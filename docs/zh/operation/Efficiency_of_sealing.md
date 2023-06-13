# Venus-集群最大化利用资源增长算力方案

&ensp;&ensp; 在 Filecoin 的网络中，算力大小至关重要，与矿工的收入息息相关。算力的增长与维持需要软硬件资源较多，每个扇区的密封需要 P1、P2、C1，C2 等
诸多过程，并且每个过程所依赖的资源各不相同，如：P1 偏向多核 CPU，P4 可用 GPU 优化等。故如何找出能最大化利用现有资源提升算力的方案是一个复杂的过程。这篇文章为如何找出最优方案提供一些思路。

## 总体思路

> 本文方案是通过各个阶段的任务耗时来推算如何均衡的分配各阶段任务的机器数量占比

- 根据实际场景，将所有加速配置都打开，做几个 sector，统计每个阶段任务耗时。每个阶段对硬件资源的的依赖如下：
    - P1：cpu 及磁盘 io
    * P2：cpu，gpu，带宽及磁盘 io
    * C1-C2：cpu，gpu，带宽及磁盘 io
> 这里多做几个是为了统计出较稳定的耗时，此阶段需保持加速设置及软硬件资源始终不变。

- 维持任务数平衡，即每个机器都有任何时刻都有任务可做，理论上每个阶段任务数与耗时成反比；

- 扇区任务由 pledge 命令控制，配合最大并发密封扇区数（MaxSealingSectors）管理集群中 sector 并发数量；

- 每个 worker 可以指定可接受的任务类型。

## 任务耗时统计

&ensp;&ensp; worker 可以领取的任务类型有：
```
TTAddPiece   TaskType = "seal/v0/addpiece"
TTPreCommit1 TaskType = "seal/v0/precommit/1"
TTPreCommit2 TaskType = "seal/v0/precommit/2"
TTCommit1    TaskType = "seal/v0/commit/1" // NOTE: We use this to transfer the sector into miner-local storage for now; Don't use on workers!
TTCommit2    TaskType = "seal/v0/commit/2"

TTFinalize TaskType = "seal/v0/finalize"

TTFetch  TaskType = "seal/v0/fetch"
TTUnseal TaskType = "seal/v0/unseal"

```
&ensp;&ensp; 每个任务都分为两个阶段：prepare 阶段和 worker 阶段，在日志中表现为：
```
# seal/v0/fetch
2021-08-03T14:00:07.925+0800    INFO    advmgr  sector-storage/sched_worker.go:401      Sector 7 prepare for seal/v0/fetch ...
2021-08-03T14:05:36.772+0800    INFO    advmgr  sector-storage/sched_worker.go:403      Sector 7 prepare for seal/v0/fetch end ...

2021-08-03T14:05:36.772+0800    INFO    advmgr  sector-storage/sched_worker.go:442      Sector 7 work for seal/v0/fetch ...
2021-08-03T14:05:36.774+0800    INFO    advmgr  sector-storage/sched_worker.go:444      Sector 7 work for seal/v0/fetch end ...

# seal/v0/addpiece
2021-08-03T13:38:37.977+0800    INFO    advmgr  sector-storage/sched_worker.go:401      Sector 8 prepare for seal/v0/addpiece ...
2021-08-03T13:38:37.978+0800    INFO    advmgr  sector-storage/sched_worker.go:403      Sector 8 prepare for seal/v0/addpiece end ...

2021-08-03T13:38:37.978+0800    INFO    advmgr  sector-storage/sched_worker.go:442      Sector 8 work for seal/v0/addpiece ...
2021-08-03T13:44:26.295+0800    INFO    advmgr  sector-storage/sched_worker.go:444      Sector 8 work for seal/v0/addpiece end ...

# seal/v0/commit/2
2021-08-03T13:26:02.119+0800    INFO    advmgr  sector-storage/sched_worker.go:401      Sector 7 prepare for seal/v0/commit/2 ...
2021-08-03T13:26:02.119+0800    INFO    advmgr  sector-storage/sched_worker.go:403      Sector 7 prepare for seal/v0/commit/2 end ...

2021-08-03T13:26:02.119+0800    INFO    advmgr  sector-storage/sched_worker.go:442      Sector 7 work for seal/v0/commit/2 ...
2021-08-03T13:49:46.180+0800    INFO    advmgr  sector-storage/sched_worker.go:444      Sector 7 work for seal/v0/commit/2 end ...

# seal/v0/finalize
2021-08-03T13:54:17.414+0800    INFO    advmgr  sector-storage/sched_worker.go:401      Sector 7 prepare for seal/v0/finalize ...
2021-08-03T13:59:30.471+0800    INFO    advmgr  sector-storage/sched_worker.go:403      Sector 7 prepare for seal/v0/finalize end ...

2021-08-03T13:59:30.471+0800    INFO    advmgr  sector-storage/sched_worker.go:442      Sector 7 work for seal/v0/finalize ...
2021-08-03T14:00:07.915+0800    INFO    advmgr  sector-storage/sched_worker.go:444      Sector 7 work for seal/v0/finalize end ...

```
&ensp;&ensp; 可以看出有些任务在 prepare 阶段比较耗时，有些在 work 阶段比较耗时，一般来说需要网路传输，带宽资源的在 prepare 比较耗时，如 fetch，finalize 等；而需要计算的任务在 work 阶段比较耗时，如 AP，P1，P2，C2 等。

