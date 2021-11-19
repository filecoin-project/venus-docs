# venus-worker用法

venus-worker配合venus-sealer用于在多个机器上部署，sealing过程分成4个过程AddPiece,PreCommit1, PreCommit2, Commit2,通过worker的设置可以在不同的机器上运行sealing的不同阶段，这样能够更灵活的部署程序，利用不同机器的优势。
这里给出一个测试网络venus-worker的搭建流程。

## 需求

### 机器
- 192.168.1.151 用于文件挂载
- 192.168.1.134 运行venus-worker
- 192.168.1.19  运行venus,venus-sealing,venus-miner

### 程序
运行此venus-worker测试流程需要一下几个程序。列出所需的项目地址，具体编译方式参考项目的README.md文件

1. venus-sealer [https://github.com/filecoin-project/venus-sealer](https://github.com/filecoin-project/venus-sealer)
2. venus-worker [https://github.com/filecoin-project/venus-worker](https://github.com/filecoin-project/venus-worker)

## 存储

多机器运行需要共享存储，这里使用nfs来做共享存储。共享存储部署在192.168.1.151
参考文档[安装nfs](https://docs.platform9.com/v5.0/openstack/tutorials-setup-nfs-server)

```sh
yum -y install rpcbind nfs-utils
mkdir /nfs && chmod 666 /nfs
echo "/nfs *(rw,sync,no_root_squash,no_subtree_check,insecure)" > /etc/exports
exportfs  -rv
systemctl start rpcbind
systemctl start nfs
cat /var/lib/nfs/etab  #检查nfs是否挂载成功
```


## 环境准备
文档默认已经部署完毕venus，venus-wallet和venus-messager

## 启动venus-sealer

在机器192.168.1.19初始化并运行venus-sealer,运行后获取api及token用于venus-worker和venus-miner的配置

### 挂载存储

```sh
mkdir /nfs
mount -t nfs 192.168.1.151:/nfs /nfs
```

### 运行venus-sealer
```sh
#初始化venus-sealer，这里不使用本地存储
venus-sealer --network calibration init --actor=t01000 --sector-size=32GiB --no-local-storage --node-url {venus-api} --node-token {venus-token} --messager-url http://{venus-message api}/rpc/v0

venus-sealer run
```

### attach存储
```sh
./venus-sealer storage attach --init --seal --store /nfs
```

### 获取api地址及token

```sh
cat ~/.venussealer/api
cat ~/.venussealer/token
```

## 配置venus-worker

在192.168.1.134里面初始化并运行venus-worker

### 挂载存储

```sh
mkdir /nfs
mount -t nfs 192.168.1.151:/nfs /nfs
```

### 运行venus-worker

```sh
# 使用上面得到的sealer的api及token
./venus-worker run --no-local-storage --miner-addr /ip4/127.0.0.1/tcp/2345/http --miner-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.gcqF6Pkm4bwGXzEx83NR7h8WPliEihJ3GyUKvhKryAQ
```

### 只由venus-worker做任务，参考如下配置
```sh
vi .venussealer/config.toml
[API]
ListenAddress = "/ip4/0.0.0.0/tcp/3456/http"

####指定venus-sealer不做任务，把下面的值改为false后，重启服务
[Storage]
ParallelFetchLimit = 10
AllowAddPiece = false
AllowPreCommit1 = false
AllowPreCommit2 = false
AllowCommit = false
AllowUnseal = false

------------------------------------------------------------------------------------------------------------
####只跑P1任务
#!/bin/bash
export RUST_LOG="trace"
export RUST_BACKTRACE="1"
export TRUST_PARAMS="1"
export FIL_PROOFS_MAXIMIZE_CACHING=1
export FIL_PROOFS_USE_MULTICORE_SDR=1
nohub /worker-p1/venus-worker --repo /worker-p1 run \
--miner-addr=/ip4/10.10.8.16/tcp/3456  \
--listen=0.0.0.0:5551 \
--miner-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<<cat .venussealer/token>>.amlA0jLYLxjom3fez3NUJ2f--kx7Jb0dJBt8zDjNtBw \
--precommit2=false --commit=false \
--no-swap=true --no-local-storage \
--task-total=13 \
--no-swap=true --no-local-storage >> /worker-p1/worker-p1.log 2>&1 &


####只跑P2任务
#!/bin/bash
export RUST_LOG="trace"
export RUST_BACKTRACE="1"
##### 把GPU 0绑定到P2进程上
export CUDA_VISIBLE_DEVICES=0
export FIL_PROOFS_USE_GPU_TREE_BUILDER=1
export FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1
export FIL_PROOFS_MAX_GPU_TREE_BATCH_SIZE=8000000
export FIL_PROOFS_MAX_GPU_COLUMN_BATCH_SIZE=8000000
export TMPDIR=/worker-p2/
nohub /worker-p1/venus-worker --repo /worker-p2 run \
--miner-addr=/ip4/10.10.8.16/tcp/3456  \
--listen=0.0.0.0:5552 \
--miner-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<<cat .venussealer/token>>.amlA0jLYLxjom3fez3NUJ2f--kx7Jb0dJBt8zDjNtBw \
--addpiece=false --unseal=false \
--precommit1=false --commit=false \
--no-swap=true --no-local-storage \
--bindP1P2=true \
--no-swap=true --no-local-storage >> /worker-p2/worker-p2.log 2>&1 &


####只跑C1、C2任务
#!/bin/bash
export RUST_LOG="trace"
export RUST_BACKTRACE="1"
export TRUST_PARAMS="1"
export FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1
export FIL_PROOFS_USE_GPU_TREE_BUILDER=1
### 绑定GPU 1绑定到C2进程上
export NVIDIA_VISIBLE_DEVICES=1
export CUDA_VISIBLE_DEVICES=1
TMPDIR=/worker-c2/
nohub /worker-c2/venus-worker --repo /worker-c2  run \
--listen=0.0.0.0:5553 \
--miner-addr=/ip4/10.10.8.16/tcp/3456  \
--miner-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.<<cat .venussealer/token>>.amlA0jLYLxjom3fez3NUJ2f--kx7Jb0dJBt8zDjNtBw \
--precommit1=false --precommit2=false \
--addpiece=false --unseal=false \
--no-swap=true --no-local-storage  >> /worker-c2/worker-pc2.log 2>&1 &
```

### attach存储
```sh
./venus-worker storage attach  /nfs
```

### 检查是否正常

运行```./venus-sealer sealing workers```, 得到类似下面的结果

```sh
Worker 8c814d19-ec36-4090-a03b-d4bc9314b39a, host lijunlongdeMacBook-Pro.local
        CPU:  [                                                                ] 0/12 core(s) in use
        RAM:  [||||||||||||||||||||||||||||||||||||||||||||                    ] 69% 11.13 GiB/16 GiB
        VMEM: [|||||||||||||||||||||||||||||||||||||||                         ] 61% 11.13 GiB/18 GiB
Worker a89d4156-d23e-44e6-b74b-8405e9496db0, host lijunlongdeMacBook-Pro.local
        CPU:  [                                                                ] 0/12 core(s) in use
        RAM:  [||||||||||||||||||||||||||||||||||||||||                        ] 63% 10.12 GiB/16 GiB
        VMEM: [|||||||||||||||||||||||||||||||||||                             ] 56% 10.12 GiB/18 GiB

```

运行`./venus-sealer storage list`, 得到类似下面的结果

```sh
7c046ce2-051f-4531-aa4d-76c1cd728acb:
        [######                                            ] 257.7 GiB/1.998 TiB 12%
        Unsealed: 0; Sealed: 17; Caches: 17; Reserved: 0 B
        Weight: 10; Use: Seal Store
        Local: /nfs
        URL: http://127.0.0.1:2345/remote
        URL: http://127.0.0.1:3456/remote

1dcfda12-fb3d-413c-b626-caf8b87e3b97:
        [#############################                     ] 136.4 GiB/233.5 GiB 58%
        Unsealed: 0; Sealed: 2; Caches: 2; Reserved: 0 B
        Use: ReadOnly   Local: /Users/lijunlong/.genesis-sectors
        URL: http://127.0.0.1:2345/remote

```

## pledge算力

在venus-sealer运行```venus-sealer sectors pledge```命令进行算力积累. 运行```venus-sealer sectors list```查看sealing的进行状态。

***Note 如果RUST代码提示权限错误，可以加/var/tmp/filecoin-parents，/tmp/bellman.gpu.lock/bellman.priority.lock加777权限***
