# Venus Stack nv23 Upgrade Guide

## Precautions

1. Upgrade all Venus products / components
2. Use the `curl` command to call the `Version` interface to check the version number after upgrading. Refer to the guide [here](https://github.com/filecoin-project/venus/issues/5132) for details.
3. Check if pre/pro messages are on-chained
4. Check if windowPost messages are on-chained
5. Check if block producing is working correctly
6. Check if the gas fee related settings are in effect


#### It is recommended not to perform sealing tasks before upgrading. If p2 messages are on-chain but c2 messages are not on-chain before upgrading, an error will be reported when c2 messages are on-chain after upgrading.

## Products / Components to be Upgraded

Component name|tag|commit
---|---|---
sophon-auth | v1.16.0 | e2340d5
venus | v1.16.0 |  3fdb199
sophon-co | v0.9.0 | 0f344ed
sophon-messager | v1.16.0 | f695806
soohon-gateway | v1.16.0 | 2d32b8e
venus-wallet | v1.16.0 | 48b1e02
sophon-miner | v1.16.0 | 500c186
droplet | v2.12.0 | deec963
damocles-manager | v0.11.0 | 7d06bd4
damocles-worker | v0.11.0 | 7d06bd4

### Upgrade Sequence

1. sophon-auth
2. venus
3. soohon-co
4. soohon-gateway
5. sophon-messager
6. sophon-miner
7. droplet
8. venus-wallet
9. damocles-manager
10. damocles-worker


### sophon-auth

Affected functions:

- Aquiring auth services from other components

Upgrade Dependency:  

- None

Precautions:

- Check if authentication working normally after startup.

### Venus

Affected functions: 

- None

Upgrade Dependency: 

- sophon-auth

Precautions:

Compile: First `make dist-clean` and then `make`, this can prevent problems caused by failure to upgrade `filecoin-ffi` properly.


1. Check if the vk file is complete after upgrading

2. After the upgrade, execute the command `./venus state network-info`, and then check whether the UpgradeWaffleHeight is normal through the log:

     ```
     #cali
     UpgradeWaffleHeight: 1779094
     #mainnet
     UpgradeWaffleHeight: 4154640
     ```

3. After the upgrade, you need to check if the blocks are synchronized normally.

4. Check the mainnet v14 actors code and make sure it is the same as the output below

     ```
     ./venus state actor-cids --network-version 23

     # The order may be different
     Network Version: 23
    Actor Version: 14
    Manifest CID: bafy2bzacecbueuzsropvqawsri27owo7isa5gp2qtluhrfsto2qg7wpgxnkba
    Actor             CID
    account           bafk2bzacebr7ik7lng7vysm754mu5x7sakphwm4soqi6zwbox4ukpd6ndwvqy
    cron              bafk2bzacecwn6eiwa7ysimmk6i57i5whj4cqzwijx3xdlxwb5canmweaez6xc
    datacap           bafk2bzacecidw7ajvtjhmygqs2yxhmuybyvtwp25dxpblvdxxo7u4gqfzirjg
    eam               bafk2bzaced2cxnfwngpcubg63h7zk4y5hjwwuhfjxrh43xozax2u6u2woweju
    ethaccount        bafk2bzacechu4u7asol5mpcsr6fo6jeaeltvayj5bllupyiux7tcynsxby7ko
    evm               bafk2bzacedupohbgwrcw5ztbbsvrpqyybnokr4ylegmk7hrbt3ueeykua6zxw
    init              bafk2bzacecbbcshenkb6z2v4irsudv7tyklfgphhizhghix6ke5gpl4r5f2b6
    multisig          bafk2bzaceajcmsngu3f2chk2y7nanlen5xlftzatytzm6hxwiiw5i5nz36bfc
    paymentchannel    bafk2bzaceavslp27u3f4zwjq45rlg6assj6cqod7r5f6wfwkptlpi6j4qkmne
    placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
    reward            bafk2bzacedvfnjittwrkhoar6n5xrykowg2e6rpur4poh2m572f7m7evyx4lc
    storagemarket     bafk2bzaceaju5wobednmornvdqcyi6khkvdttkru4dqduqicrdmohlwfddwhg
    storageminer      bafk2bzacea3f43rxzemmakjpktq2ukayngean3oo2de5cdxlg2wsyn53wmepc
    storagepower      bafk2bzacedo6scxizooytn53wjwg2ooiawnj4fsoylcadnp7mhgzluuckjl42
    system            bafk2bzacecak4ow7tmauku42s3u2yydonk4hx6ov6ov542hy7lcbji3nhrrhs
    verifiedregistry  bafk2bzacebvyzjzmvmjvpypphqsumpy6rzxuugnehgum7grc6sv3yqxzrshb4
     ```

5. If you are not troubleshooting the system, it is not recommended to set the rust log level to `trace` because more logs will be printed.

6. After the upgrade, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful.

7. actor migration

     **After testing, the pre-migration time is about 1 minutes, and the main migration time is about 50 seconds**

     ```
     The pre-migration height is 120 heights before the upgrade height:
     pre-migration start: STARTING pre-migration end: COMPLETED pre-migration
     migration starts: STARTING migration ends: COMPLETED migration
     ```
8. If `~/.venus` exists and you need to import a snapshot, you need to delete the `~/.venus/version` file first and then import the snapshot.

     * Mainnet: `./venus daemon --import-snapshot snapshot.car`
     * calibnet: `./venus daemon --import-snapshot snapshot.car --network calibrationnet`


### sophon-gateway

Affected functions: 

- None

Upgrade Dependency: 

- sophon-auth

Precautions:

- When compiling, you need to first `make dist-clean` and then `make`


### sophon-messager

Affected functions:

- None

Upgrade Dependency:  

- venus
- sophon-auth 
- sophon-gateway

Precautions:

- After the upgrade, you need to observe whether the messages can be received normally and whether the messages can be on-chained normally.


### sophon-miner

Affected functions:

- None

Upgrade Dependency: 

- auth
- venus
- gateway

Precautions:
- None

### droplet

Affected functions:

- None

Upgrade Dependency:  

- auth
- venus
- gateway
- messager

Precautions:

- Check if deals and retrieval can be issued normally after the upgrade?

### venus-wallet

Affected functions:

- None

Upgrade Dependency: 

- gateway

Precautions:

- After the upgrade, observe whether the signing is normal and whether the message can be on-chained normally.


### damocles-manager

Upgrade Dependency:

- Sophon service

Precautions:

- When compiling, you need to first `make dist-clean` and then `make`

### damocles-worker

Upgrade Dependency: 

- damocles-manager

Precautions:
- None

Upgrade result verification steps:

1. Check if the program starts normally
2. Check if pre / pro messages are uploaded normally
3. Check if block producing is normal
4. Check if windowPost is normal
5. Check if storage power grows normally
7. Check if verified deal retrieval is normal
8. Check if various gas, sector life cycle, and aggregation settings in the database are normal.


### Database changes

- None
