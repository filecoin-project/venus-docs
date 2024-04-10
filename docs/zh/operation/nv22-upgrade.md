# Venus 各组件升级文档 (持续更新中)

## 注意事项

1. 所有组件全部更换
2. 更新完通过 curl 命令调用 `Version` 接口检查版本号，各组件接口调用方式：https://github.com/filecoin-project/venus/issues/5132
3. pre/pro消息上链的情况
4. WD消息上链的情况
5. 出块情况是否正常
6. gas fee 相关设置是否生效


## 需要升级的组件

组件名|tag|commit
---|---|---
sophon-auth | v1.15.0 | a1e964b
venus | v1.15.1 | 81c99f3 
sophon-co | v0.8.0 | 0e48712
sophon-messager | v1.15.0 | 1e4f0d5
soohon-gateway | v1.15.0 | 541891a
venus-wallet | v1.15.0 | 6b3de34
sophon-miner | v1.15.0 | 8dd6c68
droplet | v2.11.0 | 44481dd 
damocles-manager |  v0.10.0-rc1 | 2f6c5f9
damocles-worker | v0.10.0-rc1 | 2f6c5f9

### 升级顺序

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

影响功能：

- 其他组件对获取 auth 的服务

依赖升级组件:  无

注意事项：

* 启动后能否正常鉴权

### venus 

影响功能：无

依赖升级组件:  sophon-auth

注意事项：

编译：先 `make dist-clean` 再 `make`，这样可以防止未能正常升级 `filecoin-ffi` 而带来的问题


1. 升级后检查vk文件是否完整

2. 升级后执行命令 `./venus state network-info`，然后检查通过日志检查 UpgradeDragonHeight 是否正常:

    ```
    # cali
    UpgradeDragonHeight: 1427974
    # mainnet
    UpgradeDragonHeight: 3855360
    ```

3. 升级后需检查是否正常同步区块

4. 检查主网 v13 actors code，确保与下面输出一样

    ```
    ./venus state actor-cids --network-version 22

    # 顺序可能会不一样
    Network Version: 22
    Actor Version: 13
    Manifest CID: bafy2bzacecdhvfmtirtojwhw2tyciu4jkbpsbk5g53oe24br27oy62sn4dc4e
    Actor             CID
    account           bafk2bzacedxnbtlsqdk76fsfmnhyvsblwyfducerwwtp3mqtx2wbrvs5idl52
    cron              bafk2bzacebbopddyn5csb3fsuhh2an4ttd23x6qnwixgohlirj5ahtcudphyc
    datacap           bafk2bzaceah42tfnhd7xnztawgf46gbvc3m2gudoxshlba2ucmmo2vy67t7ci
    eam               bafk2bzaceb23bhvvcjsth7cn7vp3gbaphrutsaz7v6hkls3ogotzs4bnhm4mk
    ethaccount        bafk2bzaceautge6zhuy6jbj3uldwoxwhpywuon6z3xfvmdbzpbdribc6zzmei
    evm               bafk2bzacedq6v2lyuhgywhlllwmudfj2zufzcauxcsvvd34m2ek5xr55mvh2q
    init              bafk2bzacedr4xacm3fts4vilyeiacjr2hpmwzclyzulbdo24lrfxbtau2wbai
    multisig          bafk2bzacecr5zqarfqak42xqcfeulsxlavcltawsx2fvc7zsjtby6ti4b3wqc
    paymentchannel    bafk2bzacebntdhfmyc24e7tm52ggx5tnw4i3hrr3jmllsepv3mibez4hywsa2
    placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro
    reward            bafk2bzacedq4q2kwkruu4xm7rkyygumlbw2yt4nimna2ivea4qarvtkohnuwu
    storagemarket     bafk2bzacebjtoltdviyznpj34hh5qp6u257jnnbjole5rhqfixm7ug3epvrfu
    storageminer      bafk2bzacebf4rrqyk7gcfggggul6nfpzay7f2ordnkwm7z2wcf4mq6r7i77t2
    storagepower      bafk2bzacecjy4dkulvxppg3ocbmeixe2wgg6yxoyjxrm4ko2fm3uhpvfvam6e
    system            bafk2bzacecyf523quuq2kdjfdvyty446z2ounmamtgtgeqnr3ynlu5cqrlt6e
    verifiedregistry  bafk2bzacedkxehp7y7iyukbcje3wbpqcvufisos6exatkanyrbotoecdkrbta
    ```

5. 若不排查问题，rust日志级别**不建议**设置为 `trace`，因为会打印较多日志

6. 升级后可以通过命令来 `./venus state get-actor t01000` 来确认是否升级成功

7. actor 迁移

    **经测试本次预迁移时间在 30 分钟左右，正式迁移时间在 100  秒左右**

    ```
    预迁移高度是升级高度前 120 个高度：
    pre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration
    migration      开始：STARTING migration      结束：COMPLETED migration
    ```
8. 如果 `~/.venus` 存在且需要导入快照，需要先删除 `~/.venus/version` 文件再导入快照
    * 主网: `./venus daemon --import-snapshot snapshot.car`
    * calibnet: `./venus daemon --import-snapshot snapshot.car --network calibrationnet`


### sophon-gateway

影响功能：无

依赖升级组件: sophon-auth

注意事项：

- 编译时,需要先 `make dist-clean` 再 `make`


### sophon-messager

影响功能：

依赖升级组件: venus, sophon-auth, soohon-gateway

注意事项：

- 升级之后需要观察能否正常接收消息, 消息能否正常上链


### sophon-miner

影响功能：

依赖升级组件：auth, venus, gateway

注意事项：

### droplet

影响功能：

- 支持 direct data onboarding，使用文档：https://github.com/ipfs-force-community/droplet/blob/master/docs/zh/direct-on-boarding.md


依赖升级组件: auth, venus, gateway, messager

注意事项：

- 升级后能否正常发单和检索

### venus-wallet

影响功能： 无

依赖升级组件: gateway

注意事项：

- 升级后观察是否正常签名，消息能否正常上链


### damocles-manager
依赖升级组件: 链服务组件

注意事项：
- 编译时,需要先 `make dist-clean` 再 `make`

### damocles-worker
依赖升级组件: damocles-manager

注意事项：

---

更新结果验证步骤: 
1. 程序启动正常
2. pre/pro消息正常上链
3. 出块正常
4. WD上链正常
5. 算力增长正常
7. 真实订单检索正常
8. 数据库各种gas，生命周期，聚合设置正常


### 数据库变更

1. droplet 增加 direct_deals 表，用于存储 direct 订单。
