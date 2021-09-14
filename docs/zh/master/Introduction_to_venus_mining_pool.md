## venus矿池介绍

&ensp;&ensp; venus 是 Filecoin 的通用实现之一，致力于分布式的集群架构及更简洁的职责划分。

&ensp;&ensp; venus分布式矿池在外部的体现和传统的分布式矿池是相似的。在存储资源上体现在地域分布性，只要有网络可以访问的地方，都可以使节点接入到Venus矿池。

### 架构

&ensp;&ensp; venus架构设计中包括venus、venus-auth、venus-miner、venus-messager、venus-wallet、venus-sealer，以及在计划中的venus-market。以职能划分为准则，将组件分为公共组件（链服务）和独立组件，这样在很大程度上解放了存储提供者，不再被消息无法上链，区块同步错误等纠缠，而拥有技术实力及硬件资源的服务商可以搭建公共组件给分散的集群提供服务，从中获取一定的服务费用等。当然，如果存储商有多个集群并有一定技术实力，也可以自己搭建链服务。

下图是我们设想中的一个典型的应用场景，在此场景中一套独立组件（venus-sealer、venus-worker、venus-wallet）负责一个集群的算力增长与维持，而这样的集群是很方便横向扩展的。

![](../../.vuepress/public/venus-cluster.png)

venus与lotus组件间的对应关系如下所示，在实现了lotus功能的基础上均有所扩展：

*  venus-auth --> token authentication service extend lotus jwt
*  venus-miner --> lotus-miner block produce part & multi miner
*  venus-sealer --> lotus-miner sealer scheduler part/wd
*  venus-worker --> lotus-worker
*  venus daemon --> lotus daemon
*  venus-wallet -> lotus wallet part
*  venus-messager --> lotus mpool
*  venus-market --> lotus-miner market part


#### venus-auth

venus-auth是用于授权的组件，在典型的部署环境下venus-auth用于给venus、venus-miner、venus-messager提供授权服务，每个本地的节点访问共享组件都要经过授权，后续会在这个基础上进行功能扩充，做一些安全方面的控制，比如访问限流、黑名单。

#### venus

venus类似lotus-daemon, 用于实现全节点，venus接入Filecoin区块链网络，为Venus提供数据支持。可以把venus当作普通节点来使用，它具有区块链节点必备的所有功能，如chain、 mpool、wallet。venus的接口和lotus基本兼容（如果存在不兼容的接口，可以提issue），你可以在venus上创建私钥、查询资产、转账等等。在典型部署环境里，venus仅仅提供基础链上数据查询服务，本身不保存私钥。slashfilter所需要的区块数据，存储到数据库里，节点本身是无状态的，这样通过nginx反向代理后就可以实现venus节点的高可用。

venus节点自身有一些区别与lotus的地方：

1. 创建区块的接口中支持了外部签名（后续会向lotus提pr）
2. 消息选择的接口支持同时选择多个批次的消息，用于多矿工出块时选择消息。
3. 支持venus-auth的的中心访问授权
   
因此如果对venus/lotus混合部署感兴趣，需要使用我们维护的lotus兼容venus的项目，或自行pick代码编译。

#### venus-miner

venus-miner的作用是聚集出块权，该程序可以配置多个矿工及其sealer、钱包的位置，同时为这些矿工来生成区块。venus-miner有以下特点：

1. 分离数据：由于生成区块的过程需要访问数据，并且矿工的sealer可能是异构的，但目前多数矿工会使用自己定制的代码，那么要实现联合挖矿就存在如何访问到这些数据的问题。通过隔断venus-miner对存储组织方式的依赖，通过让证明在矿工侧完成，无论矿工的sealer如何组织存储，只要实现了**ComputeProof**接口，venus-miner就可以通过这个接口来生成证明。
2. 分离私钥：计算随机数及签名区块的过程中，所有涉及到私钥的操作都通过远程钱包的方式来访问，这样可以提升挖矿活动的安全性。
3. 提高矿工收入和网络TPS：当venus-miner负责的矿工在一个周期获得多个（>1）出块权，venus-miner会尽量从消息池中选择不同的消息进行打包，这样一定程度上可以提升消息上链的速度，同时使该出块可能获得更多的小费奖励（Premium）。

#### venus-messager

venus-messager组件的目标是更好的帮助消息上链，并能够灵活的控制消息上链的时机，减少gas消耗，流量控制等。其中包括远程钱包管理、地址管理、消息管理。 

1. 地址管理：主要是管理nonce值，保证nonce值能够按照正确的顺序分配。
2. 消息管理：消息管理分成三个部分，分别是“消息接收和保存”、“消息选择及推送”“消息上链状态的追踪”。
3. gas Fee管理：可以按地址分别设置gasLimit的系数和maxFee。

从功能性上来说:
1. 远程钱包支持：一个venus-messager支持多个钱包，分别管理自己的message。
2. 支持sqlite本地存储和mysql远程存储：存储更加安全稳定。
3. 动态填充：根据gas和push策略，在链上发送消息时，需要填写gas相关参数和nonce，以确保gas估算和其他设置有效。
4. 维护消息状态：包括消息是否被链接和替换，保存执行结果。
5. 多点消息传递（通过Mpool API推送到多个节点）：确保消息在网络上传播。
6. 灵活配置：包括gas估算、消息推送策略等。

#### venus-wallet

venus-wallet是一个远程钱包，协议上能够同时支持lotus和venus。在典型的部署环境中，这个组件由矿工部署在本地，并通过一定的策略配置保证资产的安全。venus-wallet有以下功能特点：

1. 私钥管理模块：目前支持非对称算法BLS和SECP的私钥管理，能够生成随机私钥，并运用aes128对私钥进行对称加密存储，同时支持私钥对数据进行签名。
2. 签名验证：每种签名类型都有对应验证策略，保证了签名方不能在签名类型上欺骗钱包。
3. 签名策略模块：针对Filecoin的Lotus及Venus实现，对存在的数10种数据结构以及message数据结构中的60余种签名类型进行统一管理，按需配置各种组合方式绑定私钥签名规则，而后可以将数种不同的私钥签名规则组成一个整体，授权于外部组件使用。

#### venus-sealer + venus-worker

venus-sealer基本延续lotus的挖矿部分, 我们把sealer中和挖矿相关的代码剥离出来形成venus-sealer，两个项目的区别在于：

1. 接入了messager系统，所有的消息都是在messager中进行管理.
2. 存储脱离badger，使用sqlite保存(元数据，sector状态机系信息，调度及其结果），后续会进一步支持mysql存储，保证数据的安全性。
