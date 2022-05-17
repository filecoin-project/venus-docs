## 背景

考虑到庞大的初始硬件和Filecoin质押[投资](https://filscan.io/calculator)以及相关的运营成本，开始Filecoin存储提供是一项艰巨的任务。 囊括了分布式部署架构，订单服务和算力服务，Venus将帮助存储提供者，如社区所说，把[全职工作](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5)变成为一个对运维更加友好的解决方案。 希望本教程能让您立即开始存储提供！

## 如何提供存储服务

有两种方法可以开始使用Venus来提供存储服务。

1. 部署最少的硬件并获得对第三方Venus链服务的帐号。(请参阅[这个](Using-venus-Shared-Modules.md)教程以了解更多信息)
2. 自行部署Venus链服务。(本教程的其余部分将引导您完成这种部署Venus服务的方式)

在遵循其余的教程和成功部署后，您可以开始封装扇区，增加算力并通过您对网络存储容量的贡献最终获得区块奖励！

## venus模块介绍

根据其在挖矿集群中的作用，模块可以大致分为两类：链服务组件和本地组件。 链服务可以被认为是开始封装扇区所需的基础。 大多数与区块链的交互，如链同步、发送消息、赢得赢票等，都是由链服务处理的。 这个想法是许多存储提供者都可以共用一套链服务，从而减少维护成本。 本地组件提供了一整套算力服务。如果您选择使用第三方托管的Venus链服务，您只要将花费大部分时间在独立模块上。 另请注意，`venus-market`和`venus-wallet`模块可以作为链服务或本地组件部署。

| name                                                         | role                                                  | Chain_Service/Local |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| [venus](https://github.com/filecoin-project/venus)           | daemon for chain interactions                         | Chain_Service             |
| [venus-miner](https://github.com/filecoin-project/venus-miner) | block winning and proving                             | Chain_Service             |
| [venus-messager](https://github.com/filecoin-project/venus-messager) | chain message management                              | Chain_Service             |
| [venus-auth](https://github.com/filecoin-project/venus-auth) | utility for authorized use of shared modules          | Chain_Service             |
| [venus-gateway](https://github.com/ipfs-force-community/venus-gateway) | utility for controlled access point of shared modules | Chain_Service             |
| [venus-wallet](https://github.com/filecoin-project/venus-wallet) | addresses/keys management                             | Chain_Service/Local |
| [venus-cluster](https://github.com/ipfs-force-community/venus-cluster) | job scheduling, sealing and proving                   | Local        |
| [venus-sealer](https://github.com/filecoin-project/venus-sealer), [venus-worker](https://github.com/filecoin-project/venus-sealer) | job scheduling, sealing and proving                   | Local        |
| [venus-market](https://github.com/filecoin-project/venus-market) | deal making                                           | Chain_Service/Local        |

## 服务架构

下图展示了venus模块如何相互交互。

![venus-cluster](../../.vuepress/public/venus-cluster2.png)
## 硬件要求

在[此处](https://github.com/filecoin-project/community-china/discussions/18)了解有关硬件要求的更多信息。

:::warning

使用`venus-cluster`时，请参阅`venus-cluster`[性能测试](https://mp.weixin.qq.com/s/AxEaV2iZT8-8jOKyMoFRvA)中，社区成员使用的硬件，并作出对自己的最优调整。如有问题可以寻求[Venus Master](https://venushub.io/master/)的帮助。

:::

## 前期准备

在深入部署您的挖矿操作之前，请确保您已完成以下步骤。

:::warning

建议您在部署到主网上之前在`calibration`网络中测试您的配置。

:::

所需组件构建完成,可参考 [组件构建](../modules/build.md)

## 安装venus-auth

```shell script
$ nohup ./venus-auth run > auth.log 2>&1 &
```

:::tip Logs

日志默认打印到控制台。 通过配置可以支持InfluxDB。

:::

### 默认端口

venus-auth 默认端口为8989，下面其他组件使用参数--auth-url，填写的相关参数就是这个端口号与相应ip。

```shell
$ head  ~/.venus-auth/config.toml
Port = "8989"
```

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

### user及token生成

`venus-auth`管理着其他venus模块使用的[jwt](https://jwt.io/)令牌，以便它们在网络上安全地相互通信。

`venus` 集群中 `token` 的理论知识可参考 [venus集群token认证体系](https://github.com/filecoin-project/venus/discussions/4880)


为链服务组件生成token。

```shell script
$ ./venus-auth token gen --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```

为独立模块生成令牌。 token可以通过`<USER>` 逻辑分组，作为加入矿池的单个矿工。

```shell script
$ ./venus-auth token gen --perm sign <USER>
<USER_WRITE_AUTH_TOKEN>

$ ./venus-auth user add --name=<USER>
```

给 `user` 绑定矿工(`miner`),一个 `user` 可以有多个矿工.

```
$ ./venus-auth user miner add <USER> <minerID>

# 查看user列表
$ ./venus-auth user list
```

设置 `user` 可用,否则在其他组件请求 `user` 列表时请求不到.
 
 ```
$ ./venus-auth user update --name=<USER> --state=1
  update user success
 ```

## 安装venus-gateway

```shell script
$ ./venus-gateway --listen /ip4/0.0.0.0/tcp/45132 run \
# Use either a http or https url
--auth-url <http://VENUS_AUTH_IP_ADDRESS:PORT> \
> venus-gateway.log 2>&1 &
```

## 安装venus daemon

启动`venus`进程进行链同步。 使用 `--network` 来指定`venus`连接的网络。

```shell script
$ nohup ./venus daemon --network=cali --auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> > venus.log 2>&1 & 
```

:::tip

使用`tail -f venus.log` 或 `./venus sync status` 检查同步过程中是否有任何错误。

:::

### venus监听远程访问

默认情况下，`venus`进程只响应本地访问。更改以下配置以允许从其他地址访问。

```shell script
vim ~/.venus/config.json
```

将`apiAddress`从` /ip4/127.0.0.1/tcp/3453`更改为`/ip4/0.0.0.0/tcp/3453`。此修改重启后生效

```json
{
	"api": {"apiAddress": "/ip4/0.0.0.0/tcp/3453"}
}
```

在其他机器上执行`telnet` 验证配置生效:

```shell script
telnet <VENUS_IP_ADDRESS> <PORT>
```


:::tip

为了链服务能够与链进行交互，`daemon`需要与网络其他节点同步最新的链。具体如何导入一个链的`snapshot`进行链同步可参见[这个文档](Chain.md)。

:::

## 安装venus-messager

启动`venus-messager`。请注意，`--auth-url`、`--node-url` 和`--auth-token` 是为了让 venus-messager 了解其他`venus`模块的存在并进行自身的身份验证。

```shell script
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

如果没有指定与数据库相关的参数，`venus-messager`将默认使用 `sqlite3` 数据库。

:::


## 安装venus-miner

初始化`venus-miner`。

```shell script
$ ./venus-miner init
# For nettype, choose from mainnet, debug, 2k, calibnet
--nettype calibnet \
--auth-api <http://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132 \
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--slash-filter local
```

启动`venus-miner`。

```shell script
$ nohup ./venus-miner run > miner.log 2>& 1 &
```

`venus-miner`启动后会从`venus-auth`请求矿工列表,并对每个矿工执行出块的必要检查,如:钱包服务,WinningPoSt服务是否正常等.检查矿工列表:

```shell script
$ ./venus-miner address list 
[
        {
                "Addr": "f031429",
                "Id": "1f06d7b9-9fb2-497e-80f5-68f06b0a4b5f",
                "Name": "200-21"
        }
]
```

如果列表中没有在`venus-auth`中配置的矿工,则需要从`venus-auth`检查配置是否正确
- `检查venus-miner`初始化配置的`auth-token`对应的`user`是激活状态,即`state=enabled`
```shell script
$ ./venus-auth user list
name: ***
state: enabled
```

- 检查`venus-miner`初始化配置的`auth-token`对应的`user`下成功添加了此矿工.
```shell script
./venus-auth user list
name: ***
miners: [***,***,...]
```
> `miners` 列表有此矿工为正确.

修改成功后执行下列命令重新拉取:

```shell script
$ ./venus-miner address update
```

如果想要暂时终止或开始列表中某个矿工的出块,可通过下列命令执行.通常用于某个矿工出问题或集群迁移时使用.

```shell script
$ ./venus-miner address start <MINER_ID>
$ ./venus-miner address stop <MINER_ID>
```

## 安装venus-market

`venus-market`可以作为链服务组件之一来进行部署，具体部署文档请参考[文档](/zh/market/using-venus-market-for-master)

## 下一步

接下来请按照这个[文档](Using-venus-Shared-Modules.md)加入到你刚刚部署的链服务吧！

## 问题?

来[Slack](https://filecoinproject.slack.com/archives/C028PCH8L31)上找我们吧！
