# CLI commands

Run `go-filecoin --help` for a complete list of commands.

This is a quick reference for some common operations.

Note that all CLI inputs specifying a price are interpreted in units of FIL.

## Table of contents

- [Setup and config](#setup-and-config)
- [Network](#network)
- [Data structures](#data-structures)
- [Mining](#mining)
- [Storage: Make a deal](#storage-make-a-deal)
- [Retrieval mining](#retrieval-mining)
- [Helpful environmental variables](#helpful-environmental-variables)


### Setup and configuration
```sh
rm -fr ~/.filecoin      # <== optional, in case you have a pre-existing install
go-filecoin init        # Creates config in ~/.filecoin; to see options: `go-filecoin init --help`
go-filecoin daemon      # Starts the daemon, you may now issue it commands in another terminal
```

#
### Network
```sh
### List and ping a peer
go-filecoin swarm peers
go-filecoin ping <peerID>
```

#
### Data structures
```sh
###  View latest mined block
go-filecoin chain head
go-filecoin show block <blockID> | jq
```

#
### Mining

```sh
# Create a miner
# Requires the node be a part of a devnet that already has miners
# and no miner configured for this node yet.
go-filecoin miner create 10 --gas-price 0 --gas-limit 300

# Waits for the message to be included on chain, updates the minerAddress
# in the node's config, and sets the peerid appropriately.
# Get your miner address
go-filecoin config mining.minerAddress

# And the owner:
go-filecoin miner owner <minerAddress>

# As a miner, force a block to be mined immediately. If successful, go-filecoin
# daemon output should show an indication of mining.
go-filecoin mining once

# As a miner, set storage price
# First make sure mining is running
go-filecoin mining start

# Set the price
go-filecoin miner set-price <size> <price> --gas-price 0 --gas-limit 300

# Wait for the block to be mined (~30s) and view the ask:
go-filecoin client list-asks | jq

```
#
### Storage: Make a deal
```sh
# Create a file to be stored
echo <"Hi my name is $USER"> hello.txt
go-filecoin client import ./hello.txt

# Verify it was imported:
go-filecoin client cat <data CID>

# Get the file size:
go-filecoin client cat <data CID> | wc -c

# Find a miner by running client list-asks
go-filecoin client list-asks | jq

# Propose a storage deal, using the <miner address> from the ask.
# First make sure that mining is running
go-filecoin mining start

# Propose the deal
go-filecoin client propose-storage-deal <miner address> <data CID> <price> <durationBlocks>

# TODO we want to be able to check the status, like this but the command above doesn't
# return an id
go-filecoin client query-storage-deal <id returned above>

# If you want to retrieve the piece immediately you can bypass the retrieval market.
# Note that this is kind of cheatsy but what works at the moment.
go-filecoin client cat <data CID>
```
#
### Retrieval mining
If you want to fetch the piece from the miner's sealed sector,
wait for the deal to be Sealed per query-storage-deal status above, and
then use the retrieval miner. Warning: this requires the sector be unsealed,
which takes a minute to run (it doesn't yet cache).

```sh
go-filecoin retrieval-client retrieve-piece <miner peer id> <data CID>
### From the miner's node (terminal), get the peer id:
go-filecoin id

### Retrieve a piece
go-filecoin retrieval-client \
   retrieve-piece QmXtaLS9N3URQ2uCkqpLP6KZv7rVbT5KyjU5MQAgQM6yCq \
   QmNqefRonNc2Rn5VwEB5wqJLE9arURmBUSay3kbjJoLJG9
```
#
### Helpful environmental variables
| Variable                | Description                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------|
| `FIL_API`               | This is the default host and port for daemon commands.                                         |
| `FIL_PATH`              | Use this variable to avoid setting `--repodir` flag by providing a default value.              |
| `GO_FILECOIN_LOG_LEVEL` | This sets the log level for stdout.                                                            |
| `GO_FILECOIN_LOG_JSON`  | This sets the log format to json when its value is 1. |
