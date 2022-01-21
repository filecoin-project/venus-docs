# Venus Market

venus-gateway 是用于filecoin市场接受订单并提供检索功能的组件， 包括一个market组件和market客户端组件。用户可以使用venus-market配置venus-sealer完成市场订单的功能。 市场组件需要依赖venus来提供链信息服务，需要连接messager来提供消息推送服务，需要连接钱包提供签名服务。

## 快速启动

### 下载代码

```shell script
git clone https://github.com/filecoin-project/venus-market.git
```

### 编译

```shell script
make deps
make
```

### 启动市场服务

作为venus服务层运行
```shell script
./venus-market pool-run --auth-url <auth url> --node-url <node url> --messager-url <messager url>  --gateway-url <signer url>  --auth-token <auth token>  --piecestorage fs:/xx  --payment-addr <addr:account>
```

单人运行
```shell script
./venus-market solo-run --node-url <node url>  --node-token <auth token> --wallet-url <local wallet url>  --wallet-token <local wallet token>   --piecestorage fs:/xx --miner <f0xxx>  --payment-addr <addr:account>
```

设置peerid和address

```shell script
./venus-market net  listen  查看market地址和id
./venus-market actor set-peer-id --miner <f0xxxx> <id>   设置peerid
./venus-market actor set-addrs --miner <f0xxxx> <addr>   设置矿工的服务地址
./venus-market actor info --miner <f0xxxx>               查看矿工的peerid和服务地址
```

设置矿工的存储ask
```shell script
./venus-market storage-deals set-ask --price <price> --verified-price <price> --min-piece-size  <minsize >=256B>  --max-piece-size <max size <=sector-size> --miner <f0xxxx>
```
设置矿工检索ask
```shell script
./venus-market retrieval-deals set-ask --price <pirce> --unseal-price <price> --payment-interval <bytes> --payment-interval-increase <bytes> --payment-addr <fxxx>
```

### 启动市场客户端

使用消息池的模式

```shell script
./market-client run --node-url <node url> --messager-url <messager-url> --auth-token <auth token>  --wallet-url <wallet url> --wallet-token  <wallet token> --addr <client default address>
```

使用本地钱包签名的模式
```shell script
./market-client run --node-url <node url> --node-token <auth token>  --wallet-url <wallet url> --wallet-token  <wallet token> --addr <client default address>
```



发起订单命令

```shell script
 ./market-client data import <file>  导入文件
 ./market-client storage deals init  交互式命令开始发送订单，一次根据提示输入数据cid，数据生命周期，yes接受订单设置之后，订单发起成功
```

### 检索数据流程

```shell
./market-client retrieval retrieve --miner <miner addr> --maxPrice <max price> <data-cid> <dst path>
```

## 客户端操作指南

客户端命令行和lotus的类似。
### 数据相关

导入数据
```shell script
./market-client data import <file>
```

删除数据
```shell script
 ./market-client data drop <data id>
```

显示本地数据
```shell script
 ./market-client data local
```

查看本地导入的数据状态
```shell script
 ./market-client data stat
```

### 检索相关

查找检索数据的位置
```shell script
 ./market-client retrieval find <data id>
```

检索数据
```shell script
 ./market-client retrieval retrieve --miner <minerid>  --maxPrice <price> <data id> <output file>
```

取消数据检索
```shell script
 ./market-client retrieval cancel-retrieval  --deal-id <deal id>
```

显示在检索的订单
```shell script
 ./market-client retrieval list-retrievals 
```

### 存储相关

发起存储订单
```shell script
 ./market-client storage deals init
```

查询矿工的要求（价格，等）
```shell script
 ./market-client storage asks query-ask    
```


显示本地存储订单列表
```shell script
 ./market-client storage deals list-deals   
```

显示存储订单详情
```shell script
 ./market-client storage deals get-deal
```

显示头部矿工的要求信息
```shell script
 ./market-client storage asks list-asks     List asks for top miners
```

查看本地存储订单的状态
```shell script
 ./market-client storage asks deal-stats    Print statistics about local storage deals
```

查看存储订单的详细信息
```shell script
 ./market-client storage deals inspect-deal
 ```

### 工具命令

计算car文件的piececid
```shell script
 ./market-client data commP <file>
 ```

把文件转换成car文件
```shell script
 ./market-client data generate-car <file> <car file>
 ```
 
 查看市场中抵押的资产情况
```shell script
./market-client actor-funds balances
 ```


查看正在进行的数据传输
```shell script
 ./market-client transfer list-transfers 
 ```

重启数据传输
```shell script
./market-client transfer restart-transfer <transfer id>
 ```

取消数据传输
```shell script
./market-client transfer cancel-transfer  <transfer id>
 ```

 ### 市场命令行指南

 piece相关指令

 * `./venus-market pieces list-pieces`  列出本地接收到的pieces
 * `./venus-market pieces list-cids`  列出本地接受的数据id
 * `./venus-market pieces piece-info <piece cid>` 列出piece数据订单情况
 * `./venus-market pieces cid-info <data cid>` 列出数据cid
  
检索命令

*  `./venus-market retrieval-deals selection` 检索的相关配置
*  `./venus-market retrieval-deals list` 列出激活状态的订单
*  `./venus-market retrieval-deals set-ask` 设置检索订单要求
*  `./venus-market retrieval-deals get-ask` 查看设置的检索订单要求

存储命令
* `./venus-market storage-deals import-data` 手动导入订单数据
* `./venus-market storage-deals list` 列出本地存储订单
* `./venus-market storage-deals selection` 存储市场相关配置命令
* `./venus-market storage-deals set-ask` 设置存储市场的要求
* `./venus-market storage-deals get-ask` 查看现在的存储市场的要求
* `./venus-market storage-deals set-blocklist` 设置数据黑名单
* `./venus-market storage-deals get-blocklist` 查看设置的数据黑名单
* `./venus-market storage-deals reset-blocklist` 重制黑名单
* `./venus-market storage-deals set-seal-duration` 设置seal的时间
* `./venus-market storage-deals pending-publish` 查看挂起的发布订单消息

网络命令

* `./venus-market net listen` 查看本地libp2p网络的地址及peerid
* `./venus-market net id` 查看本地libp2p网络的peerid

actor 命令

* `./venus-market actor info` 查看矿工的peer和路径信息
* `./venus-market actor set-addrs` 设置矿工的监听网址
* `./venus-market actor set-peer-id` 设置矿工的peer id

数据流管理命令

* `./venus-market data-transfers list` 列出本地的数据流
* `./venus-market data-transfers restart` 重启本地数据流
* `./venus-market data-transfers cancel`  取消数据流传输

dagstore检索数据管理

* `./venus-market dagstore list-shards` 列出本地所有的数据文件状态
* `./venus-market dagstore initialize-shard <piece cid>` 初始化数据文件
* `./venus-market dagstore recover-shard <piece cid>` 恢复错误的数据文件
* `./venus-market dagstore gc` 清理dagstore垃圾文件

