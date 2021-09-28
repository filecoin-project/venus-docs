## 背景

&ensp;&ensp; venus-cluster是venus社区开发的一套filecoin网络中负责算力增长与维持的软件。相对于venus-sealer来说，在设计中将扇区状态的维护交给了venus-worker管理，venus-sector-manager负责与链交互，提供必要的服务接口，当venus-worker需要时调用。venus-sealer自身是一个中心调度器，所有worker都需注册到venus-sealer中，每有扇区阶段性任务产生时，venus-sealer根据可用资源，任务数等条件从中选择出最优的worker派发任务。venus-cluster系统中的worker是一个个独立的个体，创建新的扇区，并完成扇区的各阶段工作直到上链，仅在过程中需要某些信息时通过rpc 接口请求venus-sector-manager获得所需信息，比如创建扇区时请求最新的SectorID，ticket等。

&ensp;&ensp; venus-cluster和venus-sealer在扇区封装方面各有优势，总的来说，venus-cluster简化了部署流程，每个worker独立自主地完成扇区的每个阶任务，降低了系统复杂性，对单台机器的性能，资源等要求较高。venus-sealer的worker部署较为灵活，一个扇区不同阶段任务可分布在多个worker完成，使资源不足的机器可以相互合作共同完成一个扇区的封装任务，但是这种部署不确定性极高，不同机器间的数据传输也有很高的不确定性，一旦出现问题，通常影响面较大，可能造成大范围的扇区任务卡死。另外，对运维技术要求较高，需要了解各阶段的用时，资源占比等。

&ensp;&ensp; 在选择独立组件时应根据自身资源选择合理的方案。本文档主要介绍venus-cluster的部署，故在后续章节有关算力增长的说明将忽略venus-sealer。


## 部署

&ensp;&ensp; venus-cluster中的独立组件由venus-worker，venus-sector-manager和venus-wallet组成。
- venus-worker负责扇区封装，同一扇区各阶段任务都在一个worker中完成；
- venus-sector-manager负责windowPoSt、提供链服务；
- venus-wallet提供签名服务。

### 安装 venus-wallet

在后台运行`venus-wallet`模块。

```bash
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

为`venus-wallet`设置密码。主要是为了保护钱包，在导出私钥，授权签名时需要解锁。

```bash
$ ./venus-wallet setpwd
Password:******
Enter Password again:******
Password set successfully
```

:::warning

请备份密码并妥善保存，否则重启或锁住钱包后将无法使用相关功能。每`venus-wallet`启动时带`--password`标志会自动解锁钱包,否则启动后需要手动解锁:
```bash
$ ./venus-wallet unlock
Password: 

# 查看解锁状态
$ ./venus-wallet lock-state
wallet state: unlocked
```

在扇区封装的过程中需要调用wallet进行签名,如果不解锁,会导致签名失败,进而导致扇区任务失败.

:::

创建owner和worker地址。（如果没有现有的 miner ID）

```bash
$ ./venus-wallet new bls
<OWNER_ADDRESS>
$ ./venus-wallet new bls
<WORKER_ADDRESS>
```
> 如果在`Calibration`网络进行测试，则必须使用来自水龙头的测试币为您的所有地址提供资金，请使用此[水龙头](https://faucet.calibration.fildev.network/funds.html)。


***配置venus-wallet接入共享服务，使用您从链服务管理员处获得的帐号信息更改 `~/.venus_wallet/config.toml`中的`[APIRegisterHub]` 部分***

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY>"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

重新启动`venus-wallet`以使更改生效。

```bash
# grep [PID] of venus-wallet process
$ ps -ef | grep wallet

# kill the process and restart
$ kill -9 [PID]

$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

如成功连接 `venus-gateway`，您将看到以下日志。

```bash
2021-07-12T15:14:12.457+0800    INFO    wallet_event    wallet_event/listenevent.go:197 connect to server fcf714b2-eeb6-498b-aafc-5e58eccd9d0f  {"api hub": "/ip4/<IP_ADDRESS>/tcp/45132"}
```
> 建议使用`systemd`或`supervisord`等控制自动重启。

