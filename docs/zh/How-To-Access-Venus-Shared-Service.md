# venus集群组件介绍
- venus 是 Filecoin 网络的四大实现方式之一，旨在开发一套更加简单、便捷、安全、高效的分布式矿池系统。其组件按照部署方式划分为两类：共享组件和独立组件。
- 共享组件包括：venus、venus-auth、venus-gateway、venus-miner、venus-messager，顾名思义，很多集群可以共享一套venus的服务组件，如果用户使用了共享组件，只需将尽力放在算力增长与维持方面。
- 独立组件包括：venus-sealer、venus-worker，用于算力的累积与维持，其部署数量也因集群大小而不同，每个集群需根据自身需求部署及维护相关组件。
- venus-wallet可以作为共享组件也可以独立部署，出于安全考虑，最好每个集群单独部署venus-wallet，管理钱包私钥及签名服务。
----------------------------------------------------------------------------

![venus-cluster](./images/venus-cluster.png)

# venus独立组件部署

___本文档基于nerpa网路进行说明___

| 程序           | 服务器  | 类型   | 作用 |
| -------------- | ------- | ------ | -------------------- |
| venus-wallet   | \<IP6\> | 可共享 | 钱包管理，数据签名   |
| venus-sealer   | \<IP7\> | 非共享 | 数据封装及任务调度   |
| venus-worker   | \<IP8\> | 非共享 | 数据封装             |

Tips:
 - 以下所有`<>`都是需替换参数，根据自己的实际情况替换
 - 具体版本请自行使用git checkout选择 
 - 环境依赖：
     - golang ^1.16
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git

## 准备工作
- 服务组件需要记录新接入矿工并为其生成token，独立组件只有凭借这个token才能使用共享服务；
- 加入流程：需要起一个别名，这里以jimmy为例：

```shell script
$ venus-auth addUser --name jimmy --miner <miner addr>     
$ venus-auth genToken --perm write jimmy
<auth token for jimmy(miner addr)>
```

## 1. venus-wallet install
### 编译并启动
```shell script
$ git clone https://github.com/filecoin-project/venus-wallet.git

$ cd venus-wallet 

$ make

$ nohup ./venus-wallet run > wallet.log 2>&1 &
```

### 设置密码并创建钱包
> 此处创建了2个BLS钱包，用于之后的venus-sealer初始化
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

### 修改配置文件并重启
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

[APIRegisterHub]   //修改此处,上面勿动
RegisterAPI = ["/ip4/<IP2>/tcp/45132"]
Token = "<auth token for miner>"
SupportAccounts = ["jimmy"]
```

## 2. venus-sealer install

### 编译（sealer单程序只能绑定一个矿工）
```shell script
$ git clone https://github.com/filecoin-project/venus-sealer.git

$ cd venus-sealer

$ make deps

$ make
```

#### 初始化新矿工（2选1）
```shell script
$ nohup ./venus-sealer init \
--worker <bls address 1> \
--owner <bls address 2>  \
--sector-size 512M \
--network nerpa \
--node-url /ip4/<IP3>/tcp/3453 \
--messager-url /ip4/<IP3>/tcp/3453 \
--gateway-url /ip4/<IP3>/tcp/3453 \
--auth-token <auth token> \
--no-local-storage \
--wallet-name testminer \
> sealer.log 2>&1 &

```

#### 初始化已存在矿工（2选1）
> 不需要指定`--sector-size`
```shell script
$ ./venus-sealer init \
--actor <t0 addr>  \
--network nerpa \
--node-url /ip4/<IP3>/tcp/3453 \
--messager-url /ip4/<IP3>/tcp/3453 \
--gateway-url /ip4/<IP3>/tcp/3453 \
--auth-token <auth token> \
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

- `<bls address 1>`  `<bls address 2>` 为 venus-wallet 中创建的BLS钱包地址，注意这2个钱包地址都需要有balance
- `<miner token>`为 venus-auth 中注册的sealer
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


## 3. 问题相关

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