&ensp;&ensp; 为了便于计算，这里将任务阶段进行合并，主要分为：AP，P1，P2，C2 阶段，将这四个阶段之前的仍无耗时统一归为相应阶段的耗时，如 T（P1）=P1 耗时+P1 前的 fetch 耗时。这里 waitseed 怎么归类，在后面的时间逻辑中有没有考虑进去

## 速率因子

### 临时存储设备

&ensp;&ensp;Filecoin 在封装算力是会产生一些临时文件，在任务的进行中存在很多随机存取，这就要求磁盘吞吐量不能太差，否则会导致磁盘 IO 过高，计算资源等待磁盘读取处于闲置状态。

* 如何挑选适合的设备

&ensp;&ensp;如何寻找适合的设备，其实就是需要多少的磁盘吞吐量，可以通过一个简单的计算公式得到它。

```bash
文件大小 * 线程并行数量 / 运行时间 = 平均每秒钟传输速度
  
因为每个阶段的吞吐不同，拆分计算可以让得到的数据更精准
  
P1 读取 + P1 写入 = P1 阶段所需的吞吐量，其他阶段相同，把所有阶段所需的吞吐加起来就得到了所需的吞吐量，当然需要一些性能上的冗余
```
&ensp;&ensp;通常情况下绝大多数的矿工都会使用 SSD 或者 NVME，当有多块硬盘时我们可以通过`venus-worker storage attach --seal </path/>`命令或者启动多个 worker 来设置多个路径，但这并不是一个比较好的方法，路径过于分散会导致后续的维护相对复杂，无法充分利用，通过创建 raid 方式可以获得更好的性能和空间利用率，并且便于后续的维护。

* 软 raid 创建

```bash
mdadm -C /dev/md1 -l 0 -n 2 /dev/sdb1 /dev/sdc1
mdadm -C /dev/md2 -l 5 -n 6 /dev/sd[b-g]1
-C $创建软件RAID
-l $指定RAID级别  1表示raid1  其他同理  
-n $指定磁盘个数
-x $指定备用设备个数
-A $重组之前的设备
```

​	有关 mdadm 用法、MD 和各种级别的 RAID 的更多信息，请参阅：http://raid.wiki.kernel.org/

​	获取最新版本的 mdadm 应始终可以从如下链接获取：http://www.kernel.org/pub/linux/utils/raid/mdadm/

​	硬 raid 创建时请查看您的 raid 卡型号和说明进行操作

### 永久存储设备

&ensp;&ensp; 永久存储设备的访问机制和可能遇到的问题：		

1. 在每个任务阶段产生的文件有些是要永久存储的，用于 wdPoSt 或 winningPoSt，在每个 sector 完成阶段需要传输到永久存储目录，这个过程需要带宽资源，并且要保证磁盘 io；
2. wdPoSt 大量的随机读取非常小的文件，这可能会导致读取过慢而影响时空证明导致算力惩罚；
3. 当存储过于集中时，少量的机器损坏会导致所有的数据丢失；
4. 当磁盘过多时，并且盘符没有固定，启动时可能导致盘符移动；
5. 如果是 raid，尽量选择 raid5 或者 raid6，raid10 这种冗余性更高的方式；
6. 需要监控磁盘空间利用率并报警。


### 网络传输

&ensp;&ensp; 网络传输会有两个部分：

