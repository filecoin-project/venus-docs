# Storing on Filecoin

This section provides instructions for making storage deals with miners and retrieving the files afterwards.

## Table of contents

* [How to store on Filecoin](#how-to-store-on-filecoin)
* [Test Filecoin with sample data](#test-filecoin-with-sample-data)
* [Import data](#import-data)
* [Propose a storage deal](#propose-a-storage-deal)
* [Send data and pay miner](#send-data-and-pay-miner)
* [Retrieving data](#retrieving-data)

## How to store on Filecoin

Because Filecoin is a decentralized storage marketplace, storage clients (our term for anyone who wants to store data on the Filecoin network) propose storage deals with storage miners that they feel can meet their storage needs. Once a storage client has proposed a deal, the miner can choose to accept or reject that deal. The client then sends over the data, and the storage deal officially begins.

In order to run the remainder of these commands, ensure a Filecoin node is installed and currently running. See the [getting started](Getting-Started) section of this documentation for more information.

## Test Filecoin with sample data

Personal data can be used to test Filecoin. It is recommended to use small test files while initially getting used to the different commands.

If preferred, there is a folder of [sample data](https://github.com/filecoin-project/sample-data) (images, GIFs, and text files) that can be used to get started. Download this data, unzip it, and save it anywhere. In the examples below, it is assumed that the repository is saved to the Desktop (`~/Desktop`).

## Import data

Before storing data on the Filecoin network, import the data into the local Filecoin node:

```sh
# Start by creating a simple .txt file
echo "Hi my name is $USER"> hello.txt

# Import the created file into go-filecoin.
# RETURN VAL: Content ID (CID) of this file.
# You'll need this CID for future commands to
# view, store, or retrieve this data.
export CID=`go-filecoin client import ./hello.txt`

# View the imported file
# RETURN VAL: "Hi my name is user1"
go-filecoin client cat $CID
```

To import files from the local machine:

```sh
# Import an image from the sample data. Returns
# its CID which you'll need for the next step.
export CID=`go-filecoin client import ~/Desktop/sample-data-master/camel.jpg`

# View imported image
go-filecoin client cat $CID > image.jpg && open image.jpg
```

## Propose a storage deal

Once the data is imported, it is possible to look through available _ask orders_ from miners. Manually choose one of them and propose a storage deal.

<!--# Check size of the imported file (in bytes)
go-filecoin client cat <CID> | wc -c
-->

To see all available asks, run this command:

```sh
go-filecoin client list-asks --enc=json | jq
```

A list of asks will be generated in `json` format:

```json
{
  "Miner": "fcqxvnl37zdv8clc26j6r43zn8md7tc2mrfx77vru",
  "Price": "2.5",
  "Expiry": 588,
  "ID": 0,
  "Error": null
}
```

The price is in FIL per byte per blocktime (~30s), and the expiry is the blockchain height at which the ask expires. Choose an ask from that list. For now, the biggest difference between miners will be price. In the future, miners may have other characteristics.

Proposing a storage deal requires four parameters:

* `<miner>` address of the miner from `list-asks`
* `<data>` CID of the imported data to be stored
* `<ask>` ID of the ask, also from `list-asks` (usually 0)
* `<duration>` how long to store (in # of ~30sec blocktimes). For example, storing for 1 day (2 blocks/min * 60 min/hr * 24 hr/day) = 2880 blocks.

Supplied in the following command:

```sh
go-filecoin client propose-storage-deal <miner> <data> <ask> <duration>
```

If the deal is proposed correctly, it will automatically be accepted and return `Status: accepted`. Currently, a deal will fail if the required capacity exceeds what that miner has available. A deal will also fail if the client account's wallet FIL balance is insufficient to cover the asking cost over the proposed data size and duration.

## Send data and pay miner

As part of negotiating the deal, the `propose-storage-deal` command will automatically move the funds required for covering the deal's total into a payment channel with the storage miner.  This payment channel will periodically release payments to the storage miner across the lifetime of the deal.

Data is automatically transferred to a staging area via the underlying [bitswap](https://github.com/ipfs/specs/tree/master/bitswap) mechanism (implementation from IPFS) of Filecoin. Miners will now be required to store files on their machines and begin the sealing/proving process. Under the hood, filecoin miners automatically fire off a sealing process at a configured interval (defaulted to 120 seconds) to take all data in the miner's staging area and seal it into the miner's pledged storage sectors.  The deal status will move to "staged" at this point.  After sealing is complete and the miner posts its commitment to the chain, the deal status will move to "posted".

Check the deal state:

```sh
go-filecoin client query-storage-deal <dealID>
```

Once it reads "posted, you will have successfully stored your data!", the data is now available for retrieval.

## Retrieving data

Before data can be retrieved from a sealed sector, the sector must be unsealed. At present, the sealing and unsealing processes are artificially fast; it will take around 5-10 minutes for a piece of data to be retrieved after it is requested. Note that, when Filecoin is working in production, this may take much longer.

```sh
# Retrieve your data, using the address of the
# miner you made a deal with and the <CID> of the data.
go-filecoin retrieval-client retrieve-piece <minerAddress> <CID> # can take a minute
```

Congratulations! You have now walked through several of the client commands available on Filecoin. Let us know if you have any questions by dropping a message on Matrix (#fil-chat) or the [community forum](https://discuss.filecoin.io/), and take a look at the [Troubleshooting & FAQs page](Troubleshooting-&-FAQ).
