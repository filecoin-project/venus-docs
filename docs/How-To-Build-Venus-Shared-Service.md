# venus集群组件介绍
- venus 是 Filecoin 网络的四大实现方式之一，旨在开发一套更加简单、便捷、安全、高效的分布式矿池系统。其组件按照部署方式划分为两类：共享组件和独立组件。
- 共享组件包括：venus、venus-auth、venus-gateway、venus-miner、venus-messager，顾名思义，很多集群可以共享一套venus的服务组件，如果用户使用了共享组件，只需将尽力放在算力增长与维持方面。
- 独立组件包括：venus-sealer、venus-worker，用于算力的累积与维持，其部署数量也因集群大小而不同，每个集群需根据自身需求部署及维护相关组件。
- venus-wallet可以作为共享组件也可以独立部署，出于安全考虑，最好每个集群单独部署venus-wallet，管理钱包私钥及签名服务。
----------------------------------------------------------------------------

![venus-cluster](./images/venus-cluster.png)

# venus共享服务搭建

___本文档基于nerpa网路进行说明___


| 程序           | 服务器  | 类型   | 作用                                                                                         |
| -------------- | ------- | ------ | -------------------------------------------------------------------------------------------- |
| venus-auth     | \<IP1\> | 共享   | venus-auth 用于统一授权，当矿工组件访问共享组件的时候需要使用此服务注册生成的token|
| venus-gateway  | \<IP2\> | 共享   | venus-miner/venus-message与venus-sealer/venus-wallet间数据交互的桥梁|
| venus          | \<IP3\> | 共享   | 链数据同步及提供查询 |
| venus-messager | \<IP4\> | 共享   | 管理集群中的消息，保证消息上链，控制消息流量，重试等。可对接多个钱包，针对这些钱包做消息管理 |
| venus-miner    | \<IP5\> | 共享   | 负责多矿工的出块逻辑,调用venus-gateway进行数据签名或ComputeProof |                                                                              |

Tips:
 - 以下所有`<>`都是需替换参数，根据自己的实际情况替换
 - 具体版本请自行使用git checkout选择 
 - 环境依赖：
     - golang ^1.16
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git

## 1. venus-auth Install
### 编译

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git

$ cd venus-auth

$ make 
```

### 配置项介绍
- venus-auth服务默认配置文件目录为 ~/.venus-auth/config.toml
- 存储方案默认为badger内嵌kv数据库，也支持MYSQL存储，需要自行修改配置文件后启动。
- log存储默为控制台打印，同时支持influxDB存储

#### MYSQL存储启动（可选）
Tips: MYSQL支持5.7以上官方版本（如云平台MYSQL默认设置各有不同，请自己结合云平台修改配置，否则可能会出现 “ Specified key was too long; max key length is 767 bytes ”）

##### 修改venus-auth config中的db设置
```shell script
$ vim ~/.venus-auth/config.toml

# 数据源配置项
[db]
# support: badger (default), mysql 
# the mysql DDL is in the script package 
type = "mysql" 
# The following parameters apply to MySQL
DSN = "root:111111@(127.0.0.1:3306)/venus_auth?parseTime=true&loc=Local&charset=utf8mb4&collation=utf8mb4_unicode_ci&readTimeout=10s&writeTimeout=10s"
# conns 1500 concurrent
maxOpenConns = 64
maxIdleConns = 128
maxLifeTime = "120s"
maxIdleTime = "30s"

```
### 启动
```shell script
$ nohup ./venus-auth > auth.log 2>&1 &
```

### 生成组件互相访问需要的token

```shell script
$ ./venus-auth genToken --perm admin miner
<auth token for venus-miner>

$ ./venus-auth genToken --perm admin messager
<auth token for venus-messager>

$ ./venus-auth genToken --perm write sealer
<auth token for venus-sealer>