### 安装 venus-sector-manager

#### 全局 flag

&ensp;&ensp; venus-sector-manager 具备两个全局 flag，分别是：

- home：数据目录，用来保存本地数据，默认位于 `~/.venus-sector-manager`
- net：用于选择加入的 Filecoin 网络，默认 `mainnet`, 可选项: `mainnet`，`nerpa`，`testnetnet`，`2k`，`cali`，`forcenet`。


&ensp;&ensp; 初始化venus-sector-manager。

```bash
 ./venus-sector-manager --net=forcenet daemon init
```

生成的初始配置文件`~/.venus-sector-manager/sector-manager.cfg`内容：
```toml
# Default config:
[SectorManager]
#  PreFetch = true
#
#  [[SectorManager.Miners]]
#    ID = 10000
#    InitNumber = 0
#    MaxNumber = 10000
#    Disabled = false
#
[Commitment]
#  [Commitment.DefaultPolicy]
#    CommitBatchThreshold = 0
#    CommitBatchMaxWait = "0s"
#    CommitCheckInterval = "0s"
#    EnableBatchProCommit = false
#    PreCommitBatchThreshold = 0
#    PreCommitBatchMaxWait = "0s"
#    PreCommitCheckInterval = "0s"
#    EnableBatchPreCommit = false
#    PreCommitGasOverEstimation = 0.0
#    ProCommitGasOverEstimation = 0.0
#    BatchPreCommitGasOverEstimation = 0.0
#    BatchProCommitGasOverEstimation = 0.0
#    MaxPreCommitFeeCap = ""
#    MaxProCommitFeeCap = ""
#    MaxBatchPreCommitFeeCap = ""
#    MaxBatchProCommitFeeCap = ""
#    MsgConfidence = 0
#  [Commitment.Miners]
#    [Commitment.Miners.example]
#      [Commitment.Miners.example.Controls]
#        PreCommit = ""
#        ProveCommit = ""
#
[Chain]
#  Api = ""
#  Token = ""
#
[Messager]
#  Api = ""
#  Token = ""
#
[PersistedStore]
#  Includes = ["unavailable"]
#
#  [[PersistedStore.Stores]]
#    Name = "storage name,like `100.100.10.1`"
#    Path = "/path/to/storage/"
#    Strict = false
#    ReadOnly = true
#
[PoSt]
#  [PoSt.Default]
#    StrictCheck = false
#    GasOverEstimation = 0.0
#    MaxFeeCap = ""
#    MsgCheckInteval = "1m0s"
#    MsgConfidence = 5
#  [PoSt.Actors]
#    [PoSt.Actors.10000]
#      Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#      StrictCheck = false
#      GasOverEstimation = 0.0
#      MaxFeeCap = ""
#      MsgCheckInteval = "1m0s"
#      MsgConfidence = 5
```

将链服务配置更新到`sector-manager.cfg`：
```toml
[Chain]
  Api = "/ip4/<IP_ADDRESS_OF_VENUS>/tcp/<PORT_OF_VENUS>"
  Token = "AUTH_TOKEN_FOR_ACCOUNT_NAME"

[Messager]
  Api = "/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER>"
  Token = "AUTH_TOKEN_FOR_ACCOUNT_NAME"
```

#### 创建矿工

&ensp;&ensp; 如果已有矿工，可略过此步骤。

