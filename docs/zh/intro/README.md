## 前言

在同一条区块链上需要具有多个互操作的软件实现，每个实现都有自己的安全问题集，但是所有实现不尽相同，因此，启动具有多种实现方式的加密货币网络可降低发生灾难性错误的可能性，Venus 正是 Filecoin 的实现之一。

Venus 代指 Filecoin 的通用实现之一，venus 则代指 Venus 的组件之一。Venus 致力于帮助中小存储提供者能够更加简单的加入到 Filecoin 生态网络建设中。

目前 Venus 通过 venus、damocles、sophon-miner、venus-wallet、sophon-messager、sophon-auth、sophon-gateway 组件，已经实现了 Filecoin 分布式矿池的支持，未来，Venus 将持续完善自身，并共同推进开源的 Filecoin 开发与生态的发展。

## 为什么我们要这样做

2020 年 6 月，Protocol Lab 发起了关于由社区后续维护 go-filecoin 的 RFP，IPFSForce 随后申请并获得了维护权。10 月，go-filecoin 更名为 Venus，我们继续推进对 Venus 项目的维护工作。

在重新保持维护之前，Venus 是一个严重缺乏维护的项目。协议和组件上，vm/mpool/chain/rpc 虽然都有了，但是全都存在不同程度的问题，我们用了三个多月的时间，逐渐修复很多协议层、代码层，、性能的问题，使得 Venus 完成了与 Lotus 的互操作，让使用 Venus 的节点可以正常的在网络上运行。后续我们又逐渐的让 Venus 支持了 Calibration、2k 网络。

完成以上工作后，我们着手于 Venus 的开发方向。

我们的设计是让 Venus 向矿池的发展角度去支持，最初的设计是从“如何扩展单一存储提供者”思考，这个方向存在理论上的可行性，但是最大的问题在于 Filecoin 独特的证明机制。因为 Filecoin 网络的存储提供者必须周期性的提交‘时空证明’，而为了生成证明，存储提供者必须读取一整个 partition 的数据，如果 sector 极其分散的分布到不同的地方，通过公网读取，则不是一个可执行的方案。

后来我们通过数次的设计与修改，最终产生了现在的方案，就是分布式矿池。分布式矿池并非体现在单一存储提供者，而是将分布式的概念体现在多存储提供者的管理，这更像一个存储提供者联合体。

Venus 分布式矿池在外部的体现和传统的分布式矿池是相似的。在存储资源上体现在地域分布性，只要有网络可以访问的地方，都可以使节点接入到 Venus 矿池；在出块的角度上，因为 Filecoin 按算力比例来计算出块机率，所以分散的计算和整体的计算的最终结果应该是相同：***n1/p+ n2/p+n3/p......= (n1+n2+n3+.....)/p***，这在算法的基础上提供了理论基础。

在真实数据存储检索上，存储提供者可以通过 venus 统一入口接入网络或者自主接入。设计中，venus 会在获得存储提供者允许的条件下，按照数据的访问需求来选择合适的节点存储数据，使得数据更贴近真实的使用场景。

1. ***数据存储***：支持组件共享，存储会逐渐迁移到 MySQL，通过一些高可用的方案保证 Venus 的元数据安全。
2. ***共享组件***：支持高可用，保证服务的质量，减少存储提供者的时间成本与维护成本，这使得存储提供者能够更容易加入到矿池生态中。现在的挖矿活动专业性很强，而实现 Filecoin 利用闲散存储资源的梦想则不可避免需要降低参与门槛，才能吸引更多的参与者进来。
3. ***聚集出块权***：存储提供者能够将资源整合在一起，互相帮助打包消息，这样可以避免小存储提供者的消息无人打包的困境。
4. ***提升 Filecoin 网络的吞吐量***：如果同一高度存在多个区块，venus-miner 能够保证每个区块中的消息都是不同的，而如果各自出块，消息则很可能大量重复。
5. ***提升消息的稳定性***：挖矿活动中的消息可以和节点分开，由 venus-messager 来管理，venus-messager 会跟踪链的最新状态来设置一个相对合理的预估的 gas 参数，同时也支持用户自己设置一个消息参数。
6. ***提升数据访问速度***：目前的 Filecoin 网络更多的还是存储，但是作为一个存储服务，最终需要对外输出检索服务才能实现根本价值。如果有足够多的存储提供者使用 Venus，那么 Venus 在真实数据的处理上就有更多的可能，比如数据的分布，Venus 可以将数据分布到距离客户最近的一些存储提供者节点，这样可以提高客户的访问速度；比如一些公有数据可以把这些数据尽可能的分散到更多的节点上，保障在任意位置的访问都有效，这可以大大提升 IPFS 网络的效能，进一步实现 IPFS Web3.0 的梦想。