$ ./venus-auth genToken --perm sign wallet
<auth token for venus-wallet>
```
- `<auth token ?>` 格式统一为 JWT token
- 这些token之后会被各个程序使用，用以对集群接入组件做验证
- `--perm`为RPC2.0接口访问权限限制
- venus-miner，venus-messager，venus-wallet,venus-sealer推荐标记为程序名，若存在多个相同程序要加入矿池，需使用“程序名+标记符”。

## 2. venus-gateway Install

```shell script
$ git clone https://github.com/ipfs-force-community/venus-gateway.git

$ cd venus-gateway

$ make

$ nohup ./venus-gateway --listen=/ip4/0.0.0.0/tcp/45132 run --auth-url=http://<IP1>:8989 > gateway.log 2>&1 &
```
- `--authURL` 为设置venus-auth监听http地址

## 3. venus install
### 安装编译环境
```shell script
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```
### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus.git

$ cd venus

$ make deps

$ make

# 启动venus daemon 设置网络与venus-auth的地址
# 启动成功后tail -f venus.log 可以看到数据同步的log
$ nohup ./venus daemon --network nerpa \
--authURL http://<IP1>:8989 \
> venus.log 2>&1 & 
```
- `--authURL` 为设置venus-auth监听http地址

### 修改IPV4监听地址
目前程序启动后默认监听地址为`127.0.0.1:3453`，对于跨服务器集群，需要修改监听策略，可以通过`lsof -i:3453` 查询到进程后，Kill掉进程，修改IPV4策略后重启

```shell script
vim ~/.venus/config.json

# 做如下操作，修改为监听所有本机IPV4地址：
# replace api.apiAddress from 
# "/ip4/127.0.0.1/tcp/3453"  to  "/ip4/0.0.0.0/tcp/3453"

# 修改完毕后重启服务：
$ nohup ./venus daemon --network nerpa \
--authURL http://<IP1>:8989 \
> venus.log 2>&1 & <absolute path>
```

## 4. venus-messager install

### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git

$ cd venus-messager

$ make deps

$ make 

# 启动venus-message 进程
$ nohup ./venus-messager run \
--auth-token <auth token> \
--auth-url=http://<IP1>:8989 \
--node-url /ip4/<IP3>/tcp/3453 \
--gateway-url /ip4/<IP2>/tcp/45132 \
--db-type mysql \
--mysql-dsn "root:111111@tcp(127.0.0.1:3306)/cali_venus?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s" \
> msg.log 2>&1 &

```
- `--auth-url` 为设置venus-auth监听地址
- `--node-url` 为venus监听地址
- `--gateway-url` 为venus-gateway监听地址
- `--auth-token` 为在venus-auth中生成的token，用于和venus通信时的身份验证

## 5. venus-miner install

### 编译并启动

```shell script
$ git clone https://github.com/filecoin-project/venus-miner.git

$ cd venus-miner

$ make

# 初始化环境配置
$ ./venus-miner init  --nettype=nerpanet \
  --api=<venus/lotus api> --token=<auth token for venus-miner> \
  --auth-api=http://[IP1]:[auth_port] \
  --gateway-api=<venus-gateway api>

# 启动miner
$ nohup ./venus-miner run --nettype=nerpanet > miner.log 2>&1 &
```
- `--token` 为在venus-auth中生成的token，用于和venus-gateway/venus通信时的身份验证

### 矿工更新及查询
```shell script
# 更新miners,从venus-auth获取联合挖矿的矿工列表
$ ./venus-miner address update
- skip,limit为分页参数,标识从skip索引开始往后查询limit个miner

# 查询miner状态
$ ./venus-miner address state 
# print
[
	{
		"Addr": "<miner Addr>",
		"IsMining": true,
		"Err": ""
	}
]

# 如果IsMining为false
# 需要执行
$ ./venus-miner address start <miner Addr>

# 因为miner支持多矿工
# 可以通过以下指令查看所有关联矿工
# 对于矿工的启停可以自行安排
$ ./venus-miner address list
```
- `<miner Addr>`为矿工地址，为执行venus-sealer init创建或从相关网站获取，可在[venus-sealer install](How-To-Access-Venus-Shared-Service.md)部分查看