* 临时数据的网络传输，某个阶段的任务需要上个阶段的数据时会用 http 协议请求所需文件，需要保证传输时间小于计算时间。

    举例：
    传输往往和计算是同步进行的
    
    传输时间 > 计算时间 资源闲置，计算资源等待网络资源，拉长整个扇区封装的声明周期，就是降产
    
    传输时间 < 计算时间 计算资源充分利用

  - 观察计算资源是否出现闲置

  - 计算网络传输速度能否满足计算时间
    
    Precommit2 如果计算耗时 25 分钟，读取 440G 左右文件，写入 100G 左右文件  
    (440G * 1024 / 25 / 60) + (100G * 1024 / 25 / 60) = 单个线程所需的吞吐量 
    
  - 多台机器同步阶段的文件传输
  
    我们有 A，B，C 三个机器分别负责 P1，P2，Commit
  
    当 A 机器开始 P1 时会向 B 机器的 P2 传输 32G 左右的 Unsealed
  
    当 B 机器开始 P2 时，A 机器的 P1 生成的 440G 左右所有文件会传输到 B 的机器上
  
    Commit 又分为 C1 和 C2.当 C 机器运行 C1 时需要 P1 和 P2 的所有文件，计算的结果通过内存直接传递给 C2，所以并不会在落盘新的文件


* 最终数据传输，我们要知道当最终的存储也会成为我们的产量瓶颈（貌似和下面的不符合）

  1. 假设计算资源的产量是每天产出 6T 的算力，但如果存储的网络传输最大每天只能传输 5T，那么这就会导致产量的下降
  
  2. 如果我们使用了 NFS 这样的网络文件系统，当网络断开链接是，NFS 往往是会直接卡死的，所以可能需要设置 NFS 的超时机制
  
     

### worker 的指令集加速

&ensp;&ensp; P1 阶段时，使用 SHA 指令集和不使用指令集会有巨大的差距，目前大多数矿工都采用 AMD 型号的 CPU 原因就是 SHA 指令集的关系，研究发现，使用 SHA 指令集基本可以跑进 250 分钟以内，但不使用 SHA 指令集能够跑进 420 分钟已经非常艰难了

```
确保编译时使用RUSTFLAGS="-C target-cpu=native -g" FFI_BUILD_FROM_SOURCE="1" 源码编译filecoin-ffi库，如果cpu支持则启用SHA扩展，这会大幅提高扇区封装速度，源码编译（make deps）时特征如下:

+ trap '{ rm -f $__build_output_log_tmp; }' EXIT
+ local '__rust_flags=--print native-static-libs -C target-feature=+sse2'
+ RUSTFLAGS='--print native-static-libs -C target-feature=+sse2'
+ cargo +nightly-2021-04-24 build --release --no-default-features --features multicore-sdr --features pairing,gpu
+ tee /tmp/tmp.IYtnd3xka9
   Compiling autocfg v1.0.1
   Compiling libc v0.2.97
   Compiling cfg-if v1.0.0
   Compiling proc-macro2 v1.0.27
   Compiling unicode-xid v0.2.2
   Compiling syn v1.0.73
   Compiling lazy_static v1.4.0
   Compiling cc v1.0.68
   Compiling typenum v1.13.0
   Compiling serde_derive v1.0.126
   Compiling serde v1.0.126
```
### 核数限制

​	当想要把 CPU 的资源利用的更高时，需要非常合理的规划 CPU 的使用，比如有一个 64 核的 CPU，我们要想 PreCommit2 和 Commit 分别分到 32 核，这样两种任务相互不受影响，也不会导致某一个占用大量的计算资源导致另一个卡住的情况，此时我们就需要利用到核数限制

* 通过`taskset`限核

```bash
# 当我们想要启动某个进程时，可以通过 taskset -c 0-31 这种方式来进行限核操作
# 例如

TRUST_PARAMS=1 nohup taskset -c 0-32 ./venus-worker run \
--miner-addr=</ip4/sealer-ip/tcp/sealer-port> \
--miner-token=<token> \  
--listen=<0.0.0.0:3458> <flags> >> worker.log 2>&1 &\

# 扩展使用 taskset -c 0-9,19-29,39-49 进行跳跃式限核
```

这种方式的弊端就在于不方便在程序运行时对核数进行实时调整

* 通过 Cgrep 限核

