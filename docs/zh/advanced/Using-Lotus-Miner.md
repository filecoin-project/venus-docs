## 概要

通过对协议实验室的`lotus-miner`进行改造升级，能使其无缝接入`venus`共享组件。如您没有对`lotus-miner`添加过自定义代码，那么可以直接使用适配分支。如您对`lotus-miner`有定制化的代码，可以参考适配分支中最新的`commit`来添加适配代码。

主要变化功能点：

1. 发送消息到共享组件
2. 计算WinningPost证明
3. 禁用本地出块

### 代码分支

对应lotus版本的适配venus的lotus-miner分支如下表。

| lotus版本 | 适配venus分支                                                | 适配改造代码                                                 |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1.10.1    | [v1.10.1_incubation](https://github.com/ipfs-force-community/lotus/commits/v1.10.1_incubation) | [4996c6e3f70b958bae8540d822c367c3aa3546ad](https://github.com/ipfs-force-community/lotus/commit/4996c6e3f70b958bae8540d822c367c3aa3546ad) |
| 1.10.0    | [v1.11.0_incubation](https://github.com/ipfs-force-community/lotus/commits/v1.11.0_incubation) | [a500491902058a4e6e59283cd56755d56701e4b1](https://github.com/ipfs-force-community/lotus/commit/a500491902058a4e6e59283cd56755d56701e4b1) |

## 代码行走

以下大致概括了适配改造代码的一些要点。

### 配置文件改变

```
[Venus]
  [Venus.Messager]
    Url = ""
    Token = ""
  [Venus.RegisterProofAPI]
    Url = ""
    Token = ""
  [Venus.Wallet]
    Url = ""
    Token = ""
```

### lotus-miner推送消息的API

lotus-miner提供的命令中需要发送，等待，搜索消息的命令全部通过调用lotus-miner新加的messager接口来实现。

1. MessagerWaitMessage
2. MessagerPushMessage
3. MessagerGetMessage

位置：

``` bash
cmd/lotus-storage-miner/*
api/api_storage.go
extern/storage-sealing/sealing.go
extern/storage-sealing/terminate_batch.go
node/modules/storageminer.go
storage/*
```

### 给MessageSendSpec添加GasOverEstimate参数 

位置: `api/types.go`
```go
type MessageSendSpec struct {
	MaxFee            abi.TokenAmount
	GasOverEstimation float64
}
```

### miner检查发送消息的地址是否存在

lotus-miner中原先需要判断地址存在的接口，需要改成调用messager的WalletHas接口。

位置: `storage/addresses.go`

### venus-messager client

venus-messager的客户端和lotus类似，都是使用的jsonrpc协议，可以同样使用lotus的jsonrpc库来接入。 需要注意的是命名空间是Message。

位置: `node/modules/messager/*`

### 链接gateway以接受ComputeProof请求

这个功能用于监听共享组件下发的请求，在miner中是为了用于计算WinningPost证明。

位置: `cli/wallet_client.go`， `node/impl/proof_client/*`

### 非消息类型签名转到本钱包（storageask， proposaldeal）

由于远程节点中不再存在私钥，一些不需要共享组件参与的签名（例如StorageAsk，DealProposal)需要连接钱包在本地进行签名。

位置: `markets/storageadapter/provider.go`

### lotus-miner禁用本地出块

因为共享组件已经在出块，本地如果在出块会导致共识错误，因此，务必禁用本地出块。

位置: `node/modules/storageminer.go` 方法 `SetupBlockProducer`