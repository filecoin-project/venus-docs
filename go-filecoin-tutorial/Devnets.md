# Join a Devnet

There are currently 3 Filecoin developer networks (aka devnets) available for development and testing.

Current versions of each devnet are listed as colored badges at the top of [go-filecoin's README](https://github.com/filecoin-project/go-filecoin/blob/master/README.md).

Both are subject to _**frequent downtimes**_ for a variety of reasons, including bugs, breaking changes, or the polar vortex ⛄. There is no [SLA](https://en.wikipedia.org/wiki/Service-level_agreement); until we have a status page, please ping in [#fil-help](https://github.com/filecoin-project/community#chat) if you would like to confirm status.

## Table of Contents

- [User](#user)
- [Nightly](#nightly)
- [Staging (for Infra and pre-release testing)](#staging-for-infra-and-pre-release-testing)
- [Configuration](#configuration)
- [Network Health](#network-health)


### User

At the moment, **this is the network to use by default, for testing and experimenting**. Nodes are deployed from master manually.

- NetworkStats: [https://stats.kittyhawk.wtf](https://stats.kittyhawk.wtf)
- Faucet: [http://user.kittyhawk.wtf:9797/](http://user.kittyhawk.wtf:9797/)
- Dashboard: [http://user.kittyhawk.wtf:8010/](http://user.kittyhawk.wtf:8010/)
- Genesis File: [http://user.kittyhawk.wtf:8020/genesis.car](http://user.kittyhawk.wtf:8020/genesis.car)
- Block explorer: [http://user.kittyhawk.wtf:8000/](http://user.kittyhawk.wtf:8000/)
- Prometheus Endpoint: [http://user.kittyhawk.wtf:9082/metrics](http://user.kittyhawk.wtf:9082/metrics)
- Connected Nodes PeerID's: [http://user.kittyhawk.wtf:9082/nodes](http://user.kittyhawk.wtf:9082/nodes)
- Git tag: `devnet-user`
- Sector size: **256MiB**

The [Getting Started](Getting-Started) page contains
instructions for connecting your nodes to this network.

### Staging (for Infra and pre-release testing)

Deployed via CI by tagging a commit with `staging-devnet-{d}.{d}.{d}` where d is a positive integer. **This network
is for people working on infra or testing a pre-release. You should probably avoid it unless that describes you.**

- NetworkStats: [https://staging.stats.kittyhawk.wtf](https://staging.stats.kittyhawk.wtf)
    * <sub>`heartbeat.beatTarget "/dns4/staging.backend-stats.kittyhawk.wtf/tcp/8080/ipfs/QmUWmZnpZb6xFryNDeNU7KcJ1Af5oHy7fB9npU67sseEjR"`</sub>
- Faucet: [https://faucet.staging.kittyhawk.wtf/](https://faucet.staging.kittyhawk.wtf/)
- Dashboard: [http://staging.kittyhawk.wtf:8010/](http://staging.kittyhawk.wtf:8010/)
- Genesis File: [https://genesis.staging.kittyhawk.wtf/genesis.car](https://genesis.staging.kittyhawk.wtf/genesis.car)
- Block explorer: [https://explorer.staging.kittyhawk.wtf/](https://explorer.staging.kittyhawk.wtf/)
- Prometheus Endpoint: [http://staging.kittyhawk.wtf:9082/metrics](http://staging.kittyhawk.wtf:9082/metrics)
- Connected Nodes PeerID's: [http://staging.kittyhawk.wtf:9082/nodes](http://staging.kittyhawk.wtf:9082/nodes)
- Sector size: **256MiB**

### Nightly

Deployed from master by CI every day at 0600 UTC. **This network
is for people contributing to `go-filecoin`. You should probably avoid it unless that describes you.**

- Faucet: [https://faucet.nightly.kittyhawk.wtf/](https://faucet.nightly.kittyhawk.wtf/)
- Dashboard: [http://nightly.kittyhawk.wtf:8010/](http://nightly.kittyhawk.wtf:8010/)
- Genesis File: [https://genesis.nightly.kittyhawk.wtf/genesis.car](https://genesis.nightly.kittyhawk.wtf/genesis.car)
- Block explorer: [https://explorer.nightly.kittyhawk.wtf/](https://explorer.nightly.kittyhawk.wtf/)
- Prometheus Endpoint: [http://nightly.kittyhawk.wtf:9082/metrics](http://nightly.kittyhawk.wtf:9082/metrics)
- Connected Nodes PeerID's: [http://nightly.kittyhawk.wtf:9082/nodes](http://nightly.kittyhawk.wtf:9082/nodes)
- Sector size: **1KiB**

## Configuration
### Nightly 
`auto-seal-interval-seconds 300`

### Staging 
`auto-seal-interval-seconds 300`  

### User 
`auto-seal-interval-seconds 300`  

## Network Health
To get an idea of the state of each network, you can visit the network dashboard (port 8010).
Once the page is loaded, wait about 5 to 10 seconds for heartbeats to arrive. A healthy
network should show at least 5 nodes with the nickname "boot".

Each network is set up to mine a new block about every 30 seconds. If the "Last Block" column
on the far right remains blank, or the number increments far beyond the 30 second mining time,
this indicates that the network is no longer mining, or is not mining at the desired rate.

Another indication that a network is not in a healthy state is the background
color of the tipset value. If all colors are the same, the nodes are in consensus. Two or more
colors that persist may indicate that the nodes have fallen out of consensus.