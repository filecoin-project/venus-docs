# Table of Contents

[[TOC]]

## Background

Starting filecoin mining could be a daunting task given not only the large initial hardware and filecoin collateral [investment](https://filscan.io/calculator) but also the entailing operation commitment. With ideas of security, ease of use and distributed mining pool in mind, Venus implementation of filecoin will help miners turn, what community say, [a full time job](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5) into a serious hobby. Hope this tutorial will get you started mining in no time! 

> ***In view of the wide variety of models on the market, the matching scheme of sealer and worker is very complicated. You need to keep familiar with your own resources and environment, and gradually improve the scheme.***

## How mining works

There are two ways of getting started with mining using Venus. 

1. Deploy minimum hardware and gain access to a publicly hosted shared venus modules.<!--(Checkout venus incubation center page to learn more on how you can get an account setup!)--> (The rest of this tutorial will walk you through this way of deploying venus mining operation)
2. Deploy all required hardware and venus modules by yourself. (See [this](https://venus.filecoin.io/guide/How-To-Deploy-MingPool.html) tutorial to learn more)

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

![venus-cluster](../../.vuepress/public/venus-cluster.png)

## Hardware requirements

Learn more about hardware requirements [here](https://docs.filecoin.io/mine/mining-architectures/#protocol-labs-example-architecture).

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
$ ./venus-auth user add --name <ACCOUNT_NAME> --miner <MINER_ID>
# The returned token is what miner have to add into their config file in order to gain access to your shared modules
$ ./venus-auth token gen --perm write <ACCOUNT_NAME>
<AUTH_TOKEN_FOR_ACCOUNT_NAME>
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
$ git checkout -b incubation origin/incubation
$ make
```

If you have downloaded and compiled it,Please do so.
```bash
$ cd venus-wallet
$ git fetch
$ git pull
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

If you already have wallet addresses, import it.

```bash
$ ./venus-wallet import
Enter private key: 
# Enter your wallet key and press [Enter]
Enter private key: ***
imported key *** successfully!
```

Check the wallet list.

```bash
$ ./venus-wallet list
```

:::tip

If you are testing on Nerpa or Calibration, you have to fund all your addresses with test coins from faucets. For nerpa, use this [faucet](https://faucet.nerpa.interplanetary.dev/funds.html). For calibration, use this [faucet](https://faucet.calibration.fildev.network/funds.html). 

:::

***Change `[APIRegisterHub]` section of  ~/.venus_wallet/config.toml` using the credential you get from shared module admin.***
>This step is important and is the key to interacting with the service component.

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_WALLET>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

Restart venus-wallet so that the changes takes into effect.

```bash
# grep [PID] of venus-wallet process
$ ps -aux | grep venus-wallet
root      6704  2.3  0.0 2361236 43148 pts/2   Sl   17:33   0:18 ./venus-wallet run
root      8029  0.0  0.0 112828   952 pts/2    S+   17:46   0:00 grep --color=auto venus-wallet
# kill the process and restart
$ kill -9 [PID=6704]
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

:::tip

Using process controll like  `systemmd` or `supervisord` is recommended.

:::

## Install venus-sealer

Download and compile the source code of venus-sealer.

```bash
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout -b incubation origin/incubation
$ make deps
$ make
```

If you have downloaded and compiled it,Please do so.
```bash
$ cd venus-sealer
$ git fetch
$ git pull
$ git submodule update --init --recursive
# Clean up the previous library files
$ cd extern/filecoin-ffi
$ make clean
# Go back to the project root directory
$ cd ../..
$ make deps
$ make
```
> ***If you have an AMD Zen or Intel Ice Lake CPU (or later), enable the use of SHA extensions by adding these two environment variables:***

```bash
# must be executed before [make deps]
export RUSTFLAGS="-C target-cpu=native -g"
export FFI_BUILD_FROM_SOURCE=1
```

The following logging features are source compilation.
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

***This is important; community-provided Filecoin-FFI is suitable for most Linux systems, but it is quite slow to do sector sealing.For more information, see: https://docs.filecoin.io/get-started/lotus/installation/#linux***


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

# Expect output close to the following
2021-06-07T04:15:49.170+0800    INFO    main    venus-sealer/init.go:193        Checking if repo exists
2021-06-07T04:15:49.170+0800    INFO    main    venus-sealer/init.go:205        Checking full node version
2021-06-07T04:15:49.174+0800    INFO    main    venus-sealer/init.go:221        Initializing repo
2021-06-07T04:15:49.175+0800    INFO    main    venus-sealer/init.go:334        Initializing libp2p identity
2021-06-07T04:15:49.181+0800    INFO    main    venus-sealer/init.go:406        Created new miner: t02105
2021-06-07T04:15:49.181+0800    INFO    main    venus-sealer/init.go:290        Sealer successfully created, you can now start it with 'venus-sealer run'
```

## Start pledging

Run sealer.
> ***Please refer to the following text for speed settings.***
```bash
$ nohup ./venus-sealer run >> sealer.log 2>&1 &
```

:::tip 

If you are running sealer for the 1st time, it will start to download proof parameters, which may take quite some time. If you are located in China, follow the tips [here](https://venus.filecoin.io/Tips-Running-In-China.html) to speed up the process.  

:::

Attach permanent storage to sealer.

```bash
$ ./venus-sealer storage attach --init --store <ABSOLUTE_PATH_OF_YOUR_PERMANENT_STORAGE>
$ ./venus-sealer storage attach --init --seal <ABSOLUTE_PATH_OF_YOUR_SEALING_STORAGE>
```

If the paths of seal and store are the same, you can run the same command.
```bash
$ ./venus-sealer storage attach --init --store --seal <ABSOLUTE_PATH>
```

***store and seal path must be set. otherwise, the sector sealing task cannot be started. Pay attention to the log message "No good Path found". Usually the seal dir is a high-throughput SSD.***

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

***Each storage corresponds to the use attribute, and Seal and Store are required for the sector task to be successful.***

Pledge a single sector.

```bash
$ ./venus-sealer sectors pledge 
```

Check ongoing sealing job.

```bash
$ ./venus-sealer sealing workers
$ ./venus-sealer sealing jobs
```

Check the status of sectors.

```bash
$ ./venus-sealer sectors list
$ ./venus-sealer sectors status  --log  <sectorNum>
```

If a Sector fails and cannot be recovered, you need to delete it.

```bash
# Terminating -> TerminateWait -> TerminateFinality/TerminateFailed
$ ./venus-sealer sectors terminate  --really-do-it <sectorNum>
# Removing -> RemoveFailed/Removed
$ ./venus-sealer sectors remove  --really-do-it <sectorNum>
```
It takes a period of time for the command to be executed, depending on the final status change. The command can be executed multiple times during this period.

```bash
$ ./venus-sealer sectors list
ID  State       OnChain  Active  Expiration                    Deals
1   Proving     YES      YES     2513094 (in 1 year 24 weeks)  CC
2   Removed    NO       NO      n/a                           CC
3   PreCommit1  NO       NO      n/a                           CC
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

## Sealer & Worker

### Sealer configuration

In Filecoin system, a sealer can be thought of as a worker with a state management machine, which is metaphorically: sealer = worker + sector_state_manager.

In addition to doing the left and right work of the worker, it also has two main functions:
- Manage the status of each sector, including assigning new sectors, message chains, etc.
- Periodically perform windowPost.

Because of this, we usually hand over time-consuming tasks to venus-workers, and let sealer do windowPoSt and Sector state management. In this way, when sealer restarts, it will not affect the tasks being done, such as: P1, P2, C2, etc., otherwise it will need to be restarted, which will waste time.

Only sealer is allowed to do AddPiece, and it is forbidden to do P1, P2, C1, C2 and other tasks,You only need to modify ` ~/.venussealer/config.toml ` and restart sealer
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
  
# Restart sealer after saving
```

### Worker configuration
> ***Please refer to the following text for speed settings.***
```bash
$ TRUST_PARAMS=1 nohup ./venus-worker run \
--miner-addr=</ip4/sealer-ip/tcp/sealer-port> \
--miner-token=<token> \  
--listen=<0.0.0.0:3458> <flags> >> worker.log 2>&1 &\                   
```
- sealer-port: cat ~/.venussealer/api, eg. /ip4/0.0.0.0/tcp/2345/http --> 2345
- token: cat ~/.venussealer/token
- flags:
```
--addpiece                    enable addpiece (default: true)
--precommit1                  enable precommit1 (32G sectors: 1 core, 128GiB RAM) (default: true)
--unseal                      enable unsealing (32G sectors: 1 core, 128GiB RAM) (default: true)
--precommit2                  enable precommit2 (32G sectors: multiple cores, 96GiB RAM) (default: true)
--commit                      enable commit (32G sectors: multiple cores or GPUs, 128GiB RAM + 64GiB swap) (default: true)
```
If we set sealer as AP, we should add --addpiece=false when starting.

***Attach seal storage to worker,Generally, we only configure the seal path for the worker. Store inherits the sealer. In this way, each time the worker completes a sector seal, the permanent storage file will be transferred to the store directory specified by sealer.The reason for this is that windowPoSt is made by sealer.***

```bash
$ ./venus-worker storage attach --init --seal <ABSOLUTE_LOCAL_PATH>
```

Check if it's ready.

```bash
$ ./venus-worker info

# A worker's storage will be added to the venus-sealer storage list
$ ./venus-sealer storage list 
01135ade-337a-4011-9cd8-6e85edbe08fc:
        [#######                                           ] 26.52 TiB/181.2 TiB 14%
        Unsealed: 0; Sealed: 1080; Caches: 1080; Reserved: 0 B
        Weight: 10; Use: Seal Store
        Local: /storage-nfs-2/theduan/venus-nerpa-512M/storage
        URL: http://0.0.0.0:2345/remote

14142f91-6365-4b2a-ad1b-d2dd4ebd6e33:
        [###################                               ] 4.044 TiB/10.39 TiB 38%
        Unsealed: 3; Sealed: 0; Caches: 0; Reserved: 0 B
        Weight: 10; Use: Seal 
        URL: http://192.168.200.17:3458/remote (latency: 1.2ms)
```

Some other commands can also detect whether the worker is properly connected to sealer.
```bash
$ ./venus-sealer sealing workers
$ ./venus-sealer sealing jobs
```

> venus-workers can usually be configured with multiple units according to output requirements and the performance of each machine. At present, there are many models in the filecoin market, and it is impossible to give a unified solution. Miners need to test and continuously improve the ratio according to their own models, and finally explore a reasonable solution.

## Speed setting

If your system hardware resources are strong enough, the following environment variables can greatly improve sector sealing speed. You can set the environment variables according to your actual environment.

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
If your system has resources, simply add the environment variable to the start command. eg:
```bash
$ FIL_PROOFS_USE_MULTICORE_SDR=1 TRUST_PARAMS=1 BELLMAN_CPU_UTILIZATION=0.875 nohup ./venus-sealer run >> sealer.log 2>&1 &
$ FIL_PROOFS_USE_MULTICORE_SDR=1 TRUST_PARAMS=1 BELLMAN_CPU_UTILIZATION=0.875 nohup ./venus-worker run >> worker.log 2>&1 &
```


***The Sealer and worker is a complex system, and you may encounter various problems during the process: node connectivity problems, insufficient disk, insufficient memory, etc. Here is a list of common problems, please be sure to study carefully and optimize the deployment against the actual cluster environment.***
- https://docs.filecoin.io/mine/lotus/miner-troubleshooting/
- https://docs.filecoin.io/get-started/lotus/installation/#linux
- https://docs.filecoin.io/mine/lotus/miner-setup/#pre-requisites
- https://github.com/filecoin-project/venus-docs/blob/master/docs/zh/mine/venus/power_growth_and_maintain.md

***Next, the Venus Community will gradually roll out sealer and worker usage documentation to help miners find deployment solutions that maximize system resources. Stay tuned for community updates!***

## Questions?

Find us on [Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)!
