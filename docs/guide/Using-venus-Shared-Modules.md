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
| [venus-market](https://github.com/filecoin-project/venus-market) | deal making                                           | independent        |

## Mining architecture

Diagram below illustrates how venus modules interacts with one and another.

![venus-cluster](../.vuepress/public/venus-cluster.png)

## Hardware requirements

Learn more about hardware requirements [here](https://docs.filecoin.io/mine/hardware-requirements/#general-hardware-requirements). Check out this [solo mining guide](https://medium.com/zeethio/filecoin-solo-mining-rig-a549e7fa230d) by one of the comunity members. As a sidetone, everyone may have different hardware setups, and it is recommended that you [find your own optimal configurations](#finding-optimal-configurations) through trial and errors. 

## Pre-requisites

Before diving into deployment of your mining operation, please make sure you go through the following steps. 

:::warning

It is recommended that you test your setup in calibration network before deploying on mainnet. 

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

If you are an admin hosting shared venus modules, use the following command to create an account for your sealer-cluster.

```bash
# If storage provider already have a <MINER_ID>
$ ./venus-auth user add --name <ACCOUNT_NAME> --miner <MINER_ID>

# If storage provider doesn't have a <MINER_ID> yet, leave out --miner flag and use 'updateUser' command when user inited their miner id
$ ./venus-auth user add --name <ACCOUNT_NAME>
$ ./venus-auth user update --name <ACCOUNT_NAME> --miner <MINER_ID> 

# The returned token is what miner have to add into their config file in order to gain access to your shared modules
$ ./venus-auth token gen --perm write <ACCOUNT_NAME>
<AUTH_TOKEN_FOR_ACCOUNT_NAME>
```

Update user information if necessary.

```bash
./venus-auth user update --name=<ACCOUNT_NAME> --miner=<MINER_ID>
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

### Rust

Install [rustup](https://rustup.rs/).

```sh
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
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

:::tip

For participants in incubation program, please use `incubation` branch by `git checkout incubation`. To recompile using latest code in `incuvation` branch, do `git pull` and then `make`.

:::

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

If you are testing or Calibration, you have to fund all your addresses with test coins from faucets. For calibration, use this [faucet](https://faucet.calibration.fildev.network/funds.html). 

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

:::warning

Pls keep the wallet unlock state. If the state is locked , it will block sealer "Waiting for confirmation".

:::

## Install venus-sealer

Set evironment variable for building venus-sealer.

```bash
$ export RUSTFLAGS="-C target-cpu=native -g" 
$ export FFI_BUILD_FROM_SOURCE="1"
```

:::warning

Please make sure you use these flags `RUSTFLAGS="-C target-cpu=native -g" FFI_BUILD_FROM_SOURCE="1"` building venus-sealer to get best performance out of your machine.

:::

Download and compile the source code of venus-sealer.

```bash
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout <RELEASE_TAG>
$ make deps
$ make
```

:::tip

For participants in incubation program, please use `incubation` branch by `git checkout incubation`. 

:::

:::tip

To recompile using latest code in `incuvation` branch, do the following...

```bash
$ git fetch
$ git pull
$ git submodule update --init --recursive
$ make clean
$ make deps
$ make
```

:::

:::tip 

If you are using sealer for the 1st time, it may start to download proof parameters, which may take quite some time. If you already downloaded the proof params, use `TRUST_PARAMS=1` to suppress downloading. If you are located in China, follow the tips [here](https://venus.filecoin.io/Tips-Running-In-China.html) to speed up the process.  

:::

### Initialize sealer with a new miner id

If you don't have a miner id yet, run the following command to initialize sealer. Make sure you have some funds in your `<OWNER_ADDRESS>` to cover the gas fee needed for initing a new miner id, or init will fail. 

```bash
$ nohup ./venus-sealer \
# Choose from calibration for testnets
# Leave out this flag for mainnet
--network=calibration init \
--worker <WORKER_ADDRESS> \
--owner <OWNER_ADDRESS>  \
# Choose between 32G or 64G for mainnet
--sector-size=512M \
# Config for different shared venus modules
--node-url=/ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url=/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> \
--auth-token=<AUTH_TOKEN_FOR_VENUS_SEALER> \
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

If you already have a miner id, run the following command to initialize sealer. Make sure you have some funds in your `<OWNER_ADDRESS>` to cover the gas fee, or init will fail. 

```bash
$ ./venus-sealer  \
# Choose from calibration for testnets
# Leave out this flag for mainnet
--network=calibration init \
--actor=<MINER_ID>  \
# Config for different shared venus modules
--node-url=/ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url=/ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER> \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY> \
--auth-token=<AUTH_TOKEN_FOR_VENUS_SEALER> \
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

Attach permanent storage and sealing storage to sealer.

```bash
$ ./venus-sealer storage attach --init --store <ABSOLUTE_PATH_OF_YOUR_PERMANENT_STORAGE> 
$ ./venus-sealer storage attach --init --seal <ABSOLUTE_PATH_OF_YOUR_SEALING_STORAGE>
```

:::warning

If either path was not set correctly, sealing will fail. Check if your paths are properly setup by `./venus-sealer storage list` , you shold get something close to following...

```bash
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

:::

Pledge a single sector.

```bash
$ ./venus-sealer sectors pledge 
```

Congratulations! You are now pledging your 1st sector. Use [sealer commands](#sealer-commands) to monitor sealing processes and keep an eye on errors in the log.

:::warning

If you see the following error during sealing, try `mv` unsealed sector file under `~/.venussealer/unsealed/` to `/var/tmp/s-basic-unsealed-34359738368` on relevant sealer/worker box.

```bash
2021-09-01T10:41:10.394+0200    WARN    sectors storage-sealing/fsm.go:626      sector 611 got error event sealing.SectorSealPreCommit1Failed: seal pre commit(1) failed: storage call error 0: The default unsealed does not exist,please copy a generated unsealed file to /var/tmp/s-basic-unsealed-34359738368
```

We recommend preparing these files in advance for each worker machine,filename rules: 
- s-basic-unsealed-***SectorSize***
- s-piece-infos-***SectorSize***

SectorSize options: 2048,8388608,536870912,34359738368,68719476736. The corresponding filename can be created according to the SectorSize corresponding to the minerID,eg. 32G:

```
/var/tmp/s-piece-infos-34359738368
/var/tmp/s-basic-unsealed-34359738368
```

s-piece-infos-***SectorSize*** content corresponding to different SectorSize:
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

## Sealer Commands

Check ongoing sealing job.

```bash
$ ./venus-sealer sealing workers
$ ./venus-sealer sealing jobs
```

Check the sector state.

```bash
$ ./venus-sealer sectors list
$ ./venus-sealer sectors status --log <SECTOR_NUMBER>
```

If a sector got stuck in one status for too long, you might want to consider removing them. More on [how to terminate](https://github.com/filecoin-project/lotus/discussions/6950) if remove fails.

```bash
# Sector State: Removing -> RemoveFailed/Removed
$ ./venus-sealer sectors remove --really-do-it <SECTOR_NUMBER>
# Sector State: Terminating -> TerminateWait -> TerminateFinality/TerminateFailed
$ ./venus-sealer sectors terminate --really-do-it <SECTOR_NUMBER>
```

Removing a sector could take quite some time. Monitor sector state and retry remove commands if necessary.

```bash
$ ./venus-sealer sectors list
ID  State       OnChain  Active  Expiration                    Deals
1   Proving     YES      YES     2513094 (in 1 year 24 weeks)  CC
2   Removed     NO       NO      n/a                           CC
3   PreCommit1  NO       NO      n/a                           CC
```

Config MaxSealingSectors to limit maximum number of sectors in parallel.

```bash
$ vim ~/.venussealer/config.toml 
[Sealing]
  ...
  MaxSealingSectors = 10 # actual number varies from system to system
```

Config which address to drain during sealing in `~/.venussealer/config.toml`.

```toml
[Addresses]
  PreCommitControl = [] # P2
  CommitControl = [] # C2
  DisableOwnerFallback = false 
  DisableWorkerFallback = false 
```

## Finding optimal configurations

Now that you sucessfully pledged your 1st sector, finding optimal configurations for your storage system is crucial for further growth of power. As venus-sealer functions exactly like lotus-miner, resources for scaling cluster and optimization for lotus can be directly applied to venus-sealer. We recommend that you go through this [hardware list](https://github.com/filecoin-project/lotus/discussions/6071) by minerX and this [tutorial](https://github.com/filecoin-project/lotus/discussions/5989) for advanced tips.

To scale your growth, you can run venus-worker to handle different stages of the sealing process (AP, P1, P2, C2 and etc). Even for a single box setup, it is recommended that you run both venus-sealer and venus-worker to gurantee the stability of your stroage system by having sealer do windowPost solely, or sealing jobs may compete with windowPost for resources which may result in [a failed windowPost](https://docs.filecoin.io/mine/lotus/seal-workers/#miner-and-worker-co-location). 

### Using venus-worker

Change `[Storage]` section of `~/.venussealer/config.toml` to the following. 

```bash
[Storage]
  ParallelFetchLimit = 10
  AllowAddPiece = true
  AllowPreCommit1 = false
  AllowPreCommit2 = false
  AllowCommit = false
  AllowUnseal = false
```

Save and restart venus-sealer for the config to take into effect. Then collect sealer url and token.

```bash
$ cat ~/.venussealer/api
<SEALER_URL>
$ cat ~/.venussealer/token
<SEALER_TOKEN>
```

Run venus-worker.

```bash
$ TRUST_PARAMS=1 nohup ./venus-worker run \
--miner-addr=/ip4/<IP_ADDRESS_OF_VENUS_SEALER>/tcp/<PORT_OF_VENUS_SEALER> \ 
--miner-token=<SEALER_TOKEN> \
--bindP1P2=false \
--listen=<0.0.0.0:3458> \ 
--addpiece false \
>> worker.log 2>&1 &                   
```

Other worker flags of interests.

```bash
--addpiece		enable addpiece (default: true)
--precommit1	enable precommit1 (32G sectors: 1 core, 128GiB RAM) (default: true)
--unseal			enable unsealing (32G sectors: 1 core, 128GiB RAM) (default: true)
--precommit2	enable precommit2 (32G sectors: multiple cores, 96GiB RAM) (default: true)
--commit			enable commit (32G sectors: multiple cores or GPUs, 128GiB RAM + 64GiB swap) (default: true)
--task-total	total number of task (default: 100)
--bindP1P2		P1 and P2 phase tasks are bound to the same machine (default: false)
```

:::tip

--bindP1P2 forces P2 to be done on the same machine of P1.

:::

:::tip

--task-total limits the total number of tasks being executed by the worker.

:::

Attach sealing storage to worker. (Path for permanent storage will be inherited from sealer)

```bash
$ ./venus-worker storage attach --init --seal <ABSOLUTE_PATH_OF_YOUR_SEALING_STORAGE>
```

Check if your worker is connected.

```bash
$ ./venus-sealer storage list 
```

### Multiple worker processes

If you are running multiple worker processes on the same box, each worker need to set their own `TMPDIR` environment variable or sealing process may run into race condition.

Additionally, worker processes on same box will neep different repo path, which can be configured by using `--repo` flag.

```bash
$ TRUST_PARAMS=1 nohup ./venus-worker --repo=<REPO_PATH> run \
--miner-addr=/ip4/<IP_ADDRESS_OF_VENUS_SEALER>/tcp/<PORT_OF_VENUS_SEALER> 
--miner-token=<SEALER_TOKEN> \
--bindP1P2=false \
--listen=<0.0.0.0:3458> \ 
>> worker.log 2>&1 & 
```

### Misc optimizations

Increase your open file limit

```bash
$ ulimit -n 1048576
```

Environment variable for potential faster sealing speed.

```bash
export FIL_PROOFS_PARAMETER_CACHE=/fast/disk/folder1 # > 100GiB!
export FIL_PROOFS_PARENT_CACHE=/fast/disk/folder2    # > 50GiB!
export TMPDIR=/fast/disk/folder3    			# used when sealing
export MINER_API_INFO:<TOKEN>:/ip4/<miner_api_address>/tcp/<port>/http`
export BELLMAN_CPU_UTILIZATION=0.875      # optimal value depends on exact hardware
export FIL_PROOFS_MAXIMIZE_CACHING=1
export FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1 # when GPU is available
export FIL_PROOFS_USE_GPU_TREE_BUILDER=1   # when GPU is available
# The following increases speed of PreCommit1 at the cost of using a full
# CPU core-complex rather than a single core.
# See https://github.com/filecoin-project/rust-fil-proofs/ and the
# "Worker co-location" section below.
export FIL_PROOFS_USE_MULTICORE_SDR=1
```

venus-woker can take advantage of two GPU devices on the same box with the configurable environment variables.

```bash
CUDA_VISIBLE_DEVICES=1       # use only device1
CUDA_VISIBLE_DEVICES=0,1     # use both device0 and device1
CUDA_VISIBLE_DEVICES="0,1"	 # same as above use device0 and device1
CUDA_VISIBLE_DEVICES=0,2,3   # use device0, device2 and device3
CUDA_VISIBLE_DEVICES=2,0,3   # use device0, device2 and device3
```

Increase GPU RAM usage. (Default FIL_PROOFS_MAX_GPU_COLUMN_BATCH_SIZE=400000, FIL_PROOFS_MAX_GPU_TREE_BATCH_SIZE=700000)

```bash
# Recommended
FIL_PROOFS_MAX_GPU_COLUMN_BATCH_SIZE=8000000,FIL_PROOFS_MAX_GPU_TREE_BATCH_SIZE=8000000
```

There are different ways of using environment variables. For example, if we want to allow multi core SDR, we can do either of the following.

```bash
# one way of setting env variable
$ export FIL_PROOFS_USE_MULTICORE_SDR=1
$ nohup ./venus-sealer run >> sealer.log 2>&1 &

# the other way of setting env variable
$ FIL_PROOFS_USE_MULTICORE_SDR=1 nohup ./venus-worker run >> worker.log 2>&1 &
```

## Migration

There are two ways to migrate from Lotus to Venus: 1) switch to venus-sealer and connect to a hosted chain services, or 2) switch to a [venus-ready lotus-miner](https://venus.filecoin.io/advanced/) and connect to a hosted chain service. 

### Switching to venus-sealer

Wait till lotus-miner to finish up existing sealing jobs and make sure you have enough time before your next windowPost deadline, then take the following steps:

1. Stop lotus-miner as both lotus-miner and venus-sealer use port 2345 by default.
2. Init venus-sealer with your miner id with `--actor` flag along with other configuration flags. For example,  --actor=f0***.
3. After initialization of venus-sealer, use `venus-sealer storage attach --store` to specify path for permanent storage, ie. what you used for ${lotus-miner store}.
4. Import sectors from lotus-miner to venus-sealer and set sector nextid to the plus one of latest sealed sector id by executing the following. You can change repo paths in the command accordingly.
```bash
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=2
```

### More on lotus-convert

lotus-convert is a utility tool for migrating from lotus to venus.

```bash
# taskType=0; manually change nextid
# set nextid to 300 with -sid flag
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=0 -sid=300

# taskType=1; import sectors from lotus-miner to venus-sealer
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=1

# taskType=2; atuo change nextid and import sectors from lotus-miner to venus-sealer
./lotus-convert -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=2
```

## Questions?

Find us on [Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)!