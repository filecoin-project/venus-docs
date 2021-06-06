# 如何使用 Venus Messager

messager是用于管理本地消息的组件，目的是保存地址消息，管理消息状态以及控制推送消息的频率。

[目录]

## 从这开始

### 将此git仓库Clone到您的机器

```
git clone git@github.com:ipfs-force-community/venus-messager.git
```

### 安装依赖项

1. 首先, 加载所有Git子模块。

```
git submodule update --init --recursive
```

2. 初始化构建依赖关系。

```
make deps
```

### 构建并运行测试

```
# 首先，构建二进制文件
make

# 然后，运行并测试
make test
```

### 启动messager

```
# --config | -c        specify config file (default: "./messager.toml")
# --auth-url           url for auth server (default: "http://127.0.0.1:8989")
# --node-url           url for connection lotus/venus
# --node-token         token auth for lotus/venus
# --db-type            which db to use. sqlite/mysql (default: "sqlite")
# --sqlite-path        sqlite db path (default: "./message.db")
# --mysql-dsn          mysql connection string

# use sqlite db
./venus-messager run --config <config path> --auth-url <auth url> --node-url <node url> --node-token <node token> --db-type sqlite --sqlite-path <sqlite path>
# use mysql db
./venus-messager run --config <config path> --auth-url <auth url> --node-url <node url> --node-token <node token> --db-type mysql --mysql-dsn <mysql dsn>
```

## 命令

### Message命令

1. 搜索message

```
./venus-messager msg search --id=<message id>
```

2. message列表

```
./venus-messager msg list
# list messages with the same address
./venus-messager msg list --from <address>
```

3. 手动更新一个已fill的message状态

```
./venus-messager msg update_filled_msg --id=<message id>
```

4. 手动更新所有已fill的message状态

```
./venus-messager msg update_all_filled_msg
```

5. 等待消息MSG id的结果

```
./venus-messager msg wait <message id>
```

6. 通过ID重新发布message

```
./venus-messager msg republish <message id>
```

7. 替换message

```
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>
# or
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>
```

8. 列出失败的messages，可能是消息签名失败或gas估算失败

```
./venus-messager msg list-fail
```

9. 列出一段时间未链接的message

```
./venus-messager msg list-blocked
```

10. 手动标记错误的messages

```
./venus-messager msg mark-bad <message id>
```

### 地址命令

1. 搜索地址

```
./venus-messager address search <address>
```

2. 地址清单

```
./venus-messager address list
```

3. 更新地址随机数

```
./venus-messager address update_nonce --nonce=5 <address>
```

4. 禁止地址

```
./venus-messager address forbidden <address>
```

5. 激活冻结的地址

```
./venus-messager address active <address>
```

6. 设置地址选择消息的数量

```
./venus-messager address set_sel_msg_num --num=5 <address>
```

### 签名命令

1. 通过名称搜索钱包

```
./venus-messager wallet search <wallet-name>
```

2. 添加钱包

```
./venus-messager wallet add --name=<wallet-name> --url=<wallet-url> --token=<wallet-token>
```

3. 钱包列表

```
./venus-messager wallet list
```

4. 远程钱包地址列表

```
./venus-messager wallet list-addr --uuid=<wallet-id>
# or
./venus-messager wallet list-addr --name=<wallet-name>
```

5. 通过名称删除钱包

```
./venus-messager wallet del <name>
```

### 共享参数的命令

1. 获取共享的参数

```
./venus-messager share-params get
```

2. 设置共享的参数

```
# expireEpoch is the expiration height of the message, 0 means it will not expire
# selMsgNum is the maximum number of messages pushed to mpool by a single address at a time
# scanInterval is the interval to scan the remote wallet
# maxEstFailNumOfMsg is the number of failures allowed to estimate gas consumption

./venus-messager share-params set "{\"expireEpoch\": 0, \"gasOverEstimation\": 1.25, \"maxFee\": 7000000000000000, \"maxFeeCap\": 0, \"selMsgNum\": 20, \"scanInterval\": 10, \"maxEstFailNumOfMsg\": 50}"
```

3. 从数据库手动刷新共享参数

```
./venus-messager share-params refresh
```

### 节点命令

1. 按名称搜索节点信息

```
./venus-messager node search <name>
```

2. 添加节点信息

```
./venus-messager node add --name=<node-name> --url=<node-url> --token=<node-token>
```

3. 节点信息列表

```
./venus-messager node list
```

4. 根据名称删除节点信息

```
./venus-messager node del <name>
```
