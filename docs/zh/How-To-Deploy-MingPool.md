# Venus集群组件介绍
Venus是Filecoin分布式矿池的实现方案之一，系统集群组件包括：Venus，Venus-auth，Venus-miner，Venus-wallet，Venus-messager，Venus-sealer。从概念上理解其中Venus、Venus-auth、Venus-miner、Venus-wallet、Venus-messager具备可共用性（即程序可被多个矿工身份使用，在保证效率的情况下使硬件，软件资源得到充分利用），而Venus-sealer、Venus-worker、Venus-wallet主要用于积累算力。Venus-wallet属于可选组件，基于部署情况的安全性考量，Venus-wallet可以共享使用，也可以本地部署。本篇文档为nerpda测试网络下的集群部署。


![venus-cluster](./images/venus-cluster.png)
# Venus集群部署（基于nerpa测试网）


程序 | 服务器 | 类型 | 作用
--- | --- | --- | ---
Venus-auth     |   \<IP1\> | 共享| 统一授权,当矿工组件访问共享组件的时候需要使用此服务注册生成的token
Venus-wallet   |   \<IP2\> | 共享| 钱包管理,数据签名
Venus          |   \<IP3\> | 共享| Filecoin节点数据同步
Venus-messager |   \<IP4\> | 共享| 管理集群中的消息,保证消息上链,控制消息流量,重试等;可对接多个钱包,针对这些钱包做消息管理
Venus-miner    |   \<IP5\> | 共享| 负责多矿工的出块逻辑,调用venus-gateway进行数据签名或ComputeProof
Venus-gateway  |   \<IP6\> | 共享| 服务组件与venus-sealer间数据交互的桥梁
Venus-sealer   |   \<IP7\> | 非共享| 数据封装

共享组件启动顺序: venus-auth --> venus --> venus-gateway --> venus-wallet --> venus-messager --> venus-miner

Tips:
 - 以下所有`<>`都是需替换参数，根据自己的实际情况替换
 - 具体版本请自行使用git checkout选择 
 - 环境依赖：
     - golang ^1.16
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git

## 1. Venus-auth Install
### 编译并启动

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git

$ cd venus-auth

$ make 

$ nohup ./venus-auth > auth.log 2>&1 &

```
- Venus-auth服务默认配置文件目录为 ~/.venus-auth/config.toml
- 存储方案默认为badger内嵌kv数据库，也支持MYSQL存储，需要自行修改配置文件后启动。
- log存储默为控制台打印，同时支持influxDB存储

#### MYSQL存储启动（可选）
Tips: MYSQL支持5.7以上官方版本（如云平台MYSQL默认设置各有不同，请自己结合云平台修改配置，否则可能会出现 “ Specified key was too long; max key length is 767 bytes ”）

##### 修改Venus-auth config中的db设置
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
- 启动
```shell script
$ nohup ./venus-auth > auth.log 2>&1 &
```

### 注册生成各个组件的token

```shell script
$ ./venus-auth genToken --perm admin miner
<auth token miner>

$ ./venus-auth genToken --perm admin messager
<auth token messager>

$ ./venus-auth genToken --perm admin sealer
<auth token sealer>

```
- `<auth token ?>` 格式统一为 JWT token
- 这些token之后会被各个程序使用，用以对集群接入组件做验证
- `--perm`为RPC2.0接口访问权限限制
- miner，messager，sealer，推荐标记为程序名，若存在多个相同程序要加入集群，可以使用“程序名+标记符”。


## 2. Venus install
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

# 启动venus daemon 设置网络与Venus-auth的地址
# 启动成功后tail -f venus.log 可以看到数据同步的log
$ nohup ./venus daemon --network nerpa \
--authURL http://<IP1>:8989 \
> venus.log 2>&1 & 
```
- `--authURL` 为设置Venus-auth监听http地址

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


## 3. Venus-wallet install
### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus-wallet.git

$ cd venus-wallet 

# 编译
$ make

# 执行run,生成配置文件
./venus-wallet run
```

### 修改配置文件,配置venus-gateway连接信息
```toml
[APIRegisterHub]
  RegisterAPI = ["/<IP6>/tcp/45132"]   //gateway 对外的端口地址
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibGlfd2FsbGV0IiwicGVybSI6InJlYWQiLCJleHQiOiIifQ.gGKBm1VUM_juT9FIuxeW2tlLs5KZeLmf7Cl-kTo9-hU"   //钱包的单独token,venus-auth生成
  SupportAccounts = ["li_sealer"] // 矿工别名,在venus-gateway中验证
