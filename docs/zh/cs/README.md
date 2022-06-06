## 背景

考虑到庞大的初始硬件和Filecoin质押[投资](https://filscan.io/calculator)以及相关的运营成本，开始Filecoin存储提供是一项艰巨的任务。 囊括了分布式部署架构，订单服务和算力服务，Venus将帮助存储提供者，如社区所说，把[全职工作](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5)变成为一个对运维更加友好的解决方案。 希望本教程能让您立即开始存储提供！

## 如何提供存储服务

有两种方法可以开始使用Venus来提供存储服务。

1. 部署最少的硬件并获得第三方`Venus`链服务的帐号。欢迎了解`Venus`孵化器[项目](https://venushub.io/zh/incubator/)，加入`Venus`团队提供的免费链服务。(请参阅[这个](join-a-cs.md)教程以了解更多信息)
2. 自行部署`Venus`链服务。(请参阅[这个](deploy-a-cs.md)教程以了解更多信息)

在遵循其余的教程和成功部署后，您可以开始封装扇区，增加算力并通过您对网络存储容量的贡献最终获得区块奖励！

## venus组件介绍

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

在[此处](https://github.com/filecoin-project/community-china/discussions/18)了解有关硬件要求的更多信息。或者参阅我们的[单机配置示例](https://venus.filecoin.io/zh/operation/example-single-box.html)。

:::warning

使用`venus-cluster`时，请参阅`venus-cluster`[性能测试](https://mp.weixin.qq.com/s/AxEaV2iZT8-8jOKyMoFRvA)中，社区成员使用的硬件，并作出对自己的最优调整。如有问题可以寻求[Venus Master](https://venushub.io/master/)的帮助。

:::