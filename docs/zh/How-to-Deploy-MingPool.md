# How to Deploy Distributed mining pool

分布式矿池系统包含venus， venus-miner, venus-wallet, venus-messager, venus-sealer五个组件，五个组件分为两类，第一类是可共享的组件包括venus，venus-miner, venus-wallet, venus-messager这几个组件。运行在矿工本地主要用于积累算力的组件包括venus-sealer，venus-worker，venus-wallet。 venus-wallet属于可选组件，基于部署情况以及可信程度，venus-wallet既可以共享也可以本地部署。 本篇文档会以nerpda网络为例逐步的搭建矿池以及如何加入这个矿池。

## 共享组件搭建

### venus
venus节点组件用于其他组件查询链上信息，推送消息，区块。

编译节点组件
```sh
git clone https://github.com/filecoin-project/venus.git
make deps
make
```

运行节点，同步数据
```sh
./venus daemon --network nerpda
```

修改配置文件，打开外部端口

![./images/api_config.png](./images/api_config.png)

获取api及其token
```sh
cat ~/.venus/api      #此处如何ip是127.0.0.1需要修改配置文件的api监听地址，如果是0.0.0.0使用的时候需要改用具体的地址
cat ~/.venus/token
```


### venus-miner
venus-miner组件用于出块打包消息，可以配置多个矿工，本程序会计算各自的出块机会，并通过远程请求sealer来获取数据证明。

编译miner组件
```sh
git clone https://github.com/filecoin-project/venus-miner.git
make nerpanet
```

运行miner组件, 首先需要写入访问节点的api及其token
```sh
mkdir ~/.venus
echo venus_api > ~/.lotus/api       #api从节点中获取
echo venus_token > ~/.lotus/token   #token从节点中获取
```

运行挖矿软件

```sh
TRUST_PARAMS=1 ./venus-miner init
TRUST_PARAMS=1 ./venus-miner run
```

### venus-messager

messager用户管理集群中所有的消息，保证消息上链，控制消息的流量，重试等。messager对接多个钱包，扫描其地址，监控这些地址所属交易的状态，接收这些地址发送的消息服务

编译messager组件
```sh
git clone https://github.com/ipfs-force-community/venus-messager.git
make deps
make
```

运行messager组件，编辑messager.toml配置文件，修改node下的url和token， 配置成节点中获取的地址和token

```toml
[address]
  remoteWalletSweepInterval = 10

[api]
  Address = "127.0.0.1:39812"

[db]
  type = "sqlite"

  [db.mysql]
    addr = ""
    connMaxLifeTime = "0s"
    maxIdleConn = 0
    maxOpenConn = 0
    name = ""
    pass = ""
    user = ""

  [db.sqlite]
    path = "./message.db"
    debug = false

[jwt]
  expireDuration = "0s"
  secret = ""

[log]
  path = "messager.log"

[messageService]
  isProcessHead = true
  tipsetFilePath = "./tipset.txt"

[messageState]
  CleanupInterval = 86400
  DefaultExpiration = 259200
  backTime = 86400

[node]
    url = "/ip4/127.0.0.1/tcp/3453" #修改此处
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJhbGwiXX0.8dSWe7S53eF1Ue6XfYUUN-vPSfUWL12xyWkOJv6DNks" #修改此处

```

执行命令
```sh
./venus-messager -c ./messager.toml
```

## 配置矿工启动本地组件

本地组件用于本地封装算力。sealer部分是必选的，wallet部分则属于可选的，可以几个sealer集群共享一个wallet，也可以每个sealer单独配备一个wallet。可以根据实际需求来处理。

### venus-wallet
钱包用于保管私钥，对外提供签名服务，以及签名策略。

编译钱包组件
```sh
git clone https://github.com/ipfs-force-community/venus-wallet.git
make
```

运行钱包组件
```sh
./venus-wallet run
```

设置钱包密码
```sh
./venus-wallet set-password
```

创建新地址
```sh
./venus-wallet new bls
```

获取钱包授权token及地址
```sh
./venus-wallet auth api-info --perm sign
```

### 注册钱包到messager
在messager上运行命令
```sh
./venus-messager wallet add --name test01 --url /ip4/x.x.x.x/tcp/5678/http --token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.8R1Tr6FFIuCDq4Y-nmGufojmhQeTdqKsDUOl5vFpEt4
```
此命令运行后，messager会扫描钱包的地址，并对这些地址的消息进行控制管理。

### 创建地址
在钱包上创建一个地址
```sh
./venus-wallet new bls
```

从水龙头领取一笔资金***https://faucet.nerpa.interplanetary.dev/funds.html***

### 编译sealer组件
```
git clone https://github.com/ipfs-force-community/venus-messager.git
make deps
make
```

### 初始化sealer矿工
```sh
#不存在矿工
./venus-sealer init --worker t3uhywoqyqhk2mlhy4yqle3ccy4pyddeelbfj6dlojvm6ehvtnl6xw577vdolrd4pkn3gbz26f5o3hx2usoveq --owner t3uhywoqyqhk2mlhy4yqle3ccy4pyddeelbfj6dlojvm6ehvtnl6xw577vdolrd4pkn3gbz26f5o3hx2usoveq --sector-size 512M --network nerpa --node-url /ip4/x.x.x.x/tcp/3453 --node-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJhbGwiXX0.R6UZS9i6Y9vqAF-O4Z6y74uDK_8jT0M7OzqrrbNQ3II --messager-url http://x.x.x.x:39812/rpc/v0
./venus-sealer init --actor t0t01076xxx  --sector-size 512M --network nerpa --node-url /ip4/x.x.x.x/tcp/3453 --node-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJhbGwiXX0.R6UZS9i6Y9vqAF-O4Z6y74uDK_8jT0M7OzqrrbNQ3II --messager-url http://x.x.x.x:39812/rpc/v0

#初始化已存在矿工
./venus-sealer init --actor t01076 --sector-size 512M --network nerpa --node-url /ip4/x.x.x.x/tcp/3453 --node-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJhbGwiXX0.R6UZS9i6Y9vqAF-O4Z6y74uDK_8jT0M7OzqrrbNQ3II --messager-url http://x.x.x.x:39812/rpc/v0
./venus-sealer init --actor t0t01076  --sector-size 512M --network nerpa --node-url /ip4/x.x.x.x/tcp/3453 --node-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJhbGwiXX0.R6UZS9i6Y9vqAF-O4Z6y74uDK_8jT0M7OzqrrbNQ3II --messager-url http://x.x.x.x:39812/rpc/v0
```

### 运行矿工
```sh
./venus-sealer run
./venus-sealer sectors pledge #封装算力
```


获取sealer的token及地址
```sh
cat ~/.venussealer/api  #此处如何ip是127.0.0.1需要修改配置文件的api监听地址，如果是0.0.0.0使用的时候需要改用具体的地址
cat ~/.venussealer/token
```


### 加入联合挖矿
矿工初始化完成后，需要把这个矿工加入到venus-miner里面,在venus-miner机器上执行如下指令。此处需要访问sealer获取数据证明，需要访问wallet获取签名能力。
```sh
./venus-miner address add --addr t01079 --sealer-listen-api /ip4/127.0.0.1/tcp/2345/http --sealer-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.Gie-HxhQhp106J-DXFYJyuqcX4DFGaTjf44FOssUeX4 --wallet-listen-api /ip4/0.0.0.0/tcp/5678/http --wallet-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.8R1Tr6FFIuCDq4Y-nmGufojmhQeTdqKsDUOl5vFpEt4
```