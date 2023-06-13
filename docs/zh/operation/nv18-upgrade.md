## nv18 各组件升级文档

如果 venus 各组件的版本从 `v1.8.x` 升级到 `v1.10.0`，请先阅读 [venus chain-service v1.9.* & venus-market v2.5.* upgrade list / 链服务 v1.9.*和订单服务 v2.5.*升级清单](https://github.com/filecoin-project/venus/discussions/5531)，尤其注意 `venus-auth` 和 `venus-market` 的升级，`venus-auth` 升级前需要为每一个矿工都创建一个用户，`venus-market` 的启动方式和配置有较大变动。

### 时间线

升级时间：2023-03-14T15:14:00Z，北京时间是 2023-03-14 23:14:00

### 各组件版本

* [calibrationnet](https://github.com/filecoin-project/venus/discussions/5649#discussioncomment-4652920)
* [mainnet](https://github.com/filecoin-project/venus/discussions/5649#discussioncomment-4652933)


### venus

影响功能：支持 nv18 网络

依赖升级组件：无

注意事项：

1. 编译：先 `make dist-clean` 再 `make`，这样可以防止未能正常升级 `filecoin-ffi` 而带来的问题

2. 升级后检查 vk 文件是否完整

3. 升级后检查配置文件，通过日志检查 `AllowableClockDriftSecs` `UpgradeHyggeHeight` 和 `UpgradeHyggeHeight` 是否正常 :

    ```
    # cali
    AllowableClockDriftSecs:1
    Eip155ChainID:314159
    UpgradeHyggeHeight:322354
    # mainnet
    AllowableClockDriftSecs:1
    Eip155ChainID:314
    UpgradeHyggeHeight:2683348
    ```

4. 升级后需检查是否正常同步区块

5. 检查主网 v10 actors code，确保与下面输出一样

    ```
    ./venus state actor-cids --network-version 18

    # 顺序可能会不一样
    Network Version: 18
    Actor Version: 10
    Actor             CID                                                             
    datacap           bafk2bzacealj5uk7wixhvk7l5tnredtelralwnceafqq34nb2lbylhtuyo64u  
    evm               bafk2bzaceahmzdxhqsm7cu2mexusjp6frm7r4kdesvti3etv5evfqboos2j4g  
    init              bafk2bzaced2f5rhir3hbpqbz5ght7ohv2kgj42g5ykxrypuo2opxsup3ykwl6  
    account           bafk2bzaceampw4romta75hyz5p4cqriypmpbgnkxncgxgqn6zptv5lsp2w2bo  
    ethaccount        bafk2bzaceaqoc5zakbhjxn3jljc4lxnthllzunhdor7sxhwgmskvc6drqc3fa  
    multisig          bafk2bzaceduf3hayh63jnl4z2knxv7cnrdenoubni22fxersc4octlwpxpmy4  
    paymentchannel    bafk2bzaceartlg4mrbwgzcwric6mtvyawpbgx2xclo2vj27nna57nxynf3pgc  
    reward            bafk2bzacebnhtaejfjtzymyfmbdrfmo7vgj3zsof6zlucbmkhrvcuotw5dxpq  
    storagemarket     bafk2bzaceclejwjtpu2dhw3qbx6ow7b4pmhwa7ocrbbiqwp36sq5yeg6jz2bc  
    storageminer      bafk2bzaced4h7noksockro7glnssz2jnmo2rpzd7dvnmfs4p24zx3h6gtx47s  
    verifiedregistry  bafk2bzacedfel6edzqpe5oujno7fog4i526go4dtcs6vwrdtbpy2xq6htvcg6  
    eam               bafk2bzacedrpm5gbleh4xkyo2jvs7p5g6f34soa6dpv7ashcdgy676snsum6g  
    placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro  
    storagepower      bafk2bzacec4ay4crzo73ypmh7o3fjendhbqrxake46bprabw67fvwjz5q6ixq  
    system            bafk2bzacedakk5nofebyup4m7nvx6djksfwhnxzrfuq4oyemhpl4lllaikr64  
    cron              bafk2bzacedcbtsifegiu432m5tysjzkxkmoczxscb6hqpmrr6img7xzdbbs2g
    ```

6. 若不排查问题，rust 日志级别**不建议**设置为 `trace`，因为会打印较多日志

7. 升级后可以通过命令来 `./venus state get-actor t01000` 来确认是否升级成功

8. actor 迁移

    ```
    预迁移高度是升级高度前 60 个高度：2683288
    pre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration
    migration      开始：STARTING migration      结束：COMPLETED migration
    ```

9. 配置变更

    ``` json
    # 增加 fevm 相关配置，其中 enableEthRPC 字段用来控制是否启用 ETH RPC，默认是 false
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

    # 增加 allowableClockDriftSecs 字段，默认是 1
    "parameters": {
        "allowableClockDriftSecs": 1
    },
    ```


### venus-auth

影响功能：

依赖升级组件：无

注意事项：

1. 命令行能否正常使用


### venus-messager

功能：

1. 补充对接口权限的验证

依赖升级组件：

注意事项：

1. 升级后观察能够正常收消息

2. 升级后观察消息能否正常上链

3. `ReplacedMsg` 更名为 `NonceConflictMsg`


### venus-miner

影响功能：

依赖升级组件：

注意事项：

1. 升级后能否正常出块


### venus-gateway

影响功能：

注意事项：

编译：先 `make dist-clean` 再 `make`

1. 升级后检查钱包：`./venus-gateway wallet list`
2. 升级后检查矿工：`./venus-gateway miner list`


### venus-market

影响功能：

注意事项：

编译：先 `make dist-clean` 再 `make`


### venus-wallet

影响功能：

注意事项：

1. 启动后需要解锁钱包
2. 是否注册到 gateway

### venus-sector-manager
编译：先 `make dist-clean` 再 `make`