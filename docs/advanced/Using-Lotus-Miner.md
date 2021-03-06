## Overview

`lotus-miner` can be seamlessly connected to the `venus` shared components through customizations. If you haven't added any custom code to `lotus-miner`, you can use the venus-ready branch directly. If you have customized code for `lotus-miner`, you can refer to the latest `commit` in the venus-ready branch to make `lotus-miner` compatible with `venus` shared modules.

Main changes:

1. Send messages to shared modules
2. Calculate WinningPost
3. Disable block mining of lotus-miner

### Branches

List of lotus version(s) to their corresponding venus-ready branch.

| lotus ver. | venus-ready branch                                           | venus-ready commit                                           |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1.10.1     | [v1.10.1_venus_pool](https://github.com/ipfs-force-community/lotus/commits/force/v1.10.1_venus_pool ) | [212721a6b4677f2ffe36688a50f1cacde7ae5e54](https://github.com/ipfs-force-community/lotus/commit/212721a6b4677f2ffe36688a50f1cacde7ae5e54) |

## Code walk

The following outlines some of the key changes to the code.

### Configuration Change

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

### Message APIs for lotus-miner

Among the commands provided by lotus-miner, the commands that need to send, wait, and search for messages are all realized by calling the newly added messenger interface of lotus-miner.

1. MessagerWaitMessage
2. MessagerPushMessage
3. MessagerGetMessage

File path(s)：

```bash
cmd/lotus-storage-miner/*
api/api_storage.go
extern/storage-sealing/sealing.go
extern/storage-sealing/terminate_batch.go
node/modules/storageminer.go
storage/*
```

### Add GasOverEstimate params to MessageSendSpec

File path(s)：api/types.go

```go
type MessageSendSpec struct {
	MaxFee            abi.TokenAmount
	GasOverEstimation float64
}
```

### Check if address exists before sending messages

In lotus-miner, the API that was used to determine the existence of the address needs to be changed to the WalletHas API that calls the messenger.

File path(s): `storage/addresses.go`

### venus-messager client

The venus-messager client is similar to lotus, both of which use jsonrpc. You can use lotus' jsonrpc library for access. Note that the namespace is Message.

File path(s):  `node/modules/messager/*`

### Listen to gateway for ComputeProof requests

This component is used to listen to the requests issued by the shared modules, and it is used to calculate the WinningPost in the miner.

File path(s): `cli/wallet_client.go`, `node/impl/proof_client/*`

### Non-message type signing to local wallet（StorageAsk， DealProposal）

Since the private key no longer exists in the remote node, some message signing that do not require the participation of shared modules (such as StorageAsk, DealProposal) need to be connected to the wallet and sign locally

File path(s): `markets/storageadapter/provider.go`

### lotus-miner disable mining blocks

As shared modules are responsible for mining blocks, local block mining must be diabled to prevent  consensus errors. Therefore, you must disable local block mining.

File path(s): `node/modules/storageminer.go` func `SetupBlockProducer`