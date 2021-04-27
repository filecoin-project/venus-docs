# How to start a test network

This document takes building a 2k private network as an example.

## Necessary environment

Based on CentOS 7.* :
```
yum install epel-release -y
yum install ocl-icd-devel -y
yum install opencl-headers -y
yum install hwloc
yum install jq -y 
```
During the process, there is a prompt to install any components.

Software: venus-wallet,venus,venus-sealer,venus-miner, genesis nodes and ordinary nodes share services: venus,venus-wallet,venus-miner.

## Wallet service

1. Start
    
    ```sh
    ./venus-wallet run
    ```
   
2. Set password

    ```sh
    # Only need to be set once
    ./venus-wallet set-password <password>
    # Unlock the wallet and release private key, need to be executed every restart
    ./venus-wallet unlock [--] [<password>]
    # List
    ./venus-wallet list,ls
    ```    

## Generating node

1. Generate pre-seal files and data
   
    ```sh
        ./venus seed pre-seal --sector-size 2048 --num-sectors 2
        ./venus seed genesis new localnet.json
        ./venus seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json
    ```

2. Start daemon
   
   ```sh
        ./venus daemon --make-genesis=devgen.car --genesis-template=localnet.json --network=2k
        # Set wallet password
        ./venus wallet set-password <password>
        ./venus wallet import ~/.genesis-sectors/pre-seal-t01000.key
        # After restarting the deamon, you need to unlock the wallet
        ./venus wallet unlock [--] [<password>]
   ```
   
3. Signature use venus-wallet
    ```sh
        # Import wallet to venus-wallet
        ./venus wallet export <addr>
        ./venus-wallet import - import keys
        # Get token with API info required to connect to venus-wallet
        ./venus-wallet auth api-info --perm=admin
        # Modify venus configuration: [walletModule]
        ./venus config walletModule.remoteEnable true
        ./venus config walletModule.remoteBackend <api-info> 
   ```
   Please restart the venus service after everything is configured.
   
4. Initialize miner
   
    ```sh
        # init sealer
        ./venus-sealer init --genesis-miner --actor=t01000 --sector-size=2048 --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync --network=2k
        # init miner, one program can be responsible for mining of multiple miners (joint mining)
        ./venus-miner init
   ```
5. Start service of Genesis Miners

    ```sh
        # Start the sealing service
        ./venus-sealer run --nosync
        # Start the mining service
        ./venus-miner run --nosync
        # get venus-wallet rpc api & token
        ./venus-wallet auth api-info --perm=admin -> [WALLET-TOKEN:WALLET-API]
        # Add the miner, start mining
        cat .venussealer/api  -> SEALER-API
        cat .venussealer/token -> SEALER-TOKEN  
       ./venus-miner address add --addr=<t01000> --sealer-listen-api=<SEALER-API> --sealer-token=<SEALER-TOKEN> --wallet-token=<WALLET-TOKEN> --wallet-listen-api=<WALLET-API>
        # miner list
        ./venus-miner address list
    ```

## Start venus normal node

1. Create wallet
    ```sh
        ./venus-wallet new bls
    ```
    
2. Copy the ~/.venus/api & token
   Copy the api and token files to the current user root directory, modify the [ip] in the api file to the [ip] of the venus node:
   /ip4/[ip]/tcp/3453

## Generate normal miner

1. Send
    
    ```sh
        ./venus send $WALLET_T3_ADDR --value=[value] --from=[FROM_WALLET_ADDR]
        ./venus wallet balance $WALLET_T3_ADDR
    ```

2. Create miner
    ```sh
        ./venus-sealer init --owner=$WALLET_T3_ADDR --worker=$WALLET_T3_ADDR --sector-size=2048 --nosync
    ```

## Start service of normal node

   ```sh
        # start sealing service
        ./venus-sealer run --nosync
        # seal once
        ./venus-sealer sectors pledge
        # start mining service, execute commands on the started miner node
        cat .venussealer/api  -> SEALER01-API
        cat .venussealer/token -> SEALER01-TOKEN  
        ./venus-miner address add --addr=<miner addr> --sealer-listen-api=<SEALER01-API> --sealer-token=<SEALER01-TOKEN> --wallet-token=<WALLET-TOKEN> --wallet-listen-api=<WALLET-API>
   ```