```bash
$ ./venus-sector-manager --net=forcenet util miner create --from=t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq --sector-size=512MiB 
2021-09-28T16:11:20.168+0800    DEBUG   policy  policy/const.go:18      NETWORK SETUP   {"name": "forcenet"}
2021-09-28T16:11:20.185+0800    INFO    sealer  internal/util_miner.go:250      wait for message receipt        {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha"}
2021-09-28T16:11:50.189+0800    INFO    sealer  internal/util_miner.go:268      msg state: FillMsg      {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha"}
2021-09-28T16:11:50.189+0800    INFO    sealer  internal/util_miner.go:250      wait for message receipt        {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha"}
2021-09-28T16:12:20.192+0800    INFO    sealer  internal/util_miner.go:268      msg state: FillMsg      {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha"}
2021-09-28T16:12:20.192+0800    INFO    sealer  internal/util_miner.go:250      wait for message receipt        {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha"}
2021-09-28T16:12:50.195+0800    INFO    sealer  internal/util_miner.go:274      message landed on chain {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha", "smcid": "bafy2bzacecejxxqdtzyyrivhc2h4pqjdfr43dwlwbbtd7kxzbbiixzmsl6k52", "height": 92099}
2021-09-28T16:12:50.195+0800    INFO    sealer  internal/util_miner.go:285      miner actor: t01033 (t2sqliwznayjwcjke6ypex3ox5lajcwpasg7wc2fi) {"size": "512MiB", "from": "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq", "actor": "t01032", "mid": "bafy2bzaceb66tlt744zjrq6bvtziinlsi7vajlyux6t3rnzxx4sfjeupxliha", "smcid": "bafy2bzacecejxxqdtzyyrivhc2h4pqjdfr43dwlwbbtd7kxzbbiixzmsl6k52", "height": 92099}
```

至此矿工创建成功，矿工号为：t01033，查看该矿工信息：

```bash
$ ./venus-sector-manager --net=forcenet util miner info t01033
2021-09-28T16:19:19.236+0800    DEBUG   policy  policy/const.go:18      NETWORK SETUP   {"name": "forcenet"}
Miner: t01033
Owner: t01032
Worker: t01032
NewWorker: <empty>
Controls(0):
WokerChangeEpoch: -1
Multiaddrs(0):
SectorSize: 536870912
WindowPoStPartitionSectors: 2
```

#### 启动服务

&ensp;&ensp; 目前，miner的一些必要信息需要手动配置，暂时无法自动获取。

- 矿工号，sector id范围
```toml
[[SectorManager.Miners]]
    ID = 1033 # 矿工id，eg。 t01033 -> 1033 
    InitNumber = 0 # min sid 
    MaxNumber = 10000 # max sid
    Disabled = false # false: 做算力; true:仅维持算力
```

- P2,C2消息的from配置
```toml
[Commitment.Miners]
    [Commitment.Miners.1033]
      [Commitment.Miners.1033.Controls]
        PreCommit = "" # 根据实际需求配置钱包地址
        ProveCommit = "" # 根据实际需求配置钱包地址
```

- 永久存储路径配置
```toml
[[PersistedStore.Stores]]
    Name = "store-f01033" # 自己起的名称
    Path = ""  # 绝对路径
```

- wdPoSt配置
```toml
[PoSt.Actors]
    [PoSt.Actors.1033]
      Sender = "" # 根据实际需求配置钱包地址
```

确保以上信息都配置无误后启动服务:

```bash
nohup ./venus-sector-manager daemon run  --listen=0.0.0.0:1789 --poster=true 2>&1 > manager.log &
```
`--poster`设置为true表示做windowPoSt,设置为false不做windowPoSt.

