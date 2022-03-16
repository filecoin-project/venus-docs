### Chain services

The implementation of the venus system uses a microservice architecture, decoupling overlapping functionalities to form different components. Depending on different one's core functions, Venus components are loosely broken into chain service components and local components. Venus chain services can serve multiple storage systems of different storage providers. Chain services can be built by storage providers or dedicated chain service provider. Each storage system gaining access to chain services only needs to focus on local components, which is mainly for the growth, maintenance of storage power and optionally deal-making.

In the venus architecture, the continuous operation of the chain service is particularly important. If the chain service is down, storage systems using its service may fail. This article introduces how to deploy a chain service along with intros on how to use a chain service, venus-cluster and deal-making.

### Hardware requirement

Venus chain service is responsible for chain synchronization, message packaging, block producing and message query functions, which provides the fundation of a proper storage providing system. The recommended haredware specs for such chain services are:

- venus node *1: 32Core/128G/40G+2T(essd)；
- venus-auth, venus-messager *1: 16Core/32G/200G(essd)；
- venus-gateway *1: 16Core/32G/200G(essd)；
- venus-miner *1: 16Core/32G/200G(essd)；

:::tip 

One chain service can support multiple storage providers. To minimize the risks of single point failure, make sure there are redundancy for each venus modules and load balance to guard chain services from DDos.

:::

### Deploy a chain service

Follow this guide for deployment of your [chain services](https://venus.filecoin.io/guide/How-To-Deploy-MingPool.html).

### Use a chain service

To join a self-deployed or a thrid-party chain service, please refer to documentation [here](/guide/Using-venus-Shared-Modules.html).

### venus-cluster

To use venus-cluster for growth of storage power, please refer to documentation [here](/guide/Using-venus-cluster-alt.html).

### Deal making

To use venus-market, please refer to documentation [here](https://github.com/filecoin-project/venus/discussions/4735).