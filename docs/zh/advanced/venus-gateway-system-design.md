## Venus-gateway系统设计

### 背景

[venus-gateway(gateway)](https://github.com/ipfs-force-community/venus-gateway)是[venus incubation](https://filecoinfoundation.medium.com/introducing-the-filecoin-storage-provider-incubation-center-ea8743e18e)共享组件之一.

venus-incubation中的多个共享组件(eg. [venus-messenger](https://github.com/filecoin-project/venus-messager)/[venus-miner...](https://github.com/filecoin-project/venus-miner))都有对消息进行签名的需求.

提供签名的服务由接入孵化器的旷工运行的[venus-wallet](https://github.com/filecoin-project/venus-wallet)提供.

### 设计思路

由于venus-incubation中的多个共享组件(eg. [venus-messenger](https://github.com/filecoin-project/venus-messager)/[venus-miner...](https://github.com/filecoin-project/venus-miner))都有对访问孵化器的旷工提供的服务的需求.

venus-messenger/venus-miner需要访问旷工的 venus-wallet进行message/block签名.

venus-miner需要访问旷工的venus-sealer计算WinPOST证明.下面以venus-wallet来进行说明.

**其中**一种做法, 是:

> venus-walle启动时,去连接这些所有需要签名的孵化器共享组件这些共享组件独自管理注册到自己的venus-wallet服务, 
>
> 并管理好签名地址与wallet服务的对应关系, 在需要签名的时候, 分别去请求这些venus-wallet.

但更好的方法是, 把这一部分逻辑抽取出来, 分离成一个服务,

这样好处是:

1. venus-wallet启动的时候, 只需要连接gateway, 并告诉gateway, 其包含的地址私钥.而不需要向多个共享组件注册.
2. 孵化器中的共享组件在需要签名时, 也只需要向gateway发送签名的请求, 其它复杂的工作(比如, 定位对应地址的venus-wallet服务)完全托管给gateway.
4. 对于共享组件与gateway交互这一部分代码, 还可以编写为一个共享的package,降低了代码的重复.
4. 如果后期增加了需要签名的共享组件, 不会涉及到系统中其它组件(比如:venus-wallet)的修改.极大的降低了系统的耦合程度.

这样venus-gateway在孵化器的共享组件中起到了**桥接接需要签名的共享组件与提供签名服务的venus-wallet的功能.**

在实现venus-gateway的时候, 我们需要考虑以下几个问题:

1. gateway如何于孵化器中的其它交互-交互模式

2. gateway的安全性-完全性


#### 交互模式

gateway在孵化器中,其作用是桥接孵化器中其它组件的相互调用,所以在交互上可以分为两类, 

1. 与消息生产者交互(包括venus-miner,venus-messenger)

2. 与消息消费者交互(包括venus-wallet, venus-geateway)

   

![gateway交互图](https://raw.githubusercontent.com/filecoin-project/venus-docs/master/docs/.vuepress/public/venus-gateway-system-design.png)



##### 与消息消费者交互

​	Gateway与消息消费者的交互的详细内容可以在[venus-wallet-系统设计](https://github.com/filecoin-project/venus-docs/blob/master/docs/zh/advanced/venus-wallet-architecture.md)中有详细的介绍, 这里不在赘述.

​	唯一不同点是,venus-sealer消费的消息是`ComputeProof`计算`WinningPoSt`证明数据.

##### 与消息生产者交互

​	venus-gateway与消息生产者交互非常简单, 直接对外提供API.

对于venus-messenger来说是:

```go
type IWalletEvent interface {
  ...
	WalletHas(ctx context.Context, supportAccount string, addr address.Address) (bool, error)
	WalletSign(ctx context.Context, account string, addr address.Address, toSign []byte, meta wallet.MsgMeta) (*crypto.Signature, error)
}
```

对于venus-miner来说, 是:

```go
type IProofEvent interface {
	ListConnectedMiners(ctx context.Context) ([]address.Address, error)
	ListMinerConnection(ctx context.Context, addr address.Address) (*MinerState, error)
	ComputeProof(ctx context.Context, miner address.Address, sectorInfos []proof5.SectorInfo, rand abi.PoStRandomness) ([]proof5.PoStProof, error)
}
```

#### 安全性

##### 访问权限控制
在venus-gateway的访求权限使用了jwt权限访问控制模式.要求所有的请求都需要带有验证token,

但又不能为所有的旷工都使用统一的token.如果使用统一的token会带来以下问题:

1. 当需要某个旷工需要退出孵化器时, 我们需要把这个token作废, 如果使用统一的token, 会影响其他的正常旷工.

2. 使用不同的token可以为旷工提供更个性化的访问控制策略.如流量控制等.

所以, 我们开发了venus-auth, 会为每个接入的旷工分配一个token, venus-gateway把验证逻辑集成到请求的middleware中, 当收到请求时, 会先向venus-auth验证token的合法性.

##### 流量控制

我们没有办法确保接入孵化器的旷工有不泄露自己的token, 或者把token共享给其他人使用.
所以我们设计了一种机制可以把泄露的token的非法使用对系统造成的负载控制在较小的的范围之内.

对于安全性这一部分更多的信息可以参考:[venus-auth]()


#### 总结

Venus inclubation是一个复杂的分布式系统, 系统比较庞大, 如果需要对孵化器进行详细的了解请参考文档:[venus-Shared-Modules](https://github.com/filecoin-project/venus-docs/blob/master/docs/guide/Using-venus-Shared-Modules.md)
