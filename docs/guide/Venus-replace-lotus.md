# Lotus cluster replaced by Venus cluster

## Introduction of Venus cluster and lotus cluster

This document is based on the public version of [Lotus](https://github.com/filecoin-project/lotus/releases) & [Venus](https://github.com/filecoin-project/venus/releases). Part of the content involves the miners' customization of the program, which requires targeted solutions.

Tips:
 - `<>`indicates the parameter to be replaced, which is replaced according to the actual situation of the miner
 - Please use git checkout to select the specific version
 - environment:
     - golang ^1.15
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git
     
### Moduler of Venus cluster

Moduler | Server | Type | Do
--- | --- | --- | ---
venus-auth     |   \<IP1\> | Shared | Venus auth is used for unified authorization. When a miner's own running component accesses a shared component, it needs to use this service to register the generated token
venus-wallet   |   \<IP2\> | Shared | Manage your wallet, Message signature
venus          |   \<IP3\> | Shared | chain Sync
venus-messager |   \<IP4\> | Shared | Manage the message in the cluster, ensure the message on the chain, control the message flow, and try again. It can dock multiple wallets and manage messages for these wallets
venus-miner    |   \<IP5\> | Shared | Package the block message; Multiple miners can be configured; It can calculate the miner's minning situation by itself, and obtain data proof through remote access to venus-sealer
venus-sealer   |   \<IP6\> | Unshared | Sector FSM management; power growth scheduling; power maintenance
venus-worker   |   \<IP7\> | Unshared | Data seal (execution of P1,P2,C1,C2, etc.)

### Moduler of Lotus cluster

Moduler | Server | Type | Do | Moduler corresponding to Venus
--- | --- | --- | --- | ---
lotus          |   \<IP1\> | shared | Chain sync; Message pool; Wallet management, data signature, etc | venus; Some functions of venus-messenger; Some functions of venus-wallet
lotus-miner    |   \<IP2\> | Unshared | Sector FSM management; power growth scheduling; power maintenance; WinCount | Some functions of venus-miner; venus-sealer
lotus-worker   |   \<IP3\> | Unshared | Data seal (execution of P1,P2,C1,C2, etc.) | venus-worker

venus-wallet makes more refined management of wallets, such as authority management: users can specify the data types that wallets can sign, administrators can lock a wallet, restrict signatures, etc;

venus-message allows messages to allocate a Nonce value when sending to the message pool, specifying priority for different messages, and can better control the packed rhythm of the message.

venus-miner concentrates the wincount of multiple miners into one moduler, while Lotus can only be responsible for the wincount of one miner.

## Lotus cluster replaced by Venus cluster
### 1.Explain

Venus has more advantages in managing multiple clusters, and its shared moduler can serve multiple clusters. If there are few clusters, it is not recommended to build a whole set of shared moduler. You can combine multiple clusters to share a set of Venus shared moduler to meet the service requirements.

### 2.Operation

#### 1）Replacing Lotus moduler with Venus shared moduler

The shared moduler of the Venus service include: [venus](https://github.com/filecoin-project/venus)、[venus-messager](https://github.com/ipfs-force-community/venus-messager)、[venus-auth](https://github.com/ipfs-force-community/venus-auth)、[venus-wallet](https://github.com/ipfs-force-community/venus-wallet)、[venus-miner](https://github.com/filecoin-project/venus-miner)，Please refer to the deployment process: [How-To-Deploy-MingPool](How-To-Deploy-MingPool.md)。

#### 2）Replacing Lotus moduler with Venus independent moduler

##### Scheme 1: customized lotus miner component replacement 1: Replace the public version of lotus-miner moduler

* Stop generating new section seal tasks and wait for all in progress section tasks to complete;
* Replace lotus-miner with venus-sealer and restart the service. For deployment of venus-sealer, please refer to [How-To-Deploy-MingPool](How-To-Deploy-MingPool.md)。

Lotus cluster process before replacement
![lotus-cluster-1](/lotus-cluster-1.png)


Venus cluster process after replacement
![venus-replace-lotus-cluster-1](/venus-replace-lotus-cluster-1.png)

##### Scheme 2: customized lotus-miner moduler replacement

Because of the fact that the miners have modified the lotus-miner code, if they want to continue to use it, they need to make the following adjustments to lotus-miner:
* Don't enable winingpest program of lotus-poster, which needs to change the code;
* The conversion of existing sector data, This needs to be developed;
* lotus-miner connects with venus-messager, which needs to be developed;
* Miners can develop related tools by themselves, or wait for Venus developers to launch related tools and developer documents.

Lotus cluster process before replacement
![lotus-cluster-2](/lotus-cluster-2.png)


Venus cluster process after replacement
![venus-replace-lotus-cluster-2](/venus-replace-lotus-cluster-2.png)
