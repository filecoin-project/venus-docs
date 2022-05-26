# Venus的链服务搭建

便于集群的横向扩展是Venus的设计初衷，Venus团队致力于用户更加简单的运维自己的集群。

Venus系统的实现采用了微服务架构，将各部分重复的功能解耦出来，形成不同的组件。根据部署方式和功能的不同，划分为链服务组件和本地组件。
在Veuus的实现中，一套链服务可以服务多个集群，链服务可以由服务商或多个存储提供者联合搭建，每个接入链服务的存储提供者仅需将精力放在本地组件上，即算力的增长与维持。

在Venus系统中，链服务层的正常运行显得尤为重要，一旦服务异常就可能导致多个集群故障。此文档就如何搭建链服务进行介绍。

## 硬件要求

Venus系统的链服务负责链的区块同步、各集群消息打包、出块及链信息查询等功能，是各个集群正常运行的先决条件。venus的一套链服务至少包括：

- **venus节点 * 1**: 32C/128g/40g+2T(essd)；
- **venus-auth、venus-messager * 1**：16C/32G/200G(essd)；
- **venus-gateway * 1**：16C/32G/200G(essd)；
- **venus-miner * 1**：16C/32G/200G(essd)；

在通常情况下，一套链服务可服务于多个集群，因为需要预防单点故障，所以链服务的每个组件都至少有主备或负载均衡。

## 软件环境

Ubuntu:

```shell
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config curl clang build-essential hwloc libhwloc-dev wget -y && sudo apt upgrade -y
```

CentOS:

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```

- [Go 1.16 或更高版本](https://golang.org/dl/)
- 每个组件皆用相同分支: **`incubation`**

</br>

## 部署流程

根据组件的依赖关系，链服务层的部署顺序是: venus-auth --> venus-gateway --> venus --> venus-messager --> venus-miner。


### venus-auth

```shell script
$ nohup ./venus-auth run > auth.log 2>&1 &
```
> `venus-auth` 的默认配置文件位于`~/.venus-auth/config.toml`

支持MySQL 5.7及以上版本，可替代默认的`Badger`键值数据库。要使用 MySQL 数据库，请修改配置文件中的 `db` 部分。

```shell script
# Data source configuration item
[db]
# support: badger (default), mysql 
# the mysql DDL is in the script package 
type = "mysql" 
# The following parameters apply to MySQL
DSN = "<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_auth?parseTime=true&loc=Local&charset=utf8mb4&collation=utf8mb4_unicode_ci&readTimeout=10s&writeTimeout=10s"
# conns 1500 concurrent
maxOpenConns = 64
maxIdleConns = 128
maxLifeTime = "120s"
maxIdleTime = "30s"
```

#### 生成token

`venus-auth`管理着其他Venus组件使用的[jwt](https://jwt.io/)token，以便它们在网络上安全地相互通信。

为链服务组件生成token。

```bash
# --perm specifies admin, sign, wirte or read permission of the token generated
$ ./venus-auth token gen --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```

为独立组件生成token。token可以通过`<USER>` 逻辑分组，作为加入分布式存储池的单个存储提供者。

```shell script
$ ./venus-auth user add --name=<USER>

$ ./venus-auth token gen --perm write <USER>
<USER_WRITE_AUTH_TOKEN>
$ ./venus-auth token gen --perm read <USER>
<USER_READ_AUTH_TOKEN>
```

>`./venus-auth user add <USER>` 对不同的token进行逻辑分组。然后激活user, 并绑定miner
```
$ ./venus-auth user update --name=<USER> --state=1
$ ./venus-auth user miner add <USER> <MINER_ID>

# 查看 user 列表
$ ./venus-auth user list

# 查看 token 列表
$ ./venus-auth token list
```

### venus-gateway

如果遇到以下编译错误,先执行`go get github.com/google/flatbuffers@v1.12.1`
```bash
github.com/dgraph-io/badger/v3@v3.2011.1/fb/BlockOffset.go:6:2: missing go.sum entry for module providing package github.com/google/flatbuffers/go (imported by github.com/dgraph-io/badger/v3/table); to add:
        go get github.com/dgraph-io/badger/v3/table@v3.2011.1
```

启动`venus-gateway`

```bash
$ ./venus-gateway --listen /ip4/0.0.0.0/tcp/45132 run \
# Use either a http or https url
--auth-url <http://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus-gateway.log 2>&1 &
```

#### 常用命令

1. 列出注册到venus-gateway的钱包，查询结果包含钱包名称、支持的账号和钱包地址等信息。

```
$ ./venus-gateway wallet list

