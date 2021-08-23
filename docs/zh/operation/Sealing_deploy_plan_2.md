# 算力增加与维持部署参考方案2

## 机器配置

|  资源   | 配置  |
|  ----  | ----  |
|  CPU   | AMD EPYC 7282 *1 (32c) 单路 |
| 内存  | 32GB ECC/Reg, DDR4-3200 *8 |
| 硬盘  | M.2 NVME PCIe Gen3 x4 2TB SSD *2 |
| 网卡  | 10G |
| 系统盘  | 500G |
| 显卡  | 3090 * 1 |
| 存储  | 4TB SSD *25 RAID 5 |

台数:1台

## 任务配比

任务分为 AP,P1,P2,Commit阶段
	
|  运行方式   | 核数限制  |  耗时(分钟) |  内存消耗(G) |  效率(个/小时) | 日产量(T) |
|  -----------  | -----  |  ---------  |  ----------  |  ------------  | -------  |
|     P1 * 5    |   20  |    220      |   376   |   1.3636   |  1.0227  |
|  P2,AP,Commit |   12  |    10    |   120   |      3     |  1.125   |

资源说明：
- 内存加到512G;

## 部署

- 关闭超线程
```bash
    # 绝大多数的主板都可以设置关闭超线程，但需要重新启动。我们通过一种方式关闭一半CPU的映射关系来做到相同的效果，这种方式不需要重启，但是每次重启都会失效。
    
    #!/bin/bash
    for cpunum in $(cat /sys/devices/system/cpu/cpu*/topology/thread_siblings_list | cut -s -d, -f2- | tr ',' '\n' | sort -un)
    do
        echo 0 > /sys/devices/system/cpu/cpu$cpunum/online
    done
```

- 确保证明参数文件已下载,参数文件默认目录: /var/tmp/filecoin-proof-parameters

- 启动venus-sealer: sealer只做windowPoSt.
```sh
./venus-sealer --network=mainnet init --actor=<MINER_ID> --node-url=/ip4/<IP_ADDRESS_OF_VENUS/tcp/3453 --messager-url=/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> --gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> --auth-token <AUTH_TOKEN_FOR_ACCOUNT_NAME> --no-local-storage
    
# 修改配置文件只允许sealer做wdpost
[Storage]
    ParallelFetchLimit = 10
    AllowAddPiece = false
    AllowPreCommit1 = false
    AllowPreCommit2 = false
    AllowCommit = false
    AllowUnseal = false
    

# 启动venus-sealer
BELLMAN_CPU_UTILIZATION=0.875 FIL_PROOFS_USE_MULTICORE_SDR=1 nohup ./venus-sealer run > sealer.log 2>&1 &

# 设置store目录，因为sealer我们不做任务，故只需设置store目录
./venus-sealer storage attach --init --store <ABSOLUTE_PATH_OF_YOUR_PERMANENT_STORAGE>
```

> init时加`--no-local-storage`不回创建默认的store/seal目录;

- 启动venus-worker-01: 只做P1
```bash
FIL_PROOFS_MAXIMIZE_CACHING=1 BELLMAN_CPU_UTILIZATION=0.875 FIL_PROOFS_USE_MULTICORE_SDR=1 \
nohup ./venus-worker --repo=<ABSOLUTE_PATH_OF_WORKER_01> run --miner-addr=/ip4/127.0.0.1/tcp/2345 --miner-token=<sealer token> \
--addpiece=false --unseal=false --precommit2=false --commit=false --no-local-storage  > worker-01.log 2>&1 &

# 指定seal路径
./venus-worker --repo=<ABSOLUTE_PATH_OF_WORKER_01> storage attach --init --seal <ABSOLUTE_LOCAL_PATH>
```
> FIL_PROOFS_MAXIMIZE_CACHING=1 表示做P1的时候把部分临时文件缓存到内存

- 启动venus-worker-02: 做AP,P2,Commit等任务

```bash
BELLMAN_CPU_UTILIZATION=0.875 FIL_PROOFS_USE_MULTICORE_SDR=1 TMP_DIR=<OTHER_PATH> \
nohup ./venus-worker --repo=<ABSOLUTE_PATH_OF_WORKER_02> run --miner-addr=/ip4/127.0.0.1/tcp/2345 --miner-token=<sealer token> \
--precommit1=false --no-local-storage  > worker-02.log 2>&1 &

# 指定seal路径
./venus-worker --repo=<ABSOLUTE_PATH_OF_WORKER_02> storage attach --init --seal <ABSOLUTE_LOCAL_PATH>
```

> 设置worker01和worker02的seal路径相同，可以避免不必要的拷贝;

> P2没有设置用GPU;

> TMP_DIR目的是为了避免和venus-sealer竞争bellman.gpu.lock,C2阶段会自动搜索用GPU,如果和wdPost竞争gpu锁会报错

- 设置发送消息的wallet

```sh
[Addresses]
  PreCommitControl = [] # P2
  CommitControl = [] # C2
  DisableOwnerFallback = true # 禁用owner发消息
  DisableWorkerFallback = false
```
> 根据上面字段的含义自己配置想要的结果

- 限核: Cgrep限核

```bash
# 设置进程管理目录
sudo mkdir -p /sys/fs/cgroup/cpuset/worker

# 设置能够使用的核数范围
sudo echo 0-20 > /sys/fs/cgroup/cpuset/worker/cpuset.cpus

# 设置使用内存
echo 0 > cpuset.mems

# 加入进程的PID
sudo echo <PID> > /sys/fs/cgroup/cpuset/worker/cgroup.procs

```

> PID: 进程ID号;

> 每次worker重启后PID会变化,需要更新文件.

> /sys/fs/cgroup/cpuset是系统目录,worker是自己创建的.
