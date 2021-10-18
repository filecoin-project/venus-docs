# venus-market

venus-market is a module/component for participating in the filecoin market to accept deals and provide retrieval functions. It includes a market module/component and a client module/component. Storage providers can use venus-market along with venus-sealer to fullfill deals from a client. venus-market module/component relies on venus node for chain information services, venus-messenger for message pushing services, and venus-wallets for signature services.

## Quick start

Download source code.

```shell script
$ git clone https://github.com/filecoin-project/venus-market.git
```

Compile.

```shell script
$ make deps
$ make
```

Start venus-market.

```shell script
$ ./venus-market run --node-url <node url> --messager-url <messager-url> --auth-token <auth token>  --signer-url <wallet url> --signer-token  <wallet token> --piecestorage <piece storeage path> --miner <miner address>
```

Start client.

```shell script
$ ./market-client run --node-url <node url> --messager-url <messager-url> --auth-token <auth token>  --signer-url <wallet url> --signer-token  <wallet token> --addr <client default address>
```

## Client commands

Client commands are similar to lotus.

### Data related

Import data.
```shell script
$ ./market-client import <file>
```

Remove data.
```shell script
$ ./market-client drop <data id>
```

Show local data.
```shell script
$ ./market-client local
```

Check local data import status.
```shell script
$ ./market-client stat
```

### Retrieval related

Find retrieval data location.
```shell script
$ ./market-client find <data id>
```

Retrieval.
```shell script
$ ./market-client retrieve --miner <minerid> <data id> <output file>
```

Cancel retrieval.
```shell script
$ ./market-client cancel-retrieval 
```

Show deals being retrieved.
```shell script
$ ./market-client list-retrievals 
```

### Storage related

Initiate a deal.
```shell script
$ ./market-client deal    
```

Query ask price.
```shell script
$ ./market-client query-ask    
```


Show local deal list.
```shell script
$ ./market-client list-deals   
```

Show deal details.
```shell script
$ ./market-client get-deal
```

List asks for top miners.
```shell script
$ ./market-client list-asks     # List asks for top miners
```

Print statistics about local storage deals.
```shell script
$ ./market-client deal-stats    # Print statistics about local storage deals
```

Inspect storage deal details.
```shell script
 ./market-client inspect-deal
```

### CLI commands

Compute piececid of car file.
```shell script
$ ./market-client commP <file>
```

Generate car file from file.
```shell script
$ ./market-client generate-car <file> <car file>
```

Check balances.
```shell script
$ ./market-client balances
```


List onging transfers.
```shell script
$ ./market-client list-transfers 
```

Restart transfer.
```shell script
$ ./market-client restart-transfer <transfer id>
```

Cancel transfer.
```shell script
$ ./market-client cancel-transfer <transfer id>
```

 ### Market CLI commands

 piece related

 * `./venus-market pieces list-pieces`  
 * `./venus-market pieces list-cids`  
 * `./venus-market pieces piece-info <piece cid>` 
 * `./venus-market pieces cid-info <data cid>` 

retrieval related

*  `./venus-market retrieval-deals selection` 
*  `./venus-market retrieval-deals list` 
*  `./venus-market retrieval-deals set-ask` 
*  `./venus-market retrieval-deals get-ask` 

storage related
* `./venus-market storage-deals import-data` 
* `./venus-market storage-deals list` 
* `./venus-market storage-deals selection` 
* `./venus-market storage-deals set-ask` 
* `./venus-market storage-deals get-ask` 
* `./venus-market storage-deals set-blocklist` 
* `./venus-market storage-deals get-blocklist` 
* `./venus-market storage-deals reset-blocklist` 
* `./venus-market storage-deals set-seal-duration` 
* `./venus-market storage-deals pending-publish` 

network related

* `./venus-market net listen` 
* `./venus-market net id` 

actor

* `./venus-market actor info` 
* `./venus-market actor set-addrs` 
* `./venus-market actor set-peer-id` 

transfer related

* `./venus-market data-transfers list` 
* `./venus-market data-transfers restart` 
* `./venus-market data-transfers cancel` 

dagstore retrieval related

* `./venus-market dagstore list-shards` 
* `./venus-market dagstore initialize-shard <piece cid>` 
* `./venus-market dagstore recover-shard <piece cid>` 
* `./venus-market dagstore gc` 


### Initiate a deal

```shell script
 ./market-client generate-car  <file> <car file>
 ./market-client import <file>
 ./market-client deal
```

### Retrieve a deal

```shell
./market-client retrieve --miner <miner addr> <data-cid> <dst path>
```