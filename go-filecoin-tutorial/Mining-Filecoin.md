# Mining Filecoin

This guide provides an overview of how mining works, and a step-by-step of how to mine on the Filecoin network.

## Table of Contents

* [What is mining?](#what-is-mining)
* [Start mining](#start-mining)
* [Explore mined blocks](#explore-mined-blocks)
* [Set your price for storage](#set-your-price-for-storage)
* [Accept a deal and get paid](#accept-a-deal-and-get-paid)
* [Stop mining](#stop-mining)
* [Advanced options](#advanced-options)

## <div id="what-is-mining" />What is mining?

In most blockchain protocols, "miners" are the participants on the network that do the work necessary to keep the blockchain valid and secure. For providing these services, miners are compensated in the native cryptocurrency. The term "miner" emerged to compare the work of securing blockchains with that of gold miners who expended resources to expand the supply of gold.
<!--
One key difference between Proof-of-Work systems (such as Bitcoin) and Filecoin is that Filecoin is designed to generate a native token as. More specifically, in the case of Filecoin, miners secure the network by computing proofs of storage and the overall purpose of the network is for miners to provide storage to other users. Contrast this to Bitcoin, in which miners secure the network by computing wasteful proofs of work, while the overall purposes of the network are transactions and store-of-value.-->

The Filecoin network will have multiple types of miners:
* Storage miners
* Retrieval miners
* Repair miners (later)

In the current implementation, we focus mostly on storage miners. A storage miner sells storage capacity in exchange for filecoin.

## Start mining

After daemon has finished syncing and validating the chain, you can create a miner and start mining.

Mining blocks on the Filecoin network requires committing storage capacity to the network. Blocks are mined, and block rewards earned, in proportion to the amount of storage committed.

Start by creating a miner. You'll need to include a sector size and pledge collateral. You'll also need to include "gas", a small fee to send that pledge message to the Filecoin blockchain.

0. Download the parameters for your sector size (256Mib)

   ```sh 
   proofs/bin/paramfetch -j proofs/misc/parameters.json -z 1024,268435456
   ```

1. Create a miner with 100 FIL as collateral, using the default sector size (256MiB), with a message gas price of 0 FIL/unit and limit of 1000 gas units. When successful, it returns the miner address of the newly created miner.

    *Note: This step may take about a minute to process, but if it hangs for longer, double-check that `gas-price` is less than `$YOUR_WALLET_BALANCE / LIMIT`.*

    ```sh
    go-filecoin miner create 100 --gas-price=0.001 --gas-limit=300 --peerid `go-filecoin id | jq -r '.ID'`   # this may take a minute
    ```

1. Once the miner is created, run the following to start mining:

    ```sh
    go-filecoin mining start
    ```

:star2: Congrats, you are now mining blocks on the Filecoin network! Let's take a detour to explore these blocks. (Or, to begin mining your unused storage, skip directly to [Set your price for storage](#set-your-price-for-storage).)

## Explore mined blocks

You can explore the Filecoin blockchain using the [Filecoin Block Explorer](http://user.kittyhawk.wtf:8000/), or via the command line.  For example, let's get the `blockID` of the very first block of the blockchain. This is known as the _head_.

1. Show the chain head and copy the a block ID (there may be more than one):
    ```sh    
    go-filecoin chain head # returns JSON including the <blockID> of the chain head
    ```
1. Then, view the contents of that block with `show block`: 
    ```sh    
    go-filecoin show block <blockID>
    ```

Many commands also support a `--enc=json` option for machine-readable output.

## Set your price for storage

In the Filecoin storage market, miners run a command that sets their price for storage by creating an *ask order* that provide some detail on their available storage space and how much they are charging for storage. Clients propose *deals* to miners for the files they want to store. Setting a price requires the following values:
1. the price at which you are willing to sell that much storage (in FIL/byte/block)
1. the number of blocks for which this asking price is valid
1. the price to pay for each gas unit consumed mining this message (in FIL)
1. the maximum number of gas units to be consumed by this message

Let's set our price!
   
1. We set our price to 0.000000001 FIL/byte/block, valid for 2880 blocks, with a message gas price of 0.001 FIL/unit and limit of 1000 gas units:
    ```sh
    go-filecoin miner set-price --gas-price=0.001 --gas-limit=1000 0.000000001 2880
    ```
1. Once you have set your price, you can check `client list-asks` to see your ask (look for your miner address):
    ```sh
    go-filecoin client list-asks --enc=json | jq 
    ```

## Accept a deal and get paid

Clients propose storage deals to miners who have enough storage and at a price that is lower than their willingness to pay.  Currently, miners accept all deals that are proposed to them by clients with sufficient funds. Payment validation is done automatically so you don't have to take any action to accept a deal that pays you your asking price.  Deal payments are implemented using filecoin's builtin payment channels. Thus, miners are periodically credited funds in a payment channel throughout the lifetime of the deal.

To see all deals your miner has made run 
```sh
go-filecoin deals list --miner
```
 You will see a list of meta data about deals looking something like this:
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

To get more information about a specific deal run 
```sh
go-filecoin deals show <proposal-cid>
```  
In the above example `<proposal-cid>` would be `zDPWYqFD8U3ktr58iiqWTwzEV3sKyz7SGQjLg1zKS1Mgpo5N2nr1`.  You can inspect a deal's state, how long the agreed storage period is, and how much you will get paid for honoring the deal.

When the deal duration is up you can redeem your full payment by running 
```sh
go-filecoin deals redeem --gas-price=0.001 --gas-limit=1000 <proposal-cid>
``` 
This will submit a message to the blockchain redeeming funds from the payment channel set up between you and your client.  Wait for the output message to be processed by the network and voila! You will now see the deal's payout in your wallet.

## Stop mining

If at any point you want to stop mining, you can always stop:
```sh
go-filecoin mining stop
```

You can also remove all data associated with your Filecoin node instance:
```sh
rm -rf ~/.filecoin
```

## Advanced options

#### Specify where client data is stored
There are two ways to specify the location of the sector storage directory:
* the `sectorbase.rootdir` config entry
* the `--sectordir` option to `go-filecoin init`

If you don’t specify a location, data is stored in a directory named `.filecoin_sectors` underneath the parent directory of the filecoin repo directory by default.
```sh
repo-dir-parent ($HOME by default)
   repo-dir
   .filecoin_sectors
```