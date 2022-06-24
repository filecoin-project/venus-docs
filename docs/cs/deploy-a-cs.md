## Pre-requisites

Before diving into deployment of your mining operation, please make sure you go through the following steps. 

:::warning

It is recommended that you test your setup in calibration network before deploying on mainnet. 

:::

### Setup your permanent storage

Choose a network file system that you are familiar with (NFS for example) and deploy your storage cluster.

### Software dependencies

You will need to install these [software dependencies](https://lotus.filecoin.io/lotus/install/linux/#software-dependencies) (same as Lotus) before running venus.

## Install venus-auth

Download and compile the source code of venus-auth.

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git
$ cd venus-auth
$ git checkout <RELEASE_TAG>
$ make 
$ nohup ./venus-auth run > auth.log 2>&1 &
```
:::tip 

Default config file for Venus-auth is located at `~/.venus-auth/config.toml`.

:::

:::tip Logs

Log defaults printing to console. InfluxDB is supported through configuration.

:::

:::tip port

The default port of `venus-auth` is `8989`.

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
$ nohup ./venus-auth run > auth.log 2>&1 &
```

### Token gerneration

venus-auth manages [jwt](https://jwt.io/) tokens used by other venus modules for them to talk to each other securely on the network.

Generate tokens for shared modules.

```bash
# --perm specifies admin, sign, wirte or read permission of the token generated
$ ./venus-auth token gen --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```

Generate tokens for independent modules. Tokens can be logically grouped by `<USER>` as individual miner joining the mining pool.

```shell script
$ ./venus-auth user add <USER>

$ ./venus-auth token gen --perm write <USER>
<USER_WRITE_AUTH_TOKEN>
$ ./venus-auth token gen --perm read <USER>
<USER_READ_AUTH_TOKEN>
```
:::tip

Use `./venus-auth user add <USER>` to logically group different tokens. Activate the user, which was just created,  then bind miner to it:
```
$ ./venus-auth user update --name <USER> --state 1
$ ./venus-auth user miner add <USER> <MINER_ID>

# 查看user列表
$ ./venus-auth user list
```

:::

## Install venus-gateway

Download and compile the source code of venus-gateway.

```bash
$ git clone https://github.com/ipfs-force-community/venus-gateway.git
$ cd venus-gateway
$ git checkout <RELEASE_TAG>
$ make
```

Start venus-gateway.

```bash
$ ./venus-gateway --listen=/ip4/0.0.0.0/tcp/45132 run \
# Use either a http or https url
--auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus-gateway.log 2>&1 &
```

:::tip

If you encounter the following compilation errors, execute first`go get github.com/google/flatbuffers@v1.12.1`
```bash
github.com/dgraph-io/badger/v3@v3.2011.1/fb/BlockOffset.go:6:2: missing go.sum entry for module providing package github.com/google/flatbuffers/go (imported by github.com/dgraph-io/badger/v3/table); to add:
        go get github.com/dgraph-io/badger/v3/table@v3.2011.1
```
:::

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
$ nohup ./venus daemon --network=cali --auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> > venus.log 2>&1 & 
```

:::tip

Use `tail -f venus.log`  or `./venus sync status` to check if there is any errors during sychronization.

:::

### Grant access to venus daemon

By default, venus daemon only respond to local access. Change the following configuration to allow access from other addresses.

```shell script
vim ~/.venus/config.json
```

Change `apiAddress` from `/ip4/127.0.0.1/tcp/3453` to `/ip4/0.0.0.0/tcp/3453`. Save and close the config file.

```json
{
	"api": {"apiAddress": "/ip4/0.0.0.0/tcp/3453"}
}
```

Restart venus daemon for the config to take into effects.

```bash
$ ps -ef | grep venus
$ kill <VENUS_PID>
$ nohup ./venus daemon --network=cali --auth-url <http://VENUS_AUTH_IP_ADDRESS:PORT> > venus.log 2>&1 &
```

:::tip

In order for the chain service to interact with the chain, daemon needs to be synced with the network by importing a snapshot of the filecoin chain. Please refer to [this guide](Chain.md) for more details.

:::

## Install venus-messager

Download and compile the source code of venus-messager.

```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git
$ cd venus-messager
$ git checkout <RELEASE_TAG>
$ make 
```
Start venus-messager. Note that `--auth-url`, `--node-url` and `--auth-token` are for venus-messager to be aware of other venus modules and be properly authenticated.

```bash
$ nohup ./venus-messager run \
--auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> \
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
# For nettype, choose from mainnet, debug, 2k, calibnet
--nettype calibnet \
--auth-api <http://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132 \
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--slash-filter local
```

Run venus-miner.

```bash
$ nohup ./venus-miner run >>miner.log 2>& 1 &
```

### Miner management

Once a user, venus-sealer with proper miner id, connected to your shared modules. You can query the status of said miner id by the following.

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

## Next steps

Next, please follow this [guide](Using-venus-Shared-Modules.md) to connect to the storage pool you just deployed!

## Questions？

Find us on [Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)!
