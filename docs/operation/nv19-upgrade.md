# Venus nv19 Upgrade Guide

## Precautions

1. Upgrade all Venus products
2. After upgrading, use the `curl` command to call `version` interface to check the version number; Interfaces of each Venus component can be referred [here](https://github.com/filecoin-project/venus/issues/5132)
3. Check Pre/Pro messages on-chain status
4. Check wdPost message on-chain status
5. Check whether the block production is normal
6. Check whether the gas fee related settings are in effect in accordance to configuration

## Components that Need to be Upgraded

component name|tag|commit
---|---|---
venus-auth | v1.11.0 | 0c30588
venus | v1.11.0 | afd3d47
venus-messager | v1.11.0 | e4c4ab4
venus-gateway | v1.11.0 | 877a851
venus-wallet | v1.11.0 | 7afa1eb
venus-miner | v1.11.0 | a30f342
venus-market | v2.7.0 | 61f2cb5
venus-sector-manager | v0.6.0-rc3 | 134b502
venus-worker | no upgrade required | -


### Upgrade order

1. venus-auth
2. Venus
3. venus-gateway
4. venus-messager
5. venus-miner
6. venus-market
7. venus-wallet-pro
8. venus-sector-manager

### venus-auth

Affected function:

- updated way for other components to obtain auth services

Dependency upgrade components: None

Precautions:

- Use "--disable-perm-check" at startup to temporarily disable the feature of auth interface protection
- Before creating a token, you need to create the corresponding user

Note:

- The new version of auth will automatically generate a token named "defaultLocalToken" when it starts, which is used for authentication when auth-cli executes commands


### venus

Affected function: none

Dependency upgrade component: venus-auth

Precautions:

Compilation: first `make dist-clean` and then `make`, this can prevent problems caused by failing to upgrade `filecoin-ffi` normally

**Should use `--auth-token` flag when starting, or modify configuration file `api.venusAuthToken` configuration item**

1. Check whether the vk file is complete after upgrading

2. Check the configuration file after the upgrade; check whether `UpgradeLightningHeight` and `UpgradeThunderHeight` are normal through the log:

     ```
     #cali
     UpgradeLightningHeight: 489094
     UpgradeThunderHeight:489094+3120
     #mainnet
     UpgradeLightningHeight: 2809800
     UpgradeThunderHeight: 2809800 + 2880*21 = 2870280
     ```

3. After the upgrade, check whether the chain is synchronized normally

4. Check the mainnet v11 actors code to make sure it is the same as the output below

```
./venus state actor-cids --network-version 19

# order may vary
Network Version: 19
Actor Version: 11
Actor CIDs
reward bafk2bzacebwjw2vxkobs7r2kwjdqqb42h2kucyuk6flbnyzw4odg5s4mogamo
system bafk2bzaced7npe5mt5nh72jxr2igi2sofoa7gedt4w6kueeke7i3xxugqpjfm
eam bafk2bzaceaelwt4yfsfvsu3pa3miwalsvy3cfkcjvmt4sqoeopsppnrmj2mf2
cron bafk2bzacebpewdvvgt6tk2o2u4rcovdgym67tadiis5usemlbejg7k3kt567o
datacap bafk2bzacebslykoyrb2hm7aacjngqgd5n2wmeii2goadrs5zaya3pvdf6pdnq
ethaccount bafk2bzaceclkmc4yidxc6lgcjpfypbde2eddnevcveo4j5kmh4ek6inqysz2k
evm bafk2bzacediwh6etwzwmb5pivtclpdplewdjzphouwqpppce6opisjv2fjqfe
init bafk2bzaceckwf3w6n2nw6eh77ktmsxqgsvshonvgnyk5q5syyngtetxvasfxg
multisig bafk2bzaceafajceqwg5ybiz7xw6rxammuirkgtuv625gzaehsqfprm4bazjmk
paymentchannel bafk2bzaceb4e6cnsnviegmqvsmoxzncruvhra54piq7bwiqfqevle6oob2gvo
account bafk2bzacealnlr7st6lkwoh6wxpf2hnrlex5sknaopgmkr2tuhg7vmbfy45so
storageminer bafk2bzacec24okjqrp7c7rj3hbrs5ez5apvwah2ruka6haesgfngf37mhk6us
storagepower bafk2bzaceaxgloxuzg35vu7l7tohdgaq2frsfp4ejmuo7tkoxjp5zqrze6sf4
placeholder bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
verified registry bafk2bzacedej3dnr62g2je2abmyjg3xqv4otvh6e26du5fcrhvw7zgcaaez3a
storagemarket bafk2bzaceazu2j2zu4p24tr22btnqzkhzjvyjltlvsagaj6w3syevikeb5d7m
```

5. If not troubleshooting, the rust log level **not recommended** is set to `trace`, because more logs will be printed

6. After the upgrade, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful

7. Actor Migration

**Through testing, the pre-migration time is about 80 seconds, and the mainnet migration time should be about 60 seconds**

     ```
     # The pre-migration height is 120 heights before the upgrade height: 2809800 - 120 = 2809680
     Pre-migration start: STARTING pre-migration end: COMPLETED pre-migration
     migration start: STARTING migration end: COMPLETED migration
     ```

### venus-gateway

Affected function: none

Dependency upgrade component: venus-auth

Precautions:

- When compiling, you need to `make dist-clean` first and then `make`
- When starting, you should use the `--auth-token` flag, or set the configuration item directly in the configuration: `AuthConfig.Token`
- Remove flag: `--disable-address-verify`, **Check if the startup command is still using this flag when upgrading**

### venus-messager

Affected function:

- message replace
- list --block command

Dependency upgrade components: venus, venus-auth, venus-gateway

Precautions:

- When starts for the first time during the upgrade, use the `auth-token` falg, or modify the configuration file `JWTConfig.Token` configuration item first
- After the upgrade, it is necessary to observe whether the message can be received normally and whether the message can be sent to the chain normally


Note:

- The minimum value of the replace fee coefficient has been reduced from 1.25 to 1.11
- When listing blocked messages, `unfill` status messages will now also be listed as blocked messages


### venus-miner

Affected function:

- Added timeout mechanism for selecting message

Dependency upgrade component: auth, venus, gateway

Precautions:

- `[Auth].[Token]` must be configured in the configuration file, and has `admin` permission in venus-auth, do not use the token from `defaultLocalToken`, you need to manually create one.

### venus-market

Affected function:

- Added and adjusted some commands

Dependency upgrade components: auth, venus, gateway, messager

Precautions:

- You must use `cs-token` when starting, or modify the configuration item `AuthNode.Token`

### venus-wallet

Affected function: none

Dependency upgrade component: gateway

Precautions:
- After the upgrade, observe whether the signature is normal and whether the message can be sent to the chain normally
- `wallet new`, `import`, and `export` commands have been removed. The purpose of deletion is to avoid misuse.

### venus-sector-manger

Affected features: fip-0061 wdpost algorithm changes

Dependency upgrade component: Chain Service component

Precautions:

- When compiling, you need to `make dist-clean` first and then `make`

---

Upgrade verification:

1. The program starts normally
2. Pre/Pro messages are on-chained normally
3. Block generation is normal
4. WdPost on-chain is normal
5. Storage power is increasing normally
7. Verified deal retrieval is normal
8. Various gas, life cycle, database and aggregation settings are normal

### Notes on Database Changes

1. [venus-messager added actor configuration and related commands, and adds `actor_cfg` table](https://github.com/filecoin-project/venus/issues/5558)

2. Added index to venus-market `storage_deals` table: `CREATE INDEX idx_cdpprovider_state ON storage_deals(cdp_provider,state)`