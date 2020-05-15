# Running a local network

This section includes instructions for deploying a local network either manually with `gengen` or automatically with `localnet` for development or testing purposes.

## Table of contents

 - [Manual network setup with gengen tool](#manual-network-setup-with-gengen-tool)
    - [Configuration](#configuration)
    - [Generated output](#generated-output)
    - [Using the output](#using-the-output)
  - [Automatic network setup with localnet tool](#automatic-network-setup-with-localnet-tool)
    - [Basic usage](#basic-usage)
    - [Regular sectors](#regular-sectors)


## Manual network setup with gengen tool

The [gengen tool](https://github.com/filecoin-project/go-filecoin/blob/master/tools/gengen/README.md) is a command line utility used to generate the assets required to bootstrap a network, including a `genesis.car` file.

### Configuration

`gengen` uses a configuration file to describe the assets it will produce. The file describes the number of wallets (account actors) that will be generated, the balance of each wallet, and if the wallet has a miner associated with it.

#### config.json

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

  > **NOTICE:** A default configuration is provided in the [`go-filecoin/fixtures/`](https://github.com/filecoin-project/go-filecoin/blob/master/fixtures/setup.json) directory.

The `keys` property defines the number of wallets to create. This will produce a set of files `0.key...n.key`, where `n` is the value of `keys - 1`. The files will be produced in the working directory, though the output can be changed by providing the `-keypath` when running the `gengen` command.

The `preAlloc` property defines the preallocated funds for the wallet. The numerical value (represented as a string to support large values) is associated with a key by the position it has in the array. This means that the wallet, with key `0.key`, will have `1000` FIL, while `4.key` will have `5000`.

The `miners` property defines a miner and the amount of power it will have on the network. Power is a measurement of sealed sectors. Currently this power is fake; but for the most part, it fully simulates a production experience. Gengen [soon may create real sealed sectors](https://github.com/filecoin-project/go-filecoin/issues/2270). It is best to keep this power value low. The `owner` is the key index, so key `0.key` would be owner `0`.

### Generated output

There are two main outputs from `gengen`, with the additional of the `n.key` files for easy importing.

**-out-car**
This options defines the location and name of the `car` file. Generally, this file is named `genesis.car`. This file is used to load the genesis block into nodes by providing the `--genesisfile` option during `go-filecoin init`.

**-out-json**
This options defines the location and name of the address information. This file contains the wallet private keys, as well as the miner addresses. The private keys in this file are the same as the key files `0.key...n.key`. The key files
are provided as an easier way to import the individual keys.

### Using the output

The following file describes the how to use the files inside of `fixtures` to configure a node to use the information inside of the genesis file.

The genesis file contains the seed of the chain. The block contains messages that gives power to one miner and tokens to certain other address (account actors / wallets). To use the miner in the genesis, the miner owner (account actor / wallet) must be imported, followed by configuration changes and updating the `peerid` associated with the miner.

 > **NOTICE:** The following commands assume you are running inside of the `go-filecoin` source directory. Each block below is expected to be run in a different terminal window.

1. Initialise the genesis file and start the daemon:
    ```sh
    ./go-filecoin init --genesisfile=./fixtures/test/genesis.car
    ./go-filecoin daemon
    ```

2. In another terminal, enter the following:

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

This will generate a non-zero balance. Setting up additional miners can be achieved by following the standard method, and using this genesis node as a way to receive funds.

## Automatic network setup with localnet tool

The [localnet tool](https://github.com/filecoin-project/go-filecoin/tree/master/tools/fast/bin/localnet) is built using our [FAST library](https://github.com/filecoin-project/go-filecoin/tree/master/tools/fast). It provides an automated way to setup a localnet, removing the extra steps involved with using `gengen` and juggling the execution of commands against different filecoin repositories.

`localnet` goes a bit further and handles the construction of miner nodes, which you will have to do manually if using `gengen`. All configuration for `localnet` can be found in the README linked above.

`localnet` must be built, and is only compatible with `go-filecoin` binaries built from the same commit. 

To build `localnet`, issue the following commands:

```sh
cd tools/fast/bin/localnet
go build -o localnet main.go
```

### Basic usage
When using all the default flags, `localnet` will use the `go-filecoin` binary located in the project directory under `filecoin-project/go-filecoin`. It will default to our small sectors, creating five miners. The `-shell` flag tells `localnet` to create an additional node and launches your shell with `go-filecoin` setup correctly in your path, ready to use. The node will already be connect to all the miners and have 100,000 FIL in its default wallet.

```sh
localnet $ ./localnet -shell
```

### Regular sectors
Using regular sized sectors with `localnet` can be incredibly taxing on a system and should be avoided
on laptops due to the number of miners running. The overall miner count can be reduced from the default `5` by passing the `-miner-count` flag:

```sh
localnet $ ./localnet -small-sectors=false -miner-count=2 -shell
```

See `./localnet -help` for additional configuration options, or refer to the localnet README linked above.
