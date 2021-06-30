# Table of Contents

[[TOC]]

## Background

Starting filecoin mining could be a daunting task given not only the large initial hardware and filecoin collateral [investment](https://filscan.io/calculator) but also the entailing operation commitment. With ideas of security, ease of use and distributed mining pool in mind, Venus implementation of filecoin will help miners turn, what community say, [a full time job](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5) into a serious hobby. Hope this tutorial will get you started mining in no time! 

## How mining works

There are two ways of getting started with mining using Venus. 

1. Deploy minimum hardware and gain access to a publicly hosted shared venus modules.<!--(Checkout venus incubation center page to learn more on how you can get an account setup!)--> (See [this](https://venus.filecoin.io/Using-venus-Shared-Modules.html) tutorial to learn more)
2. Deploy all required hardware and venus modules by yourself. (The rest of this tutorial will walk you through this way of deploying venus mining operation)

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

![venus-cluster](../.vuepress/public/venus-cluster.png)
## Hardware requirements

Learn more about hardware requirements [here](https://docs.filecoin.io/mine/mining-architectures/#protocol-labs-example-architecture).

## Pre-requisites

Before diving into deployment of your mining operation, please make sure you go through the following steps. 

:::warning

It is recommended that you test your setup in nerpa or calibration network before deploying on mainnet. 

:::

### Setup your permanent storage

Choose a network file system that you are familiar with (NFS for example) and deploy your storage cluster.

### Software dependencies

You will need the following software installed before running venus.

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

## Install venus-auth
Download and compile the source code of venus-auth.

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git
$ cd venus-auth
$ git checkout <RELEASE_TAG>
$ make 
$ nohup ./venus-auth > auth.log 2>&1 &
```
:::tip 

Default config file for Venus-auth is located at `~/.venus-auth/config.toml`.

:::

:::tip Logs

Log defaults printing to console. InfluxDB is supported through configuration.

:::

### Using MySQL (Optional)

MySQL 5.7 or above is supported and can be used as a substitute for the dedault Badger key-value  database. To use MySQL database, modify the db section of the config.

```shell script
$ vim ~/.venus-auth/config.toml

# Data source configuration item
[db]
# support: badger (default), mysql 
# the mysql DDL is in the script package 
type = "mysql" 
# The following parameters apply to MySQL
DSN = "<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_auth?parseTime=true&loc=Local&charset=utf8mb4&collation=utf8mb4_unicode_ci&readTimeout=10s&writeTimeout=10s"
# conns 1500 concurrent
maxOpenConns = 64
maxIdleConns = 128
maxLifeTime = "120s"
maxIdleTime = "30s"
```
Restart venus-auth for the configuration to take into effect.

```shell script
$ ps -ef | grep auth
$ kill <VENUS_AUTH_PID>
$ nohup ./venus-auth > auth.log 2>&1 &
```

### Token gerneration

venus-auth manages [jwt](https://jwt.io/) tokens used by other venus modules for them to talk to each other securely on the network.

Generate tokens for shared modules.

```bash
# --perm specifies admin, sign, wirte or read permission of the token generated
$ ./venus-auth genToken --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```

Generate tokens for independent modules. Tokens can be logically grouped by `<USER>` as individual miner joining the mining pool.

```shell script
$ ./venus-auth addUser --name <USER>
$ ./venus-auth genToken --perm write <USER>
<USER_WRITE_AUTH_TOKEN>
$ ./venus-auth genToken --perm read <USER>
<USER_READ_AUTH_TOKEN>
```
:::tip

Use `./venus-auth addUser <USER>` to logically group different tokens.

:::

## Install venus-gateway

Download and compile the source code of venus-gateway.

```bash
$ git clone https://github.com/ipfs-force-community/venus-gateway.git
$ cd venus-gateway
$ git checkout <RELEASE_TAG>
$ go mod tidy
$ make
```

Start venus-gateway.

```bash
$ ./venus-gateway \
--listen /ip4/0.0.0.0/tcp/45132 \
run \
# Use either a http or https url
--auth-url <https://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus-gateway.log 2>&1 &
```

## Install venus daemon

Download and compile the source code of venus.

```shell script
$ git clone https://github.com/filecoin-project/venus.git
$ cd venus
$ git checkout <RELEASE_TAG>
$ make deps
$ make
```
Start venus daemon for chain synchronization. Use `--network` to specify the network venus is connecting to.

```bash
$ nohup ./venus daemon --network nerpa \
--authURL <https://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus.log 2>&1 & 
```

:::tip

Use `tail -f venus.log` to check if there is any errors during sychronization.

:::

### Grant access to venus daemon

By default, venus daemon only respond to local access. Change the following configuration to allow access from other addresses.

```shell script
vim ~/.venus/config.json
```

Change `apiAddress` from `/ip4/127.0.0.1/tcp/3453` to `/ip4/0.0.0.0/tcp/3453`. Save and close the config file.

```json
{
	"api": {
		"venusAuthURL": "http://192.168.5.62:8989",
		"apiAddress": "/ip4/0.0.0.0/tcp/3453",
		"accessControlAllowOrigin": [
			"http://localhost:8080",
			"https://localhost:8080",
			"http://127.0.0.1:8080",
			"https://127.0.0.1:8080"
    ],
		"accessControlAllowCredentials": false,
		"accessControlAllowMethods": [
			"GET",
			"POST",
			"PUT"
    ]
  },
```

Restart venus daemon for the config to take into effects.

```bash
$ ps -ef | grep venus
$ kill <VENUS_PID>
$ nohup ./venus daemon --network nerpa \
--authURL <https://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus.log 2>&1 
```

## Install venus-wallet

Download and compile the source code of venus-wallet.

```shell script
$ git clone https://github.com/filecoin-project/venus-wallet.git
$ cd venus-wallet 
$ git checkout <RELEASE_TAG>
$ make
```

Start venus-wallet.

```bash
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

Set password for venus-wallet

```shell script
# Set lock and unlock password
$ ./venus-wallet setpwd
Password:******
Enter Password again:******
```
:::warning

Make sure you properly backup the password you just set.

:::

Generate addresses for later use.

```bash
$ ./venus-wallet new bls
<OWNER_ADDRESS>
$ ./venus-wallet new bls
<WORKER_ADDRESS>
```

:::tip

If you are testing on Nerpa or Calibration, you have to fund all your addresses with test coins from faucets. For nerpa, use this [faucet](https://faucet.nerpa.interplanetary.dev/funds.html). For calibration, use this [faucet](https://faucet.calibration.fildev.network/funds.html). 

:::

Change `[APIRegisterHub]` section of `~/.venus_wallet/config.toml` using the token you generated with venus-auth.

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<USER_READ_AUTH_TOKEN>"
SupportAccounts = ["<USER>"]
```
Restart venus-wallet so that the changes takes into effect.

```bash
# grep [PID] of venus-wallet process
$ ps -ef | grep wallet
# kill the process and restart
$ kill [PID]
$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

## Install venus-messager

Download and compile the source code of venus-messager.

```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git
$ cd venus-messager
$ git checkout <RELEASE_TAG>
$ make deps
$ make 
```
Start venus-messager. Note that `--auth-url`, `--node-url` and `--auth-token` are for venus-messager to be aware of other venus modules and be properly authenticated.

```bash
$ nohup ./venus-messager run \
--auth-url=<https://VENUS_AUTH_IP_ADDRESS:PORT> \
--node-url /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132 \
--auth-token <SHARED_ADMIN_AUTH_TOKEN> \
--db-type mysql \
--mysql-dsn "<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_messager?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s" \
> msg.log 2>&1 &
```

:::tip

If no database related params are specified, venus-messager will default to use sqlite.

:::


## Install venus-miner

Download and compile the source code of venus-miner.

```shell script
$ git clone https://github.com/filecoin-project/venus-miner.git
$ cd venus-miner
$ git checkout <RELEASE_TAG>
$ make
```
Initialize venus-miner.

```bash
$ ./venus-miner init
# For nettype, choose from mainnet, nerpanet, debug, 2k, calibnet
--nettype nerpanet
--auth-api <https://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
```

Run venus-miner.

```bash
$ nohup ./venus-miner run >>miner.log 2>& 1 &
```

### Miner management

Once a miner, venus-sealer with proper miner id, connected to your shared modules. You can query the status of said miner id by the following.

```bash
$ ./venus-miner address state 
[
	{
		"Addr": "<MINER_ID>",
		"IsMining": true,
		"Err": null
	}
]
```

If `IsMining` of your miner is `false`, you can run the following command to start the miner id.

```bash
$ ./venus-miner address start <MINER_ID>
```

List all miner ids that have connected to venus-miner.

```bash
$ ./venus-miner address list
```

## Install venus-sealer

Download and compile the source code of venus-miner.

```shell script
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout <RELEASE_TAG>
$ make deps
$ make
```

#### Initialize sealer with a new miner id

If you don't have a miner id yet, run the following command to initialize sealer.

```shell script
$ nohup ./venus-sealer init \
--worker <WORKER_ADDRESS> \
--owner <OWNER_ADDRESS>  \
# Choose between 32G or 64G for mainnet
--sector-size 512M \
# Choose from nerpa, calibration. Leave out --network for mainet?
--network nerpa \
# Addresses of different shared venus modules
--node-url /ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url /ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/3453 \
--gateway-url /ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/3453 \
--auth-token <USER_WRITE_AUTH_TOKEN> \
# Flags sealer to not storing any sealed sectors on the machine it runs on
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

#### Initialize sealer with an existing miner id

If you already have a miner id, run the following command to initialize sealer.

```shell script
$ ./venus-sealer init \
--actor <MINER_ID>  \
# Choose from nerpa, calibration. Leave out --network for mainet?
--network nerpa \
# Config for different shared venus modules
--node-url /ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453 \
--messager-url /ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/3453 \
--gateway-url /ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/3453 \
--auth-token <USER_WRITE_AUTH_TOKEN> \
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

### Start pledging

Run venus-sealer.

```shell script
$ nohup ./venus-sealer run >> sealer.log 2>&1 &
```

:::tip

If you are running sealer for the 1st time, it will start to download proof parameters, which may take quite some time. If you are located in China, follow the tips [here](https://venus.filecoin.io/Tips-Running-In-China.html) to speed up the process.

:::

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

## Questions？

Find us on [Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)!
