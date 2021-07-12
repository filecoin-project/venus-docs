## 前言

在同一条区块链上需要具有多个互操作的软件实现，每个实现都有自己的安全问题集，但是所有实现不尽相同，因此，启动具有多种实现方式的加密货币网络可降低发生灾难性错误的可能性，Venus正是Filecoin的实现之一。

Venus代指Filecoin的通用实现之一，venus则代指Venus的组件之一。Venus致力于帮助中小矿工能够更加简单的加入到Filecoin生态网络建设中。

目前Venus通过venus、venus-sealer、venus-miner、venus-wallet、venus-messager、venus-auth组件，已经实现了Filecoin分布式矿池的支持，未来，Venus将持续完善自身，并共同推进开源的Filecoin开发与生态的发展。

## 为什么我们要这样做

2020年6月，Protocol Lab发起了关于由社区后续维护go-filecoin的RFP，IPFSForce随后申请并获得了维护权。10月，go-filecoin更名为Venus，我们继续推进对Venus项目的维护工作。

在重新保持维护之前，Venus是一个严重缺乏维护的项目。协议和组件上，vm/mpool/chain/rpc虽然都有了，但是全都存在不同程度的问题，我们用了三个多月的时间，逐渐修复很多协议层、代码层,、性能的问题，使得Venus完成了与Lotus的互操作，让使用Venus的节点可以正常的在网络上运行。后续我们又逐渐的让Venus支持了Calibration、Nerpa、2k网络。

完成以上工作后，我们着手于Venus的开发方向。

我们的设计是让Venus向矿池的发展角度去支持，最初的设计是从“如何扩展单一矿工”思考，这个方向存在理论上的可行性，但是最大的问题在于Filecoin独特的证明机制。因为Filecoin网络的矿工必须周期性的提交‘时空证明’，而为了生成证明，矿工必须读取一整个partition的数据，如果sector极其分散的分布到不同的地方，通过公网读取，则不是一个可执行的方案。

后来我们通过数次的设计与修改，最终产生了现在的方案，就是分布式矿池。分布式矿池并非体现在单一矿工，而是将分布式的概念体现在多矿工的管理，这更像一个矿工联合体。

Venus分布式矿池在外部的体现和传统的分布式矿池是相似的。在存储资源上体现在地域分布性，只要有网络可以访问的地方，都可以使节点接入到Venus矿池；在出块的角度上，因为Filecoin按算力比例来计算出块机率，所以分散的计算和整体的计算的最终结果应该是相同：***n1/p+ n2/p+n3/p......= (n1+n2+n3+.....)/p***，这在算法的基础上提供了理论基础。

在真实数据存储检索上，矿工可以通过venus统一入口接入网络或者自主接入。设计中，venus会在获得矿工允许的条件下，按照数据的访问需求来选择合适的节点存储数据，使得数据更贴近真实的使用场景。

1. ***数据存储***：支持组件共享，存储会逐渐迁移到MySQL，通过一些高可用的方案保证Venus的元数据安全。
2. ***共享组件***：支持高可用，保证服务的质量，减少矿工的时间成本与维护成本，这使得矿工能够更容易加入到矿池生态中。现在的挖矿活动专业性很强，而实现Filecoin利用闲散存储资源的梦想则不可避免需要降低参与门槛，才能吸引更多的参与者进来。
3. ***聚集出块权***：矿工能够将资源整合在一起，互相帮助打包消息，这样可以避免小矿工的消息无人打包的困境。
4. ***提升Filecoin网络的吞吐量***：如果同一高度存在多个区块，venus-miner能够保证每个区块中的消息都是不同的，而如果各自出块，消息则很可能大量重复。
5. ***提升消息的稳定性***：挖矿活动中的消息可以和节点分开，由venus-messager来管理，venus-messager会跟踪链的最新状态来设置一个相对合理的预估的gas参数，同时也支持用户自己设置一个消息参数。
6. ***提升数据访问速度***：目前的Filecoin网络更多的还是存储，但是作为一个存储服务，最终需要对外输出检索服务才能实现根本价值。如果有足够多的矿工使用Venus，那么Venus在真实数据的处理上就有更多的可能，比如数据的分布，Venus可以将数据分布到距离客户最近的一些矿工节点，这样可以提高客户的访问速度；比如一些公有数据可以把这些数据尽可能的分散到更多的节点上，保障在任意位置的访问都有效，这可以大大提升IPFS网络的效能，进一步实现IPFS Web3.0的梦想。

## venus如何工作

### 架构

Venus架构设计中包括venus、venus-miner、venus-sealer、venus-messager、venus-wallet、venus-auth，以及在计划中的venus-market。在经典的架构中venus、venus-miner、venus-auth、venus-messager、venus-market是作为公共组件存在，venus-sealer、venus-wallet作为本地组件存在。

