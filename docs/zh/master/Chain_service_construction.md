## 链服务搭建篇

&ensp;&ensp; 便于集群的横向扩展是venus的设计初衷，venus团队致力于客户更加简单的运维自己的集群。venus系统的实现采用了微服务架构，
将各部分重复的功能解耦出来，形成不同的组件。根据部署方式和功能的不同，划分为链服务组件个独立组件。在veuus的实现中，一套链服务可以
服务多个集群，链服务可以由服务商或多个矿工联合搭建，每个接入链服务的集群仅需将精力放在独立组件上，即算力的增长与维持。

&ensp;&ensp; 在venus系统中，链服务层的正常运行显得尤为重要，一旦服务异常就可能导致多个集群故障。这篇文章就如何搭建链服务层进行介绍。

### 硬件要求

&ensp;&ensp; venus系统的链服务负责链区块同步，各集群消息打包，出块及链信息查询等功能，是各个集群正常运行的先决条件。venus的
一套链服务至少包括：

- venus节点*1: 32C/128g/40g+2T(essd)；
- venus-auth、venus-messager*1：16C/32G/200G(essd)；
- venus-gateway*1：16C/32G/200G(essd)；
- venus-miner*1：16C/32G/200G(essd)；

&ensp;&ensp; 在通常情况下，一套链服务服务于多个集群，需要预防单点故障，故链服务层每个组件都至少有主备或负载均衡。

### 软件环境

Ubuntu:

```shell
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config curl clang build-essential hwloc libhwloc-dev wget -y && sudo apt upgrade -y
```

CentOS:

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```

- [Go 1.16 或更高版本](https://golang.org/dl/)
- 每个组件皆用相同分支: `incubation`

### 部署流程

&ensp;&ensp; 根据组件的依赖关系，链服务层的部署顺序是: venus-auth --> venus-gateway --> venus --> venus-messager --> venus-miner.


#### venus-auth

```shell script
$ nohup ./venus-auth run > auth.log 2>&1 &
```
> `venus-auth` 的默认配置文件位于`~/.venus-auth/config.toml`

&ensp;&ensp; 支持MySQL 5.7及以上版本，可替代默认的`Badger`键值数据库。要使用 MySQL 数据库，请修改配置文件中的 `db` 部分。

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

##### 生成token

&ensp;&ensp; `venus-auth`管理着其他venus模块使用的[jwt](https://jwt.io/)令牌，以便它们在网络上安全地相互通信。

为链服务组件生成token。

```bash
# --perm specifies admin, sign, wirte or read permission of the token generated
$ ./venus-auth token gen --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```

为独立模块生成令牌。 token可以通过`<USER>` 逻辑分组，作为加入矿池的单个矿工。

```shell script
$ ./venus-auth user add --name=<USER> --miner=<minerID>

$ ./venus-auth token gen --perm write <USER>
<USER_WRITE_AUTH_TOKEN>
$ ./venus-auth token gen --perm read <USER>
<USER_READ_AUTH_TOKEN>
```

>`./venus-auth user add <USER>` 对不同的token进行逻辑分组。如果已经有矿工号，则带上--miner，没有则需要在创建矿工后更新：
```
$ ./venus-auth user update --name <USER> --miner=<minerID>

# 查看 user 列表
$ ./venus-auth user list

# 查看 token 列表
$ ./venus-auth token list
```

#### venus-gateway

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

#### venus

启动`venus`进程进行链同步。 使用 `--network` 来指定`venus`连接的网络。

```bash
$ nohup ./venus daemon --network=nerpa --auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> > venus.log 2>&1 & 
```

> 使用`tail -f venus.log` 或 `./venus sync status` 检查同步过程中是否有任何错误。

##### 允许其他IP的实例访问venus

默认情况下，`venus`进程只响应本地访问。更改以下配置(~/.venus/config.json)以允许从其他地址访问。

```json
{
  "api": 
  {
      "apiAddress": "/ip4/0.0.0.0/tcp/3453"
  }
}
```

#### venus-messager

启动`venus-messager`, `--auth-url`、`--node-url` 和`--auth-token` 是为了让 venus-messager 了解其他`venus`模块的存在并进行自身的身份验证。

```bash
$ nohup ./venus-messager run \
--auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> \
--node-url /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132 \
--auth-token <SHARED_ADMIN_AUTH_TOKEN> \
--db-type mysql \
--mysql-dsn "<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_messager?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s" \
> msg.log 2>&1 &
```
> 如果没有指定与数据库相关的参数，`venus-messager`将默认使用 sqlite。



#### venus-miner

初始化`venus-miner`。
```bash
$ ./venus-miner init
# For nettype, choose from mainnet, nerpanet, debug, 2k, calibnet
--nettype nerpanet
--auth-api <http://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453
```

启动`venus-miner`。

```bash
$ nohup ./venus-miner run > miner.log 2>&1 &
```

##### 矿工管理

`venus-miner` 启动时会从 `venus-auth` 中拉取最新的`miner_id`列表，可以通过以下方式查询`miner_id`的状态。

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

如果你的矿工的`IsMining`为`false`，你可以运行以下命令来启动这个`miner id`的出块逻辑。

```bash
$ ./venus-miner address start <MINER_ID>
```

列出所有已连接到`venus-miner`的`miner id`。

```bash
$ ./venus-miner address list
```

在`venus-miner`运行期间有`miner_id`加入或退出矿池,或有`miner_id`的连接信息有改变,需要重新从`venus_auth`拉取数据.

```bash
$ ./venus-miner address update
```
