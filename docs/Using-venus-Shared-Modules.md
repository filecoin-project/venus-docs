[toc]

# Preface

Starting filecoin mining could be a daunting task given not only the large initial hardware and filecoin collateral [investment](https://filscan.io/calculator) but also the entailing operation commitment. With the idea of security, ease of use and distributed mining pool in mind, Venus implementation of filecoin will help miners turn, what community say, [a full time job](https://filecoinproject.slack.com/archives/CEGN061C5/p1610810730117900?thread_ts=1610809298.116800&cid=CEGN061C5) into a serious hobby. Hope this tutorial will get you started mining in no time! 

# How mining works 

There are two ways of getting started with mining using Venus. 

1. Deploy minimum hardware and gain access to a publicly hosted shared Venus modules. (Checkout venus incubation center page to learn more on how you can get an account setup!)
2. Deploy all hardware and venus modules by yourself.

After following the rest of the trutorial and successful deployment, you can start pledging sectors, grow power and evantually obtain block rewards through your contribution to the network's storage capacity!

# Venus modules introduction

Depending on its role in a mining cluster, modules could be loosely broken down into two category: shared and independent. Shared modules could be thought as the plumbings of what you need to start sealing sectors. Most of the dealings with the blockchain like chain synchronizations, sending messages, winning a block and etc are handled by the shared modules. The idea is that many miners could all use a set of shared modules, thus reducing overhead in maintainence. Independent modules handles sealing and proving of your sectors, where you will be spend most of your time if you choose to use a publicly hosted shared venus modules. Note also that venus-wallet module could be deployed as either shared or independent. 

| name                                                         | role                                                  | shared/independent |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------ |
| [venus](https://github.com/filecoin-project/venus)           | daemon for chain interactions                         | shared             |
| [venus-miner](https://github.com/filecoin-project/venus-miner) | block winning and proving                             | shared             |
| [venus-messager](https://github.com/filecoin-project/venus-messager) | chain message manager                                 | shared             |
| [venus-auth](https://github.com/filecoin-project/venus-auth) | utility for authorized use of shared modules          | shared             |
| [venus-gateway](https://github.com/ipfs-force-community/venus-gateway) | utility for controlled access point of shared modules | shared             |
| [venus-wallet](https://github.com/filecoin-project/venus-wallet) | addresses/keys manager                                | shared/independent |
| [venus-sealer](https://github.com/filecoin-project/venus-sealer), [venus-worker](https://github.com/filecoin-project/venus-sealer) | job scheduling, sealing and proving                   | independent        |

# Mining architecture



 # Hardware requirements

TBD

# Pre-requisites

Before diving into deployment of your mining operation, please make sure you check the following. 

## Setup your permanent storage

##  Get your account setup in shared modules

## Software dependencies

# Install venus-wallet

# Install venus-sealer

# Start mining

