## Background

venus-cluster is next generation of venus-sealer, which is responsible for growth (PoRep) and maintenance (PoSt) storage power in the filecoin network. Compared with venus-sealer, PoSt of the sectors is now handled by venus-worker while the venus-sector-manager sub-module is responsible for interacting with the chain and providing necessary service API interfaces for venus-worker on demand. In the old design, venus-sealer is a central scheduler that all workers need to be registered with. When a sealing task is queued, venus-sealer tries to select the worker with enough available resources to process the task. In the new design, workers in venus-cluster are independent from each other, who handles the entire sealing pipeline till sector is commited on-chain during which RPC calls are made to venus-sector-manager to obtain information such as latest SectorID, ticket and etc.

venus-cluster and venus-sealer both have their own merits in sealing. Generally speaking, venus-cluster simplifies the deployment process, and workers can now independently manage the sealing pipeline, reducing cluster complexity while requiring higher hardwares specs for each worker box. Worker deployment of venus-sealer could be more flexible where each worker only manages one or more phases of the sealing pipeline, thus enabling lower hardware spec workers to work togther. However, this may also creates uncertainty in the sealing pipeline. If a problem occurs, it may cause a large amount of sectors being stuck and may require experienced operator to weigh in and figure out exactly which sealing phase has gone wrong.

When choosing which venus sealing component to use, you should evaluate based on your own hardware resources and technical capacity. This document mainly introduces the deployment of venus-cluster.


## Deployment

When you compile venus-cluster, it will generate binaries of venus-worker, venus-sector-manager and venus-wallet.

- venus-worker: responsilbe for sector sealing; all sealing phases a sector has to go through will be done in one worker 
- venus-sector-manager: manages windowPost; provides chain services
- venus-wallet: manages signing services

## Start venus-wallet

Run venus-wallet module in background.

```bash
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

:::tip 

Use `tail -f wallet.log` to monitor wallet log.

:::

Setup a password for your venus-wallet.

```bash
$ ./venus-wallet setpwd
Password:******
Enter Password again:******
Password set successfully
```

:::warning

Please keep backups of your password and store them properly or you will lose contorl of your wallet.

:::

:::warning

When restarting your wallet, manuually unlock your wallet or you wallet won't be able to sign any messages during sealing or other tasks.

```bash
$ ./venus-wallet unlock
Password:
```

Use `--password` for auto unlocking after running.

```bash
$ ./venus-wallet run --password
```

Check current state your wallet.

```bash
$ ./venus-wallet lock-state
wallet state: unlocked
```

:::

Generate owner and worker addresses. (If you don't have an existing miner id)

```bash
$ ./venus-wallet new bls
<OWNER_ADDRESS>
$ ./venus-wallet new bls
<WORKER_ADDRESS>
```

:::tip

If you are testing on Nerpa or Calibration, you have to fund all your addresses with test coins from faucets. For nerpa, use this [faucet](https://faucet.nerpa.interplanetary.dev/funds.html). For calibration, use this [faucet](https://faucet.calibration.fildev.network/funds.html). 

:::

:::tip

Use `./venus-wallet import` command for importing addresses from private keys.

:::

Change `[APIRegisterHub]` section of  `~/.venus_wallet/config.toml` using the credential you get from shared module admin.

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_VENUS_WALLET>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

:::warning

Make sure above 3 params are correctly set, or connection to venus shared modules will fail.

:::

Restart venus-wallet so that the changes takes into effect.

```bash
# grep [PID] of venus-wallet process
$ ps -ef | grep wallet
root   6704  2.3  0.0 2361236 43148 pts/2   Sl   17:33   0:18 ./venus-wallet run
root   8029  0.0  0.0 112828   952 pts/2    S+   17:46   0:00 grep --color=auto venus-wallet
# kill the process and restart
$ kill -9 [PID]
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

You should see logs close to the following indicating successful connection to `venus-gateway`.

```bash
2021-07-12T15:14:12.457+0800    INFO    wallet_event    wallet_event/listenevent.go:197 connect to server fcf714b2-eeb6-498b-aafc-5e58eccd9d0f  {"api hub": "/ip4/<IP_ADDRESS>/tcp/45132"}
```

:::tip

Using process controll like  `systemmd` or `supervisord` is recommended.

:::

## Run venus-sector-manager


Init venus-sector-manager.

```bash
# use --home flag for local data storage, default: ~/.venus-sector-manager
# use --net for network selection, nerpa, testnetnet, 2k, cali, forcenet, default: mainnet
$ ./venus-sector-manager --net=forcenet daemon init
```

Create initial config file @  `~/.venus-sector-manager/sector-manager.cfg`.
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

Add configurations for chain services in `sector-manager.cfg` too.
```toml
[Chain]
  Api = "/ip4/<IP_ADDRESS_OF_VENUS>/tcp/<PORT_OF_VENUS>"
  Token = "AUTH_TOKEN_FOR_ACCOUNT_NAME"

[Messager]
  Api = "/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER>"
  Token = "AUTH_TOKEN_FOR_ACCOUNT_NAME"
```

