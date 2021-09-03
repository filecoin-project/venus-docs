## Overview

If you already have power sealed using `lotus-miner`, you can use venus-ready `lotus-miner` maintained in this [repo](https://github.com/ipfs-force-community/lotus). venus-ready `lotus-miner` retains current lotus logic while adding components that allow connection to chain services (venus shared modules). venus-ready `lotus-miner` will be released for every major network updates. 

### Branches

List of lotus version(s) to their corresponding venus-ready branch.

| lotus ver. | venus-ready branch                                           | venus-ready commit                                           |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 1.10.1     | [v1.10.1_incubation](https://github.com/ipfs-force-community/lotus/commits/v1.10.1_incubation) | [4996c6e3f70b958bae8540d822c367c3aa3546ad](https://github.com/ipfs-force-community/lotus/commit/4996c6e3f70b958bae8540d822c367c3aa3546ad) |
| 1.11.0     | [v1.11.0_incubation](https://github.com/ipfs-force-community/lotus/commits/v1.11.0_incubation) | [a500491902058a4e6e59283cd56755d56701e4b1](https://github.com/ipfs-force-community/lotus/commit/a500491902058a4e6e59283cd56755d56701e4b1) |

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