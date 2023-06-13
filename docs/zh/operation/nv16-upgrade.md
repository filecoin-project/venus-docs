## nv16 各组件升级文档

### 时间线

升级时间：2022-07-06T14:00:00Z，北京时间是 2022-07-06 22:00:00（周三）

### venus-auth

tag: v1.6.0

影响功能：支持多个 miner 共享同一个 token 的功能

依赖升级组件：无

注意事项：

1. 新增加一张 `miners` 表，用于保存 `user` 和 `miner` 的对应关系

2. 会把 `users` 表每行数据的 `name` 和 `miner` 字段的值写入到 `miners` 表中的 `user` 和 `miner`字段，检查写入是否有问题，成功日志:migrate from:0, to:1 success；失败日志：migrate from store version:0 failed

3. `./venus-auth user miner list <user>` 可以查看每个用户绑定的 miner

4. 使用命令 `./venus-auth user list`列出所有 user，**确保被使用的 user 状态都为 enabled 状态**


### venus

tag: v1.6.0

影响功能：支持 nv16 网络

依赖升级组件：无

注意事项：
1. 升级后检查 vk 文件是否完整

2. 升级后检查配置文件，升级高度是否正常设置，配置文件默认在 `~/.venus/config.json` :
    ```
    # cali
    "upgradeSkyrHeight": 1044660
    # mainnet
    "upgradeSkyrHeight": 1960320
    ```

3. 升级后需检查是否正常同步区块

4. api 版本发生变化，影响 miner 的连接

    ```
    # 用 curl 命令测试接口 StateGetBeaconEntry、BeaconGetEntry，下面三个 curl 命令返回结果应该一样
    curl http://127.0.0.1:3453/rpc/v0 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"method": "Filecoin.BeaconGetEntry","params":[1933610], "id": 0}'
    curl http://127.0.0.1:3453/rpc/v1 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"method": "Filecoin.BeaconGetEntry","params":[1933610], "id": 0}'       
    curl http://127.0.0.1:3453/rpc/v1 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"method": "Filecoin.StateGetBeaconEntry","params":[1933610], "id": 0}'
    ```

5. 检查主网 v8 actors cid，确保与下面输出一样

    ```
    ./venus state actor-cids

    # 顺序可能会不一样
    _manifest         bafy2bzacebogjbpiemi7npzxchgcjjki3tfxon4ims55obfyfleqntteljsea  
    account           bafk2bzacedudbf7fc5va57t3tmo63snmt3en4iaidv4vo3qlyacbxaa6hlx6y  
    storagemarket     bafk2bzacediohrxkp2fbsl4yj4jlupjdkgsiwqb4zuezvinhdo2j5hrxco62q  
    storageminer      bafk2bzacecgnynvd3tene3bvqoknuspit56canij5bpra6wl4mrq2mxxwriyu  
    multisig          bafk2bzacebhldfjuy4o5v7amrhp5p2gzv2qo5275jut4adnbyp56fxkwy5fag  
    paymentchannel    bafk2bzacebalad3f72wyk7qyilvfjijcwubdspytnyzlrhvn73254gqis44rq  
    reward            bafk2bzacecwzzxlgjiavnc3545cqqil3cmq4hgpvfp2crguxy2pl5ybusfsbe  
    system            bafk2bzacedwq5uppsw7vp55zpj7jdieizirmldceehu6wvombw3ixq2tcq57w  
    cron              bafk2bzacecqb3eolfurehny6yp7tgmapib4ocazo5ilkopjce2c7wc2bcec62  
    init              bafk2bzaceaipvjhoxmtofsnv3aj6gj5ida4afdrxa4ewku2hfipdlxpaektlw  
    storagepower      bafk2bzacebjvqva6ppvysn5xpmiqcdfelwbbcxmghx5ww6hr37cgred6dyrpm  
    verifiedregistry  bafk2bzaceb3zbkjz3auizmoln2unmxep7dyfcmsre64vnqfhdyh7rkqfoxlw4
    ```

6. 主网可以通过设置环境变量 `export VENUS_USE_FVM_TO_SYNC_MAINNET_V15=1` 在 nv15 网络使用 fvm

7. 若不排查问题，rust 日志级别**不建议**设置为 `trace`，因为会打印较多日志

8. 升级后可以通过命令来 `./venus  state get-actor t01000` 来确认是否升级成功


### venus-messager

tag:v1.6.0

影响功能：支持新的网络版本，新增主目录，默认在 `~/.venus-messager`

依赖升级组件：

注意事项：
1. 升级后是否生成主目录 `~/.venus-messager`

2. 升级后主目录应包含 `config.toml` 和 `tipset.json`，`config.toml` 应与启动 `messager` 使用的配置文件内容一致，`~/.venus-messager/tipset.json` 是由当前目录中的 `tipset.json` 拷贝而来

3. 升级成功后再次重启是读取的配置是`~/.venus-messager/config.toml`

4. 能否正常收到消息和推送消息到节点


### venus-miner

tag: v1.6.0

影响功能：
1. 获取 beacon 的接口名字 由 `BeaconGetEntry` 改为 `StateGetBeaconEntry`

依赖升级组件：venus,venus-auth,venus-gateway

注意事项：
1. 升级后常用命令 address state/list/update验证一遍.
2. 如果用 mysql 数据库，检查下 miner_blocks 表中 parent_key 字段是 varchar(1000)


### venus-gateway

tag: v1.6.0

影响功能：修复没有自动清理超时的请求

注意事项：

1. 升级后 `wallet` 是否重新注册上来


### venus-market

tag: v2.2.0

影响功能：

注意事项：


### venus-wallet

#### 社区

tag: v1.6.0

影响功能：

注意事项：

1. 需要解锁钱包
2. 是否注册到 gateway
