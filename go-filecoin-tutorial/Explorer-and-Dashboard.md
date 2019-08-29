# Block Explorer and Dashboard

## Table of Contents

- [Block Explorer](#block-explorer)
- [Network Dashboard](#network-dashboard)


## Block Explorer

The Filecoin block explorer is a great way to explore blocks that have been mined on the Filecoin network. It shows a constantly updating list of blocks (currently being mined on the Filecoin devnet). You can click into each block to see block details, such as the miner's address, the parent block, messages included in the block, and message receipts.

You can check the block explorer here: [http://user.kittyhawk.wtf:8000/](http://user.kittyhawk.wtf:8000/)

Home Page:

![Block explorer home page](./images/BE-home.png)

Diving into one block:

![One block](./images/BE-one-block.png)


## Network Dashboard

The Filecoin network dashboard provides a visual way to see nodes on the Filecoin network.

View stats about the whole devnet network:
- [User devnet network stats](https://stats.kittyhawk.wtf/)

See [Devnets](Devnets) for links to dashboards on the nightly and infra/test devnets.

In order to see your node's activity, configure your node to [stream its activity](Getting-Started#start-streaming-activity-from-your-node):

```sh
# User devnet
go-filecoin config heartbeat.beatTarget "/dns4/backend-stats.kittyhawk.wtf/tcp/8080/ipfs/QmUWmZnpZb6xFryNDeNU7KcJ1Af5oHy7fB9npU67sseEjR"
# Nightly devnet
go-filecoin config heartbeat.beatTarget "/dns4/nightly.kittyhawk.wtf/tcp/9081/ipfs/QmVR3UFv588pSu8AxSw9C6DrMHiUFkWwdty8ajgPvtWaGU"
```

Look for your node's miner address, which you can obtain by running `go-filecoin id`.
