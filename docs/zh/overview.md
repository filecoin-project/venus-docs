# Venus

现在我们的venus不仅仅是一个网络节点，更多的时候指代的是整个分布式矿池组件，venus致力于帮助中小矿工能够更加容易简单的加入到filecoin生态网络建设当中。

## 为什么我们要这样做

大概是去年10月份开始Venus项目的维护工作，那时候这个项目的名称还是叫做go-filecoin. 那时候的venus还是一个严重缺乏维护的项目，节点上vm/mpool/chain/rpc看上去都有了，但是个个都有问题，我们团队花了三个多月的时间，逐渐的修复了很多协议层，代码层, 性能上的问题，使得venus完成了与lotus的互操作，能够作为一个节点正常的运行在网络上面，后续又逐渐支持了calibration，nerpa，2k网络。完成这一部分后，我们要考虑该往哪里去，最开始的思路就是往矿池的角度去。关键还是在于如何做。最开始的思路还是在如何扩展单一矿工上面，这个方向存在理论上的可行性，但是最大的问题在于Filecoin独特的证明机制，filecoin上的矿工必须周期的性的提交时空证明，而为了生成证明，矿工必须读取一整个partition的数据。如果sector分散的分不到不同的地方，通过公网读取，这是很不现实的办法.

后来我们在数次的讨论中逐渐产生了现在的方案，那就是分布式矿池不是体现在在单一矿工上，而是将分布式的概念体现在多矿工上面，这更像一个矿工联合体。其体现在外部和传统的分布式矿池是相似的。在存储资源上是完全分布在任意地方的，只要有网络访问的地方都可以接入到venus矿池中。在出块上，因为Filecoin是按算力比例来计算机会的的（这和比特币就很不同），分散的计算和整体的计算的最终结果应该是相同 ***n1/p+ n2/p+n3/p......= (n1+n2+n3+.....)/p***， 因而最终的奖励和分散是相等的，在算法基础上提供了理论基础. 在真实数据存储检索上，矿工可以通过venus统一入口接入网络或者自主接入,设计中venus会在获得矿工允许的条件下按照数据的访问需求来选择合适的节点来存储数据，使得数据更贴近真实的使用场景。

1. ***运行数据存储支持*** 共享组件逐渐存储都会迁移到mysql，通过一些高可用的方案保证venus的元数据安全。
2. ***共享组件***，共享组件支持高可用，保证服务的质量，减少矿工的时间成本，维护成本。这使得矿工能够更容易加入到矿池系统中，现在的挖矿活动专业性很强，而实现filecoin利用闲散存储资源的梦想则不可避免需要降低门槛，吸引越多的用户参与进来。
3. ***聚集出块权***，矿工能够抱团在一起，互相帮助打包消息，经历过去年测试阶段的人都体会过小矿工消息无人打包的痛苦，而在venus中，将不会存在这个问题。
4. ***提升filecoin网络的吞吐量***，如果同一个高度存在多个区块，venus-mienr能够保证每个区块中的消息都是不同的，而如果各自出块，消息则很可能差不多。
5. ***提升消息的稳定性***，挖矿活动中的消息可以和节点分开，由messager组件来管理，messager组件会跟踪链的最新状态来设置一个相对合理的gas估计参数，同时也支持用户自己设置一个消息参数
6. ***提升数据访问速度***，目前的filecoin网络更多的还是存储，但是作为一个存储服务，最终需要对外输出检索服务才能存在根本的价值。在venus如果有足够的用户参加参与，那么venus在真实数据的处理上就有更多的可能，比如说数据的散步，venus可以将数据散步到具体客户最近的一些矿工节点上，这样可以提高客户的访问速度，比如说一些公有数据可以把这些数据尽可能的分散到更多的节点上，保证在任意地方的访问，这可以大大提升ipfs网络的效能，进一步实现ipfs web3的梦想。

## venus如何工作

## 架构

venus架构设计中包括venus-auth, venus, venus-miner,venus-messager venus-sealer, venus-wallet，以及在计划中的venus-market. 在经典的架构中中venus-auth,venus,venus-miner, venus-messager， venus-market是作为公共组件存在. venus-sealer,venus-wallet作为本地组件存在。 公共组件可以有服务商，或者多个矿工联合建立，而矿工只需要在本地运行venus-sealer/venus-worker/venus-wallet即可。实际上venus的所有的组件都是面向协议的。如果矿工有足够的技术实力，也可以把公共组件的全部或者部分部署在本地。矿工可以灵活的部署。

下图是个我们设想中的一个典型的应用场景

![./images/venus-arch.png](./images/venus-arch.png)

组件的对应关系，功能上有一定的相似，细节和用法上有更多强大的功能扩充。

*  venus-auth  -->  token authentication service extend lotus jwt
*  venus-miner -->  lotus-miner block produce part
*  venus-sealer --> lotus-miner sealer scheduler part/wd
*  venus-worker --> lotus-worker
*  venus daemon --> lous daemon
*  venus-wallet ->  lotus wallet part
*  venus-messanger --> lotus mpool


### venus-auth

venus-auth是一个授权组件，在典型的部署环境下venus-auth用于给venus,venus-miner,venus-messager提供授权服务，每个本地的节点访问共享组件都要经过授权，后续会在这个基础上进行扩充做一些安全方面的控制，比如访问限流，黑名单之类的功能。

