# 如何使用 Venus Messager

messager 是用于管理本地消息的组件，目的是保存地址消息，管理消息状态以及控制推送消息的频率。

## 开始

### 克隆代码到你的机器

```bash
git clone https://github.com/filecoin-project/venus-messager.git
```

### 安装依赖及构建

```bash
make deps
make
```

### 启动messager

> ./venus-messager --config=xx.toml run [command options]

* 可以通过 `--config=xx.toml` 来指定配置文件的目录，默认目录是 `./messager.toml`
* 启动时指定的配置文件不存在，则会生成对应名称的配置文件，并把设置的参数的值写到配置文件
* 启动时指定的配置文件存在，设置的参数的值会被使用，但不会写到配置文件，未设置的参数则使用配置文件中参数的值

```bash
options:
   --auth-url       auth服务的URL
   --auth-token     auth服务的token
   --node-url       lotus/venus 节点的URL
   --node-token     auth服务的URL
   --db-type        使用的数据库类型，sqlite 或者 mysql
   --sqlite-file    sqlite 数据库的文件，例子：~/sqlite/message.db
   --mysql-dsn      mysql dsn，eg. user:password@(127.0.0.1:3306)/messager?parseTime=true&loc=Local
   --gateway-url    gateway的URL
   --gateway-token  gateway的token
```

## 命令行

### 消息

1. 查询消息

```bash
./venus-messager msg search --id=<message id> or --cid=<message cid>
```

2. 列出消息

```bash
./venus-messager msg list
# 列出相同地址的消息
./venus-messager msg list --from <address>
```

3. 更新一个已上链消息（但数据库的状态未更新）的状态

```bash
./venus-messager msg update_filled_msg --id=<message id>
```

4. 更新所有已上链消息（但数据库的状态未更新）的状态

```bash
./venus-messager msg update_all_filled_msg
```

5. 等待消息的结果

```bash
./venus-messager msg wait <message id>
```

6. 通过ID重新发布消息

```bash
./venus-messager msg republish <message id>
```

7. 替换消息

```bash
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>
# or
./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>
```

8. 列出失败的消息，可能是消息签名失败或gas估算失败

```bash
./venus-messager msg list-fail
```

9. 列出一段时间未链接的消息

```bash
./venus-messager msg list-blocked
```

10. 手动标记异常的消息

```bash
./venus-messager msg mark-bad <message id>
```

### 地址

1. 查询地址

```bash
./venus-messager address search <address>
```

2. 列出地址

```bash
./venus-messager address list
```

3. 重置地址

> 把地址的nonce设置为链上的nonce，并且全部未上链消息都被标记为`错误消息`

```bash
./venus-messager reset <address>
```

4. 冻结地址，不再接收推送的消息

```bash
./venus-messager address forbidden <address>
```

5. 激活冻结的地址

```bash
./venus-messager address active <address>
```

6. 设置地址一轮推送选择消息的最大数量

```bash
./venus-messager address set-sel-msg-num --num=5 <address>
```

7. 设置地址fee相关参数

> venus message address set-fee-params [command options] address

```bash
 # options
 # --gas-overestimation   估算gas的系数 (default: 0)
 # --max-feecap           单个消息愿意付出的最多 feecap (包括燃烧和支付给矿工, attoFIL/GasUnit)
 # --max-fee              单个消息最多花费 X attoFIL

./venus-messager address set-fee-params <address>
```

### 共享参数

1. 获取共享的参数

```bash
./venus-messager share-params get
```

2. 设置共享的参数

```bash
# expireEpoch is the expiration height of the message, 0 means it will not expire
# selMsgNum is the maximum number of messages pushed to mpool by a single address at a time
# scanInterval is the interval to scan the remote wallet
# maxEstFailNumOfMsg is the number of failures allowed to estimate gas consumption

./venus-messager share-params set "{\"expireEpoch\": 0, \"gasOverEstimation\": 1.25, \"maxFee\": 7000000000000000, \"maxFeeCap\": 0, \"selMsgNum\": 20, \"scanInterval\": 10, \"maxEstFailNumOfMsg\": 50}"
```

3. 从数据库手动刷新共享参数

```bash
./venus-messager share-params refresh
```

### 节点

1. 按名称搜索节点信息

```bash
./venus-messager node search <name>
```

2. 添加节点信息

```bash
./venus-messager node add --name=<node-name> --url=<node-url> --token=<node-token>
```

3. 节点信息列表

```bash
./venus-messager node list
```

4. 根据名称删除节点信息

```bash
./venus-messager node del <name>
```

### 日志

1. 设置日志级别

```bash
# 支持的级别：trace,debug,info,warn|warning,error,fatal,panic
./venus-messager log set-level
```

### send 命令

> 发送消息
> venus-messager send [command options] [targetAddress] [amount]

```bash
   options:
   --from value         optionally specify the address to send
   --gas-premium value  specify gas price to use in AttoFIL (default: "0")
   --gas-feecap value   specify gas fee cap to use in AttoFIL (default: "0")
   --gas-limit value    specify gas limit (default: 0)
   --method value       specify method to invoke (default: 0)
   --params-json value  specify invocation parameters in json
   --params-hex value   specify invocation parameters in hex
   --account value      optionally specify the account to send
```
