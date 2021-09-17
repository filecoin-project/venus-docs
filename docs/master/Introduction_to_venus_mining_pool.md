## Venus overview

Venus is one of the common implementations of Filecoin, dedicated to a distributed cluster architecture and a more concise division of responsibilities.

The external appearance of &ensp;&ensp; venus distributed mining pool is similar to traditional distributed mining pool. In terms of storage resources, it is reflected in the geographical distribution. As long as there is a place that can be accessed by the network, the node can be connected to the Venus mining pool.

### Architecture

The venus architecture design includes venus, venus-auth, venus-miner, venus-messager, venus-wallet, venus-sealer, and the planned venus-market. Based on the division of functions as the criterion, the components are divided into public components (chain services) and independent components, which greatly liberates the storage provider, and is no longer entangled by messages that cannot be chained, block synchronization errors, etc., but has technology Service providers with strength and hardware resources can build public components to provide services to dispersed clusters, and obtain certain service fees from them. Of course, if the storage provider has multiple clusters and has certain technical strength, they can also build their own chain services.

The following figure is a typical application scenario we envisioned. In this scenario, a set of independent components (venus-sealer, venus-worker, venus-wallet) is responsible for the growth and maintenance of a cluster's computing power, and such a cluster is very Convenient for horizontal expansion.

![](../.vuepress/public/venus-cluster.png)

The corresponding relationship between venus and lotus components is shown below, which have been extended based on the realization of lotus functions:

* venus-auth --> token authentication service extend lotus jwt
* venus-miner --> lotus-miner block produce part & multi miner
* venus-sealer --> lotus-miner sealer scheduler part/wd
* venus-worker --> lotus-worker
* venus daemon --> lotus daemon
* venus-wallet -> lotus wallet part
* venus-messager --> lotus mpool
* venus-market --> lotus-miner market part


#### venus-auth

Venus-auth is a component used for authorization. In a typical deployment environment, venus-auth is used to provide authorization services for venus, venus-miner, and venus-messager. Each local node must be authorized to access shared components. On this basis, expand the functions and do some security controls, such as access current limiting and blacklisting.

#### venus

Venus is similar to lotus-daemon, which is used to implement full nodes. Venus is connected to the Filecoin blockchain network to provide data support for Venus. You can use venus as a normal node. It has all the functions necessary for a blockchain node, such as chain, mpool, and wallet. The interface of venus is basically compatible with lotus (if there is an incompatible interface, you can raise an issue). You can create a private key on venus, query assets, transfer funds, and so on. In a typical deployment environment, venus only provides data query services on the basic chain, and does not store the private key itself. The block data required by slashfilter is stored in the database, and the node itself is stateless, so that the high availability of the venus node can be achieved through the nginx reverse proxy.

The venus node itself has some differences with lotus:

1. The interface for creating the block supports external signatures (pr will be mentioned to lotus later)
2. The message selection interface supports simultaneous selection of multiple batches of messages, which is used to select messages when multiple miners produce blocks.
3. Support central access authorization of venus-auth

Therefore, if you are interested in mixed deployment of venus/lotus, you need to use the lotus compatible venus project we maintain, or pick the code to compile by yourself.

#### venus-miner

The function of venus-miner is to gather block rights. The program can configure the locations of multiple miners, their sealers and wallets, and generate blocks for these miners at the same time. The venus-miner has the following characteristics:

1. Separation of data: Because the process of generating blocks requires access to data, and the sealer of miners may be heterogeneous, but currently most miners use their own custom code, then there is how to access these data in order to achieve joint mining problem. By blocking the dependence of venus-miner on the storage organization, and by letting the proof be completed on the miner's side, no matter how the miner's sealer organizes storage, as long as the **ComputeProof** interface is implemented, venus-miner can generate the proof through this interface.
2. Separate the private key: In the process of calculating the random number and signing the block, all operations involving the private key are accessed through a remote wallet, which can improve the security of mining activities.
3. Increase miner income and network TPS: When the miner responsible for venus-miner obtains multiple (>1) block rights in one cycle, venus-miner will try to select different messages from the message pool for packaging, to a certain extent It can increase the speed of news on the chain, and at the same time make it possible to get more tip rewards (Premium) for the block.

#### venus-messager

The goal of the venus-messager component is to better help the message on the chain, and to flexibly control the timing of the message on the chain, reduce gas consumption, flow control, etc. These include remote wallet management, address management, and message management.

1. Address management: It mainly manages the nonce value to ensure that the nonce value can be allocated in the correct order.
2. Message management: Message management is divided into three parts, namely "message receiving and saving", "message selection and push" and "message on-chain status tracking".
3. Gas Fee Management: The coefficient of gasLimit and maxFee can be set separately according to the address.

In terms of functionality:

1. Remote wallet support: One venus-messager supports multiple wallets, and manages their own messages separately.
2. Support sqlite local storage and mysql remote storage: storage is more secure and stable.
3. Dynamic filling: According to the gas and push strategy, when sending a message on the chain, gas-related parameters and nonce need to be filled in to ensure that the gas estimation and other settings are effective.
4. Maintain the message status: including whether the message is linked and replaced, and save the execution result.
5. Multi-point messaging (push to multiple nodes via Mpool API): Ensure that messages are spread on the network.
6. Flexible configuration: including gas estimation, message push strategy, etc.

#### venus-wallet

venus-wallet is a remote wallet that can support both lotus and venus on the protocol. In a typical deployment environment, this component is deployed locally by miners, and certain policy configurations are used to ensure asset security. venus-wallet has the following features:

1. Private key management module: currently supports private key management of asymmetric algorithms BLS and SECP, can generate random private keys, and use aes128 to encrypt and store the private keys symmetrically, and support private keys to sign data.
2. Signature verification: Each signature type has a corresponding verification strategy, which ensures that the signer cannot cheat the wallet on the signature type.
3. Signature strategy module: For Filecoin's Lotus and Venus implementations, it manages the existing 10 data structures and more than 60 signature types in the message data structure in a unified manner, and configures various combinations to bind private key signature rules as needed , And then several different private key signature rules can be combined into a whole and authorized to be used by external components.

#### venus-sealer + venus-worker

Venus-sealer basically continues the mining part of lotus. We stripped out the mining-related code in sealer to form venus-sealer. The difference between the two projects is:

1. Connected to the messenger system, all messages are managed in the messenger.
2. The storage is separated from the badger and saved with sqlite (metadata, sector state machine system information, scheduling and its results), and mysql storage will be further supported in the future to ensure data security.