[
       {
                "Account": "li_sealer",
                "SupportAccounts": [
                        "li_sealer"
                ],
                "ConnectStates": [
                        {
                                "Addrs": [
                                        "t3vlgp2tciovduiuvxls6t7tzasvdddv7cjkoo7z5f3nkjymrb2m73v2dkvulaiaprglihyqqbfrv3wcvtxcra"
                                ],
                                "ChannelId": "c9f69aee-dd5d-42c1-a6bc-9a642595f3aa",
                                "Ip": "127.0.0.1:36376",
                                "RequestCount": 0,
                                "CreateTime": "2021-09-10T13:29:22.411062263+08:00"
                        }
                ]
        }
 ]
```

2. 列出连接到gateway的矿工

```
$ ./venus-gateway miner list

t01561
t02608
t02082
```

### venus

启动`venus`进程进行链同步。 使用 `--network` 来指定`venus`连接的网络。

```bash
$ nohup ./venus daemon --network=cali --auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> > venus.log 2>&1 & 
```

> 使用`tail -f venus.log` 或 `./venus sync status` 检查同步过程中是否有任何错误。

#### 允许其他IP的实例访问venus

默认情况下，`venus`进程只响应本地访问。更改以下配置(~/.venus/config.json)以允许从其他地址访问。

```json
{
  "api": 
  {
      "apiAddress": "/ip4/0.0.0.0/tcp/3453"
  }
}
```

### venus-messager

启动`venus-messager`, `--auth-url`、`--node-url` 和`--auth-token` 是为了让 venus-messager 了解其他`venus`组件的存在并进行自身的身份验证。

```bash
$ nohup ./venus-messager run \
--auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> \
--node-url=/ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132 \
--auth-token=<SHARED_ADMIN_AUTH_TOKEN> \
--db-type=mysql \
--mysql-dsn="<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_messager?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s" \
> msg.log 2>&1 &
```
> 如果没有指定与数据库相关的参数，`venus-messager`将默认使用 sqlite.

messager中消息总共分以下几种状态：
```
UnKnown：    unkonwn
UnFillMsg：  未填充，消息刚推送到messager
FillMsg：    已填充，也就是已签名消息
OnChainMsg： 已上链
FailedMsg：  失败消息
ReplacedMsg：被替换
NoWalletMsg：未找到钱包
```

#### 常用命令

1. 全局参数

1.1 获取全局参数

```
$ ./venus-messager share-params get

{
        "id": 1,
        "gasOverEstimation": 1.25,
        "maxFee": "7000000000000000",
        "maxFeeCap": "0",
        "selMsgNum": 20
}
```

1.2 设置全局参数

```
OPTIONS:
   --gas-over-estimation  预估gas时，gas的系数
   --max-fee
   --max-feecap
   --sel-msg-num value    一轮推送选择的消息数
$ ./venus-messager share-params set [options]
```

2. 消息

2.1 查询单个消息，支持用消息ID和消息cid查询

```
$ ./venus-messager msg search --id=<message id> or --cid=<message cid>
```

2.2 列出消息，可以多个flag组合使用，也支持分页

```
options:
   --page-index   当前页（默认 1）
   --page-size    每页消息数（默认100）
   --from         消息from地址
   --state        消息状态