### venus

venus等同于lotus-daemon, 是一个全节点，用于接入filecoin区块链网络，为venus提供基础的数据支持。你可以把venus当作普通节点来使用，它具有区块链节点必备的所有功能，chain, mpool, wallet. 接口和lotus基本兼容（如果存在不兼容的接口可以提issue,我们会尽快修复）。你可以在venus上创建私钥，查询资产，转账等等。在典型部署环境下面，venus仅仅提供基础链上数据查询服务，本身不保存私钥。slashfilter所需要的区块数据存储到数据库里面，节点本身是无状态的，这样通过nginx反响代理后就可以实现venus节点的高可用。

venus节点自身有一些区别与lotus的地方，
1. 区别在与创建区块接口中支持了外部签名（后续会给lotus提pr）
2. 消息选择接口支持同时选择多个批次的消息，用于多矿工出块的时候选择消息。
3. 支持venus-auth的的中心访问授权。
   
因此如果对venus/lotus混合部署有兴趣的，需要使用我们维护的一个lotus兼容venus的项目。或者自行pick代码编译。

### venus-miner

venus-miner的作用是聚集出块权利，该程序可以配置多个矿工及其sealer，钱包的位置，同时为这些矿工来生成区块。 

1. 分离数据：由于生成区块的过程需要访问到数据，在加上矿工的sealer可能是异构的，目前多数矿工或多或少都是自己定制的代码，那么要实现联合挖矿就存在如何访问到这么多数据的问题，这里思路是要隔断venus-miner对存储组织方式的依赖。最后的方式就是证明是在矿工从侧完成，无论矿工的sealer是如何组织存储的，只要实现了***ComputeProof***接口，venus-miner就可以通过这个接口来生成证明。
2. 分离私钥：计算随机数及签名区块的过程中，所有涉及到私钥的操作都通过远程钱包的方式来访问，这样可以提升挖矿活动的安全性。
3. 提高矿工收入和网络tps: 当venus-miner负责的矿工在一个周期获得多个（>1）出块权，venus-miner会尽量从消息池中选择不同的消息进行打包，这样一定程度上可以提升消息的上链速度，使该出块更有可能获得额外的小费奖励（Premium）。

### venus-messager

messager组件的目标是更好的帮助消息上链，并能够灵活的控制消息的上链时机，减少gas消耗，流量控制等。其中包括远程钱包管理，地址管理，消息管理。 

1. 钱包管理，messager连接多个钱包，并将这些地址扫描到表里面。
2. 地址管理，主要是管理nonce值，保证nonce值能够按照正确的顺序分配。
3. 消息管理，消息管理分成三个部分，分别是消息接收和保存，消息选择及推送，消息上链状态的追踪

从功能性上来说:
1. Remote wallet support: One messenger support multiple wallets to manage their messager separately
2. Supports sqlite local storage and mysql remote storage for more secure and stable storage
3. Fill on fly: gas related parameters and nonce are to be filled out when sending a message on chain according to gas and push policy, to make sure the gas-estimation and other seeting are valid
4. Maintain message status, including whether the message is chained and replaced. Save the results of the execution.
5. Multi-point message delivery (directly to the blockchain network with libp2p, push to the node by Mpool API), to make sure that messages are propagation over the network
6. Flexible config include for gas estimate, msg push stragety,etc

![./images/messager.png](./images/messager.png)

### venus-wallet

venus-wallet是一个远程钱包，协议上能够同时支持lotus和venus。在典型的部署环境中，这个组件由矿工部署在本地，并通过一定的策略配置保证资产的安全。

1. 私钥管理模块：目前支持非对称算法BLS和SECP的私钥管理，能够生成随机私钥，并运用aes128对私钥进行对称加密存储，同时支持私钥对数据进行签名。
2. 签名验证: 每种签名类型都有对应验证策略，保证了签名方不能在签名类型上欺骗钱包。
3. 签名策略模块：针对Filecoin的Lotus及Venus的实现，其主要存在的数10种数据结构以及message数据结构中的60余种概念分类进行统一管理，按需配置各种组合方式绑定私钥签名规则，而后可以将数种不同的私钥签名规则组成一个整体授权于外部组件使用，同时该授权也附带了多个私钥策略组之间的隔离，使得集群部署中可以直接在Venus-wallet单实例中创建多个私钥组，而不需要使用以往多实例部署的方式来达成私钥地址可见性越界的问题。

### venus-sealer + venus-worker

venus-sealer基本延续lotus的挖矿部分, 我们把sealer中和挖矿相关的代码剥离出来形成了venus-sealer，两个项目的区别在于：

1. 接入了messager系统，所有的消息都是在messager中进行管理
2. 存储脱离badger，使用sqlite保存(元数据，sector状态机系信息，调度及其结果），后续会进一步支持mysql存储，保证了数据的安全性。

## 未来的一些构想及方向

未来的一些计划。目前后续的计划主要集中在
1. 持续跟进最新的区块链网络。 
2. 启动venus-market项目，完善整个venus挖矿系统。 
3. 优化sealer调度方式及存储相关（思考中）。
4. 提升组件可用性，持续测试组件，修复一些潜在的问题，保证组件服务的稳定与安全，简化部署方式。
5. 优化日志系统，便于问题查询追踪。