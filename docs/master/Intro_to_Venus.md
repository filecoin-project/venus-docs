## Overview

Venus is one of the 4 implementations of Filecoin storage network, which focuses on distributed architecture and a more concise division of functionalities. Storage resources are geographically dipersed, which means as long as there is internet connection a storage system can be connected to a Venus chain service.

## Architecture

The Venus components/modules includes includes [venus](https://github.com/filecoin-project/venus), [venus-auth](https://github.com/filecoin-project/venus-auth), [venus-miner](https://github.com/filecoin-project/venus-miner), [venus-messager](https://github.com/filecoin-project/venus-messager), [venus-gateway](https://github.com/ipfs-force-community/venus-gateway), [venus-wallet](https://github.com/filecoin-project/venus-wallet), [venus-sealer](https://github.com/filecoin-project/venus-sealer)（soon to be replaced by `venus-cluster`），[venus-cluster](https://github.com/ipfs-force-community/venus-cluster) and [venus-market](https://github.com/filecoin-project/venus-market). Based on functionalities, the components can be broken into shared components (chain services) and local components. As a storage provider using chain services, it is no longer required to maintain chain synchronization, micro manage the sending of each message and other interactions with the chain. As a chain services provider with hardware resources, it can build chain services for other storage providers and potentially charge service fees from them. For large storage providers, they can also take advantage of venus architecture to allow quicker expansion and easier maintenance. 

The following figure demonstrates how each component interacts with each other. In this illustration, chain services is serving one storage provider and can easily scale to serve multiple storage providers.

![](../.vuepress/public/venus-cluster.png)

The following shows venus components to lotus components relationship. 

* venus-auth --> token authentication service extend lotus jwt
* venus-miner --> lotus-miner block produce part & multi miner
* venus-sealer --> lotus-miner sealer scheduler part/wd
* venus-cluster --> lotus-miner sealer scheduler part/wd
* venus-worker --> lotus-worker
* venus daemon --> lotus daemon
* venus-wallet -> lotus wallet part
* venus-messager --> lotus mpool
* venus-market --> lotus-market node

## How venus works

For more on how each Venus components work, please go through this document [here](https://venus.filecoin.io/guide/#how-venus-works).
