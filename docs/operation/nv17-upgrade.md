# nv17 upgrade 

If you are upgrading `venus-wallet` or `venus-gateway` from `v1.6.x` to `v1.8.0`, please read [Venus component v1.7.0 usage notes](https://github.com/filecoin-project/venus/discussions/5265) first and pay attention to the upgrade order of `venus-gateway` and `venus-wallet`.

### timeline

Upgrade time (UTC): 2022-11-30T14:00:00Z
Upgrade time (Beijing): 2022-11-30 22:00:00

### Versions of each component

* [calibrationnet](https://github.com/filecoin-project/venus/discussions/5386#discussioncomment-3893446)
* [mainnet](https://github.com/filecoin-project/venus/discussions/5386#discussioncomment-3893449)

### venus-auth

Affected function:

Dependency: none

Precautions:

1. Add field `open_mining` to `miners` table, 0 means no block, 1 means block, default is 1


### venus

Affected function: nv17 network support

Dependency: None

Precautions:

Compilation: first `make dist-clean` and then `make`, this can prevent problems caused by failing to upgrade `filecoin-ffi`.

1. Check whether the vk file is complete after upgrading

2. Check the configuration file after the upgrade, whether the upgrade height is set correctly, the configuration file is in `~/.venus/config.json` by default:
    ```
    #cali
    "upgradeSkyrHeight": 16800
    #mainnet
    "upgradeSkyrHeight": 2383680
    ```

3. After the upgrade, you need to check whether height is synchronized correctly

4. Check the mainnet `v9 actors code` to make sure it is the same as the output below

    ```
    ./venus state actor-cids --network-version 17

    # order may vary
    Network Version: 17
    Actor Version: 9
    Actor CIDs
    reward bafk2bzacebezgbbmcm2gbcqwisus5fjvpj7hhmu5ubd37phuku3hmkfulxm2o
    system bafk2bzaceagvlo2jtahj7dloshrmwfulrd6e2izqev32qm46eumf754weec6c
    _manifest bafy2bzaceb6j6666h36xnhksu3ww4kxb6e25niayfgkdnifaqi6m6ooc66i6i
    storagemarket bafk2bzacec3j7p6gklk64stax5px3xxd7hdtejaepnd4nw7s2adihde6emkcu
    multisig bafk2bzacec4va3nmugyqjqrs3lqyr2ij67jhjia5frvx7omnh2isha6abxzya
    paymentchannel bafk2bzacebhdvjbjcgupklddfavzef4e4gnkt3xk3rbmgfmk7xhecszhfxeds
    storagepower bafk2bzacedsetphfajgne4qy3vdrpyd6ekcmtfs2zkjut4r34cvnuoqemdrtw
    verifiedregistry bafk2bzacecf3yodlyudzukumehbuabgqljyhjt5ifiv4vetcfohnvsxzynwga
    datacap bafk2bzacebb6uy2ys7tapekmtj7apnjg7oyj4ia5t7tlkvbmwtxwv74lb2pug
    account bafk2bzacect2p7urje3pylrrrjy3tngn6yaih4gtzauuatf2jllk3ksgfiw2y
    cron bafk2bzacebcec3lffmos3nawm5cvwehssxeqwxixoyyfvejy7viszzsxzyu26
    init bafk2bzacebtdq4zyuxk2fzbdkva6kc4mx75mkbfmldplfntayhbl5wkqou33i
    storageminer bafk2bzacedyux5hlrildwutvvjdcsvjtwsoc5xnqdjl73ouiukgklekeuyfl4
    ```

5. If you are not troubleshooting anything, it is **NOT** recommended to set rust log level to `trace` as more irrelavant logs will be printed

6. After the upgrade, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful


### venus-messager

Affected function:

1. Increase the control of basefee, you can set the basefee separately for an address, when the basefee on the chain is higher than the basefee limit, the message will not be pushed out

Dependency upgrade components:

Precautions:

1. After the upgrade, observe whether the message can be on-chained normally


### venus-miner

Affected function:

Dependency upgrade components:

Precautions: 

1. If you are upgrading from `1.7.*` to `v1.8.0`, it will automatically migrate configuration files. Whereas if you are upgrading from `1.6.*` to `v1.8.0`, it is required to have a reinitialization of `repo` (init). Please checkout this [guide](https://github.com/filecoin-project/venus-miner/blob/master/docs/zh/CHANGELOG.md#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9-2) to learn more.

2. Check if blocks can be produced normally after the upgrade.


### venus-gateway

Affected function:

Precautions:

Compile: first `make dist-clean` and then `make`

1. Check wallet after upgrade: `./venus-gateway wallet list`
2. Check miners after upgrade: `./venus-gateway miner list`


### venus-market

Affected function:

Precautions:

Compile: first `make dist-clean` and then `make`

### venus-wallet

Affect function:

Precautions:

1. Make sure to unlock the wallet after startup
2. Check whether the wallet is registered on the gateway