```

### 重启
```bash
$ nohup ./venus-wallet run  --network=test > wallet.log 2>&1 &
```

### venus-wallet增加签名的矿工别名
```bash
./venus-wallet support <sealer name> 
``` 

### 设置密码并创建钱包
> 此处创建了2个BLS钱包，用于之后的Venus-sealer初始化
```shell script
# 设置加解锁密码
$ ./venus-wallet setpwd
Password:******
Enter Password again:******

# 生成BLS地址
$ ./venus-wallet new bls
<bls address 1>
$ ./venus-wallet new bls
<bls address 2>
```
- `<bls address 1>` 为86位长度地址
#### 注意
新生成的`<bls address 1>` `<bls address 2>`需要到https://faucet.nerpa.interplanetary.dev/funds.html中预充balance后才能在链上生成actor。

```shell script
$ ./venus-wallet auth api-info --perm admin
<wallet jwt token>
```


## 4. Venus-messager install
### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git

$ cd venus-messager

$ make deps

$ make 

# 启动venus-message 进程
$ nohup ./venus-messager run \
--auth-url=http://<IP1>:8989 \
--node-url /ip4/<IP3>/tcp/3453 \
--node-token <auth token messager> \
--db-type mysql \
--mysql-dsn "root:111111@tcp(127.0.0.1:3306)/cali_venus?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s" \
> msg.log 2>&1 &

```
- `--auth-url` 为设置Venus-auth监听地址
- `--node-url` 为Venus监听地址
- `--node-token` 为使用Venus-auth中注册的JWT token代表自身节点，用于和Venus通信时的身份验证


### 添加钱包链接（可以添加多个钱包链接）
> 这边会周期性监控`Venus-wallet`的钱包可访问地址变化 \
做延时性动态跟踪，依赖于`Venus-wallet`处的`list`接口
```shell script
$ ./venus-messager wallet add \
--name testminer --url /ip4/<IP2>/tcp/5678/http \
--token <wallet jwt token> 

# 查询钱包列表
$ ./venus-messager wallet list
```
- `--name` 为给Venus-messager添加钱包链接命名
- `--url` 为设置Venus-wallet监听地址
- `--token` 为设置Venus-wallet中获得的接口授权JWT token,查看Venus-wallet install中`<wallet jwt token>`处可查看token如何获得

## 5. Venus-sealer install

### 编译并启动（sealer单程序只能绑定一个矿工）
```shell script
$ git clone https://github.com/filecoin-project/venus-sealer.git

$ cd venus-sealer

$ make deps

$ make

```

### 生成token,用于与共享组件数据交互时验证
```bash
./venus-auth addUser --miner <t0 addr> --srouceType 1  --name <miner name>
./venus-auth genToken --perm write sealer
```

### 配置文件变化,增加venus-gateway的连接配置
```toml
  [RegisterProof]
    Urls = ["/ip4/<IP6>/tcp/45132"]
    Token="<venus-auth token"
```

#### 初始化新矿工（2选1）
```shell script
$ nohup ./venus-sealer init \
--worker <bls address 1> \
--owner <bls address 2>  \
--sector-size 512M \
--network nerpa \
--auth-token <venus-auth token> \
--messager-url /ip4/<IP4>/tcp/39812/http \
--node-url /ip4/<IP3>/tcp/34530/http \
--gateway-url /ip4/<IP6>/tcp/45132/http \
--no-local-storage \
> sealer.log 2>&1 &

```

