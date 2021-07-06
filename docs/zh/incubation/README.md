# Venus集群组件介绍

&ensp;&ensp; Venus是Filecoin分布式矿池的实现方案之一， venus架构设计中包括venus、venus-miner、venus-sealer、venus-messager、venus-wallet、venus-auth、venus-gateway，以及在计划中的venus-market。在经典的架构中venus、venus-miner、venus-auth、venus-messager、venus-market、venus-gateway是作为公共组件存在，venus-sealer（包含venus-worker）、venus-wallet作为本地组件存在。
                           
&ensp;&ensp; 公共组件可以由服务商或者多个矿工联合建立，而矿工只需要在本地运行venus-sealer、venus-worker、venus-wallet即可。实际上Venus的所有组件都是面向协议的，如果矿工有足够的技术实力，也可以把公共组件的全部或者部分部署在本地，这样矿工可以更灵活的部署。

![venus-cluster](../../.vuepress/public/venus-cluster.png)

## venus集群部署（基于nerpa测试网）


| 程序           | 服务器  | 类型   | 作用                                                                                         |
| -------------- | ------- | ------ | -------------------------------------------------------------------------------------------- |
| venus-auth     | \<IP1\> | 共享   | venus-auth 用于统一授权，当矿工组件访问共享组件的时候需要使用此服务注册生成的token                       |
| venus-gateway  | \<IP2\> | 共享   | 桥接部分接口调用                                                                                |
| Venus          | \<IP3\> | 共享   | Filecoin节点数据同步                                                                            |
| venus-messager | \<IP4\> | 共享   | 管理集群中的消息，保证消息上链，控制消息流量，重试等。可对接多个钱包，针对这些钱包做消息管理                  |
| venus-miner    | \<IP5\> | 共享   | 打包出块消息，可配置多个矿工，会自行计算矿工出块情况，并通过远程访问Venus-sealer获取数据证明 |
| venus-wallet   | \<IP6\> | 共享   | 钱包管理，数据签名                                                                           |
| venus-sealer   | \<IP7\> | 非共享 | 数据封装                                                                                     |


Tips:
 - 以下所有`<>`都是需替换参数，根据自己的实际情况替换
 - 具体版本请自行使用git checkout选择 
 - 环境依赖：
     - golang ^1.16
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git



## 服务搭建
### 1. venus-auth Install
#### 编译并启动

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git

$ cd venus-auth

$ make 

$ nohup ./venus-auth > auth.log 2>&1 &

```
- venus-auth服务默认配置文件目录为 ~/.venus-auth/config.toml
- 存储方案默认为badger内嵌kv数据库，也支持MYSQL存储，需要自行修改配置文件后启动
- log存储默为控制台打印，同时支持influxDB存储

##### MYSQL存储启动（可选）
>MYSQL支持5.7以上官方版本（如云平台MYSQL默认设置各有不同，请自己结合云平台修改配置，否则可能会出现 “ Specified key was too long; max key length is 767 bytes ”）

&ensp;&ensp; 修改venus-auth config中的db设置,重启后生效
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

#### 注册生成云上组件互相访问需要的JWT token

```shell script
$ ./venus-auth genToken --perm admin admin
<admin token>
```
- 这些token之后会被服务程序使用，用以访问API时做验证
- `--perm`为RPC2.0接口访问权限限制
- admin为虚拟的权限拥有者，可以随意指定。venus-miner、venus-messager及venus-sealer，推荐标记为程序名，若存在多个相同程序加入矿池服务组件，推荐使用“程序名+标记符”。

### 2. venus-gateway Install

```shell script
$ git clone https://github.com/ipfs-force-community/venus-gateway.git
$ cd venus-gateway
$ make

$ nohup ./venus-gateway --listen /ip4/0.0.0.0/tcp/45132 run --auth-url  http://<IP1>:<Port1> > gateway.log 2>&1 &
```

### 3. venus install
#### 安装编译环境
```shell script
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```
#### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus.git

$ cd venus

$ make deps

$ make

# 启动venus daemon 设置网络与venus-auth的地址
# 启动成功后tail -f venus.log 可以看到数据同步的log
# 同步的时间取决于当前高度与本地高度的差距
$ nohup ./venus daemon --network nerpa --authURL=http://<IP1>:<Port1> > venus.log 2>&1 & 
```
- `--authURL` 为设置Venus-auth监听http地址

#### 修改IPV4监听地址
目前程序启动后默认监听地址为`127.0.0.1:3453`，对于跨服务器集群，需要修改监听策略，重启生效。

```shell script
vim ~/.venus/config.json

# 监听所有本机IPV4地址：
# "/ip4/127.0.0.1/tcp/3453"  to  "/ip4/0.0.0.0/tcp/3453"
```

### 4. venus-messager install
#### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git

$ cd venus-messager

$ make deps

$ make 

# 启动venus-message 进程
$ nohup ./venus-messager run \
--auth-url=http://<IP1>:<Port1> \
--node-url /ip4/<IP3>/tcp/<Port3> \
--gateway-url /ip4/<IP2>/tcp/<Port2> \
--auth-token <admin token> \
--db-type mysql \
--mysql-dsn "root:111111@tcp(127.0.0.1:3306)/cali_venus?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s" \
> msg.log 2>&1 &

```
- `--auth-url` 为设置venus-auth监听地址
- `--node-url` 为venus监听地址
- `--gateway-url` 为venus-gateway监听地址
- `--auth-token` 为在venus-auth中生成的管理员token，用于和Venus通信时的身份验证

### 5. venus-miner install

#### 编译并启动

```shell script
$ git clone https://github.com/filecoin-project/venus-miner.git

$ cd venus-miner