刚启动时会将配置信息输出到日志:
```
021-09-28T16:51:03.850+0800    INFO    dep     dep/sealer_constructor.go:69    Sector-manager initial cfg: [SectorManager]
  PreFetch = true

  [[SectorManager.Miners]]
    ID = 1033
    InitNumber = 0
    MaxNumber = 10000
    Disabled = false

[Commitment]
  [Commitment.DefaultPolicy]
    CommitBatchThreshold = 0
    CommitBatchMaxWait = "0s"
    CommitCheckInterval = "0s"
    EnableBatchProCommit = false
    PreCommitBatchThreshold = 0
    PreCommitBatchMaxWait = "0s"
    PreCommitCheckInterval = "0s"
    EnableBatchPreCommit = false
    PreCommitGasOverEstimation = 0.0
    ProCommitGasOverEstimation = 0.0
    BatchPreCommitGasOverEstimation = 0.0
    BatchProCommitGasOverEstimation = 0.0
    MaxPreCommitFeeCap = ""
    MaxProCommitFeeCap = ""
    MaxBatchPreCommitFeeCap = ""
    MaxBatchProCommitFeeCap = ""
    MsgConfidence = 0
  [Commitment.Miners]
    [Commitment.Miners.1033]
      [Commitment.Miners.1033.Controls]
        PreCommit = "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq"
        ProveCommit = "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq"
    [Commitment.Miners.example]
      [Commitment.Miners.example.Controls]
        PreCommit = ""
        ProveCommit = ""

[Chain]
  Api = "/ip4/192.168.200.12/tcp/3453"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGl0YW8wNCIsInBlcm0iOiJzaWduIiwiZXh0IjoiIn0.rezCJILQkXw0hZrCYdyVVX_dB2ZqqlXWCk4izAqnld8"

[Messager]
  Api = "/ip4/192.168.200.12/tcp/39812"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGl0YW8wNCIsInBlcm0iOiJzaWduIiwiZXh0IjoiIn0.rezCJILQkXw0hZrCYdyVVX_dB2ZqqlXWCk4izAqnld8"

[PersistedStore]
  Includes = []

  [[PersistedStore.Stores]]
    Name = "store-f01033"
    Path = "/mnt/test"
    Strict = false
    ReadOnly = false

[PoSt]
  [PoSt.Default]
    StrictCheck = false
    GasOverEstimation = 0.0
    MaxFeeCap = ""
    MsgCheckInteval = "1m0s"
    MsgConfidence = 5
  [PoSt.Actors]
    [PoSt.Actors.1033]
      Sender = "t3skelnvntu5m7kb656jfvr5dfy663aru76c6pxqp4qf6madrm7s4db77ysasefohdjypmoumc3niug6xmcxuq"


2021-09-28T16:51:03.859+0800    INFO    badger  v2@v2.2007.2/logger.go:46       All 0 tables opened in 0s
        {"path": "/home/ipfs/.venus-sector-manager/meta"}
2021-09-28T16:51:03.860+0800    DEBUG   kv      kvstore/prefix_wrapper.go:26    kv wrapped      {"prefix": "sector-number/", "prefix-len": 14}
2021-09-28T16:51:03.863+0800    INFO    badger  v2@v2.2007.2/logger.go:46       All 0 tables opened in 0s
        {"path": "/home/ipfs/.venus-sector-manager/offline_meta"}
2021-09-28T16:51:03.863+0800    DEBUG   kv      kvstore/prefix_wrapper.go:26    kv wrapped      {"prefix": "sector-states/", "prefix-len": 14}
2021-09-28T16:51:03.863+0800    DEBUG   kv      kvstore/prefix_wrapper.go:26    kv wrapped      {"prefix": "sector-states-offline/", "prefix-len": 22}
2021-09-28T16:51:03.870+0800    INFO    badger  v2@v2.2007.2/logger.go:46       All 0 tables opened in 0s
        {"path": "/home/ipfs/.venus-sector-manager/sector-index"}
2021-09-28T16:51:03.872+0800    INFO    confmgr confmgr/local_mgr.go:133        will reload sector-manager(/home/ipfs/.venus-sector-manager/sector-manager.cfg) once receive reload sig
2021-09-28T16:51:03.872+0800    INFO    confmgr confmgr/local_mgr.go:49 local conf mgr start
2021-09-28T16:51:03.874+0800    INFO    dep     dep/sealer_constructor.go:215   miner info pre-fetched  {"miner": "1033"}
2021-09-28T16:51:03.874+0800    INFO    sealer  venus-sector-manager/server.go:38       daemon running
2021-09-28T16:51:03.874+0800    INFO    sealer  venus-sector-manager/server.go:31       trying to listen on 0.0.0.0:1789
```

### 安装 venus-worker

#### 准备 cgroup

> 如果不想使用限核功能，这步可以略过

由于 venus-worker 允许使用者启动子进程形态的 sealing 单步处理器，并通过 cgroup 对这些子进程进行资源管理，因此需要通过执行以下命令获得 cgroup 的相关操作权限：

```bash
./create-cgroup.sh
```

注意：此脚本将为特定的 cgroup 资源组分配当前用户的执行权限。这也就意味着，如果使用者打算用特定的用户启动 venus-cluster，需要先切换到目标用户再执行脚本。

