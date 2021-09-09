## Venus-wallet 系统设计

### 背景

venus-wallet是旷工接入[venus incubation](https://filecoinfoundation.medium.com/introducing-the-filecoin-storage-provider-incubation-center-ea8743e18e)的必要组件之一.

出于对旷工私钥的安全性考虑,孵化器并不会掌握旷工的私钥, 同时孵化器又需要私钥进行签名,所以我们设计并实现了venus-wallet,用于接入孵化器的旷工自己管理的相关私钥,并提供旷工相关的消息的签名服务.

### 设计思路

对于这样一个特殊的组件,我们从以下几个方面来介绍对于venus-wallet的设计思路.
1. venus-wallet以何种方式与[venus-gateway](https://github.com/ipfs-force-community/venus-gateway)进行交互-交互模式
2. venus-wallet私钥的安全性-安全性

#### 交互模式

venus-wallet是通过与venus-gateway的交互, 参与到孵化器系统中为旷工提供签名服务的.

其中venus-wallet是client端定义如下:

```go
type WalletRegisterClient struct {
	ResponseWalletEvent func(ctx context.Context, resp *types.ResponseEvent) error
	ListenWalletEvent   func(ctx context.Context, policy *walletevent.WalletRegisterPolicy) (chan *types.RequestEvent, error)
	SupportNewAccount   func(ctx context.Context, channelId uuid.UUID, account string) error
	AddNewAddress       func(ctx context.Context, channelId uuid.UUID, newAddrs []address.Address) error
	RemoveAddress       func(ctx context.Context, channelId uuid.UUID, newAddrs []address.Address) error
}
```

其中接口:

> ListenWalletEvent
> ResponseWalletEvent

利用了[go-jsonrpc](https://github.com/filecoin-project/go-jsonrpc/)包采用websocket连接client对server调用支持channel模式的特性模拟了异步消息队列的方式来处理gateway发出的调用请求并返回数据.

相关逻辑实现在`WalletEvent`类型中, 主体逻辑.

1. 调用`ListenWalletEven`t开始循环监听管道消息

2. 解析收到的消息请求类型,并执行相应的函数

3. 将执行的结果通`ResponseWalletEvent`函数返回到gateway


代码如下:

```go
// WalletEvent定义
type WalletEvent struct {
	processor IWalletProcess
	client    *WalletRegisterClient
	log       logging.StandardLogger
	channel   uuid.UUID
	cfg       *config.APIRegisterHubConfig
}

// 监听gateway请求并处理.
func (e *WalletEvent) listenWalletRequestOnce(ctx context.Context) error {
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	policy := &walletevent.WalletRegisterPolicy{
		SupportAccounts: e.cfg.SupportAccounts,
		SignBytes:       core.RandSignBytes,
	}
	log.Infow("", "rand sign byte", core.RandSignBytes)
	walletEventCh, err := e.client.ListenWalletEvent(ctx, policy)
	if err != nil {
		return xerrors.Errorf("listenWalletRequestOnce listenWalletRequestOnce call failed: %w", err)
	}
	for event := range walletEventCh {
		switch event.Method {
		case "InitConnect":
			req := types.ConnectedCompleted{}
			err := json.Unmarshal(event.Payload, &req)
			if err != nil {
				e.log.Errorf("init connect error %s", err)
			}
			e.channel = req.ChannelId
			e.log.Infof("connect to server success %v", req.ChannelId)
			//do not response
		case "WalletList":
			go e.walletList(ctx, event.Id)
		case "WalletSign":
			go e.walletSign(ctx, event)
		default:
			e.log.Errorf("unexpect proof event type %s", event.Method)
		}
	}
	return nil
}

// 返回调用结果
func (e *WalletEvent) value(ctx context.Context, id uuid.UUID, val interface{}) {
	respBytes, err := json.Marshal(val)
	if err != nil {
		e.log.Errorf("marshal address list error %s", err)
		err = e.client.ResponseWalletEvent(ctx, &types.ResponseEvent{
			Id:      id,
			Payload: nil,
			Error:   err.Error(),
		})
		e.log.Errorf("response wallet event error %s", err)
		return
	}
	err = e.client.ResponseWalletEvent(ctx, &types.ResponseEvent{
		Id:      id,
		Payload: respBytes,
		Error:   "",
	})
	if err != nil {
		e.log.Errorf("response error %v", err)
	}
}
```

#### 安全性

##### 地址私钥认证

在venus-wallet与gateway建立连接后,其第一件事请, 是通过`AddNewAddress`接口告诉gateway其包含了的地址私钥, 以便gateway需要签名时,能够通过地址定位到自己进行签名.

但是gateway并不完全信任venus-wallet,需要其能够证明自己的确包含了这个地址的私钥.

在大多数场景中这种情况只需要按下面的流程进行验证就行了:

1. gateway发送message到venus-wallet
2. venus-wallet对message执行签名,并返回给gateway
3. gateway验证签名
4. 地址确认完成

但在gateway不信任wallet的同时,wallet同样不信任gateway, wallet有理由怀疑, 这个签名会对其资金安全造成威胁, 
比如gateway发送了一个从这个地址转出资金的消息的hash值给他签名,然后就可以把消息发送到filecoin链上了.

同时也不能单独让wallet自己提供签名的message, 因为wallet可以在filecoin链上随便找到一条这个地址对某串消息的签名来冒充.

所以, 要建立这种信任,在地址私钥认证的过程中, 我们设计了一套方案:

**签名验证的消息由双方共同生成,以确保万无一失.**

具体流程如下图:

<img src="https://raw.githubusercontent.com/filecoin-project/venus-docs/master/docs/.vuepress/public/venus-wallet-verify-address.png"/>

##### 签名API安全性

由于venus-wallet对gateway提供`WalletSign`用于签名, Venus-wallet需要保证gateway无法利用这个接口做非法的事情.

所以针对这个问题,设计了一套协议,保证venus-wallet对数据进行签名之前, 可以对需要签名的消息进行验证, 以确定是否需要对这个数据签名.

协议中定义了签名类型和MsgMeta:

```go
const (
	MTUnknown = MsgType("unknown")
	// Signing message CID. MsgMeta.Extra contains raw cbor message bytes
	MTChainMsg = MsgType("message")
	// Signing a blockheader. signing raw cbor block bytes (MsgMeta.Extra is empty)
	MTBlock = MsgType("block")
	// Signing a deal proposal. signing raw cbor proposal bytes (MsgMeta.Extra is empty)
	MTDealProposal = MsgType("dealproposal")
	// extra is nil, 'toSign' is cbor raw bytes of 'DrawRandomParams'
	//  following types follow above rule
	MTDrawRandomParam = MsgType("drawrandomparam")
	MTSignedVoucher   = MsgType("signedvoucher")
	MTStorageAsk      = MsgType("storageask")
	MTAskResponse     = MsgType("askresponse")
	MTNetWorkResponse = MsgType("networkresposne")
	// reference : storagemarket/impl/remotecli.go:330
	// sign storagemarket.ClientDeal.ProposalCid,
	// MsgMeta.Extra is nil, 'toSign' is market.ClientDealProposal
	// storagemarket.ClientDeal.ProposalCid equals cborutil.AsIpld(market.ClientDealProposal).Cid()
	MTClientDeal = MsgType("clientdeal")
	MTProviderDealState = MsgType("providerdealstate")
	MTVerifyAddress = MsgType("verifyaddress")
)
type MsgMeta struct {
	Type MsgType
	// Additional data related to what is signed. Should be verifiable with the
	// signed bytes (e.g. CID(Extra).Bytes() == toSign)
	Extra []byte
}
```

定义签名接口:

```go
type ShimWallet interface {
	WalletList(ctx context.Context) ([]core.Address, error)
	WalletSign(ctx context.Context, signer core.Address, toSign []byte, meta core.MsgMeta) (*core.Signature, error)
}
```

在venus-walelt处理WalletSign请求时,按照下面的流程处理,中间任何一个步骤不符合预期都会签名失败,返回错误:

1. 判断`MsgMeta.MsgType`是否为合法的签名类型
2. 根据`MsgType` 和`MsgMeta.Extra`可以 unmarshal出真正需要签名的数据的数据结构.
3. 通过Unmarshal的数据结构重新计算需要签名的Message
4. 检查Message是否与toSign相等.

然后根据数据结构计算出需要真正需要签名的签名message, 这个message应该和参数中的`tosign`是相等的.

### 总结
Venus inclubation是一个复杂的分布式系统, 系统比较庞大, 如果需要对孵化器进行详细的了解请参考文档:[venus-Shared-Modules](https://github.com/filecoin-project/venus-docs/blob/master/docs/guide/Using-venus-Shared-Modules.md)