$ make

# 初始化环境配置
$ ./venus-miner init --nettype=<nerpa> ---auth-api=/ip4/<IP1>/tcp/<Port1> \
   --gateway-api=/ip4/<IP2>/tcp/<Port2> --api=/ip4/<IP3>/tcp/<Port3> \
   --token <admin token>

# 启动
$ nohup ./venus-miner run > miner.log 2>&1 &
```
&ensp;&ensp; 每次启动时会从venus-auth请求当前已加入venus分布式矿池中的miner列表,可以根据命令查询:
```
$ ./venus-miner address state 
[
	{
		"Addr": "<MINER_ID>",
		"IsMining": true,
		"Err": null
	}
]
```
&ensp;&ensp; 如果某个矿工的IsMining=false,说明该矿工因为某些错误导致没能正常启动出块逻辑,这时需要人工排查并修正后,执行下列命令:
```
$ ./venus-miner address start <MINER_ID> 
```

&ensp;&ensp; 如果有新的矿工加入或已有矿工退出矿池,可以执行下列命名重新拉取矿工列表:
```
$ ./venus-miner address update
```

## 本地组件搭建

### 准备工作

- 服务组件venus-auth需要为venus-sealer生成标识信息，比如：具有write权限的token，集群别明等，这些作为独立组件访问服务的必要信息，需要在请求API中带入：
```shell script
 ./venus-auth addUser --name=<集群别名> --miner=<矿工地址>
 ./venus-auth genToken --perm write  <集群别名>
```

- 服务组件venus-auth需要为每个集群的venus-wallet生成具有wallet权限的token，用于向venus-gateway注册服务时验证请求合法性：
```shell script
./venus-auth genToken --perm write  <wallet别名,目前可以随意起>
```

### 1. venus-wallet install
#### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus-wallet.git

$ cd venus-wallet 

$ make

$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

#### 设置密码并创建钱包
> 此处创建2个BLS钱包，用于之后的venus-sealer创建矿工时的 worker 和 owner。
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

>新生成的`<bls address 1>` `<bls address 2>`需要到https://faucet.nerpa.interplanetary.dev/funds.html中预充balance后才能在链上生成actor。

#### 设置访问权限

```toml
# Default config:
[API]
  ListenAddress = "/ip4/0.0.0.0/tcp/5678/http"

[DB]
  Conn = "/root/.venus_wallet/keystore.sqlit"
  Type = "sqlite"
  DebugMode = true

[JWT]
  Token = "65794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a42624778766479493657794a795a57466b4969776964334a70644755694c434a7a615764754969776959575274615734695858302e7a534c6755446565514e6473716f666179415235445a6f4b4f48787742566855364c635636716154586663"
  Secret = "96d3bbf96ee0151a0495146bccd4825e81e12c24ed8307456a286066a610d52d"

[Factor]
  ScryptN = 262144
  ScryptP = 1

[Strategy]
  Level = 0
  NodeURL = ""

[APIRegisterHub]   //修改此处 上面勿动
RegisterAPI = ["/ip4/<IP2>/tcp/<Port2>"]
Token = "<wallet token>"
SupportAccounts = ["集群别名"]
```

### 2. venus-sealer install

#### 编译
```shell script
$ git clone https://github.com/filecoin-project/venus-sealer.git

$ cd venus-sealer

$ make deps

$ make
```
#### 初始化新矿工（2选1）
```shell script
$ ./venus-sealer init --worker=<bls address 1> --owner=<bls address 2> --sector-size=512M --network=nerpa \
--node-url=/ip4/<IP3>/tcp/<Port3> --messager-url=/ip4/<IP4>/tcp/<Port4> --gateway-url=/ip4/<IP2>/tcp/<Port2> \
--auth-token=<auth token> \
--no-local-storage
```

#### 初始化已存在矿工（2选1）
> 不需要指定`--sector-size`
```shell script
$ ./venus-sealer init --actor=<t0 addr> --network=nerpa \
--node-url=/ip4/<IP3>/tcp/<Port3> --messager-url=/ip4/<IP4>/tcp/<Port4> --gateway-url=/ip4/<IP2>/tcp/<Port2> \
--auth-token <auth token> \
--no-local-storage

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
- `<miner token>`为Venus-auth中注册的sealer
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


#### 封装速率

- venus-sealer启动时默认会检查参数文件，需要很长时间，在确保参数文件已存在的情况下可以关闭检查：
```shell script
TRUST_PARAMS=1
```

- venus-sealer运行时可通过调整某些环境变量的值以最大利用系统资源，加快封装速度：
```shell script
# See https://github.com/filecoin-project/bellman
export BELLMAN_CPU_UTILIZATION=0.875

# See https://github.com/filecoin-project/rust-fil-proofs/
export FIL_PROOFS_MAXIMIZE_CACHING=1 # More speed at RAM cost (1x sector-size of RAM - 32 GB).
export FIL_PROOFS_USE_GPU_COLUMN_BUILDER=1 # precommit2 GPU acceleration
export FIL_PROOFS_USE_GPU_TREE_BUILDER=1

# The following increases speed of PreCommit1 at the cost of using a full
# CPU Core-Complex rather than a single core. Should be used with CPU affinities set!
# See https://github.com/filecoin-project/rust-fil-proofs/ and the seal workers guide.
export FIL_PROOFS_USE_MULTICORE_SDR=1
```

### 问题相关
1. go mod tidy 错误

```shell script
SECURITY ERROR
This download does NOT match an earlier download recorded in go.sum.
The bits may have been replaced on the origin server, or an attacker may
have intercepted the download attempt.


# 解决方案
go clean -modcache
go mod tidy
```
