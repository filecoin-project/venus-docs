## Background

Starting filecoin mining could be a daunting task given not only the large initial hardware and filecoin collateral [investment](https://filscan.io/calculator) but also the entailing operation commitment. With ideas of security, ease of use and distributed mining pool in mind, Venus implementation of filecoin will help miners turn, what community say, [a full time job](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5) into a serious hobby. Hope this tutorial will get you started mining in no time! 

## How mining works

There are two ways of getting started with mining using Venus. 

1. Deploy minimum hardware and gain access to a publicly hosted shared venus modules.<!--(Checkout venus incubation center page to learn more on how you can get an account setup!)--> (The rest of this tutorial will walk you through this way of deploying venus mining operation)
2. Deploy all required hardware and venus modules by yourself. (See [this](How-To-Deploy-MingPool.md) tutorial to learn more)

After following the rest of the trutorial and successful deployment, you can start pledging sectors, grow power and evantually obtain block rewards through your contribution to the network's storage capacity!

## Introducing venus modules

Depending on its role in a mining cluster, modules could be loosely broken down into two category: shared and independent. Shared modules could be thought as the plumbings of what you need to start sealing sectors. Most of the dealings with the blockchain like chain synchronizations, sending messages, winning a block and etc are handled by the shared modules. The idea is that many miners could all use a set of shared modules, thus reducing overhead in maintainence. Independent modules handles sealing and proving of your sectors, where you will be spend most of your time if you choose to use a publicly hosted shared venus modules. Note also that venus-wallet module could be deployed as either shared or independent. 

| name                                                         | role                                                  | shared/independent |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| [venus](https://github.com/filecoin-project/venus)           | daemon for chain interactions                         | shared             |
| [venus-miner](https://github.com/filecoin-project/venus-miner) | block winning and proving                             | shared             |
| [venus-messager](https://github.com/filecoin-project/venus-messager) | chain message management                              | shared             |
| [venus-auth](https://github.com/filecoin-project/venus-auth) | utility for authorized use of shared modules          | shared             |
| [venus-gateway](https://github.com/ipfs-force-community/venus-gateway) | utility for controlled access point of shared modules | shared             |
| [venus-wallet](https://github.com/filecoin-project/venus-wallet) | addresses/keys management                             | shared/independent |
| [venus-sealer](https://github.com/filecoin-project/venus-sealer), [venus-worker](https://github.com/filecoin-project/venus-sealer) | job scheduling, sealing and proving                   | independent        |

## Mining architecture

Diagram below illustrates how venus modules interacts with one and another.

![venus-cluster](/venus-cluster.png)

## Hardware requirements

Learn more about hardware requirements [here](https://github.com/filecoin-project/lotus/discussions/6071).

## Pre-requisites

Before diving into deployment of your mining operation, please make sure you go through the following steps. 

:::warning

It is recommended that you test your setup in nerpa or calibration network before deploying on mainnet. 

:::

### Setup your permanent storage

Choose a network file system that you are familiar with (NFS for example) and deploy your storage cluster.

### Get your account setup in shared modules

There are two ways to have your account setup.

#### For miners connecting to shared modules

If you are trying to connect to a hosted shared venus modules, <!--like ones provided by venus incubation center,--> contact admin of said service and have them set it up for you.

:::tip

venus-wallet can be deployed as either a shared or independent module depend on your security requirement.

:::

#### For admins of shared modules

If you are an admin hosting shared venus modules, use the following command to create an account for your miner.

```bash
# If miner doesn't have a <MINER_ID> yet, leave out --miner flag and use 'updateUser' when user inited their miner id
$ ./venus-auth user add --name <ACCOUNT_NAME> --miner <MINER_ID> --state=1 --sourceType=1
# The returned token is what miner have to add into their config file in order to gain access to your shared modules
$ ./venus-auth token gen --perm write <ACCOUNT_NAME>
<AUTH_TOKEN_FOR_ACCOUNT_NAME>
```

Update user information if necessary.

```bash
./venus-auth user update --name=<ACCOUNT_NAME> --miner=<MINER_ID> --state=1  --sourceType=1
```

### Software dependencies

You will need to have the following software installed before running venus.

#### Build tools

Ubuntu/Debian:

```shell
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config curl clang build-essential hwloc libhwloc-dev wget -y && sudo apt upgrade -y
```

CentOS:

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```

#### Go

To build venus, you need a working installation of [Go 1.16 or higher](https://golang.org/dl/).

```bash
wget -c https://golang.org/dl/go1.16.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
```

Add `/usr/local/go/bin` to your path and setup `Go` env. For most Linux distributions you can run something like:

```bash
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc && source ~/.bashrc
# setup go env
go env -w GOPROXY=https://goproxy.io,direct
go env -w GO111MODULE=on
```

See the [official Golang installation instructions](https://golang.org/doc/install) if you get stuck.

## Install venus-wallet

Download and compile the source code of venus-wallet.

```bash
$ git clone https://github.com/filecoin-project/venus-wallet.git
# change directory to venus-wallet
$ cd venus-wallet
$ git checkout <RELEASE_TAG>
$ make
```

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

Please keep backups of your password and store them properly.

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

Change `[APIRegisterHub]` section of  `~/.venus_wallet/config.toml` using the credential you get from shared module admin.

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

Restart venus-wallet so that the changes takes into effect.

```bash
# grep [PID] of venus-wallet process
$ ps -ef | grep wallet
# kill the process and restart
$ kill [PID]
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

You should see logs close to the following indicating successful connection to `venus-gateway`.

```bash
2021-07-12T15:14:12.457+0800    INFO    wallet_event    wallet_event/listenevent.go:197 connect to server fcf714b2-eeb6-498b-aafc-5e58eccd9d0f  {"api hub": "/ip4/<IP_ADDRESS>/tcp/45132"}
```

:::tip

Using process controll like  `systemmd` or `supervisord` is recommended.

:::

## Install venus-sealer

Download and compile the source code of venus-sealer.

```bash
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout <RELEASE_TAG>
# make dependency
$ make deps
$ make
```

:::tip 

If you are using sealer for the 1st time, it may start to download proof parameters, which may take quite some time. If you already downloaded the proof params, use `TRUST_PARAMS=1` to suppress downloading. If you are located in China, follow the tips [here](https://venus.filecoin.io/Tips-Running-In-China.html) to speed up the process.  

:::

### Initialize sealer with a new miner id

If you don't have a miner id yet, run the following command to initialize sealer.

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
```

Expect logs close to the following indicating a successful creation of a new `<MINER_ID>`.

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

It may take couple minutes before  `init` command finishes. 

:::

### Initialize sealer with an existing miner id

If you already have a miner id, run the following command to initialize sealer.

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
```

Expect logs close to the following.

```bash
2021-06-07T04:15:49.170+0800    INFO    main    venus-sealer/init.go:193        Checking if repo exists
2021-06-07T04:15:49.170+0800    INFO    main    venus-sealer/init.go:205        Checking full node version
2021-06-07T04:15:49.174+0800    INFO    main    venus-sealer/init.go:221        Initializing repo
2021-06-07T04:15:49.175+0800    INFO    main    venus-sealer/init.go:334        Initializing libp2p identity
2021-06-07T04:15:49.181+0800    INFO    main    venus-sealer/init.go:406        Created new miner: t02105
2021-06-07T04:15:49.181+0800    INFO    main    venus-sealer/init.go:290        Sealer successfully created, you can now start it with 'venus-sealer run'
```

## Start pledging

Run sealer.

```bash
$ nohup ./venus-sealer run >> sealer.log 2>&1 &
```

Attach permanent storage to sealer.

```bash
$ ./venus-sealer storage attach --init --store <ABSOLUTE_PATH_OF_YOUR_PERMANENT_STORAGE> --seal <ABSOLUTE_PATH_OF_YOUR_SEALING_STORAGE>
```

Pledge a single sector.

```bash
$ ./venus-sealer sectors pledge 
```

Check ongoing sealing job.

```bash
$ ./venus-sealer sealing
```

See `venus-sealer -h` for list of commands that sealer supports.

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

## Questions?

Find us on [Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)!