```bash
# 好的目录划分会帮助对多个进程的管理
sudo mkdir -p /sys/fs/cgroup/cpuset/Pre1-worker

# 设置能够使用的核数范围
sudo echo 0-31 > /sys/fs/cgroup/cpuset/Pre1-worker/cpuset.cpus

# 加入进程的PID
sudo echo <PID> > /sys/fs/cgroup/cpuset/Pre1-worker/cgroup.procs
```

Cgrep 是在进程启动之后加入到配置文件的，并且支持实时的修改核数限制，当然也可以尝试使用 docker 限核，但 docker 的限核也是通过 Cgrep 来实现，至于 Cgrep 其他的用法我们基本都用不到，就不一一说明了



##  worker 运行方式和资源消耗

### P1 阶段

* P1 阶段的加速因子

```bash
export FIL_PROOFS_MAXIMIZE_CACHING=1  # 控制cache文件缓存到内存中，起到加速作用，会占用56G内存
  
export FIL_PROOFS_USE_MULTICORE_SDR=1 # 控制P1阶段是否使用多核运行，他会占用单个CPU组，所以每个CPU缓存组只会运行一个任务
```
`P1`阶段有两种选择，可以选择更快的速度或者更少的 CPU，需要根据实际资源决定。

  

* P1 的内存资源消耗

```bash
# 内存中会存储56G的cache文件
# 加上2层layer文件，32G的矿工每层文件32G，64G每层文件64G
  
# 以32G矿工为例，如果我们同时运行了10个任务
  
56G cahce 文件 + 32 *2 * 并行线程数 = 696G Mem
```

* P1 的磁盘资源消耗

```bash
# 11层layer文件 
  
# 64G的tree-d文件
  
# 32G的unsealed文件
  
11 * 32G + 64 + 32 = 440G
```

### P2 阶段

* P2 的加速因子有两个

```bash
export FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1  # 使用GPU运算tree-r-last阶段
   
export FIL_PROOFS_USE_GPU_TREE_BUILDER=1 # 使用GPU运算tree-c阶段
   
# 任何环境变量都不增加的情况下使用CPU运算
```
从实验结果来看使用 GPU 运算要明显比 CPU 快得多，而 CPU 运算时的核数，主频跟时间是成线性比例的，CPU 核数越多速度越快，主频越高越快，反之亦然。


* P2 内存资源

```bash
--precommit2   enable precommit2 (32G sectors: all cores, 96GiB Memory) (default: true)
  
# 在命令行中可以看到运行一个需要96GiB的内存，如果并行2个就是2倍
```

* P2 的磁盘资源消耗

```bash
# 32G
# 8个tree-c文件，每个 4.6G左右
  
# 8个tree-r-last,每个9.2M
  
# t_aux，4K，p_aux，4K

# 32G的sealed文件
  
----------------------
# 64G
# 16个tree-c文件，每个 4.6G左右
  
# 16个tree-r-last,每个9.2M
  
# t_aux，4K，p_aux，4K

# 64G的sealed文件
```

### Commit

* Commit 中的 C1 的磁盘资源消耗

```bash
# C1需要前面2个阶段产生的所有文件

P1 440G + P2 79G = 519G 

# 每个C1的任务需要消耗487G左右的空间
```

C1 并没有太多的 CPU 消耗，并且时间极短


* Commit 中的 C2 的运行方式，CPU 和 GPU

```bash
BELLMAN_NO_GPU=1 # 禁用GPU

BELLMAN_CUSTOM_GPU="GeForce RTX 3090:10496" 
# 指定GPU的cuda核心数，当GPU型号比较冷门无法识别时可使用
```

* C2 的内存资源消耗

```bash
enable commit (32G sectors: all cores or GPUs, 128GiB Memory + 64GiB swap) (default: true)

# 命令行中指出总共需要 128G + 64 G = 192G的内存
```

## 产量优化

### 产量的计算公式

&ensp;&ensp;每个阶段的效率：

```
 产出数量 / 时间 = 效率
 
 # 得到效率之后，我们就可以很轻松的算出产量
 
 效率/h/个数 * 24h * 32G = 日产量
```

例如我们有 1 台机器

P1:240 分钟

P2:30 分钟

Commit：35 分钟



此时我们可以简单一个计算公式的表格



| 运行阶段   | 时间/m | 并行线程数 | 效率/时间h/个数 | 计算公式        |
| ---------- | ------ | ---------- | --------------- | --------------- |
| P1 | 240    | 1          | 0.25            | = 1 / (240 /60) |
| P2 | 30     | 1          | 2               | = 1 / (30 /60)  |
| Commit     | 35     | 1          | 1.7142857143    | = 1 / (35 /60)  |



