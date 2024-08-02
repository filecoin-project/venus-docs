# Venus 各组件升级文档 (持续更新中)

## 注意事项

1. 所有组件全部更换
2. 更新完通过 curl 命令调用 `Version` 接口检查版本号，各组件接口调用方式：https://github.com/filecoin-project/venus/issues/5132
3. pre/pro消息上链的情况
4. WD消息上链的情况
5. 出块情况是否正常
6. gas fee 相关设置是否生效

#### 建议升级之前不要做算力，如果升级前 p2 消息上链但 c2 消息没上链，升级后 c2 消息上链会报错

## 需要升级的组件

组件名|tag|commit
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

2. 升级后执行命令 `./venus state network-info`，然后检查通过日志检查 UpgradeWaffleHeight 是否正常:

    ```
    # cali
    UpgradeWaffleHeight: 1779094
    # mainnet
    UpgradeWaffleHeight: 4154640
    ```

3. 升级后需检查是否正常同步区块

4. 检查主网 v14 actors code，确保与下面输出一样

   ```
    ./venus state actor-cids --network-version 23

    # 顺序可能会不一样
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

5. 若不排查问题，rust日志级别**不建议**设置为 `trace`，因为会打印较多日志

6. 升级后可以通过命令来 `./venus state get-actor t01000` 来确认是否升级成功

7. actor 迁移

    **经测试本次预迁移时间在1分钟左右，正式迁移时间在50秒左右**

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

- 无


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

无
