# How Filecoin Works

## Table of Contents

- [What is Filecoin?](#what-is-filecoin)
    - [What's the connection between Filecoin and IPFS?](#whats-the-connection-between-filecoin-and-ipfs)
- [Architecture Overview](#architecture-overview)
    - [Filecoin as a decentralized storage solution](#filecoin-as-a-decentralized-storage-solution)
    - [Filecoin as a blockchain](#filecoin-as-a-blockchain)
    - [Core Concepts (TODO)](#core-concepts-todo)
- [Further Reading](#further-reading)


## What is Filecoin?
Filecoin is a decentralized storage network that turns the world’s unused storage into an algorithmic market, creating a permanent, decentralized future for the web. **Miners** earn the native protocol token (also called “filecoin”) by providing data storage and/or retrieval. **Clients** pay miners to store or retrieve data.

#### What's the connection between Filecoin and IPFS?
Filecoin and [IPFS](https://github.com/ipfs/ipfs) are complementary protocols, both created by Protocol Labs. IPFS allows peers to store, request, and transfer verifiable data with each other. IPFS is open-source and free to download and use, and is already in use by numerous groups. With IPFS, individual nodes store data that they consider important; there’s no simple way to incentivize others to join the network or store specific data.

Filecoin is designed to solve this key problem by providing a system of persistent data storage. Under Filecoin’s incentive structure, clients pay to store data at specific levels of redundancy and availability, and miners earn payments and rewards by continuously storing data and cryptographically proving that they are doing so.

#### In short: IPFS addresses and moves content; Filecoin is the missing incentive layer.

👉 Ready to dive in? You can jump straight to [Getting Started](Getting-Started) to build and run a node. Or, to learn more about Filecoin architecture, keep reading...

## Architecture Overview

You can think of Filecoin as two concepts. One is a blockchain, and the other is a decentralized storage solution. These are very much interlinked, but it can be easier to understand them separately.

#### Filecoin as a decentralized storage solution

The Filecoin decentralized storage network has 4 major roles:
1. **Storage miners:** like servers in the classical http web, they store data
1. **Retrieval miners:** like CDNs, they fetch data and serve it to clients
1. **Storage clients:** users that want to store data
1. **Retrieval clients:** users that want to get data

Any node can perform all 4 of these at once, but can also choose to perform just _some_ of these roles. See [Getting Started](Getting-Started) for tutorials on installing and running a node.

#### Filecoin as a blockchain

A blockchain is a public digital ledger, with transactions recorded chronologically and publicly in a series of linked records, or blocks. Rather than relying on a central authority, blockchains are built by a network of nodes, each participating in the network and coming to agreement through consensus protocols.

While most blockchains use Proof-of-Work mining, Filecoin uses Proof-of-Storage. The probability that you will mine a filecoin block increases with the amount of storage you provide on the network. 

The Filecoin blockchain design has similarities to Ethereum: Filecoin _messages_ are roughly equivalent to Ethereum _transactions_, and Filecoin _actors_ are similar to Ethereum _contracts_.

#### Core Concepts (TODO)
- Proofs of Storage (SpaceTime, Replication)
- Expected Consensus (EC)
- Storage Market

## Further Reading
* [Filecoin Specification](https://github.com/filecoin-project/specs)
  * [Storage Market](https://github.com/filecoin-project/specs/blob/master/storage-market.md)
  * [Expected Consensus](https://github.com/filecoin-project/specs/blob/master/expected-consensus.md)
  * [Filecoin Proofs](https://github.com/filecoin-project/specs/blob/master/proofs.md)
