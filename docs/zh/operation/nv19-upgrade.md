# Venus 各组件升级文档

## 注意事项

1. 所有组件全部更换
2. 更新完通过 curl 命令调用 `Version` 接口检查版本号，各组件接口调用方式：https://github.com/filecoin-project/venus/issues/5132
3. pre/pro消息上链的情况
4. WD 消息上链的情况
5. 出块情况是否正常
6. gas fee 相关设置是否生效

## 需要升级的组件

组件名|tag|commit
---|---|---
venus-auth | v1.11.0 | 0c30588
venus | v1.11.1 | 870f1b4 
venus-messager | v1.11.0 | e4c4ab4 
venus-gateway | v1.11.1 | 8d7be74 
venus-wallet | v1.11.0 | 7afa1eb 
venus-miner | v1.11.0 | a30f342 
venus-market | v2.7.1 | b920551 
venus-sector-manager | v0.6.0-rc3 | 134b502
venus-worker | 无需升级 | -


### 升级顺序

1. venus-auth
2. venus
3. venus-gateway
4. venus-messager
5. venus-miner
6. venus-market
7. venus-wallet-pro
8. venus-sector-manager


### venus-auth

影响功能：

- 其他组件对获取 auth 的服务

依赖升级组件：无

注意事项：

- 启动时使用 "--disable-perm-check" ,暂时关闭 auth 接口保护的特性
- 创建 token 之前需要先创建对应的用户

备注：
- 新版本的 auth 在启动的时候会自动生成一个名为 "defaultLocalToken" 的 token, 该 token 用于 auth-cli 执行命令时的鉴权


### venus 

影响功能：无

依赖升级组件：venus-auth

注意事项：

编译：先 `make dist-clean` 再 `make`，这样可以防止未能正常升级 `filecoin-ffi` 而带来的问题

**启动时应带上 flag --auth-token ,或者修改配置文件 api.venusAuthToken 配置项**

1. 升级后检查 vk 文件是否完整

2. 升级后检查配置文件，通过日志检查 `UpgradeLightningHeight` 和 `UpgradeThunderHeight` 是否正常 :

    ```
    # cali
    UpgradeLightningHeight:489094
    UpgradeThunderHeight:489094+3120
    # mainnet
    UpgradeLightningHeight:2809800
    UpgradeThunderHeight:  2809800 + 2880*21 = 2870280
    ```

3. 升级后需检查是否正常同步区块

4. 检查主网 v11 actors code，确保与下面输出一样

    ```
    ./venus state actor-cids --network-version 19

    # 顺序可能会不一样
	Network Version: 19
	Actor Version: 11
	Actor             CID
	reward            bafk2bzacebwjw2vxkobs7r2kwjdqqb42h2kucyuk6flbnyzw4odg5s4mogamo
	system            bafk2bzaced7npe5mt5nh72jxr2igi2sofoa7gedt4w6kueeke7i3xxugqpjfm
	eam               bafk2bzaceaelwt4yfsfvsu3pa3miwalsvy3cfkcjvmt4sqoeopsppnrmj2mf2
	cron              bafk2bzacebpewdvvgt6tk2o2u4rcovdgym67tadiis5usemlbejg7k3kt567o
	datacap           bafk2bzacebslykoyrb2hm7aacjngqgd5n2wmeii2goadrs5zaya3pvdf6pdnq
	ethaccount        bafk2bzaceclkmc4yidxc6lgcjpfypbde2eddnevcveo4j5kmh4ek6inqysz2k
	evm               bafk2bzacediwh6etwzwmb5pivtclpdplewdjzphouwqpppce6opisjv2fjqfe
	init              bafk2bzaceckwf3w6n2nw6eh77ktmsxqgsvshonvgnyk5q5syyngtetxvasfxg
	multisig          bafk2bzaceafajceqwg5ybiz7xw6rxammuirkgtuv625gzaehsqfprm4bazjmk
 	paymentchannel    bafk2bzaceb4e6cnsnviegmqvsmoxzncruvhra54piq7bwiqfqevle6oob2gvo
	account           bafk2bzacealnlr7st6lkwoh6wxpf2hnrlex5sknaopgmkr2tuhg7vmbfy45so
	storageminer      bafk2bzacec24okjqrp7c7rj3hbrs5ez5apvwah2ruka6haesgfngf37mhk6us
	storagepower      bafk2bzaceaxgloxuzg35vu7l7tohdgaq2frsfp4ejmuo7tkoxjp5zqrze6sf4
	placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
	verifiedregistry  bafk2bzacedej3dnr62g2je2abmyjg3xqv4otvh6e26du5fcrhvw7zgcaaez3a
	storagemarket     bafk2bzaceazu2j2zu4p24tr22btnqzkhzjvyjltlvsagaj6w3syevikeb5d7m
    ```

