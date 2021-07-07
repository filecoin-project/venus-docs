## 背景

考虑到庞大的初始硬件和Filecoin质押[投资](https://filscan.io/calculator)以及相关的运营成本，开始Filecoin挖掘是一项艰巨的任务。 囊括了安全性、易用性和分布式存储池的想法，Venus将帮助存储提供者，正如社区所说，把[全职工作](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5)变成为一个严肃的爱好。 希望本教程能让您立即开始挖矿！

## 如何提供存储服务

有两种方法可以开始使用Venus来提供存储服务。

1. 部署最少的硬件并获得对第三方托管的共享venus模块的使用帐号。（本教程的其余部分将引导您完成这种部署Venus服务的方式）
2. 自行部署所有需要的硬件和venus模块。 （请参阅[这个](How-To-Deploy-MingPool.md)教程以了解更多信息）

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

## 服务架构

下图展示了venus模块如何相互交互。

![venus-cluster](/venus-cluster.png)

## 硬件要求

在[此处](https://github.com/filecoin-project/community-china/discussions/18)了解有关硬件要求的更多信息。

## 前期准备

在深入部署您的挖矿操作之前，请确保您已完成以下步骤。

:::warning

建议您在部署到主网上之前在`nerpa` 或`calibration`网络中测试您的配置。

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

如果您是托管共享 venus 模块的管理员，请使用以下命令为您的矿工创建一个帐户。

```bash
# If miner doesn't have a <MINER_ID> yet, leave out --miner flag and use 'updateUser' when user inited their miner id
$ ./venus-auth addUser --name <ACCOUNT_NAME> --miner <MINER_ID>
# The returned token is what miner have to add into their config file in order to gain access to your shared modules
$ ./venus-auth genToken --perm write <ACCOUNT_NAME>
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

#### Go

构建venus，您需要安装[Go 1.16 或更高版本](https://golang.org/dl/)。

```bash
wget -c https://golang.org/dl/go1.16.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
```

将 `/usr/local/go/bin` 添加到您的路径并设置`go env`。对于大多数Linux系统，您可以运行以下内容：

```bash
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc && source ~/.bashrc
# setup go env
go env -w GOPROXY=https://goproxy.io,direct
go env -w GO111MODULE=on
```

如果卡住，请参阅[官方Golang安装说明](https://golang.org/doc/install)。

## 安装venus-wallet

下载并编译`Venus-wallet`的源代码。

```bash
$ git clone https://github.com/filecoin-project/venus-wallet.git
# change directory to venus-wallet
$ cd venus-wallet
$ git checkout <RELEASE_TAG>
$ make
```

在后台运行`venus-wallet`模块。

```bash
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

:::tip 

使用 `tail -f wallet.log` 来监控钱包日志。

:::

为您的`venus-wallet`设置密码。

```bash
$ ./venus-wallet setpwd
Password:******
Enter Password again:******
Password set successfully
```

:::warning

请备份您的密码并妥善保存。

:::

生成owner和worker地址。（如果您没有现有的miner ID）

```bash
$ ./venus-wallet new bls
<OWNER_ADDRESS>
$ ./venus-wallet new bls
<WORKER_ADDRESS>
```

:::tip

如果您在`Nerpa`或`Calibration`上进行测试，则必须使用来自水龙头的测试币为您的所有地址提供资金。 对于 nerpa，请使用此[水龙头](https://faucet.nerpa.interplanetary.dev/funds.html)。对于校准网，请使用此[水龙头](https://faucet.calibration.fildev.network/funds.html)。

:::

使用您从共享模块管理员处获得的帐号信息更改 `~/.venus_wallet/config.toml`中的`[APIRegisterHub]` 部分。

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

:::tip

建议使用`systemd`或`supervisord`等线程控制。

:::

## 安装venus-sealer

下载并编译`venus-sealer`的源代码。

```bash
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout <RELEASE_TAG>
# make dependency
$ make deps
$ make
```

### 创建新的miner-id来初始化sealer

如果您还没有miner-id，请运行以下命令来初始化sealer。

```bash
$ nohup ./venus-sealer init \
--worker <WORKER_ADDRESS> \
--owner <OWNER_ADDRESS>  \
# Choose between 32G or 64G for mainnet
--sector-size 512M \
# Choose from nerpa, calibration for testnets
# Leave out this flag for mainnet
--network nerpa \
# Config for different shared venus modules
--node-url /ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url /ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> \
--gateway-url /ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> \
--auth-token <AUTH_TOKEN_FOR_ACCOUNT_NAME> \
# Flags sealer to not storing any sealed sectors on the machine it runs on
# You can leave out this flag if you are on testnet
--no-local-storage \
> sealer.log 2>&1 &

# Expect output close to the following
2021-04-25T18:41:31.925+0800	INFO	main	venus-sealer/init.go:182	Checking if repo exists
2021-04-25T18:41:31.926+0800	INFO	main	venus-sealer/init.go:217	Checking full node version
2021-04-25T18:41:31.927+0800	INFO	main	venus-sealer/init.go:233	Initializing repo
2021-04-25T18:41:31.928+0800	INFO	main	venus-sealer/init.go:309	Initializing libp2p identity
2021-04-25T18:41:32.082+0800	INFO	main	venus-sealer/init.go:485	Pushed CreateMiner message: aaf489f9-af4b-4e4b-9084-018d43f05b7e
2021-04-25T18:41:32.082+0800	INFO	main	venus-sealer/init.go:486	Waiting for confirmation
2021-04-25T18:46:32.088+0800	INFO	main	venus-sealer/init.go:502	New miners address is: t01640 (t2cxzf7xvrqo3froqn2xgdqjdbydhkcrgakj7j3ma)
# miner id on nerpa and calibration starts with "t", while miner id on mainnet starts with "f"
2021-04-25T18:46:32.088+0800	INFO	main	venus-sealer/init.go:381	Created new miner: t01640
2021-04-25T18:46:32.089+0800	INFO	main	venus-sealer/init.go:302	Sealer successfully created, you can now start it with 'venus-sealer run'
```

### 使用现有的miner-id初始化sealer

如果您已经有miner-id，请运行以下命令来初始化sealer。

```bash
$ ./venus-sealer init \
--actor <MINER_ID>  \
# Choose from nerpa, calibration for testnets
# Leave out this flag for mainnet
--network nerpa \
# Config for different shared venus modules
--node-url /ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url /ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> \
--gateway-url /ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> \
--auth-token <AUTH_TOKEN_FOR_ACCOUNT_NAME> \
# Flags sealer to not store any sealed sectors on the machine it runs on
--no-local-storage \
> sealer.log 2>&1 &

# Expect output close to the following
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
$ nohup ./venus-sealer run >> sealer.log 2>&1 &
```

:::tip 

如果您是第一次运行sealer，它会开始下载证明参数，这可能需要相当长的时间。 如果您位于中国，请按照提示 [此处](../advanced/Tips-Running-In-China.md)加快流程。

:::

将永久存储连接到sealer。

```bash
$ ./venus-sealer storage attach --init --store <ABSOLUTE_PATH_OF_YOUR_PERMANENT_STORAGE> --seal <ABSOLUTE_PATH_OF_YOUR_SEALING_STORAGE>
```

封装一个扇区。

```bash
$ ./venus-sealer sectors pledge 
```

检查正在进行的封装工作。

```bash
$ ./venus-sealer sealing
```

参见`venus-sealer -h` 获取sealer支持的命令列表。

```bash
$ ./venus-sealer -h
NAME:
   venus-sealer - Filecoin decentralized storage network miner

USAGE:
   venus-sealer [global options] command [command options] [arguments...]

VERSION:
   1.4.1

COMMANDS:
   init      Initialize a venus sealer repo
   run       Start a venus sealer process
   sectors   interact with sector store
   actor     manipulate the miner actor
   info      Print miner info
   sealing   interact with sealing pipeline
   storage   manage sector storage
   messager  message cmds
   proving   View proving information
   stop      Stop a running venus sealer
   version   Print version
   help, h   Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --actor value, -a value  specify other actor to check state for (read only)
   --color                  (default: false)
   --help, -h               show help (default: false)
   --version, -v            print the version (default: false)
```

## 问题?

来[Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)上找我们吧！
