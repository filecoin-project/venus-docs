---
home: true
---

## Overview

_Disclaimer: Venus is currently under heavy development. Details discussed here may subject to change._

`venus`, formerly known as `go-filecoin`, was originally maitained by [Protocol Labs](https://protocol.ai/) as an implementation of the Filecoin network written in `go` programming language. During its early days, development of `go-filecoin` went stale as more resources were allocated toward `lotus` in preparation for the [launch of mainnet](https://liftoff.filecoin.io/). In a mission to fulfill [network security strategy](https://filecoin.io/blog/posts/announcing-filecoin-implementations-in-rust-and-c/), [IPFSForce community](https://github.com/ipfs-force-community) has now taken over the development of `go-filecoin` and rebranded the project to `venus`, as in the planet Venus being the brightest "star" in the horizon before every sunrise.

## Why Venus?

Compared with other implementations of filecoin network, `venus` has the following areas that it's focusing its most resources on...

- Improved UX for miner/operators 
- Improved security with granular access control for wallet
- Modularized components with support for scalability
- Distributed mining pool support
- Interoperability with `lotus` 

## Venus modules

Unlike `lotus`, different `venus` modules are designed to be deployed on different machines with redundancy to insure consistency and stability of a cluster. Through proper configurations, modules communicates with each other through APIs and authenticated by tokens. 

- [Venus](https://github.com/filecoin-project/venus): daemon module, responsible for chain syncing and vm
- [Venus-Miner](https://github.com/filecoin-project/venus-miner): miner module, responsible for mining rewards with support for multi miner
- [Venus-Sealer](https://github.com/filecoin-project/venus-sealer): sealer module, responsible for pledging new sector
- [Venus-Messager](https://github.com/ipfs-force-community/venus-messager): message module, responsible for management of message pool
- [Venus-Wallet](https://github.com/ipfs-force-community/venus-wallet): wallet module, responsible for secure management of private keys and signing messages

## Getting started with Venus

Filecoin mainnet is currently live. Visit [network.filecoin.io](https://network.filecoin.io) for all available networks. The tutorials below explore the network using the `venus` implementation.

* 🍄 First time using `Venus`? Start with the install and setup steps in [Getting Started](Getting-Started).
* 🤖 Ready to mine? Head over to [Mining Filecoin](Mining-Filecoin).
* 🌸 PRs, bug reports, and issue suggestions are welcome [Welcome to Contributing](How-To-Contribute-Docs)
* 💔 Need help? Start with [Troubleshooting & FAQ](Troubleshooting-&-FAQ)

## Looking for an introduction to the Filecoin network?

Filecoin currently offers several node implementations including a `Lotus` implementation (also in GoLang) that is currently the recommended default. For a more general introduction to the Filecoin network and underlying concepts that apply across all implementations, please visit the [Filecoin Docs](https://docs.filecoin.io) and [Filecoin Specification](https://spec.filecoin.io). 