公共组件可以有服务商或者多个矿工联合建立，而矿工只需要在本地运行venus-sealer、venus-worker、venus-wallet即可。实际上Venus的所有组件都是面向协议的，如果矿工有足够的技术实力，也可以把公共组件的全部或者部分部署在本地，这样矿工可以更灵活的部署。

下图是我们设想中的一个典型的应用场景

![](/venus-cluster.png)

下列内容表示了组件间的对应关系，功能上有一定的相似，细节和用法上有更多强大的功能扩充。

*  venus-auth --> token authentication service extend lotus jwt
*  venus-miner --> lotus-miner block produce part
*  venus-sealer --> lotus-miner sealer scheduler part/wd
*  venus-worker --> lotus-worker
*  venus daemon --> lotus daemon
*  venus-wallet -> lotus wallet part
*  venus-messager --> lotus mpool

### venus-auth

venus-auth是用于授权的组件，在典型的部署环境下venus-auth用于给venus、venus-miner、venus-messager提供授权服务，每个本地的节点访问共享组件都要经过授权，后续会在这个基础上进行功能扩充，做一些安全方面的控制，比如访问限流、黑名单。

### venus

venus类似lotus-daemon, 用于实现全节点，venus接入Filecoin区块链网络，为Venus提供数据支持。可以把venus当作普通节点来使用，它具有区块链节点必备的所有功能，如chain、 mpool、wallet。venus的接口和lotus基本兼容（如果存在不兼容的接口，可以提issue），你可以在venus上创建私钥、查询资产、转账等等。在典型部署环境里，venus仅仅提供基础链上数据查询服务，本身不保存私钥。slashfilter所需要的区块数据，存储到数据库里，节点本身是无状态的，这样通过nginx反向代理后就可以实现venus节点的高可用。

venus节点自身有一些区别与lotus的地方：

1. 创建区块的接口中支持了外部签名（后续会向lotus提pr）
2. 消息选择的接口支持同时选择多个批次的消息，用于多矿工出块时选择消息。
3. 支持venus-auth的的中心访问授权
   
因此如果对venus/lotus混合部署感兴趣，需要使用我们维护的lotus兼容venus的项目，或自行pick代码编译。

### venus-miner

venus-miner的作用是聚集出块权，该程序可以配置多个矿工及其sealer、钱包的位置，同时为这些矿工来生成区块。venus-miner有以下特点：

1. 分离数据：由于生成区块的过程需要访问数据，并且矿工的sealer可能是异构的，但目前多数矿工会使用自己定制的代码，那么要实现联合挖矿就存在如何访问到这些数据的问题。通过隔断venus-miner对存储组织方式的依赖，通过让证明在矿工侧完成，无论矿工的sealer如何组织存储，只要实现了**ComputeProof**接口，venus-miner就可以通过这个接口来生成证明。
2. 分离私钥：计算随机数及签名区块的过程中，所有涉及到私钥的操作都通过远程钱包的方式来访问，这样可以提升挖矿活动的安全性。
3. 提高矿工收入和网络TPS：当venus-miner负责的矿工在一个周期获得多个（>1）出块权，venus-miner会尽量从消息池中选择不同的消息进行打包，这样一定程度上可以提升消息上链的速度，同时使该出块可能获得更多的小费奖励（Premium）。

### venus-messager

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

### venus-wallet

venus-wallet是一个远程钱包，协议上能够同时支持lotus和venus。在典型的部署环境中，这个组件由矿工部署在本地，并通过一定的策略配置保证资产的安全。venus-wallet有以下功能特点：

1. 私钥管理模块：目前支持非对称算法BLS和SECP的私钥管理，能够生成随机私钥，并运用aes128对私钥进行对称加密存储，同时支持私钥对数据进行签名。
2. 签名验证：每种签名类型都有对应验证策略，保证了签名方不能在签名类型上欺骗钱包。
3. 签名策略模块：针对Filecoin的Lotus及Venus实现，对存在的数10种数据结构以及message数据结构中的60余种签名类型进行统一管理，按需配置各种组合方式绑定私钥签名规则，而后可以将数种不同的私钥签名规则组成一个整体，授权于外部组件使用。

### venus-sealer + venus-worker

venus-sealer基本延续lotus的挖矿部分, 我们把sealer中和挖矿相关的代码剥离出来形成venus-sealer，两个项目的区别在于：

1. 接入了messager系统，所有的消息都是在messager中进行管理.
2. 存储脱离badger，使用sqlite保存(元数据，sector状态机系信息，调度及其结果），后续会进一步支持mysql存储，保证数据的安全性。

## 未来的一些构想

后续的计划主要集中在：
1. 持续跟进最新的Filecoin区块链网络。
2. 启动venus-market项目，完善整个Venus系统。
3. 优化venus-sealer调度方式及存储相关（思考中）。
4. 提升组件可用性，持续测试组件，修复一些潜在的问题，保证组件服务的稳定与安全，简化部署方式。
5. 优化日志系统，便于问题查询追踪。