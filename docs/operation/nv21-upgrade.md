# Venus nv21 Upgrade Guide

## Precautions

1. Be sure to upgrade all Venus products
2. After upgrading, please use the `curl` command to call the `Version` API to check the version number. Details of each Venus products' version interface can be found [here](https://github.com/filecoin-project/venus/issues/5132).
3. Monitor proper on-chain of pre and prove messages 
4. Monitor proper on-chain of window post messages
5. Monitor block producing 
6. Check whether the gas fee related settings are in effect


## Products Upgrade Guide

Product | tag | commit
---|---|---
sophon-auth | v1.14.0 | 7caadbc
venus | v1.14.0 | 45058a7
sophon-messager | v1.14.0 | e5f8371
soohon-gateway | v1.14.0 | 1adf038
venus-wallet | v1.14.0 |  b478cd0
sophon-miner | v1.14.0 |  9ca976c
droplet | v2.10.0 |  6daf168
damocles-manager |  v0.9.0 | 9f87e20
damocles-worker | v0.9.0 | 9f87e20


### Recommended Upgrade Sequence

1. sophon-auth
2. venus
3. soohon-gateway
4. sophon-messager
5. sophon-miner
6. droplet
7. venus-wallet
8. damocles-manager
9.damocles-worker


### sophon-auth

Affected functions:

- Affecting how other Venus products are authorized to use the sophon service

Dependency: 

- None

Precautions:

- Check if authentication is normal after startup


### venus

Affected functions: 

- None

Dependency: 

- sophon-auth

Precautions:

:::tip
Compile: First `make dist-clean` and then `make`, this can prevent problems caused by failure to upgrade `filecoin-ffi` properly

**If `~/.venus` exists and you need to import a snapshot, you need to delete the `~/.venus/version` file first before importing the snapshot**
:::

1. Check whether the vk file is complete after upgrading

2. After the upgrade, execute the command `./venus state network-info`, and then check whether the `UpgradeWatermelonHeight` is normal through the log:

     ```
     #cali
     UpgradeWatermelonHeight: 1013134
     #mainnet
     UpgradeWatermelonHeight: 3469380
     ```

3. After the upgrade, you need to check whether the block height is synchronized normally.

4. Check the mainnet `v12 actors` code and make sure it is the same as the output below

     ```
     ./venus state actor-cids --network-version 21

     # Ordering may be different
     Network Version: 21
    Actor Version: 12
    Actor             CID
    datacap           bafk2bzacebpiwb2ml4qbnnaayxumtk43ryhc63exdgnhivy3hwgmzemawsmpq
    ethaccount        bafk2bzaceb4gkau2vgsijcxpfuq33bd7w3efr2rrhxrwiacjmns2ntdiamswq
    reward            bafk2bzacealqnxn5lwzwexd6reav4dppypquklx2ujlnvaxiqk2tzstyvkp5u
    verifiedregistry  bafk2bzacedudgflxc75c77c6zkmfyq4u2xuk7k6xw6dfdccarjrvxx453b77q
    eam               bafk2bzaceb3elj4hfbbjp7g5bptc7su7mptszl4nlqfedilxvstjo5ungm6oe
    multisig          bafk2bzacecw5lyp3n3t67xdwrmo36h4z7afc3lobmmr6wg55w6yjzg5jhmh42
    storagemarket     bafk2bzacedylkg5am446lcuih4voyzdn4yjeqfsxfzh5b6mcuhx4mok5ph5c4
    system            bafk2bzacebfqrja2hip7esf4eafxjmu6xcogoqu5xxtgdg7xa5szgvvdguchu
    account           bafk2bzaceboftg75mdiba7xbo2i3uvgtca4brhnr3u5ptihonixgpnrvhpxoa
    cron              bafk2bzacechxjkfe2cehx4s7skj3wzfpzf7zolds64khrrrs66bhazsemktls
    placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
    storagepower      bafk2bzacecsij5tpfzjpfuckxvccv2p3bdqjklkrfyyoei6lx5dyj5j4fvjm6
    evm               bafk2bzacecmnyfiwb52tkbwmm2dsd7ysi3nvuxl3lmspy7pl26wxj4zj7w4wi
    init              bafk2bzacebllyegx5r6lggf6ymyetbp7amacwpuxakhtjvjtvoy2bfkzk3vms
    paymentchannel    bafk2bzacectv4cm47bnhga5febf3lo3fq47g72kmmp2xd5s6tcxz7hiqdywa4
    storageminer      bafk2bzacedo75pabe4i2l3hvhtsjmijrcytd2y76xwe573uku25fi7sugqld6
     ```

5. If there is no problem troubleshoot, it is not recommended to set the rust log level to `trace` because more logs will be printed.

6. After the upgrade, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful.

7. actor migration

:::tip
**After testing, the pre-migration time is about 20 to 30 minutes, and the actual migration time is about 70 seconds**

     ```
     The pre-migration height is the 120 heights before the upgrade height:
     pre-migration start: STARTING pre-migration end: COMPLETED pre-migration
     migration starts: STARTING migration ends: COMPLETED migration
     ```
:::

### sophon-gateway

Functions affected: 

- None

Dependency: 

- sophon-auth

Precautions:

- When compiling, you need to first `make dist-clean` and then `make`


### sophon-messager

Affected functions:

- None

Dependency: 

- venus
- sophon-auth
- sophon-gateway

Precautions:

- After the upgrade, monitor whether the messages can be received normally and whether the messages can be  on-chained normally.


### sophon-miner

Affect functions:

Dependency: 

- auth
- venus
- gateway

Precautions:

- `[Auth].[Token]` in the configuration file must be configured, and the token must be created with admin permission from sophon-auth. It is recommended that one does not use the token from `defaultLocalToken`, one should create one manually.


### Droplet

Affected functions:

- Support v2 version of storage deal protocol
- Support offline computation of commP


Dependency: 

- auth
- venus
- gateway
- messager

Precautions:

- Monitor deals and retrievals

### venus-wallet

Affected functions:

- None

Dependency: 

- gateway

Precautions:

- After the upgrade, monitor whether the signature is normal and whether the message can be on-chained normally.


### damocles-manager

Dependency: 

- Sophon service

Precautions:

- When compiling, you need to first `make dist-clean` and then `make`

### damocles-worker

Dependency: 

- damocles-manager

Precautions:

- The new proof type `SyntheticPoRep` uses a new proof parameter file. If `SyntheticPoRep` is enabled, it is best to prepare new proof parameters in advance. **Failing to do so may cause SyntheticPoRep deadlock**.

---

Upgrade result verification steps:

1. Check if program starts normally
2. Check if Pre & prove messages are on-chained normally
3. Check if block producing is normal
4. Check if window post is normal
5. Check if storage power grows normally
7. Check if storage deal retrieval is normal
8. Check if various gas, life cycle, and aggregation settings of the database are normal.

### Database changes

1. Add `id` field to droplet `storage_deals` table  ==> `ALTER TABLE storage_deals ADD id varchar(128)`