#### 如何找到每个阶段的最佳运行数量和配置

&ensp;&ensp; 从上面的表格中我们明显看出 P1 的效率明显不足，而此时 P2 和 Commit 机器必定会闲置，如何处理呢？产出的时间无法调整，那么我们就可以调整并行的线程数，当然我们可以新增一些计算内存的公式来指导我们对内存的消耗



| 运行阶段   | 时间/m | 并行线程数 | 效率/时间h/个数 | 计算公式        | 日产量/G    | 公式      | mem/G |
| ---------- | ------ | ---------- | --------------- | --------------- | ----------- | --------- | ----- |
| P1 | 240    | 7          | 1.75            | = 7 / (240 /60) | 1344        | =7*64+56  | 504   |
| P2 | 30     | 1          | 2               | = 1 / (30 /60)  | 1536        | =1*96     | 96    |
| Commit     | 35     | 1          | 1.7142857143    | = 1 / (35 /60)  | 1316.571429 | =1*128+64 | 192   |



现在三个阶段的效率已经非常接近了，但是此时我们仍然存在一些问题：

1. Commit 效率低于 P1，这会导致大量的任务阻塞到 Commit 阶段
2. 当某个阶段的效率过高时就会出现闲置
3. 我们需要微调资源的分布来尽可能的保证每个阶段的效率无限相等



#### 集群方案运行的的可能性

​		当我们有多台机器时，我们就要决定某些机器运行哪些阶段，在这之前我们再来看下不同阶段的特性：

1. P1 : 极度消耗内存，可以单核，多核，并行运行，临时存储需要伴随着并行数量的增多而增多
2. P2 : 轻度消耗内存，CPU，GPU 都可以运行，如果拆分，需要传输大量的文件
3. Commit: 中度消耗内存，CPU，GPU 都可以运行，如果拆分，需要传输所有临时文件



如果我们此时只考虑这些因素，那么我们的组合方式有多少种呢？而这些不同的组合方式一定会带来不通的产量，虽然每个矿工的机器都有所不同，但我们的目标是一样的：

1. 更高的产量组合运行方式
2. 各个阶段更加均衡的分布


我们可能无法做到完美，但无限接近也是最好的结果



#### 如何寻找最佳的下发任务数，始终保持机器满负荷运行

&ensp;&ensp;当我们找到最佳的组合方式之后我们需要考虑的就是如何才能保证这些机器 24 小时都是不间断运行的呢？我们不希望任何一个阶段的出现闲置

当我们发现 P1 需要并行 7 个时，那么我们如果保证 P1 的任务量是充足的，那么后续的两个阶段在不考虑其他问题的情况下，也一定是充足的，所以我们需要保证始终维持 P1 时刻都有 7 个任务

```toml
# 在 venus-sealer 的配置文件中我们可以设置最大的任务数，这可以帮我我们避免任务数下发过多

DataDir = "~/.venussealer"

[API]
  ListenAddress = "/ip4/0.0.0.0/tcp/2345/http"
  RemoteListenAddress = "192.168.200.6:2345"
  Timeout = "30s"

[Sealing]
  MaxWaitDealsSectors = 0
  MaxSealingSectors = 7    # 修改为 7
  MaxSealingSectorsForDeals = 0
```

此时我们可以通过一个简单的定时脚本就可以做到，始终维持最佳的任务量了


## 损失和止损

&ensp;&ensp;如果一个任务执行错误之后又被反复的重试，这就像我们有 7 个通道进行算力的封装，但是此时有一通道阻塞或者损坏，这就会降低我们 1 / 7 的产量，所以及时的处理错误也是非常重要的

* 何种情况下应该立刻抛弃任务
  1. ticket 过期
  2. Commit 过期
  3. 依赖文件损坏重试多次都未成功时;

* 移除无法完成的 sector

```bash
venus-sealer sectors remove --really-do-it <sectorNum>
```
如遇到无法彻底删除请查询：[顽固扇区如何删除](https://github.com/filguard/lotus-ops/blob/master/documents/questions.md#1-%E9%A1%BD%E5%9B%BA%E6%89%87%E5%8C%BA%E5%A6%82%E4%BD%95%E5%88%A0%E9%99%A4)

