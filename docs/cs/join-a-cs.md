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

venus-wallet can be deployed as either a chain service or a local component depend on your security requirement.

:::

#### For admins of shared modules

If you are an admin hosting shared venus modules, use the following command to create an account for your sealer-cluster.

```bash
# create user, default state=1
$ ./venus-auth user add <ACCOUNT_NAME>
# bind miner to user
$ ./venus-auth user miner add <ACCOUNT_NAME> <MINER_ID> 

# The returned token is what miner have to add into their config file in order to gain access to your shared modules
$ ./venus-auth token gen --perm write <ACCOUNT_NAME>
<AUTH_TOKEN_FOR_ACCOUNT_NAME>
```

Update user information if necessary.

```bash
./venus-auth user update --user=<ACCOUNT_NAME> --help
```

### Software dependencies

You will need to install these [software dependencies](https://lotus.filecoin.io/lotus/install/linux/#software-dependencies) (same as Lotus) before running venus.

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

## Install venus-cluster

Download source code.

```bash
$ git clone https://github.com/ipfs-force-community/venus-cluster.git
```

Compile `venus-cluster`.

```bash
$ cd venus-cluster
$ make all
```

:::tip
After compilation, two executable, `venus-worker` and `venus-sector-manager`, will be generated under `./dist/bin`.
:::

### Create a miner-id（optional）

Skip this step if you already have a miner-id.

```bash
$ ./venus-sector-manager util miner create 
--from=<OWNER_ADDRESS> 
--owner=<OWNER_ADDRESS> 
--worker=<WORKER_ADDRESS>
--sector-size=32GiB
```
:::tip
Use `--net` param for different network options. Default is mainnet.
:::

:::tip
You will see logs similar to the following once successfully created new miner-id.

```bash
2022-05-09T07:29:51.325Z  INFO  cmd  internal/util_miner.go:242  miner actor: t01219 (t2z4nnndtt2iuu57lq3ivor7xdvqwivwb5renrh3a)  
{"size": "512MiB", "from": "t3wultr2i47m24ew2p3bskclnb4rtgmuwb6cwjleqbeu4ndqocx67635dibpsq3ugpbv5y7fpjlpxlmkqcgnva", 
"actor": "t01166", "owner": "t3wultr2i47m24ew2p3bskclnb4rtgmuwb6cwjleqbeu4ndqocx67635dibpsq3ugpbv5y7fpjlpxlmkqcgnva", 
"worker": "t3wultr2i47m24ew2p3bskclnb4rtgmuwb6cwjleqbeu4ndqocx67635dibpsq3ugpbv5y7fpjlpxlmkqcgnva"}
```
:::

### venus-sector-manager

Initialize work space.

```bash
./dist/bin/venus-sector-manager daemon init
```

Tailor `~/.venus-sector-manager/sector-manager.cfg` to your own hardware. Detailed instructions on each configurations could be found [here](/zh/cluster/Venus-Sector-Manager).

```toml
[Common]
  [Common.API]
    # *mandatory* node address (chain service)
    Chain = "/ip4/{api_host}/tcp/{api_port}"
    # *mandatory* messager address (chain service)
    Messager = "/ip4/{api_host}/tcp/{api_port}"
    # market node address
    # Market = "/ip4/{api_host}/tcp/{api_port}"
    # *mandatory* gateway address (chain service)
    Gateway = "/ip4/{api_host}/tcp/{api_port}"
    # *mandatory* authentication token (chain service)
    Token = "{auth token}"
   
[[Common.PieceStores]]
  # *mandatory*
  #Path = "{store_path}"
   
[[Common.PersistStores]]
  # optional
  Name = "{store_name1}"
  # *mandatory* use of absolute path is recommended
  Path = "{store_path1}"
   
[[Common.PersistStores]]
  Name = "{store_name2}"
  Path = "{store_path2}"
   
[[Miners]]
  # *mandatory* `SP` actor id (Remove the "t0" or "f0" at the beginning)
  Actor = 33680
   
  [Miners.Sector]
    # oprional, pledge new sector from InitNumber
    InitNumber = 0
    # oprional, stop pledging new sector at MaxNumber
    MaxNumber = 1000000
    # Enable sealing
    Enabled = true
    # Enable storage deals
    EnableDeals = true
   
  [Miners.Commitment.Pre]
    # address for sending out pre messages
    Sender = "t3vi4amwofexsfpontn5g722psgikzochthhhu3ptvofzrqmgajs67gt5n2ririlc4hj667dvfsn3kmxiwgtya"
    #GasOverEstimation = 1.2
    # FeeCap limit for single pre message
    #MaxFeeCap = "5 nanoFIL"
   
  [Miners.Commitment.Pre.Batch]
    # if bacth pre is enabled?
    Enabled = true
    # Minimum number of messages for one batch
    #Threshold = 16
    # Max wait time before batch pre
    #MaxWait = "1h0m0s"
    # How often it checks the threshold is met
    #CheckInterval = "1m0s"
    #GasOverEstimation = 1.2
    #MaxFeeCap = "5 nanoFIL"
   
  # Same set of config for ProveCommit as for pre above
  [Miners.Commitment.Prove]
    Sender = "t3vi4amwofexsfpontn5g722psgikzochthhhu3ptvofzrqmgajs67gt5n2ririlc4hj667dvfsn3kmxiwgtya"
    #GasOverEstimation = 1.2
    #MaxFeeCap = "5 nanoFIL"
   
  [Miners.Commitment.Prove.Batch]
    Enabled = true
    #Threshold = 16
    #MaxWait = "1h0m0s"
    #CheckInterval = "1m0s"
    #GasOverEstimation = 1.2
    #MaxFeeCap = "5 nanoFIL"
   
  [Miners.PoSt]
    # address for sending out Post messages
    Sender = "t3vi4amwofexsfpontn5g722psgikzochthhhu3ptvofzrqmgajs67gt5n2ririlc4hj667dvfsn3kmxiwgtya"
    Enabled = true
    #StrictCheck = true
    #GasOverEstimation = 1.2
    # FeeCap limit for single post message
    #MaxFeeCap = "5 nanoFIL"
    #Confidence = 10
   
  [Miners.Proof]
    Enabled = true
   
  [Miners.Deal]
    Enabled = true
```

Start `venus-sector-manager`.

```bash
$ ./dist/bin/venus-sector-manager --net=cali daemon run --poster --miner --listen 0.0.0.0:1789
```

:::tip
Again, use `--net` param for different network options. Default is mainnet.
:::

### venus-worker

Plan your sealing storage and init directories.

```bash
$ ./dist/bin/venus-worker store sealing-init -l <dir1> <dir2> <dir3> <...>
```

Attach permanent storage and init directories.

```bash
$ ./dist/bin/venus-worker store file-init -l <dir1>
```

Plan CPU cores, numa, etc for eahc sealing tasks and tailor your configuration file to it. The following is an example configuration for `venus-worker`. More detailed instructions on each configurations could be found [here](/zh/cluster/Venus-Worker-c)

```toml
[worker]
  # optional, instance name of venus-sector-manager
  # name = "bytest"
  # rpc_server.host = "0.0.0.0"
  # rpc_server.port = 17890

[sector_manager]
  rpc_client.addr = "/ip4/{some_ip}/tcp/1789"
  # rpc_client.headers = { User-Agent = "jsonrpc-core-client" }
  # piece_token = "{auth token}"

[sealing]
  # miner IDs that this venus-worker can serve; Ex: [22908, 11034, 191107]
  allowed_miners = [33680]
  allowed_sizes = ["32GiB","64GiB"]
  # When set to ture, you will need to configure `piece_token` in `sector_manager`
  # enable_deals = true
  # Max number of retries when errors of temp type encountred during sealing
  # max_retries = 3
  # Time intervals between retires when errors of temp type encountred during sealing
  # seal_interval = "30s"
  # Time interval between idle `sealing_store`s to start pledging
  # recover_interval = "30s"
  # Used to reduce network congestion during sealing for rpc polling non-time sensitive informations
  # rpc_polling_interval = "30s"
  # wether to skip local proof check
  # ignore_proof_check = false

# Plan out your sealing pipeline based on your hardware specs
[[sealing_thread]]
  # Number of sealing_thread corresponds to number of working directories you configured for sealing storage; Absolute path is preferred
  location = "{path to sealing store1}"
  # Each sealing thread then can be further customized 
  # sealing.allowed_miners = [10123, 10124, 10125]
  # sealing.allowed_sizes = ["32GiB", "64GiB"]
  # sealing.enable_deals = true
  # sealing.max_retries = 3
  # sealing.seal_interval = "30s"
  # sealing.recover_interval = "30s"
  # sealing.rpc_polling_interval = "30s"
  # sealing.ignore_proof_check = false

[[sealing_thread]]
  location = "{path to sealing store2}"

[[sealing_thread]]
  location = "{path to sealing store3}"

[[sealing_thread]]
  location = "{path to sealing store4}"

[[sealing_thread]]
  location = "{path to sealing store5}"

[[sealing_thread]]
  location = "{path to sealing store6}"

[[sealing_thread]]
  location = "{path to sealing store7}"

[[sealing_thread]]
  location = "{path to sealing store8}"

# You can have multiple [[attached]] path for permanent storage of sealed sectors
[[attached]]
  # optional
  name = "bytest"
  # Absolute path is preferred
  location = "/xx/xx/xxx"
  #readonly = false

[processors.static_tree_d]
  32GiB = "{path to static tree_d for 32GiB}"
  64GiB = "{path to static tree_d for 64GiB}"

[processors.limit]
  # Number of concurrent pc1
  pc1 = 4
  # Number of concurrent pc2
  pc2 = 2
  # Number of concurrent c2
  c2 = 1

# fields for pc1 processors
[[processors.pc1]]
  # optional
  numa_preferred = 0
  # follows cgroup.cpuset format
  cgroup.cpuset = "0-7"
  # max concurrency
  concurrent = 2
  # Any external environment variable when executing this particular pc1 task
  envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
  numa_preferred = 1
  cgroup.cpuset = "12-19"
  concurrent = 2
  envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc2]]
  cgroup.cpuset = "8-11,24-27"
  envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
  cgroup.cpuset = "20-23,36-39"
  envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }

[[processors.c2]]
  cgroup.cpuset = "28-35"
  envs = { CUDA_VISIBLE_DEVICES = "2,3" }

[[processors.tree_d]]
  cgroup.cpuset = "40-45"
```
:::tip
You can also reference the configurations in `venus-cluster` [community test](https://github.com/filecoin-project/venus/discussions/4866).
:::

Start `venus-worker`.

```bash
$ /path/to/venus-worker daemon -c /path/to/venus-worker.toml
```

:::tip
The above `sector-manager.cfg` and `venus-worker.toml` are just minimal to get you to start pledging sectors. More detailed information on configurations could be found [here](/zh/cluster/).
:::

:::tip
Note that `name = "xxx"` under `[[attached]]` in `venus-worker.toml` must be the same `Name = "xxx"` under `[[Common.PersistStores]]` in `sector-manager.cfg`.
:::

## Questions?

Find us on [Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)!