#### 初始化已存在矿工（2选1）
> 不需要指定`--sector-size`
```shell script
$ ./venus-sealer init \
--actor <t0 addr>  \
--network nerpa \
--auth-token <venus-auth token> \
--node-url /ip4/<IP3>/tcp/3453 \
--messager-url http://<IP4>:39812/rpc/v0 \
--gateway-url /ip4/<IP6>/tcp/45132/http \
--no-local-storage \
--wallet-name testminer 

# 查看日志等待消息上链注册actor地址
2021-04-25T18:41:31.925+0800	INFO	main	venus-sealer/init.go:182	Checking if repo exists
2021-04-25T18:41:31.926+0800	INFO	main	venus-sealer/init.go:217	Checking full node version
2021-04-25T18:41:31.927+0800	INFO	main	venus-sealer/init.go:233	Initializing repo
2021-04-25T18:41:31.928+0800	INFO	main	venus-sealer/init.go:309	Initializing libp2p identity
2021-04-25T18:41:32.082+0800	INFO	main	venus-sealer/init.go:485	Pushed CreateMiner message: aaf489f9-af4b-4e4b-9084-018d43f05b7e
2021-04-25T18:41:32.082+0800	INFO	main	venus-sealer/init.go:486	Waiting for confirmation
2021-04-25T18:46:32.088+0800	INFO	main	venus-sealer/init.go:502	New miners address is: t01640 (t2cxzf7xvrqo3froqn2xgdqjdbydhkcrgakj7j3ma)
2021-04-25T18:46:32.088+0800	INFO	main	venus-sealer/init.go:381	Created new miner: t01640
2021-04-25T18:46:32.089+0800	INFO	main	venus-sealer/init.go:302	Sealer successfully created, you can now start it with 'venus-sealer run'

```

- `<bls address 1>`  `<bls address 2>` 为Venus-wallet中创建的BLS钱包地址，注意这2个钱包地址都需要有balance
- `<auth token sealer>`为Venus-auth中注册的JWT token
- `<absolute path>`为绝对路径

#### 启动sealer并执行sector封装

```shell script
$ nohup ./venus-sealer run >> sealer.log 2>&1 &

# 指定存储目录(可选)
# 因为指定了--no-local-storage
# 所以需要指定sealer存储目录
$ ./venus-sealer storage attach --init --store --seal <absolute path>

# 执行sector封装，这个命令只支持单次
# 可以通过crontab 做定时任务，也可以自行编写策略脚本执行
$ ./venus-sealer sectors pledge 

# 查看sector列表
$ ./venus-sealer sectors list

# 查看actor地址
# 这里为<t0 addr>
$ ./venus-sealer info

Chain: [sync ok] [basefee 100 aFIL]
Sealer: <t0 addr> (512 MiB sectors)
Power: 0  / 15 Ti (0.0000%)
	Raw: 0 B / 1.5 TiB (0.0000%)
	Committed: 3 GiB
	Proving: 0 B
Below minimum power threshold, no blocks will be won
Sealer Balance:    383.869 FIL
      PreCommit:  0
      Pledge:     93.75 mFIL
      Vesting:    0
      Available:  383.775 FIL
Market Balance:   0
       Locked:    0
       Available: 0
Worker Balance:   1000 FIL
Total Spendable:  1383.775 FIL
```

## 6. Venus-miner install

### 编译并启动

```shell script
$ git clone https://github.com/filecoin-project/venus-miner.git

$ cd venus-miner

$ make

# 初始化环境配置
$ ./venus-miner init  --nettype=nerpanet \
--api=<venus/lotus api> --token=<auth token miner> \
--auth-api=http://[auth_ip]:[auth_port] \
--gateway-api=<venus-gateway api>

# 启动miner
$ nohup ./venus-miner run --nettype=nerpanet > miner.log 2>&1 &


# 更新miners,从venus-auth获取联合挖矿的矿工列表
$ ./venus-miner address update
- skip,limit为分页参数,标识从skip索引开始往后查询limit个miner


# 查询miner状态
$ ./venus-miner address state 
# print
[
	{
		"Addr": "<t0 addr>",
		"IsMining": true,
		"Err": ""
	}
]

# 如果IsMining为false
# 需要执行
$ ./venus-miner address start <t0 addr>

# 因为miner支持多矿工
# 可以通过以下指令查看所有关联矿工
# 对于矿工的启停可以自行安排
$ ./venus-miner address list
```

### 将miner的地址添加到Venus-auth中
```
$  ./venus-auth addUser --miner <t0 addr> --srouceType 1  --name <miner name>
```
- `miner name`自定义的miner名称，用于识别



## 7. 问题相关

1. go mod 出先如下问题

```shell script
SECURITY ERROR
This download does NOT match an earlier download recorded in go.sum.
The bits may have been replaced on the origin server, or an attacker may
have intercepted the download attempt.


# 解决方案
go clean -modcache
go mod tidy
```
