# nv17 各组件升级文档

如果 `venus-wallet` 或者 `venus-gateway` 的版本从 `v1.6.x` 升级到 `v1.8.0`，请先阅读 [Venus 组件 v1.7.0 使用注意事项 ](https://github.com/filecoin-project/venus/discussions/5265)，注意 `venus-gateway` 和 `venus-wallet`的升级顺序。

### 时间线

升级时间：2022-11-30T14:00:00Z，北京时间是 2022-11-30 22:00:00

### 各组件版本

* [calibrationnet](https://github.com/filecoin-project/venus/discussions/5386#discussioncomment-3893446)
* [mainnet](https://github.com/filecoin-project/venus/discussions/5386#discussioncomment-3893449)

### venus-auth

影响功能：

依赖升级组件：无

注意事项：

1. `miners` 表增加字段 `open_mining`，0 表示不出块，1 表示出块，默认是 1


### venus

影响功能：支持 nv17 网络

依赖升级组件：无

注意事项：

编译：先 `make dist-clean` 再 `make`，这样可以防止未能正常升级 `filecoin-ffi` 而带来的问题

1. 升级后检查 vk 文件是否完整

2. 升级后检查配置文件，升级高度是否正常设置，配置文件默认在 `~/.venus/config.json` :
    ```
    # cali
    "upgradeSkyrHeight": 16800
    # mainnet
    "upgradeSkyrHeight": 2383680
    ```

3. 升级后需检查是否正常同步区块

4. 检查主网 v9 actors code，确保与下面输出一样

    ```
    ./venus state actor-cids --network-version 17

    # 顺序可能会不一样
    Network Version: 17
    Actor Version: 9
    Actor             CID
    reward            bafk2bzacebezgbbmcm2gbcqwisus5fjvpj7hhmu5ubd37phuku3hmkfulxm2o
    system            bafk2bzaceagvlo2jtahj7dloshrmwfulrd6e2izqev32qm46eumf754weec6c
    _manifest         bafy2bzaceb6j6666h36xnhksu3ww4kxb6e25niayfgkdnifaqi6m6ooc66i6i
    storagemarket     bafk2bzacec3j7p6gklk64stax5px3xxd7hdtejaepnd4nw7s2adihde6emkcu
    multisig          bafk2bzacec4va3nmugyqjqrs3lqyr2ij67jhjia5frvx7omnh2isha6abxzya
    paymentchannel    bafk2bzacebhdvjbjcgupklddfavzef4e4gnkt3xk3rbmgfmk7xhecszhfxeds
    storagepower      bafk2bzacedsetphfajgne4qy3vdrpyd6ekcmtfs2zkjut4r34cvnuoqemdrtw
    verifiedregistry  bafk2bzacecf3yodlyudzukumehbuabgqljyhjt5ifiv4vetcfohnvsxzynwga
    datacap           bafk2bzacebb6uy2ys7tapekmtj7apnjg7oyj4ia5t7tlkvbmwtxwv74lb2pug
    account           bafk2bzacect2p7urje3pylrrrjy3tngn6yaih4gtzauuatf2jllk3ksgfiw2y
    cron              bafk2bzacebcec3lffmos3nawm5cvwehssxeqwxixoyyfvejy7viszzsxzyu26
    init              bafk2bzacebtdq4zyuxk2fzbdkva6kc4mx75mkbfmldplfntayhbl5wkqou33i
    storageminer      bafk2bzacedyux5hlrildwutvvjdcsvjtwsoc5xnqdjl73ouiukgklekeuyfl4
    ```

5. 若不排查问题，rust 日志级别**不建议**设置为 `trace`，因为会打印较多日志

6. 升级后可以通过命令来 `./venus state get-actor t01000` 来确认是否升级成功


### venus-messager

功能：

1. 增加对 basefee 的控制，可以对某个地址单独设置 basefee，当链上 basefee 高于限制的 basefee，消息将不会被推送出去

依赖升级组件：

注意事项：

1. 升级后观察消息能否正常上链


### venus-miner

影响功能：

依赖升级组件：

注意事项：

1. 从 `1.7.*`升级到`v1.8.0`会自动迁移配置文件，从 `1.6.*` 升级到`v1.8.0`需重新初始化`repo`(init)，[参考](https://github.com/filecoin-project/venus-miner/blob/master/docs/zh/CHANGELOG.md#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9-2)
2. 升级后能否正常出块


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