### Init a new miner id (optinal if you already have one)

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

Get miner id from above log. Check miner information.

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

### Start daemon

&ensp;&ensp; 目前，miner的一些必要信息需要手动配置，暂时无法自动获取

Before starting daemon, couple more configurations need to be done. Miner id and sector id.

```toml
[[SectorManager.Miners]]
    ID = 1033 # miner id, ex, t01033 -> 1033 (leave out "t" and "f")
    InitNumber = 0 # min sid 
    MaxNumber = 10000 # max sid
    Disabled = false # false: allow sealing; true: maintenance only (windowPost)
```

Addresses for P2 and C2.

```toml
[Commitment.Miners]
    [Commitment.Miners.1033]
      [Commitment.Miners.1033.Controls]
        PreCommit = "" # Your choice of address
        ProveCommit = "" # Your choice of address
```

Persisted store path.

```toml
[[PersistedStore.Stores]]
    Name = "store-f01033" # name of your choice
    Path = ""  # Absolute path 
```

WindowPost address.

```toml
[PoSt.Actors]
    [PoSt.Actors.1033]
      Sender = "" # Your choice of address
```

Make sure the above configurations are correctly set and start daemon.

```bash

$ nohup ./venus-sector-manager daemon run --listen=0.0.0.0:1789 --poster=true 2>&1 > manager.log &
```
:::tip

Use `--poster` flag for enabling and disabling windowPost for this daemon process

:::

First run will print configurations to the log.
```bash
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

## Run venus-worker

### cgroup (optional)

Since venus-worker allows users to do sealing in the form of sub-processes, and manage these sub-processes through cgroup, it is necessary to execute the following commands to obtain the relevant operation permissions of the cgroup.

```bash
$ ./create-cgroup.sh
```

注意：此脚本将为特定的 cgroup 资源组分配当前用户的执行权限。这也就意味着，如果使用者打算用特定的用户启动 venus-cluster，需要先切换到目标用户再执行脚本。

:::tip

Note that this script will assign the execution permissions of the current user to a specific cgroup resource group. This means that if the user intends to start the venus-cluster with another user, it needs to switch to the target user before executing the script.

:::

### Config seal storage

Seal storage will be storing cache files during sealing process. By design, venus-worker will match computation resources to storage resources on demand while keeping sectors intact from each other.

Format seal storage. Muliple path can be configured. Each corresponds to a sector. For example, if `<path/to/local/store1>` is created then all cache files of this sector will be stored under this path. 
```bash
$ ./venus-worker store seal-init -l [<path/to/local/store1> <path/to/local/store2> <path/to/local/store3>]
```

Once formatted, folder structure will resemble the following.

```bash
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

### Config permanent storage

Configure permanent storage path for sealed sectors. Mount your remote storage solution and format the it to prevent losing the mount.

```bash
$ ./venus-worker store file-init -l <path/to/remote/store>
```

Remote storage should look like the following after execution. 
```bash
$ ls -al <path/to/remote/store>
total 8
drwxrwxrwx 2 ipfs ipfs 4096 Sep 28 17:12 .
drwxr-xr-x 3 root root 4096 Sep 28 16:26 ..
-rw-rw-r-- 1 ipfs ipfs    0 Sep 28 17:12 .holder
```

### Configurations

Toml style config file.

```toml
# venus-sector-manager API
[sealer_rpc]
url = "ws://127.0.0.1:1789/rpc/v0"

# sealing related config
[sealing]
# allow deals?
enable_deals = false
# when sealing fails, how many times to retry before giving up
max_retries = 3

# path to local storage
[[store]]
location = "<path/to/local/store1>"

[[store]]
location = "<path/to/local/store2>"

[[store]]
location = "<path/to/local/store3>"

# number of parallel tasks for each phase
[limit]
# number of PC1 in parallel
# pc1 = 1
pc2 = 1
c2 = 1

# path to remote permanent storage
[remote]
path = "<path/to/remote/store>"

# C2 sub processes related
[processors.pc2]
# sub processes
external = true
# [[processors.pc2.subs]]
# [processors.pc2.subs.cgroup]
# cpuset = "24-27"

# [[processors.pc2.subs]]
# [processors.pc2.subs.cgroup]
# cpuset = "28-31"

# C2 sub processes related
[processors.c2]
# sub processes
external = true
# proceessors can be used by sub process, optional if you haven't set cgroup previously
# [[processors.c2.subs]]
# [processors.c2.subs.cgroup]
# cpuset = "32-47"
```

Start worker.
```bash
$ RUST_LOG=debug TMPDIR=./ nohup ./venus-worker daemon --config=./venus-worker.toml 2>&1 > worker.log &
```

