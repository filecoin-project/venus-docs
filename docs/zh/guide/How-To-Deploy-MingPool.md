## 背景

考虑到庞大的初始硬件和Filecoin质押[投资](https://filscan.io/calculator)以及相关的运营成本，开始Filecoin挖掘是一项艰巨的任务。 囊括了安全性、易用性和分布式存储池的想法，Venus将帮助存储提供者，正如社区所说，把[全职工作](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5)变成为一个严肃的爱好。 希望本教程能让您立即开始挖矿！

## 如何提供存储服务

有两种方法可以开始使用Venus来提供存储服务。

1. 部署最少的硬件并获得对第三方托管的共享venus模块的使用帐号。(请参阅[这个](Using-venus-Shared-Modules.md)教程以了解更多信息)
2. 自行部署所有需要的硬件和venus模块。(本教程的其余部分将引导您完成这种部署Venus服务的方式)

在遵循其余的教程和成功部署后，您可以开始封装扇区，增加算力并通过您对网络存储容量的贡献最终获得区块奖励！

## venus模块介绍

根据其在挖矿集群中的作用，模块可以大致分为两类：共享和独立。 共享模块可以被认为是开始封装扇区所需的基础。 大多数与区块链的交互，如链同步、发送消息、赢得赢票等，都是由共享模块处理的。 这个想法是许多矿工都可以共用一组共享模块，从而减少维护成本。 独立模块处理封装和证明您的扇区。如果您选择使用第三方托管的共享Venus模块，您将花费大部分时间在独立模块上。 另请注意，`venus-wallet`模块可以作为共享或独立部署。

| name                                                         | role                                                  | shared/independent |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| [venus](https://github.com/filecoin-project/venus)           | daemon for chain interactions                         | shared             |
| [venus-miner](https://github.com/filecoin-project/venus-miner) | block winning and proving                             | shared             |
| [venus-messager](https://github.com/filecoin-project/venus-messager) | chain message management                              | shared             |
| [venus-auth](https://github.com/filecoin-project/venus-auth) | utility for authorized use of shared modules          | shared             |
| [venus-gateway](https://github.com/ipfs-force-community/venus-gateway) | utility for controlled access point of shared modules | shared             |
| [venus-wallet](https://github.com/filecoin-project/venus-wallet) | addresses/keys management                             | shared/independent |
| [venus-sealer](https://github.com/filecoin-project/venus-sealer), [venus-worker](https://github.com/filecoin-project/venus-sealer) | job scheduling, sealing and proving                   | independent        |

## 服务架构

下图展示了venus模块如何相互交互。

![venus-cluster](/venus-cluster.png)
## 硬件要求

在[此处](https://github.com/filecoin-project/community-china/discussions/18)了解有关硬件要求的更多信息。

## 前期准备

在深入部署您的挖矿操作之前，请确保您已完成以下步骤。

:::warning

建议您在部署到主网上之前在`nerpa` 或`calibration`网络中测试您的配置。

:::

### 永久存储

选择您熟悉的网络文件系统（例如 NFS）并部署您的存储集群。

### 软件依赖

在运行 venus 之前，您需要安装以下软件。

#### 构建工具

Ubuntu/Debian:

```shell
sudo apt install mesa-opencl-icd ocl-icd-opencl-dev gcc git bzr jq pkg-config curl clang build-essential hwloc libhwloc-dev wget -y && sudo apt upgrade -y
```

CentOS:

```bash
sudo yum install -y https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm; sudo yum install -y git gcc bzr jq pkgconfig clang llvm mesa-libGL-devel opencl-headers ocl-icd ocl-icd-devel hwloc-devel
```

#### Go

构建venus，您需要安装[Go 1.16 或更高版本](https://golang.org/dl/)。

```bash
wget -c https://golang.org/dl/go1.16.2.linux-amd64.tar.gz -O - | sudo tar -xz -C /usr/local
```

将 `/usr/local/go/bin` 添加到您的路径并设置`go env`。对于大多数Linux系统，您可以运行以下内容：

```bash
echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc && source ~/.bashrc
# setup go env
go env -w GOPROXY=https://goproxy.io,direct
go env -w GO111MODULE=on
```

如果卡住，请参阅[官方Golang安装说明](https://golang.org/doc/install)。

## 安装venus-auth
下载并编译`venus-auth`的源代码。

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git
$ cd venus-auth
$ git checkout <RELEASE_TAG>
$ make 
$ nohup ./venus-auth run > auth.log 2>&1 &
```
:::tip 

`venus-auth` 的默认配置文件位于`~/venus-auth/config.toml`。

:::

:::tip Logs

日志默认打印到控制台。 通过配置可以支持InfluxDB。

:::

### 使用MySQL (可选)

支持MySQL 5.7及以上版本，可替代默认的`Badger`键值数据库。要使用 MySQL 数据库，请修改配置中的 `db`部分。

```shell script
$ vim ~/.venus-auth/config.toml

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
重启`venus-auth`使配置生效。

```shell script
$ ps -ef | grep auth
$ kill <VENUS_AUTH_PID>
$ nohup ./venus-auth run > auth.log 2>&1 &
```

### 生成token

`venus-auth`管理着其他venus模块使用的[jwt](https://jwt.io/)令牌，以便它们在网络上安全地相互通信。

为共享模块生成token。

```bash
# --perm specifies admin, sign, wirte or read permission of the token generated
$ ./venus-auth token gen --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```

为独立模块生成令牌。 token可以通过`<USER>` 逻辑分组，作为加入矿池的单个矿工。

```shell script
$ ./venus-auth usdr add --name <USER>
$ ./venus-auth token gen --perm write <USER>
<USER_WRITE_AUTH_TOKEN>
$ ./venus-auth token gen --perm read <USER>
<USER_READ_AUTH_TOKEN>
```
:::tip

使用`./venus-auth user add <USER>` 对不同的token进行逻辑分组。

:::

## 安装venus-gateway

下载并编译`venus-gateway`的源代码。

```bash
$ git clone https://github.com/ipfs-force-community/venus-gateway.git
$ cd venus-gateway
$ git checkout <RELEASE_TAG>
$ go mod tidy
$ make
```

启动`venus-gateway`。

```bash
$ ./venus-gateway \
--listen /ip4/0.0.0.0/tcp/45132 \
run \
# Use either a http or https url
--auth-url <https://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus-gateway.log 2>&1 &
```

## 安装venus daemon

下载并编译`venus-daemon`的源代码。

```shell script
$ git clone https://github.com/filecoin-project/venus.git
$ cd venus
$ git checkout <RELEASE_TAG>
$ make deps
$ make
```
启动`venus`进程进行链同步。 使用 `--network` 来指定`venus`连接的网络。

```bash
$ nohup ./venus daemon --network nerpa \
--authURL <http://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus.log 2>&1 & 
```

:::tip

使用`tail -f venus.log`检查同步过程中是否有任何错误。

:::

### 允许访问venus daemon

默认情况下，`venus`进程只响应本地访问。更改以下配置以允许从其他地址访问。

```shell script
vim ~/.venus/config.json
```

将`apiAddress`从` /ip4/127.0.0.1/tcp/3453`更改为`/ip4/0.0.0.0/tcp/3453`。保存并关闭配置文件。

```json
{
	"api": {"apiAddress": "/ip4/0.0.0.0/tcp/3453"}
}
```

重启`venus`进程使配置生效。

```bash
$ ps -ef | grep venus
$ kill <VENUS_PID>
$ nohup ./venus daemon --network nerpa \
--authURL <http://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus.log 2>&1 
```

## 安装venus-messager

下载并编译`venus-messager`的源代码。

```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git
$ cd venus-messager
$ git checkout <RELEASE_TAG>
$ make deps
$ make 
```
启动`venus-messager`。请注意，`--auth-url`、`--node-url` 和`--auth-token` 是为了让 venus-messager 了解其他`venus`模块的存在并进行自身的身份验证。

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

:::tip

如果没有指定与数据库相关的参数，`venus-messager`将默认使用 sqlite。

:::


## 安装venus-miner

下载并编译`venus-miner`的源代码。

```shell script
$ git clone https://github.com/filecoin-project/venus-miner.git
$ cd venus-miner
$ git checkout <RELEASE_TAG>
$ make
```
初始化`venus-miner`。

```bash
$ ./venus-miner init
# For nettype, choose from mainnet, nerpanet, debug, 2k, calibnet
--nettype nerpanet
--auth-api <http://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
```

启动`venus-miner`。

```bash
$ nohup ./venus-miner run >>miner.log 2>& 1 &
```

### 矿工管理

一旦有用户(有`miner id`的`venus-sealer`) 连接到您的共享模块。 您可以通过以下方式查询该`miner id`的状态。

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

如果你的矿工的`IsMining`为`false`，你可以运行以下命令来启动这个`miner id`。

```bash
$ ./venus-miner address start <MINER_ID>
```

列出所有已连接到`venus-miner`的`miner id`。

```bash
$ ./venus-miner address list
```

## 下一步

接下来请按照这个[文档](Using-venus-Shared-Modules.md)加入到你刚刚部署的存储池！

## 问题?

来[Slack](https://filecoinproject.slack.com/archives/CEHHJNJS3)上找我们吧！
