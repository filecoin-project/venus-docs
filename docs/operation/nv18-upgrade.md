# nv18 Upgrade Guide

If you are upgrading chain service components from `v1.8.x` to `v1.10.0`, please read [venus chain-service v1.9.* & venus-market v2.5.* upgrade list / 链服务 v1.9.*和订单服务 v2.5.*升级清单](https://github.com/filecoin-project/venus/discussions/5531) first and pay special attention to the upgrade of `venus-auth` and `venus-market`. Before upgrading `venus-auth`, a user account needs to be created for each miner. Also startup CLI and configurations of `venus-market` major breaking changes made to it.

## About nv18 upgrade

We storngly encourage you to test out the upgrade in calibration before mainnet.

### Upgrade Timeline

Upgrade UTC time: 2023-03-14T15:14:00Z, which is 2023-03-14 23:14:00 in Beijing time

### nv18 compatible versions

* [calibrationnet](https://github.com/filecoin-project/venus/discussions/5649#discussioncomment-4652920)
* [mainnet](https://github.com/filecoin-project/venus/discussions/5649#discussioncomment-4652933)

## venus

Feature: support nv18 network

Dependency: None

Precautions:

1. Compile: make sure to first `make dist-clean` and then `make`. This can prevent problems caused by failing to upgrade `filecoin-ffi` normally

2. Check whether the vk file is complete after upgrading

3. After upgrading, check the configuration file. And see whether `AllowableClockDriftSecs`, `UpgradeHyggeHeight` and `UpgradeHyggeHeight` are normal in the log:

     ```
     #cali
     AllowableClockDriftSecs: 1
     Eip155ChainID:314159
     UpgradeHyggeHeight: 322354
     #mainnet
     AllowableClockDriftSecs: 1
     Eip155ChainID:314
     UpgradeHyggeHeight: 2683348
     ```

4. After upgrading, check the status of block synchronization

5. Check the mainnet v10 actors CID and make sure it is the same as the output below...

     ```
     ./venus state actor-cids --network-version 18

     # order may vary
     Network Version: 18
     Actor Version: 10
     Actor CIDs
     datacap bafk2bzacealj5uk7wixhvk7l5tnredtelralwnceafqq34nb2lbylhtuyo64u
     evm bafk2bzaceahmzdxhqsm7cu2mexusjp6frm7r4kdesvti3etv5evfqboos2j4g
     init bafk2bzaced2f5rhir3hbpqbz5ght7ohv2kgj42g5ykxrypuo2opxsup3ykwl6
     account bafk2bzaceampw4romta75hyz5p4cqriypmpbgnkxncgxgqn6zptv5lsp2w2bo
     ethaccount bafk2bzaceaqoc5zakbhjxn3jljc4lxnthllzunhdor7sxhwgmskvc6drqc3fa
     multisig bafk2bzaceduf3hayh63jnl4z2knxv7cnrdenoubni22fxersc4octlwpxpmy4
     paymentchannel bafk2bzaceartlg4mrbwgzcwric6mtvyawpbgx2xclo2vj27nna57nxynf3pgc
     reward bafk2bzacebnhtaejfjtzymyfmbdrfmo7vgj3zsof6zlucbmkhrvcuotw5dxpq
     storagemarket bafk2bzaceclejwjtpu2dhw3qbx6ow7b4pmhwa7ocrbbiqwp36sq5yeg6jz2bc
     storageminer bafk2bzaced4h7noksockro7glnssz2jnmo2rpzd7dvnmfs4p24zx3h6gtx47s
     verifiedregistry bafk2bzacedfel6edzqpe5oujno7fog4i526go4dtcs6vwrdtbpy2xq6htvcg6
     eam bafk2bzacedrpm5gbleh4xkyo2jvs7p5g6f34soa6dpv7ashcdgy676snsum6g
     placeholder bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
     storagepower bafk2bzacec4ay4crzo73ypmh7o3fjendhbqrxake46bprabw67fvwjz5q6ixq
     system bafk2bzacedakk5nofebyup4m7nvx6djksfwhnxzrfuq4oyemhpl4lllaikr64
     cron bafk2bzacedcbtsifegiu432m5tysjzkxkmoczxscb6hqpmrr6img7xzdbbs2g
     ```

6. When not debugging, it is **not recommended** is set the rust log level to `trace` as too much logs may be printed

7. After upgrading, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful

8. Actor Migration

     ```
     The pre-migration height is 60 epoch before the upgrade epoch of 2683288
     Pre-migration start: STARTING pre-migration end: COMPLETED pre-migration
     migration started: STARTING migration ended: COMPLETED migration
     ```

9. Configuration changes

     ```json
     # Added fevm related configuration, where the enableEthRPC field is used to control whether to enable ETH RPC, the default is false
     "fevm": {
         "enableEthRPC": false,
         "ethTxHashMappingLifetimeDays": 0,
         "event": {
                 "enableRealTimeFilterAPI": false,
                 "enableHistoricFilterAPI": false,
                 "filterTTL": "24h0m0s",
                 "maxFilters": 100,
                 "maxFilterResults": 10000,
                 "maxFilterHeightRange": 2880,
                 "databasePath": ""
         }
     }

     # Added allowableClockDriftSecs field, default is 1
     "parameters": {
         "allowableClockDriftSecs": 1
     },
     ```


## venus-auth

Feature:

Dependency: none

Precautions:

1. Check whether the command line can be used correctly


## venus-messager

Function:

1. Added additional interface authentication

Dependency:

Precautions:

1. Observe if messages can be received normally after upgrading

2. After upgrading, observe whether the message can be on-chained properly

3. `ReplacedMsg` is renamed to `NonceConflictMsg`


## venus-miner

Feature:

Dependency:

Precautions: 

1. Check if block be produced properly after upgrading


## venus-gateway

Feature:

Precautions:

1. Compile: first `make dist-clean` and then `make`

2. Check remote wallet after upgrading: `./venus-gateway wallet list`

3. Check miners after upgrading: `./venus-gateway miner list`


## venus-market

Feature:

Precautions:

1. Compile: first `make dist-clean` and then `make`


## venus-wallet

Feature:

Precautions:

1. Need to unlock the wallet after restart

2. Check if wallet is properly registered to the gateway

## venus-sector-manager

Compile: first `make dist-clean` and then `make`