#### 准备seal目录

本地目录用于保存 `PoRep` 过程中产生的文件。`venus-worker` 的设计理念是*按需配置*， 即配置与计算资源相匹配的本地存储资源，以让所有活跃中的扇区能够相互独立、并行不悖。

使用者通过以下方式来初始化将要使用的本地目录：
```
./venus-worker store seal-init -l [<path/to/local/store1> <path/to/local/store2> <path/to/local/store3>]
```

这里可以设置多个路径，多少个路径代表可同时做多少个sector，如创建一个sector选择的路径<path/to/local/store1>，则这个sector的所有临时文件都在此目录。执行后目录结构变化如下：

```
$ ls -al seal/
total 16
drwxrwxr-x 4 ipfs ipfs 4096 Sep 28 17:10 .
drwxr-xr-x 8 ipfs ipfs 4096 Sep 28 17:04 ..
drwxrwxr-x 4 ipfs ipfs 4096 Sep 28 17:10 seal_01
drwxrwxr-x 4 ipfs ipfs 4096 Sep 28 17:10 seal_02

$ ls -al seal/seal_01
total 16
drwxrwxr-x 4 ipfs ipfs 4096 Sep 28 17:10 .
drwxrwxr-x 4 ipfs ipfs 4096 Sep 28 17:10 ..
drwxrwxr-x 2 ipfs ipfs 4096 Sep 28 17:10 data
-rw-rw-r-- 1 ipfs ipfs    0 Sep 28 17:10 .holder
drwxrwxr-x 2 ipfs ipfs 4096 Sep 28 17:10 meta
```

#### 配置store目录

持久化目录用于保存 `PoRep` 的结果文件。

常见的做法是将存储服务器的对应目录挂载到本地。为了避免在丢失挂载点的情况下启动，也需要对持久化目录进行初始化。

具体做法是在成功挂载之后，通过以下方式来初始化持久化目录：
```
./venus-worker store file-init -l <path/to/remote/store>
```

执行后会在目录变化：
```
ls -al <path/to/remote/store>
total 8
drwxrwxrwx 2 ipfs ipfs 4096 Sep 28 17:12 .
drwxr-xr-x 3 root root 4096 Sep 28 16:26 ..
-rw-rw-r-- 1 ipfs ipfs    0 Sep 28 17:12 .holder
```

#### 准备配置文件

配置文件使用 toml 格式

```toml
# venus-sector-manager 的服务地址
[sealer_rpc]
url = "ws://127.0.0.1:1789/rpc/v0"

# sealing 过程配置
[sealing]

# 是否接受扇区内包含订单
enable_deals = false

# 对于 sealing 过程中的临时性异常，允许自动重试的次数
max_retries = 3

# 本地目录配置，按照实际情况配置，需初始化
[[store]]
location = "<path/to/local/store1>"

[[store]]
location = "<path/to/local/store2>"

[[store]]
location = "<path/to/local/store3>"

# 各阶段并行任务数量配置
[limit]

# pc1 阶段的并发数量控制
# 仅在一些特定的场景下进行配置，如计算资源少于按照存储资源所需的数量
# pc1 = 1

pc2 = 1
c2 = 1

# 持久化目录配置，按照实际情况配置，需初始化
[remote]
path = "<path/to/remote/store>"

# pc2 子进程处理器相关配置
[processors.pc2]

# 启动子进程处理器
external = true

# [[processors.pc2.subs]]
# [processors.pc2.subs.cgroup]
# cpuset = "24-27"

# [[processors.pc2.subs]]
# [processors.pc2.subs.cgroup]
# cpuset = "28-31"

# c2 子进程处理器相关配置
[processors.c2]

# 启动子进程处理器
external = true

# 子进程可使用的处理器核心,如果前面限核没有配置，则此处也不配置
# [[processors.c2.subs]]
# [processors.c2.subs.cgroup]
# cpuset = "32-47"
```

启动服务
```bash
 RUST_LOG=debug TMPDIR=./ nohup ./venus-worker daemon --config=./venus-worker.toml 2>&1 > worker.log &
```