$ ./venus-messager msg list [options]
```

2.3 列出异常的消息，可能是消息签名失败或gas估算失败

```
$ ./venus-messager msg list-fail
# Return 字段里包含粗略的错误
ID                                                                                                                 To       From          Nonce  Value                      GasLimit  GasFeeCap   GasPremium  Method  State      ExitCode  Return                                                                 Height  CreateAt
bafk4bzacicqkukukk3jukpankepybvdaj2gpi3fuminxlakacaiukuj2yq53zhb3coapmbx7ozpe6v2bgp4hxphyyrbkhieszvqczwfub2i6bgf2  t016345  t3v5shsyt...  0      7.666985421223199696 FIL   0         3000000000  0           6       UnFillMsg  -1        gas estimate: estimating gas limit: message execution failed: exit 16  0       2021-09-05 21:35:53
bafk4bzacicviuerbarkm45kjnam7j2tlfv2pdecu46uqiscwdh5eedvixihwwoqhkffwa4rx5rrbi7b66etz2devuoozl2qhkbpz2s7v5rbixnov  t016345  t3v5shsyt...  0      7.671490278328236907 FIL   0         3000000000  0           6       UnFillMsg  -1        gas estimate: estimating gas limit: message execution failed: exit 16  0       2021-09-05 21:50:16
ba
```

2.4 标记异常消息，该消息被标记会被置为`FailedMsg`状态

```bash
./venus-messager msg mark-bad <message id>
```

2.5 替换消息

```
# 根据消息ID替换
$ ./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>
# 或者根据消息的from和nonce替换
$ ./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>
```

3. 地址

3.1 查询单个地址信息

```
$ ./venus-messager address search t3weswpwlpkpbhozfety4ebmph3osweakrgqjmb74nwxt57hru73mx3ttp2abxrqqi45oebshxbenb4jtkmb2q
{
        "id": "bda9fbfd-2ccc-487a-aaa1-a7843b2af149",
        "addr": "t3weswpwlpkpbhozfety4ebmph3osweakrgqjmb74nwxt57hru73mx3ttp2abxrqqi45oebshxbenb4jtkmb2q",
        "nonce": 4,
        "weight": 0,
        "selMsgNum": 0,
        "state": 1,
        "gasOverEstimation": 0,
        "maxFee": "0",
        "maxFeeCap": "0",
        "isDeleted": -1,
        "createAt": "2021-08-30T14:18:24.92+08:00",
        "updateAt": "2021-08-30T18:17:38.875+08:00"
 }
```

3.2 列出所有地址

```
$ ./venus-messager address list
```

3.3 设置地址一轮推送选择消息的最大数量

```
$ ./venus-messager address set-sel-msg-num --num=5 <address>
```

### venus-miner

初始化`venus-miner`。
```bash
$ ./venus-miner init
# For nettype, choose from mainnet, debug, 2k, calibnet
--nettype <NET_TYPE> \
--auth-api <http://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132 \
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--slash-filter local
```

启动`venus-miner`。

```bash
$ nohup ./venus-miner run > miner.log 2>&1 &
```

#### miner管理

`venus-miner` 启动时会从 `venus-auth` 中拉取最新的`miner_id`列表，然后预执行一遍出块流程，如果失败会在state中体现出来，可以通过以下方式查询`miner_id`的状态。

```bash
$ ./venus-miner address state
[
	{
		"Addr": "<MINER_ID>",
		"IsMining": true,
		"Err": null
	}
]
```
如果某个`miner_id`的 Err 不是 `null`,则需要根据错误信息分析原因，并通知用户解决。


我们可以开始或暂停某个`miner_id`的出块逻辑，如启动`miner_id=f01008`的出块逻辑。

```bash
$ ./venus-miner address start f01008
```

列出所有已连接到链服务的`miner id`。

```bash
$ ./venus-miner address list
```

在`venus-miner`运行期间有`miner_id`加入或退出矿池,或有`miner_id`保存在venus-auth的信息有改变,需要重新从`venus_auth`拉取数据.

```bash
$ ./venus-miner address update
```

统计某个`miner_id`在特定链高度区间内获得的出块权

```bash
./venus-miner winner count --epoch-start=<START_EPOCH> --epoch-end=<END_EPOCH> <MINER_ID>
```
> 1. epoch-end>epoch-start; 2. epoch-end必须小于当前链高度，即这个命令是用来查询历史出块情况的，并非是预测未来出块权的。举例如下:

```bash
 ./venus-miner winner count --epoch-start=60300 --epoch-end=60345 f01008
[
        {
                "miner": "f01008",
                "totalWinCount": 7,
                "msg": "",
                "winEpochList": [
                        {
                                "epoch": 60340,
                                "winCount": 2
                        },
                        {
                                "epoch": 60329,
                                "winCount": 1
                        },
                        {
                                "epoch": 60326,
                                "winCount": 2
                        },
                        {
                                "epoch": 60339,
                                "winCount": 1
                        },
                        {
                                "epoch": 60315,
                                "winCount": 1
                        }
                ]
        }
]
```

## 使用链服务

请学习参见[这个](/zh/guide/Using-venus-Shared-Modules.html)文档。

## 使用venus-cluster

请学习参见[这个](/zh/cluster)文档。

## 接收存储订单

请学习参见[这个](https://github.com/filecoin-project/venus/discussions/4735)文档。
