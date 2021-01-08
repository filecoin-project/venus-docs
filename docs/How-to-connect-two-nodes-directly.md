# Connecting two nodes directly

This guide is primarily for getting two nodes mining and connected to a swarm on a single machine for local development purposes. Some of the instructions can still apply to connecting to the testnet.

It is optionally possible to modify a copy of [this script](https://github.com/filecoin-project/go-filecoin/blob/master/functional-tests/retrieval), which can be used to set up two local nodes and perform a file store/retrieval.

## Table of contents

- [Initial setup](#initial-setup)
    - [Node one](#node-one)
    - [Node two](#node-two)

## Initial setup

Set the location of the filecoin source (substitute the path with the location of the cloned source tree):

```sh
export GO_FILECOIN_PATH=$HOME/go/src/github.com/filecoin-project/go-filecoin
```

### Node one

1. Initialize `go-filecoin` in the default directory, and use the genesis file from `go-filecoin` source.
	```sh
	go-filecoin init --genesisfile ./fixtures/genesis.car
	```
 	These files will now be in `$HOME/.filecoin`.

2. Run the daemon:
	```sh
	go-filecoin daemon
	```

3. Get the address of Node 1 with `go-filecoin id`:
	```sh
	$ go-filecoin id
    {
	"Addresses": [
		"/ip4/127.0.0.1/tcp/6000/ipfs/QmVk7A2vEBFr9GyKyQ3wvDmTWj8M4H3jubHUDc3CktdoXL",
		"/ip4/172.16.200.201/tcp/6000/ipfs/QmVk7A2vEBFr9GyKyQ3wvDmTWj8M4H3jubHUDc3CktdoXL"
	],
	"ID": "QmVk7A2vEBFr9GyKyQ3wvDmTWj8M4H3jubHUDc3CktdoXL",
	"AgentVersion": "",
	"ProtocolVersion": "",
	"PublicKey": ""
    }
	```

4. For convenience, copy-paste the first address to export as a shell variable:
	```sh
	export NODE1_ADDR=/ip4/127.0.0.1/tcp/6000/ipfs/QmVk7A2vEBFr9GyKyQ3wvDmTWj8M4H3jubHUDc3CktdoXL    
	```

### Node two

  > **NOTICE:** This section includes instructions for two nodes on the **same machine** for development/testing purposes. To connect two separate machines, the `--repodir` flag can be removed from each command, unless a different path than the default filecoin repo directory in $HOME/.filecoin is being used for the configuration.

1. In a new terminal, choose a location for the second node's repository directory and supply its path to the intialization script with the `--repodir` option:

	```sh
	go-filecoin init --genesisfile $GO_FILECOIN_PATH/fixtures/genesis.car --repodir=$HOME/.filecoin2
	```

2. Edit the `config.json` file and change the values for `api.address` and `swarm.address` to be different from the defaults (which are in use by the first node):

	```json
       "api": {                                                                                                                                                            
                "address": "/ip4/127.0.0.1/tcp/3453",                                                                                                                       
                "accessControlAllowOrigin": [//^^^^ change this to a different port/value                                                                                                                              
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
	...                                                                                 

        "swarm": {                                                                                                                                                          
                "address": "/ip4/0.0.0.0/tcp/6000"                                                                                                                          
        },                                 //^^^^ change this to a different port/value                                                   
	...
	```

3. In a new terminal, launch the daemon:

	```sh
	go-filecoin daemon --repodir=$HOME/.filecoin2
	```

4. Fetch the address of node 2:

	```sh
	$ go-filecoin id --repodir=$HOME/.filecoin2
    {
   	"Addresses": [
   		"/ip4/127.0.0.1/tcp/6001/ipfs/QmXcUJ7YoFQEY7w8bpxuFvQtY9VHUkYfx6AZW6Bi2MDFbs",
   		"/ip4/172.16.200.201/tcp/6001/ipfs/QmXcUJ7YoFQEY7w8bpxuFvQtY9VHUkYfx6AZW6Bi2MDFbs"
   	],
   	"ID": "QmXcUJ7YoFQEY7w8bpxuFvQtY9VHUkYfx6AZW6Bi2MDFbs",
   	"AgentVersion": "",
   	"ProtocolVersion": "",
   	"PublicKey": ""
   }
	$ export NODE2_ADDR=/ip4/127.0.0.1/tcp/6001/ipfs/QmXcUJ7YoFQEY7w8bpxuFvQtY9VHUkYfx6AZW6Bi2MDFbs    
	```

5. Connect node 2 to node 1 using the address retrieved for node 1:

	```sh
	go-filecoin swarm connect $NODE1_ADDR --repodir=$HOME/.filecoin2
	```

6. Check your connected peers:

	```sh
	# Peers of node 1
	go-filecoin swarm peers
	/ip4/127.0.0.1/tcp/6001/ipfs/QmXcUJ7YoFQEY7w8bpxuFvQtY9VHUkYfx6AZW6Bi2MDFbs

	# Peers of node 2
	# you can also run commands without specifying --repodir if you set FIL_PATH
	go-filecoin swarm peers --repodir=$HOME/.filecoin2
	/ip4/127.0.0.1/tcp/6000/ipfs/QmVk7A2vEBFr9GyKyQ3wvDmTWj8M4H3jubHUDc3CktdoXL
	```
