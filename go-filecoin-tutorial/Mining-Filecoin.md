# Mining Filecoin

This section provides an overview of how mining works as well as a step-by-step guide to mining on the Filecoin network.

## Table of contents

* [What is mining?](#what-is-mining)
* [Start mining](#start-mining)
* [Explore mined blocks](#explore-mined-blocks)
* [Set your price for storage](#set-your-price-for-storage)
* [Accept a deal and get paid](#accept-a-deal-and-get-paid)
* [Stop mining](#stop-mining)
* [Advanced options](#advanced-options)

## <div id="what-is-mining" />What is mining?

In most blockchain protocols, "miners" are the participants on the network that do the work necessary to advance the blockchain and maintain its validity. For providing these services, miners are compensated in the native cryptocurrency. The term "miner" emerged in the initial Proof-of-Work era, comparing the work done by hardware miners using computational power to secure blockchains with that of gold miners whom expended vast physical resources for a chance at a large payout. 

<!--
One key difference between Proof-of-Work systems (such as Bitcoin) and Filecoin is that Filecoin is designed to generate a native token as. More specifically, in the case of Filecoin, miners secure the network by computing proofs of storage and the overall purpose of the network is for miners to provide storage to other users. Contrast this to Bitcoin, in which miners secure the network by computing wasteful proofs of work, while the overall purposes of the network are transactions and store-of-value.-->

The Filecoin network will have multiple types of miners:
* **Storage miners**, responsible for storing files and data on the network.
* **Retrieval miners**, responsible for providing quick pipes to retrieve files.
* **Repair miners**, which are to be implemented.

In the current implementation, the focus is mostly on storage miners, which sell storage capacity in exchange for FIL.

## Start mining

After the daemon has finished syncing and validating the chain, a miner can be created straight away. Mining blocks on the Filecoin network requires committing storage capacity to the network. Blocks are mined and block rewards earned in equal proportion to the amount of storage committed.

To create a miner, a sector size and pledge collateral must be included, as well as "gas"; a small fee provided to send the pledge message to the Filecoin blockchain, similar to a postage stamp.

### An example configuration

1. Generate the proof parameters for proving/verification

   ```sh
   ./go-sectorbuilder/paramcache
   ```

2. Create a miner with 100 FIL as collateral, using the default sector size (256MiB), with a message gas price of 0.001 FIL/unit and limit of 300 gas units:

  > **NOTICE:** This step may take about a minute to process, but if it hangs for longer, double-check that `(gas-price * gas-limit)` is less than `$YOUR_WALLET_BALANCE`.

    ```sh
    go-filecoin miner create 100 --gas-price=0.001 --gas-limit=300   # this may take a minute
    ```
When successful, it returns the miner address of the newly created miner.

3. Once the miner is created, run the following to start mining:

    ```sh
    go-filecoin mining start
    ```

## Explore mined blocks

The Filecoin blockchain can be explored using the community-managed block explorers [filscout.io](https://filscout.io) and [filscan.io](filscan.io), or via the command line.  For example, to retrieve the `blockID` of the very first block -- or the 'head block' -- of the blockchain:

1. Show the chain head and copy the a block ID (there may be more than one):
    ```sh    
    go-filecoin chain head # returns JSON including the <blockID> of the chain head
    ```
1. Then, view the contents of that block with `show block`:
    ```sh    
    go-filecoin show block <blockID>
    ```

  > **NOTICE:** Many commands also support a `--enc=json` option for machine-readable output.

## Set your price for storage

In the Filecoin storage market, miners run a command that sets their price for storage by creating an *ask order*. This ask order provides the miners available storage capacity as well as the price per unit they are requesting. Clients propose *deals* to miners for the files they want to store. Setting a price requires the following values:

1. The price at which you are willing to sell that much storage (in `FIL/byte/block`).
2. The number of blocks for which this asking price is valid.
3. The price to pay for each gas unit consumed mining this message (in FIL).
4. The maximum number of gas units to be consumed by this message.

Let's set our price!

1. Set the price to 0.000000001 FIL/byte/block, valid for 2880 blocks, with a message gas price of 0.001 FIL/unit and limit of 1000 gas units:
    ```sh
    go-filecoin miner set-price --gas-price=0.001 --gas-limit=1000 0.000000001 2880
    ```
2. Once complete, check `client list-asks` for your miner address to ensure it has been set:
    ```sh
    go-filecoin client list-asks --enc=json | jq
    ```

## Accept a deal and get paid

Clients propose storage deals to miners who have enough storage and at a price that they are willing to accept.  Currently, miners accept all deals that are proposed to them by clients with sufficient funds. Payment validation is done automatically, and not additional input is required to accept a deal that covers the asking price.  Deal payments are implemented using Filecoin's built-in payment channels. Thus, miners are periodically credited funds in a payment channel throughout the lifetime of the deal.

1. To see all deals your miner has made:
	```sh
	go-filecoin deals list --miner
	```
2. A list containing metadata about deals will be printed out, like so:
	```json
	{
	"minerAddress": "t2mpmyigmpopcwguhe2tpdeonoppuht5mtvd2ljcq",
	"pieceCid": {
		"/": "QmbHmUVAkqZjQXgifDady7m5cYprX1fgtGaTYxUBBTX3At"
	},
	"proposalCid": {
		"/": "zDPWYqFD8U3ktr58iiqWTwzEV3sKyz7SGQjLg1zKS1Mgpo5N2nr1"
	},
	"state": "staged"
	}
	```

3. To get more information about a specific deal:
	```sh
	go-filecoin deals show <proposal-cid>
	```  
	
In the above example `<proposal-cid>` would be `zDPWYqFD8U3ktr58iiqWTwzEV3sKyz7SGQjLg1zKS1Mgpo5N2nr1`. It is possible to inspect the current state of a deal, how long the agreed storage period is, and how much payout will be recieved for honoring the deal.

4. When the deal duration is up you can redeem your full payment by running
	```sh
	go-filecoin deals redeem --gas-price=0.001 --gas-limit=1000 <proposal-cid>
	```
	
This will submit a message to the blockchain redeeming funds from the payment channel set up in the client.  Once the output message is processed by the network, the deal's payout will be visibile in the user's wallet.

## Stop mining

To stop mining altogether:

	```sh
	go-filecoin mining stop
	```

2. To remove all data associated with your Filecoin node instance:

	```sh
	rm -rf ~/.filecoin
	```

## Advanced options

#### Specify where client data is stored
There are two ways to specify the location of the sector storage directory:
* the `sectorbase.rootdir` config entry
* the `--sectordir` option to `go-filecoin init`

If a location is not specified, the data is stored in a directory named `.filecoin_sectors` underneath the parent directory of the Filecoin repo directory.

```sh
repo-dir-parent ($HOME by default)
   repo-dir
   .filecoin_sectors
```