## venus 如何工作

Venus 是 Filecoin 的通用实现之一，致力于分布式的集群架构及更简洁的职责划分。

Venus 分布式存储池在外部的呈现和传统的分布式矿池是相似的。在存储资源上体现在地域分布性，只要有网络可以访问的地方，都可以使节点接入到 Venus 矿池。

### venus

[venus](https://github.com/filecoin-project/venus) 类似 lotus-daemon，用于实现全节点。venus 接入 Filecoin 区块链网络，为 Venus 提供数据支持。可以把 venus 当作普通节点来使用，它具有区块链节点必备的所有功能，如 chain、mpool、wallet。venus 的接口和 lotus 基本兼容（如果存在不兼容的接口，欢迎发布 Issue），你可以在 venus 上创建私钥、查询资产、转账等等。在典型部署环境里，venus 仅仅提供基础链上数据查询服务，本身不保存私钥。slashfilter 所需要的区块数据，存储到数据库里，节点本身是无状态的，这样通过 nginx 反向代理后就可以实现 venus 节点的高可用。

venus 节点自身有一些区别与 lotus 的地方：

1. 创建区块的接口中支持了外部签名（后续会向 Lotus 提 PR）
2. 消息选择的接口支持同时选择多个批次的消息，用于多存储提供者出块时选择消息。
3. 支持 sophon-auth 的的中心访问授权

因此如果对 Venus/Lotus 混合部署感兴趣，需要使用我们维护的 [lotus 兼容 venus 的项目](https://github.com/ipfs-force-community/lotus/releases)，可自行 pick 代码编译。

### sophon-auth

[sophon-auth](https://github.com/ipfs-force-community/sophon-auth) (原 venus-auth) 是用于授权的组件，在典型的部署环境下 sophon-auth 用于给 venus、sophon-miner、sophon-messager 提供授权服务，每个本地的节点访问共享组件都要经过授权，后续会在这个基础上进行功能扩充，做一些安全方面的控制，比如访问限流、黑名单。

### sophon-miner

[sophon-miner](https://github.com/ipfs-force-community/sophon-miner) (原 venus-miner) 的作用是聚集出块权，可以为接入链服务的多个集群执行出块逻辑。sophon-miner 有以下特点：

1. 分离数据：由于生成区块的过程需要访问数据，并且存储提供者的 sealer 可能是异构的，但目前多数存储提供者会使用自己定制的代码，那么要实现联合挖矿就存在如何访问到这些数据的问题。通过隔断 sophon-miner 对存储组织方式的依赖，通过让证明在存储提供者侧完成，无论存储提供者的 sealer 如何组织存储，只要实现了**ComputeProof**接口，sophon-miner 就可以通过这个接口来生成证明。
2. 分离私钥：计算随机数及签名区块的过程中，所有涉及到私钥的操作都通过远程钱包的方式来访问，这样既无泄漏集群私钥，又能保证出块逻辑正常运行。
3. 提高网络 TPS：当 sophon-miner 负责的存储提供者在一个周期获得多个（>1）出块权，sophon-miner 会尽量从消息池中选择不同的消息进行打包，这样一定程度上可以提升消息上链的速度，同时使该出块可能获得更多的小费奖励（Premium）。
4. 收益稳定性：多存储提供者联合挖矿配套奖励池分配系统可以让小存储提供者每天都能获得区块奖励，也可以减少某些存储提供者偶发性出块错误造成的损失。

### sophon-messager

[sophon-messager](https://github.com/ipfs-force-community/sophon-messager) (原 venus-messager) 组件的目标是更好的帮助消息上链，并能够灵活的控制消息上链的时机，减少 gas 消耗，流量控制等。其中包括远程钱包管理、地址管理、消息管理。 

1. 地址管理：主要是管理 nonce 值，保证 nonce 值能够按照正确的顺序分配。
2. 消息管理：消息管理分成三个部分，分别是“消息接收和保存”、“消息选择及推送”“消息上链状态的追踪”。
3. GasFee 管理：可以按地址分别设置 gasLimit 的系数和 maxFee。

从功能性上来说：
1. 远程钱包支持：一个 sophon-messager 支持多个钱包，分别管理自己的 message。
2. 支持 sqlite 本地存储和 mysql 远程存储：存储更加安全稳定。
3. 动态填充：根据 gas 和 push 策略，在链上发送消息时，需要填写 gas 相关参数和 nonce，以确保 gas 估算和其他设置有效。
4. 维护消息状态：包括消息是否被链接和替换，保存执行结果。
5. 多点消息传递（通过 Mpool API 推送到多个节点）：确保消息在网络上传播。
6. 灵活配置：包括 gas 估算、消息推送策略等。

### venus-wallet

[venus-wallet](https://github.com/filecoin-project/venus-wallet) 是一个远程钱包，协议上能够同时支持 lotus 和 venus。在典型的部署环境中，这个组件由存储提供者部署在本地，并通过一定的策略配置保证资产的安全。venus-wallet 有以下功能特点：

1. 私钥管理模块：目前支持非对称算法 BLS 和 SECP 的私钥管理，能够生成随机私钥，并运用 aes128 对私钥进行对称加密存储，同时支持私钥对数据进行签名。
2. 签名验证：每种签名类型都有对应验证策略，保证了签名方不能在签名类型上欺骗钱包。
3. 签名策略模块：针对 Filecoin 的 Lotus 及 Venus 实现，对存在的数 10 种数据结构以及 message 数据结构中的 60 余种签名类型进行统一管理，按需配置各种组合方式绑定私钥签名规则，而后可以将数种不同的私钥签名规则组成一个整体，授权于外部组件使用。


### droplet

[droplet](https://github.com/ipfs-force-community/droplet) (原 venus-market) 是 Venus 系统中的市场组件。其愿景是打造 Filecoin 网络中分布式的存储和检索市场。目前已经实现了兼容 Lotus 协议的订单存储和检索，逐渐向着 droplet 服务多个集群的接单，对外提供统一的检索服务方向发展。可参见[droplet 设计与路线图](https://github.com/filecoin-project/venus/blob/master/documentation/en/venus-market-design-roadmap.md)

### sophon-gateway

[sophon-gateway](https://github.com/ipfs-force-community/sophon-gateway) (原 venus-gateway) 是独立组件与链服务层的桥梁，用于简化部署并降低存储提供者访问的复杂性、增加存储提供者访问的安全性。独立组件启动时将其服务接口注册到 sophon-gateway，链服务组件需要时通过 sophon-gateway 请求对应集群的服务接口。

- 存储提供者不需要外部 IP 和曝露钱包服务；
- 存储池配置 SSL 证书后，集群与存储池的连接是安全的；
- 存储提供者可以简单地将多个客户端（钱包/证明）注册到存储池以获得高可用性。

![sophon-gateway](../../../docs/.vuepress/public/venus-gateway-system-design.png)

### damocles 

[damocles](https://github.com/ipfs-force-community/damocles) (原 venus-cluster) 是 Venus 推出的新版本扇区封装、算力维持组件，相对于原本的 venus-sealer，在任务调度、最大化系统资源方面有一定优势，其面向的用户受众也将有所不同。