5. 若不排查问题，rust 日志级别**不建议**设置为 `trace`，因为会打印较多日志

6. 升级后可以通过命令来 `./venus state get-actor t01000` 来确认是否升级成功

7. actor 迁移
	
	**经测试本次预迁移时间在 80 秒左右，正式迁移时间再 60 秒左右**

    ```
    预迁移高度是升级高度前 120 个高度：2809800 - 120 = 2809680
    pre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration
    migration      开始：STARTING migration      结束：COMPLETED migration
    ```

### venus-gateway

影响功能：无

依赖升级组件：venus-auth

注意事项：

- 编译时，需要先 `make dist-clean` 再 `make`
- 启动时，应带上 flag --auth-token ,或者直接在配置中设置配置项：AuthConfig.Token
- 移除 flag：`--disable-address-verify`，**升级时检查启动命令是否还在使用该 flag**

### venus-messager

影响功能：
- 消息 replace
- list --block 命令

依赖升级组件：venus, venus-auth, venus-gateway

注意事项：

- 升级第一次启动时，带上 auth-token flag, 或者先修改配置文件 JWTConfig.Token 配置项
- 升级之后需要观察能否正常接收消息，消息能否正常上链


备注：
- replace fee 系数的最小值 由 1.25 下调 到 1.11
- list blocked 消息的时候，unfill 状态的消息也会作为 blocked 消息被列出来


### venus-miner

影响功能：

- 选消息增加超时机制

依赖升级组件：auth, venus, gateway

注意事项：

- 配置文件中 [Auth].[Token] 必须配置，且在 venus-auth 中具有 admin 权限，不要使用`defaultLocalToken`对应的 token，应手动创建一个。

### venus-market

影响功能：
- 新增和调整部分命令
依赖升级组件：auth, venus, gateway, messager

注意事项：

- 启动时必须带上 cs-token, 或者修改 配置项 AuthNode.Token

### venus-wallet

影响功能：无

依赖升级组件：gateway

注意事项：
- 升级后观察是否正常签名，消息能否正常上链

### venus-sector-manger

影响功能：fip-0061 wdpost 算法改动

依赖升级组件：链服务组件

注意事项：
- 编译时，需要先 `make dist-clean` 再 `make`
- wdpost 算法回滚步骤
	1. vsm 切换到 [fip-0061-fallback] https://github.com/ipfs-force-community/venus-cluster/tree/fip-0061-fallback 分支

---

更新结果验证步骤：
1. 程序启动正常
2. pre/pro消息正常上链
3. 出块正常
4. WD 上链正常
5. 算力增长正常
7. 真实订单检索正常
8. 数据库各种 gas，生命周期，聚合设置正常

### 数据库变更

1. [venus-messager 增加对 actor 的配置及相关命令，新增 `actor_cfg` 表](https://github.com/filecoin-project/venus/issues/5558)

2. venus-market `storage_deals` 表增加索引：`CREATE INDEX idx_cdpprovider_state ON storage_deals(cdp_provider,state)`
