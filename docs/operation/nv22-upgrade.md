# Venus Stack nv22 Upgrade Guide (WIP)

## Precautions

1. Upgrade all Venus products / components
2. Use the `curl` command to call the `Version` interface to check the version number after upgrading. Refer to the guide [here](https://github.com/filecoin-project/venus/issues/5132) for details.
3. Check if pre/pro messages are on-chained
4. Check if windowPost messages are on-chained
5. Check if block producing is working correctly
6. Check if the gas fee related settings are in effect


## Products / Components to be Upgraded

Component name|tag|commit
---|---|---
sophon-auth | v1.15.0 | a1e964b
venus | v1.15.1 | 81c99f3
sophon-co | v0.8.0 | 0e48712
sophon-messager | v1.15.0 | 1e4f0d5
soohon-gateway | v1.15.0 | 541891a
venus-wallet | v1.15.0 | 6b3de34
sophon-miner | v1.15.0 | 8dd6c68
droplet | v2.11.0 | 44481dd
damocles-manager | v0.10.0-rc1 | 2f6c5f9
damocles-worker | v0.10.0-rc1 | 2f6c5f9

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

- Is authentication working normally after startup?

### Venus

Affected functions: 

- None

Upgrade Dependency: 

- sophon-auth

Precautions:

Compile: First `make dist-clean` and then `make`, this can prevent problems caused by failure to upgrade `filecoin-ffi` properly.


1. Check if the vk file is complete after upgrading

2. After the upgrade, execute the command `./venus state network-info`, and then check whether the UpgradeDragonHeight is normal through the log:

     ```
     #cali
     UpgradeDragonHeight: 1427974
     #mainnet
     UpgradeDragonHeight: 3855360
     ```

3. After the upgrade, you need to check if the blocks are synchronized normally.

4. Check the mainnet v13 actors code and make sure it is the same as the output below

     ```
     ./venus state actor-cids --network-version 22

     # The order may be different
     Network Version: 22
     Actor Version: 13
     Manifest CID: bafy2bzacecdhvfmtirtojwhw2tyciu4jkbpsbk5g53oe24br27oy62sn4dc4e
     Actor CID
     account bafk2bzacedxnbtlsqdk76fsfmnhyvsblwyfducerwwtp3mqtx2wbrvs5idl52
     cron bafk2bzacebbopddyn5csb3fsuhh2an4ttd23x6qnwixgohlirj5ahtcudphyc
     datacap bafk2bzaceah42tfnhd7xnztawgf46gbvc3m2gudoxshlba2ucmmo2vy67t7ci
     eam bafk2bzaceb23bhvvcjsth7cn7vp3gbaphrutsaz7v6hkls3ogotzs4bnhm4mk
     ethaccount bafk2bzaceautge6zhuy6jbj3uldwoxwhpywuon6z3xfvmdbzpbdribc6zzmei
     evm bafk2bzacedq6v2lyuhgywhlllwmudfj2zufzcauxcsvvd34m2ek5xr55mvh2q
     init bafk2bzacedr4xacm3fts4vilyeiacjr2hpmwzclyzulbdo24lrfxbtau2wbai
     multisig bafk2bzacecr5zqarfqak42xqcfeulsxlavcltawsx2fvc7zsjtby6ti4b3wqc
     paymentchannel bafk2bzacebntdhfmyc24e7tm52ggx5tnw4i3hrr3jmllsepv3mibez4hywsa2
     placeholder bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
     reward bafk2bzacedq4q2kwkruu4xm7rkyygumlbw2yt4nimna2ivea4qarvtkohnuwu
     storagemarket bafk2bzacebjtoltdviyznpj34hh5qp6u257jnnbjole5rhqfixm7ug3epvrfu
     storageminer bafk2bzacebf4rrqyk7gcfggggul6nfpzay7f2ordnkwm7z2wcf4mq6r7i77t2
     storagepower bafk2bzacecjy4dkulvxppg3ocbmeixe2wgg6yxoyjxrm4ko2fm3uhpvfvam6e
     system bafk2bzacecyf523quuq2kdjfdvyty446z2ounmamtgtgeqnr3ynlu5cqrlt6e
     verifiedregistry bafk2bzacedkxehp7y7iyukbcje3wbpqcvufisos6exatkanyrbotoecdkrbta
     ```

5. If you are not troubleshooting the system, it is not recommended to set the rust log level to `trace` because more logs will be printed.

6. After the upgrade, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful.

7. actor migration

     **After testing, the pre-migration time is about 30 minutes, and the main migration time is about 100 seconds**

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

### droplet

Affected functions:

- Direct data onboarding support; Documentation [here](https://github.com/ipfs-force-community/droplet/blob/master/docs/zh/direct-on-boarding.md)


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

Upgrade result verification steps:

1. Check if the program starts normally
2. Check if pre / pro messages are uploaded normally
3. Check if block producing is normal
4. Check if windowPost is normal
5. Check if storage power grows normally
7. Check if verified deal retrieval is normal
8. Check if various gas, sector life cycle, and aggregation settings in the database are normal.


### Database changes

1. The droplet adds the `direct_deals` table to store DD
O deals.
