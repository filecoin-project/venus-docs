## Background

Starting filecoin storage providing could be a daunting task given not only the large initial hardware and filecoin collateral [investment](https://filscan.io/calculator) but also the entailing operation commitment. With ideas of distributed infrastracture, optimized deal experience and new storage power service in mind, Venus implementation of filecoin will help storage providers turn, what community say, [a full time job](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5) into a full fledged solution that is more friendly to opeartion. Hope this tutorial will get you started mining in no time! 

## Start Storage Providing 

There are two ways of getting started with storage providing using Venus. 

1. Deploy minimum hardware and gain access to a publicly hosted Venus chain service. Check out [Venus SP Incubator program](https://venushub.io/incubator/) to learn how you can gain access to a free hosted chain service.<!--(Checkout venus incubation center page to learn more on how you can get an account setup!)--> (Please refer to [this](join-a-cs.md) tutorial to learn more)
2. Deploy a Venus chain service by yourself. (Please refer to [this](deploy-a-cs.md) tutorial to learn more)

After following the rest of the trutorial and successful deployment, you can start pledging sectors, grow power and evantually obtain block rewards through your contribution to the network's storage capacity!

## Introducing Venus Components

Depending on its role in a storage system, components could be loosely broken down into two category: chain service components and local components. Chain service could be thought as the plumbings of what you need to start sealing sectors. Most of the interactions with the blockchain like chain synchronizations, sending messages, winning a block and etc are handled by the chain service. The idea is that many miners could all use one chain service, thus reducing overhead in maintainence. Local components handles sealing and proving of your sectors, where you will be spend most of your time if you choose to use a publicly hosted chain service. Note also that both `venus-market` and `venus-wallet` component could be deployed as either chain service or local component. 

| name                                                         | role                                                  | Chain_Service/Local |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| [venus](https://github.com/filecoin-project/venus)           | daemon for chain interactions                         | Chain_Service             |
| [venus-miner](https://github.com/filecoin-project/venus-miner) | block winning and proving                             | Chain_Service             |
| [venus-messager](https://github.com/filecoin-project/venus-messager) | chain message management                              | Chain_Service             |
| [venus-auth](https://github.com/filecoin-project/venus-auth) | utility for authorized use of shared modules          | Chain_Service             |
| [venus-gateway](https://github.com/ipfs-force-community/venus-gateway) | utility for controlled access point of shared modules | Chain_Service             |
| [venus-wallet](https://github.com/filecoin-project/venus-wallet) | addresses/keys management                             | Chain_Service/Local |
| [venus-cluster](https://github.com/ipfs-force-community/venus-cluster) | job scheduling, sealing and proving                   | Local        |
| [venus-market](https://github.com/filecoin-project/venus-market) | deal making  | Chain_Service/Local |
| ~~[venus-sealer](https://github.com/filecoin-project/venus-sealer), [venus-worker](https://github.com/filecoin-project/venus-sealer)~~ | ‼️Deprecated; ~~job scheduling, sealing and proving~~                   | ~~Local~~        |



## Mining Architecture

Diagram below illustrates how Venus components interacts with one and another.

![venus-cluster](../.vuepress/public/venus-cluster2.png)

## Hardware requirements

Learn more about hardware requirements [here](https://docs.filecoin.io/mine/hardware-requirements/#general-hardware-requirements). Check out this [solo mining guide](https://medium.com/zeethio/filecoin-solo-mining-rig-a549e7fa230d) by one of the comunity members. As a sidetone, everyone may have different hardware setups, and it is recommended that you [find your own optimal configurations](#finding-optimal-configurations) through trial and errors. 

:::warning
For `venus-cluster`, you could refer to this [community test report](https://github.com/filecoin-project/venus/discussions/4865) for hardware reference. Plan your hardware carefully, when in doubt please seek help from [Venus Master](https://venushub.io/master/).
:::