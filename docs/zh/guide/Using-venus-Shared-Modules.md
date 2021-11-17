## 背景

考虑到庞大的初始硬件和Filecoin质押[投资](https://filscan.io/calculator)以及相关的运营成本，开始Filecoin挖掘是一项艰巨的任务。 囊括了安全性、易用性和分布式存储池的想法，Venus将帮助存储提供者，正如社区所说，把[全职工作](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5)变成为一个严肃的爱好。 希望本教程能让您立即开始挖矿！

## 如何提供存储服务

有两种方法可以开始使用Venus来提供存储服务。

1. 部署最少的硬件并获得对第三方托管的共享venus模块的使用帐号。(本教程的其余部分将引导您完成这种部署Venus服务的方式)
2. 自行部署所有需要的硬件和venus模块。(请参阅[这个](How-To-Deploy-MingPool.md)教程以了解更多信息)

在遵循其余的教程和成功部署后，您可以开始封装扇区，增加算力并通过您对网络存储容量的贡献最终获得区块奖励！

## venus模块介绍

根据其在挖矿集群中的作用，模块可以大致分为两类：共享和独立。 共享模块可以被认为是开始封装扇区所需的基础。 大多数与区块链的交互，如链同步、发送消息、赢得赢票等，都是由共享模块处理的。 这个想法是许多矿工都可以共用一组共享模块，从而减少维护成本。 独立模块处理封装和证明您的扇区。如果您选择使用第三方托管的共享Venus模块，您将花费大部分时间在独立模块上。 另请注意，`venus-wallet`模块可以作为共享或独立部署。

| name                                                         | role                                                  | shared/independent |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| [venus](https://github.com/filecoin-project/venus)           | daemon for chain interactions                         | shared             |
| [venus-miner](https://github.com/filecoin-project/venus-miner) | block winning and proving                             | shared             |
| [venus-messager](https://github.com/filecoin-project/venus-messager) | chain message management                              | shared             |
| [venus-auth](https://github.com/filecoin-project/venus-auth) | utility for authorized use of shared modules          | shared             |
| [venus-gateway](https://github.com/ipfs-force-community/venus-gateway) | utility for controlled access point of shared modules | shared             |
| [venus-wallet](https://github.com/filecoin-project/venus-wallet) | addresses/keys management                             | shared/independent |
| [venus-sealer](https://github.com/filecoin-project/venus-sealer), [venus-worker](https://github.com/filecoin-project/venus-sealer) | job scheduling, sealing and proving                   | independent        |
| [venus-market](https://github.com/filecoin-project/venus-market) | deal making                                           | independent        |

## 服务架构

下图展示了venus模块如何相互交互。

![venus-cluster](../../.vuepress/public/venus-cluster.png)

## 硬件要求

在[此处](https://github.com/filecoin-project/community-china/discussions/18)了解有关硬件要求的更多信息。或者参阅我们的[单机配置示例](https://venus.filecoin.io/zh/operation/example-single-box.html)。

## 前期准备

在深入部署您的挖矿操作之前，请确保您已完成以下步骤。

:::warning

建议您在部署到主网上之前在`calibration`网络中测试您的配置。

:::

### 永久存储

选择您熟悉的网络文件系统（例如 NFS）并部署您的存储集群。

### 在共享模块中设置您的帐户

有两种方法可以配置您的帐户。

#### 对于需接入共享模块的用户

如果您尝试连接到第三方托管的共享venus模块，联系上述服务的管理员并让他们为您设置。

:::tip

venus-wallet 可以部署为共享或独立模块，具体取决于您的安全要求。

:::

#### 对于共享模块的管理员

如果您是托管共享 venus 模块的管理员，请使用以下命令注册各个集群。

```bash
# 如果已有节点号
$ ./venus-auth user add --name <ACCOUNT_NAME> --miner <MINER_ID>

# 没有节点号，在创建节点号后更新
$ ./venus-auth user add --name <ACCOUNT_NAME>
$ ./venus-auth user update --name <ACCOUNT_NAME> --miner <MINER_ID>

# 为此账号分配token，用于接入服务层验证
$ ./venus-auth token gen --perm write <ACCOUNT_NAME>
<AUTH_TOKEN_FOR_ACCOUNT_NAME>
```

### 软件依赖

在运行 venus 之前，您需要安装以下软件。

#### 构建工具

Ubuntu/Debian:

```shell
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config curl clang build-essential hwloc libhwloc-dev wget -y && sudo apt upgrade -y
```

CentOS:

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```

### Rust

安装[rustup](https://rustup.rs/)。

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Go

构建venus，您需要安装[Go 1.16 或更高版本](https://golang.org/dl/)。

```bash
wget -c https://golang.org/dl/go1.16.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
```

将 `/usr/local/go/bin` 添加到您的路径并设置`go env`。对于大多数Linux系统，您可以运行以下内容：

```bash
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc && source ~/.bashrc
# setup go env
export GOPROXY=https://goproxy.cn
go env -w GO111MODULE=on
```

如果卡住，请参阅[官方Golang安装说明](https://golang.org/doc/install)。

## 安装venus-wallet

下载并编译`Venus-wallet`的源代码。

- 首次编译

```bash
$ git clone https://github.com/filecoin-project/venus-wallet.git
# change directory to venus-wallet
$ cd venus-wallet
$ git checkout -b incubation origin/incubation
$ make
```

- 曾经成功编译过

```bash
# change directory to venus-wallet,switch to the incubation branch
$ git fetch
$ git pull
```

在后台运行`venus-wallet`模块。

```bash
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

:::tip 

使用 `tail -f wallet.log` 来监控钱包日志。

:::

为您的`venus-wallet`设置密码

```bash
$ ./venus-wallet setpwd
Password:******
Enter Password again:******
Password set successfully
```

:::warning

请备份您的密码并妥善保存，否则你将无法使用wallet相关的功能。每次venus-wallet run启动时带--password标志会自动解锁钱包,如果没带,在wallet实例启动后你需要手动解锁:
```bash
$ ./venus-wallet unlock
Password: 

# 查看解锁状态
$ ./venus-wallet lock-state
wallet state: unlocked
```
在扇区封装的过程中需要调用wallet进行签名,如果不解锁,会导致签名失败,进而导致扇区任务失败.

:::

生成owner和worker地址。（如果您没有现有的miner ID）

```bash
$ ./venus-wallet new bls
<OWNER_ADDRESS>
$ ./venus-wallet new bls
<WORKER_ADDRESS>
```

:::tip

如果您在`Calibration`上进行测试，则必须使用来自水龙头的测试币为您的所有地址提供资金。对于校准网，请使用此[水龙头](https://faucet.calibration.fildev.network/funds.html)。

:::

***配置venus-wallet接入共享服务,使用您从共享模块管理员处获得的帐号信息更改 `~/.venus_wallet/config.toml`中的`[APIRegisterHub]` 部分***

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

重新启动`venus-wallet`以使更改生效。

```bash
# grep [PID] of venus-wallet process
$ ps -ef | grep wallet
# kill the process and restart
$ kill [PID]
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

如成功连接 `venus-gateway`，您将看到以下日志。

```bash
2021-07-12T15:14:12.457+0800    INFO    wallet_event    wallet_event/listenevent.go:197 connect to server fcf714b2-eeb6-498b-aafc-5e58eccd9d0f  {"api hub": "/ip4/<IP_ADDRESS>/tcp/45132"}
```

:::tip

建议使用`systemd`或`supervisord`等线程控制。

:::

:::warning

请确保venus-wallet 处于unlocked状态，要么会在Sealer模块初始化时卡在 "Waiting for confirmation"，导致miner帐号生成不了。

:::


## 安装venus-sealer

下载并编译`venus-sealer`的源代码。

- 首次编译

```bash
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout -b incubation origin/incubation
# specify source compilation
export RUSTFLAGS="-C target-cpu=native -g"
export FFI_BUILD_FROM_SOURCE=1
$ make deps
$ make
```

源码编译也可以

```bash
$ RUSTFLAGS="-C target-cpu=native -g" FFI_BUILD_FROM_SOURCE="1" make deps
```

- 曾经成功编译过

```bash
$ git fetch
$ git pull

# Update and compile filecoin-ffi, if filecoin-ffi has not changed, no need to execute
$ git submodule update --init --recursive
$ make clean
$ make deps

$ make
```

:::warning

- 确保编译时使用`RUSTFLAGS="-C target-cpu=native -g" FFI_BUILD_FROM_SOURCE="1"` 源码编译filecoin-ffi库，如果cpu支持则启用SHA扩展，这会大幅提高扇区封装速度，源码编译（make deps）时特征如下：
```
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

:::

:::tip 

如果您是第一次运行sealer，它会开始下载证明参数，这可能需要相当长的时间。如果您确认已下载`proof params`，可使用`TRUST_PARAMS=1`跳过下载逻辑执行。如果您位于中国，请按照提示[此处](../advanced/Tips-Running-In-China.md)加快流程。

:::

### 创建新的miner-id来初始化sealer

如果您还没有miner-id，请运行以下命令来初始化sealer。请确保`<OWNER_ADDRESS>`中有足够资金支付gasfee，否则`init`将失败。

```bash
$ nohup ./venus-sealer \
# Leave out this flag for mainnet
--network=calibration init \
--worker=<WORKER_ADDRESS> \
--owner=<OWNER_ADDRESS>  \
# Choose between 32G or 64G for mainnet
--sector-size 512M \
# Config for different shared venus modules
--node-url=/ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url=/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> \
--auth-token=<AUTH_TOKEN_FOR_ACCOUNT_NAME> \
# Flags sealer to not storing any sealed sectors on the machine it runs on
# You can leave out this flag if you are on testnet
--no-local-storage \
> sealer.log 2>&1 &
```

以下为成功创建`<MINER_ID>`的日志。

```bash
2021-07-12T17:02:07.199+0800	INFO	main	venus-sealer/init.go:142	Initializing venus sealer
2021-07-12T17:02:07.199+0800	INFO	main	venus-sealer/init.go:162	Checking proof parameters
2021-07-12T17:03:35.229+0800	INFO	paramfetch	go-paramfetch@v0.0.2-0.20210614165157-25a6c7769498/paramfetch.go:207	parameter and key-fetching complete
2021-07-12T17:03:35.229+0800	INFO	main	venus-sealer/init.go:176	Trying to connect to full node RPC
2021-07-12T17:03:35.592+0800	INFO	main	venus-sealer/init.go:190	Checking full node sync status
2021-07-12T17:03:35.592+0800	INFO	main	venus-sealer/init.go:198	Checking if repo exists
2021-07-12T17:03:35.592+0800	INFO	main	venus-sealer/init.go:210	Checking full node version
2021-07-12T17:03:36.099+0800	INFO	main	venus-sealer/init.go:226	Initializing repo
2021-07-12T17:03:36.100+0800	INFO	main	venus-sealer/init.go:339	Initializing libp2p identity
2021-07-12T17:03:39.022+0800	INFO	main	venus-sealer/init.go:515	Pushed CreateMiner message: 3bfd3fc8-4f8d-45c8-86e9-5fe29a02fec0
2021-07-12T17:03:39.022+0800	INFO	main	venus-sealer/init.go:516	Waiting for confirmation
2021-07-12T17:07:39.184+0800	INFO	main	venus-sealer/init.go:532	New miners address is: <MINER_ID> (t2qgsnl5qy7sehm7u5nobkblmi2t4tuvh7flc4nqy)
2021-07-12T17:07:39.184+0800	INFO	main	venus-sealer/init.go:411	Created new miner: <MINER_ID>
2021-07-12T17:07:39.185+0800	INFO	main	venus-sealer/init.go:295	Sealer successfully created, you can now start it with 'venus-sealer run'
```

:::tip 

`init`命令会发送创建矿工消息并等待上链，可能需要等待几分钟。 

:::

### 使用现有的miner-id初始化sealer

如果您已经有miner-id，请运行以下命令来初始化sealer。请确保`<OWNER_ADDRESS>`中有足够资金支付gasfee，否则`init`将失败。

```bash
$ ./venus-sealer 
# Leave out this flag for mainnet
--network=calibration init \
--actor=<MINER_ID>  \
# Config for different shared venus modules
--node-url=/ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url=/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> \
--auth-token=<AUTH_TOKEN_FOR_ACCOUNT_NAME> \
# Flags sealer to not store any sealed sectors on the machine it runs on
--no-local-storage \
> sealer.log 2>&1 &
```

以下为成功init日志的范例。

```bash
2021-06-07T04:15:49.170+0800    INFO    main    venus-sealer/init.go:193        Checking if repo exists
2021-06-07T04:15:49.170+0800    INFO    main    venus-sealer/init.go:205        Checking full node version
2021-06-07T04:15:49.174+0800    INFO    main    venus-sealer/init.go:221        Initializing repo
2021-06-07T04:15:49.175+0800    INFO    main    venus-sealer/init.go:334        Initializing libp2p identity
2021-06-07T04:15:49.181+0800    INFO    main    venus-sealer/init.go:406        Created new miner: t02105
2021-06-07T04:15:49.181+0800    INFO    main    venus-sealer/init.go:290        Sealer successfully created, you can now start it with 'venus-sealer run'
```

## 开始封装

运行sealer。

```bash
$ nohup ./venus-sealer run > sealer.log 2>&1 &
```

给sealer指定临时路径（存放p1-c2阶段生成文件，sector完成后会释放）和持久存储路径（用于做winningPoSt或wdPoSt的文件需要持久保存）

```bash
$ ./venus-sealer storage attach --init --store <ABSOLUTE_PATH_OF_YOUR_PERMANENT_STORAGE>
$ ./venus-sealer storage attach --init --seal <ABSOLUTE_PATH_OF_YOUR_SEALING_STORAGE>
```

如果你的两个目录是相同的，那么可以一次性指定
```
./venus-sealer storage attach --init --store --seal <ABSOLUTE_PATH>
```

> 如果你打算只用venus-sealer封装扇区，那么seal和store路径必须都配置，缺一不可。
```bash
$ ./venus-sealer storage list
37109bd3-15cc-4821-99e8-b7af891f2e84:
        [####################***                           ] 4.82 TiB/10.39 TiB 46%
        Unsealed: 2; Sealed: 1; Caches: 1; Reserved: 483.2 GiB
        Weight: 10; Use: Seal 
        URL: http://127.0.0.1:3456/remote (latency: 9.1ms)
f4074188-c851-4468-820b-e138beb5f12d:
        [####################                              ] 4.348 TiB/10.39 TiB 41%
        Unsealed: 1; Sealed: 8; Caches: 8; Reserved: 0 B
        Weight: 10; Use: Seal Store
        Local: /mnt/mount/litao/
        URL: http://192.168.200.17:2345/remote
```

封装一个扇区。

```bash
$ ./venus-sealer sectors pledge 
```

:::warning

如果遇到如下错误, 请复制一个已经生成的unsealed文件(`~/.venussealer/unsealed/`) 到 `/var/tmp/s-basic-unsealed-34359738368`.

```bash
2021-09-01T10:41:10.394+0200    WARN    sectors storage-sealing/fsm.go:626      sector 611 got error event sealing.SectorSealPreCommit1Failed: seal pre commit(1) failed: storage call error 0: The default unsealed does not exist,please copy a generated unsealed file to /var/tmp/s-basic-unsealed-34359738368
```

我们建议先生成一个unsealed文件后拷贝到每个做 P1 任务的worker机器/var/tmp目录,文件的命令规则: 
- s-basic-unsealed-***SectorSize***
- s-piece-infos-***SectorSize***

SectorSize 选项: 2048,8388608,536870912,34359738368,68719476736,eg. 32G:

```
/var/tmp/s-piece-infos-34359738368
/var/tmp/s-basic-unsealed-34359738368
```

不同SectorSize对应的s-piece-infos-***SectorSize***文件内容:
```
# 32G
[{"Size":34359738368,"PieceCID":{"/":"baga6ea4seaqao7s73y24kcutaosvacpdjgfe5pw76ooefnyqw4ynr3d2y6x2mpq"}}]

# 8M
[{"Size":8388608,"PieceCID":{"/":"baga6ea4seaqgl4u6lwmnerwdrm4iz7ag3mpwwaqtapc2fciabpooqmvjypweeha"}}]

# 512M
[{"Size":536870912,"PieceCID":{"/":"baga6ea4seaqdsvqopmj2soyhujb72jza76t4wpq5fzifvm3ctz47iyytkewnubq"}}]

# 2k
[{"Size":2048,"PieceCID":{"/":"baga6ea4seaqpy7usqklokfx2vxuynmupslkeutzexe2uqurdg5vhtebhxqmpqmy"}}]

# 64G
[{"Size":68719476736,"PieceCID":{"/":"baga6ea4seaqomqafu276g53zko4k23xzh4h4uecjwicbmvhsuqi7o4bhthhm4aq"}}]
```

:::

一般启动一个脚本或系统事务用于发任务,最好是相隔一段时间发一个任务。为了避免任务数过多导致系统卡顿，需要控制sector的任务上限(MaxSealingSectors)。

```bash
$ vim ~/.venussealer/config.toml 

[Sealing]
  ...
  MaxSealingSectors = 0
```

检查正在进行的封装工作

```bash
$ ./venus-sealer sealing
$ ./venus-sealer sealing workers
$ ./venus-sealer sealing jobs
```

检查扇区状态
```bash
$ ./venus-sealer sectors list
$ ./venus-sealer sectors status  --log  <sectorNum>
```

如果某个扇区因为ticket过期或别的原因无法继续做下去，你需要及时remove掉，不然会占着磁盘和任务数。

```bash
# Terminating -> TerminateWait -> TerminateFinality/TerminateFailed
$ ./venus-sealer sectors terminate  --really-do-it <sectorNum>
# Removing -> RemoveFailed/Removed
$ ./venus-sealer sectors remove  --really-do-it <sectorNum>
```

Remove和Terminate执行受限于Sealing的并发机制，有时需要很长时间，你可以尝试多次执行这两个命令加快速度。查看Sector状态：

```bash
$ ./venus-sealer sectors list
ID  State       OnChain  Active  Expiration                    Deals
1   Proving     YES      YES     2513094 (in 1 year 24 weeks)  CC
2   Removed    NO       NO      n/a                           CC
3   PreCommit1  NO       NO      n/a                           CC
```

设置发送消息的地址：

```bash
[Addresses]
  PreCommitControl = [] # P2
  CommitControl = [] # C2
  DisableOwnerFallback = false # true 表示禁用
  DisableWorkerFallback = false # true 表示禁用
```
> P2,C2消息的from可以设置多个，但必须是miner-id相关联的，如worker，owner或controller。

## worker机制

在Filecoin系统中,venus-sealer可以被认为是一个带有状态管理机的venus-worker，也就是说:

sealer = worker + sector_state_manager

除了做worker具备的工作外，它有两个主要功能:
- 管理每个扇区的状态，包括分配扇区任务，处理与扇区状态变化的事件等;
- 定期执行windowPost.

因此，我们通常将耗时的任务交给venus-worker做，让sealer做windowPoSt和Sectors状态管理。这样做的好处是:venus-sealer重启后，不会影响到worker正在进行的任务,否则会导致仍无频繁重做.

- 只允许venus-sealer做AddPiece，禁止做P1, P2, C1, C2等任务，修改` ~/.venussealer/config.toml ', 然后重启.
```bash
vim  ~/.venussealer/config.toml 
# modify
[Storage]
  ParallelFetchLimit = 10
  AllowAddPiece = true
  AllowPreCommit1 = false
  AllowPreCommit2 = false
  AllowCommit = false
  AllowUnseal = false
  
# Restart venus-sealer after saving
```

-- 启动worker并指定可以接的任务类型.
```
$ TRUST_PARAMS=1 nohup ./venus-worker run \
--miner-addr=</ip4/sealer-ip/tcp/sealer-port> \
--miner-token=<token> \
--task-total=100 \
--bindP1P2=false \
--listen=<0.0.0.0:3458> <flags> > worker.log 2>&1 &           
```
- sealer-port: cat ~/.venussealer/api, eg. /ip4/0.0.0.0/tcp/2345/http,把0.0.0.0替换为venus-sealer实际的IP地址.
- token: cat ~/.venussealer/token
- flags:
```
--addpiece                    enable addpiece (default: true)
--precommit1                  enable precommit1 (32G sectors: 1 core, 128GiB RAM) (default: true)
--unseal                      enable unsealing (32G sectors: 1 core, 128GiB RAM) (default: true)
--precommit2                  enable precommit2 (32G sectors: multiple cores, 96GiB RAM) (default: true)
--commit                      enable commit (32G sectors: multiple cores or GPUs, 128GiB RAM + 64GiB swap) (default: true)
--task-total                  total number of task (default: 100)
--bindP1P2                    P1 and P2 phase tasks are bound to the same machine (default: false)
```
- ***task-total为可同时进行的任务数,默认100;***
- ***bindP1P2设置为true表示这个worker的P2只能接P1也在本机器上完成的Sector任务,如果网络带宽不足,建议启动,可以减少不必要的文件传输***

一般情况下，我们只为venus-worker配置seal路径,Store继承venus-sealer。worker完成扇区密封时，永久存储文件将被转移到venus-sealer指定的store路径.
```bash
$ ./venus-worker storage attach --init --seal <ABSOLUTE_LOCAL_PATH>
```

### 多worker注意事项

- TMPDIR指定worker的临时目录，比如gpu的文件锁就会生成在此路径下，worker运行在同一机器上时需要指定不同的TMPDIR，否则会竞争文件锁；
- 多个worker在同一机器同用户创建时需要指定不同的库目录，需要带repo flag，形式：
```bash
$ TRUST_PARAMS=1 nohup ./venus-worker --repo=<REPO_PATH> run \
--miner-addr=</ip4/sealer-ip/tcp/sealer-port> --miner-token=<token> \
--task-total=100 --bindP1P2=false \
--listen=<0.0.0.0:3458> <flags> > worker.log 2>&1 &
```

查看venus-worker状态

```bash
$ ./venus-worker info

# A worker's storage will be added to the venus-sealer storage list
$ ./venus-sealer storage list 
01135ade-337a-4011-9cd8-6e85edbe08fc:
        [#######                                           ] 26.52 TiB/181.2 TiB 14%
        Unsealed: 0; Sealed: 1080; Caches: 1080; Reserved: 0 B
        Weight: 10; Use: Seal Store
        Local: /storage-nfs/torage
        URL: http://0.0.0.0:2345/remote
14142f91-6365-4b2a-ad1b-d2dd4ebd6e33:
        [###################                               ] 4.044 TiB/10.39 TiB 38%
        Unsealed: 3; Sealed: 0; Caches: 0; Reserved: 0 B
        Weight: 10; Use: Seal 
        URL: http://192.168.200.17:3458/remote (latency: 1.2ms)
```

## 加速项配置

如果您的系统硬件资源足够大，或者拥有GPU等可以加快扇区密封的资源,您可以根据实际环境设置环境变量。

```bash
# MINER_API_INFO as obtained before
export TMPDIR=/fast/disk/folder3                    # used when sealing
export MINER_API_INFO:<TOKEN>:/ip4/<miner_api_address>/tcp/<port>/http`
export BELLMAN_CPU_UTILIZATION=0.875      # optimal value depends on exact hardware
export FIL_PROOFS_MAXIMIZE_CACHING=1
export FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1 # when GPU is available
export FIL_PROOFS_USE_GPU_TREE_BUILDER=1   # when GPU is available
export FIL_PROOFS_PARAMETER_CACHE=/fast/disk/folder # > 100GiB!
export FIL_PROOFS_PARENT_CACHE=/fast/disk/folder2   # > 50GiB!
# The following increases speed of PreCommit1 at the cost of using a full
# CPU core-complex rather than a single core.
# See https://github.com/filecoin-project/rust-fil-proofs/ and the
# "Worker co-location" section below.
export FIL_PROOFS_USE_MULTICORE_SDR=1
```

venus-worker使用了一个GPU程序，在双卡3080机器上运行，程序会自动搜寻并使用0号和1号GPU卡。性能测试要求程序只运行在一张GPU卡上，但程序没有参数设置GPU的地方。
采取CUDA环境变量CUDA_VISIBLE_DEVICES来限定程序运行的GPU设备解决问题:
```bash
// CUDA_VISIBLE_DEVICES设置说明，设置device对程序可见
CUDA_VISIBLE_DEVICES=1       // 仅使用device1 (即卡一)
CUDA_VISIBLE_DEVICES=0,1     // 仅使用device 0和 device1
CUDA_VISIBLE_DEVICES="0,1"	 // 同上, 仅使用device 0和 device1
CUDA_VISIBLE_DEVICES=0,2,3   // 仅使用device 0, device2和device3
CUDA_VISIBLE_DEVICES=2,0,3   // 仅使用device0, device2和device3
```

可以通过以下变量来提升显卡GPU内存的使用率，减少P2任务的用时
FIL_PROOFS_MAX_GPU_COLUMN_BATCH_SIZE  -  每次计算Column的batch大小，默认400000;
FIL_PROOFS_MAX_GPU_TREE_BATCH_SIZE  -   每次Encoding计算的batch大小，默认700000
```bash
// 建议值
FIL_PROOFS_MAX_GPU_COLUMN_BATCH_SIZE=8000000,FIL_PROOFS_MAX_GPU_TREE_BATCH_SIZE=8000000
```

这些变量的使用有两种方式：
- 在启动venus-sealer和venus-worker前 export设置,如我想开启cpu多核计算
```bash
export FIL_PROOFS_USE_MULTICORE_SDR=1
nohup ./venus-sealer run >> sealer.log 2>&1 &
```

- 在启动命令中使用环境变量
```bash
FIL_PROOFS_USE_MULTICORE_SDR=1 nohup ./venus-worker run >> worker.log 2>&1 &
```
***关于GPU的使用***

- C2阶段会主动搜索机器是否有可用GPU，有则使用；
- P2阶段在生成tree-c和tree-r-last阶段可以使用gpu加速，但需要在启动对应sealer或worker时配置环境变量：FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1表示生成tree-r-last阶段使用GPU，FIL_PROOFS_USE_GPU_TREE_BUILDER=1表示生成tree-c阶段使用GPU。


参考文档
- https://docs.filecoin.io/mine/lotus/miner-troubleshooting/
- https://docs.filecoin.io/get-started/lotus/installation/#linux
- https://docs.filecoin.io/mine/lotus/miner-setup/#pre-requisites
- https://github.com/filecoin-project/venus-docs/blob/master/docs/zh/mine/venus/power_growth_and_maintain.md

## lotus-miner

&ensp;&ensp; 如果你已经用lotus-miner密封了一定数量的扇区，我们建议你继续使用lotus-miner，venus社区同步维护可接入共享组件的lotus-miner：https://github.com/ipfs-force-community/lotus，对于lotus官方的每个大版本，我们会同步发布对应版本。

&ensp;&ensp; 这个分支只是将对接共享组件的逻辑加进来，其他逻辑一切没变，你可以按照原有的习惯去执行lotus-miner。

### 已有算力集群处理

&ensp;&ensp;等待lotus-miner正在做的扇区完成后执行下列流程：

1. 停止lotus-miner，因为默认lotus-miner和venus-sealer都是用的2345端口；

2. 初始化venus-sealer，--actor 指定原来的矿工地址；

3. 启动venus-sealer后，使用venus-sealer storage attach --store 来指定原来数据存储的路径；

5. 修改默认下发sector id的数值,导入lotus-miner下发的扇区：

&ensp;&ensp; 如果想继续增长算力,需要修改扇区nextid的值>已完成扇区的最大ID;想在venus-sealer查看已有的扇区,需要从lotus-miner导入,具体方法如下:
```bash
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=0 -sid=10
```
`taskType`: 0-只修改nextid,1-只导入扇区,2-都做; `sid`: 默认是0,这时会从源仓库中查找最大扇区的ID写入nextid,其他值-以指定的值修改nextid,举例如下:
```bash
# 只修改nextid=300
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=0 -sid=300

# 仅导入扇区
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=1

# 导入扇区并修改nextid为已有扇区最大的ID
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=2
```

## 问题?

来[Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)上找我们吧！
