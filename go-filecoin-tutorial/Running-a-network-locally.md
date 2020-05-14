# Running a local network

Sometime it can be helpful to setup a local network for testing, both in development or in play. There are currently two different ways to setup a network.

- Manually using the gengen tool
- Automatically using localnet tool

## Table of contents

 - [Manual network setup with gengen tool](#manual-network-setup-with-gengen-tool)
    - [Configuration](#configuration)
    - [Generated Output](#generated-output)
    - [Using the output](#using-the-output)
  - [Automatic network setup with localnet tool](#automatic-network-setup-with-localnet-tool)
    - [Basic usage](#basic-usage)
    - [Regular Sectors](#regular-sectors)


## Manual network setup with gengen tool

[README](https://github.com/filecoin-project/go-filecoin/tree/master/gengen)

The Gengen tool is a command line tool used to generate the assets required to bootstrap a network. The tool builds the `genesis.car` that is provided to users when connecting to the devnets, as well a few other assets. We'll discuss these in detail.

### Configuration

Gengen uses a configuration file to describe the assets it will produce. The file describes the number of wallets (account actors) that will be generated, the balance of each wallet, and if the wallet has a miner associated with it.

**config.json**
```json
{
  "keys": 5,
  "preAlloc": [
    "1000",
    "2000",
    "3000",
    "4000",
    "5000",
  ],
  "miners": [{
    "owner": 0,
    "power": 1
  }]
}
```
_Note: A default configuration is provided in the [`go-filecoin/fixtures/`](https://github.com/filecoin-project/go-filecoin/blob/master/fixtures/setup.json) directory_

The `keys` property defines the number of wallets to create. This will produce a set of files `0.key...n.key`, where `n` is the value of `keys - 1`. The files will be produced in the working directory, but the output can be changed by providing the `-keypath` when running the `gengen` command.

The `preAlloc` property defines the preallocated funds for the wallet. The numerical value (represented as a string to support large values) is associated with a key by the position it has in the array. This means that the wallet, with key `0.key`, will have `1000` FIL, while `4.key` will have `5000`.

The `miners` property defines a miner and the amount of power it will have on the network. Power is a measurement of sealed sectors. Currently this power is fake, but for the most part acts like the real thing. Gengen [soon may create real sealed sectors](https://github.com/filecoin-project/go-filecoin/issues/2270). It's best to keep this power value low. The `owner` is the key index, so key `0.key` would be owner `0`.

### Generated output

There are two main outputs from `gengen`, with the additional of the `n.key` files for easy importing.

**-out-car**
This options defines the location and name of the `car` file, generally you will see this named `genesis.car`. The file is used to load the genesis block into nodes. This is done by providing the `--genesisfile` option during `go-filecoin init`.

**-out-json**
This options defines the location and name of the address information. This file contains the wallet private keys, as well as the miner addresses. The private keys in this file are the same as the key files `0.key...n.key`. The key files
are provided as an easier way to import the individual keys.

### Using the output

The following file describes the setup process for configuring a node to use information inside of the genesis file. Below we will talk about how to use the files inside of `fixtures` to do this process.

The genesis file contains the seed of the chain. It's basically block zero. The block contains messages that gives
power to one miner and tokens to certain other address (account actors / wallets).

To use the miner in the genesis, we have to import the miner owner (account actor / wallet), configure a few values,
and update the peerid associated with the miner.

_Note: The following commands assume you are running inside of the `go-filecoin` source directory. Each block below is expected to be run in a different terminal window._

```sh
./go-filecoin init --genesisfile=./fixtures/test/genesis.car
./go-filecoin daemon
```

In another terminal:

```sh
mineraddr=$(jq -r '.Miners[0].Address' ./fixtures/test/gen.json)
peerid=$(./go-filecoin --enc=json id | jq -r '.ID')
./go-filecoin config mining.minerAddress $mineraddr
walletaddr=$(./go-filecoin --enc=json wallet import ./fixtures/test/0.key | jq -r '.Addresses[0]')
./go-filecoin config wallet.defaultAddress $walletaddr
./go-filecoin miner update-peerid --from $walletaddr --gas-price 0.001 --gas-limit=300 $mineraddr $peerid
./go-filecoin mining start
./go-filecoin wallet balance $walletaddr
```

You should see a non-zero balance. Setting up additional miners can be achieved by following the standard method, and using this genesis node as a way to receive funds.

## Automatic network setup with localnet tool

[README](https://github.com/filecoin-project/go-filecoin/tree/master/tools/fast/bin/localnet)

The localnet is a tool built using our [FAST library](https://github.com/filecoin-project/go-filecoin/tree/master/tools/fast).
It provide an automated way to setup a localnet and remove the requirement for working with `gengen`, and juggling the execution
of commands agasint different filecoin repos.

Localnet goes a bit further and handles the construction of miner nodes, which you will have to do manually if using `gengen`. All configuration for `localnet` can be found in the README linked above.

You will need to build `localnet`, and it's only compatible with `go-filecoin` binaries built from the same commit. Building is easy though:

```sh
cd tools/fast/bin/localnet
go build -o localnet main.go
```

Using localnet is really simple. A few examples will showcase this:

### Basic usage
When using all the default flags, localnet will use the `go-filecoin` binary located in the project directory under `filecoin-project/go-filecoin`. It will default to our small sectors, creating five miners. The `-shell` flag tells localnet to create an additional node and launches your shell with `go-filecoin` setup correctly in your path, ready to use. The node will already be connect to all the miners and have 100,000 FIL in its default wallet.

```sh
localnet $ ./localnet -shell
```

### Regular sectors
Using regular sized sectors with localnet can be incredibly taxing on a system and should probably be avoided
on laptops due to the number of miners running. The overall miner count can be reduced from the default `5` by passing the `-miner-count` flag.

```sh
localnet $ ./localnet -small-sectors=false -miner-count=2 -shell
```

See `./localnet -help` for additional configuration options, or refer to the localnet README linked above.
