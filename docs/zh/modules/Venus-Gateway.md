# Venus Gateway

venus-gateway用于注册钱包，矿工相关信息，也是其它组件和钱包交流的中间桥梁。用于代理从共享组件调用本地组件的请求。

## 快速启动

### 下载代码

```shell script
git clone https://github.com/ipfs-force-community/venus-gateway.git
```

### 编译

```shell script
make
```

### 启动服务

```shell script
./venus-gateway run --auth-url=<auth-url>
```

> 启动成功会在当前目录生成 `token` 文件，里面存的是 jwt token，给命令行使用

## CLI 操作指南

### 查看帮助

```shell script
./venus-gateway -h

NAME:
   venus-gateway - venus-gateway for proxy incoming wallet and proof

USAGE:
   venus-gateway [global options] command [command options] [arguments...]

VERSION:
   0.0.1'+gitc2048fb'

COMMANDS:
   run      start venus-gateway daemon
   miner    miner cmds
   wallet   wallet cmds
   help, h  Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --listen value  host address and port the worker api will listen on (default: "/ip4/127.0.0.1/tcp/45132")
   --help, -h      show help (default: false)
   --version, -v   print the version (default: false)
```

### venus gateway 基础操作

#### miner相关

1. 列出 miner

```shell script
./venus-gateway miner list

# res
t01561
t02608
t02082
```

2. 查看单个miner状态

```shell script
./venus-gateway miner <miner-id>

# res
{
        "Connections": [
                {
                        "Channel": "ddbbd646-f3a2-474b-8457-ea7195cf5765",
                        "Ip": "127.0.0.1:36586",
                        "RequestCount": 0,
                        "CreateTime": "2021-07-20T17:34:33.767108581+08:00"
                }
        ],
        "ConnectionCount": 1
 }
```

#### 钱包相关

1. 列出钱包

```shell script
./venus-gateway wallet list

# res
[
        {
                "Account": "wallet_test1",
                "SupportAccounts": [
                        "testminer"
                ],
                "ConnectStates": [
                        {
                                "Addrs": [
                                        "t3wbwannykivspagunexwwky7eiqg4qa25eoqmgolpkzdz3fidocbjeflbyxqqguyypsekyhqbkj33f657ulla",
                                        "t1zkh45ooidf5zt3yv5o26uugjn5ao4fttsxfgdaq",
                                ],
                                "ChannelId": "016c1010-c56a-4849-89d1-e2b28aecc95a",
                                "Ip": "192.168.5.64:50448",
                                "RequestCount": 0,
                                "CreateTime": "2021-07-19T14:06:50.209609054+08:00"
                        }
                ]
        },
        {
                "Account": "wallet_test2",
                "SupportAccounts": [
                        "wallet_test2"
                ],
                "ConnectStates": [
                        {
                                "Addrs": [
                                        "t3vwbowhnkripgyxdawgwepcwcsqmai5exxetord362wudwr24a3kvgndnpsn6i3md2i23cmjx3rfflvbu7gna",
                                ],
                                "ChannelId": "57971a25-b760-4744-b6c2-af470ab456a9",
                                "Ip": "127.0.0.1:36598",
                                "RequestCount": 0,
                                "CreateTime": "2021-07-20T17:34:33.809502589+08:00"
                        }
                ]
        }
 ]
```

2. 查看单个钱包

```shell script
./venus-gateway wallet <wallet-account>
```

### 验证钱包地址是否真实存在

1. gateway 每次启动会生成一个随机的字符串(gateway_string)
2. 钱包注册时携带一个随机字符串(wallet_string)给到 gateway
3. gateway 逐个验证钱包注册的地址：gateway 会调用`sign`接口，签名的数据是 hash(gateway_string+wallet_string)后的新的字符串，并通过 `MsgMeta.Extra`
把 `gateway_string` 携带给钱包，最后gateway验证钱包签名后的结果
