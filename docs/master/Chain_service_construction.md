## Chain services

The implementation of the venus system uses a microservice architecture, decoupling overlapping functionalities to form different components. Depending on different one's core functions, Venus components are loosely broken into chain service components and independent components. Venus chain services can serve multiple clusters of different storage providers. Chain services can be built by storage providers or dedicated service provider. Each cluster gaining access to chain services only needs to focus on independent components, which is mainly for the growth and maintenance of storage power.

In the venus architecture, the continuous operation of the chain service is particularly important. Once the chain service is down, clusters using its service may fail. This article introduces how to deploy a chain services.

### Hardware requirement

Venus chain service is responsible for chain synchronization, message packaging, block producing and message query functions, which provides the fundation of a proper storage providing system. The recommended haredware specs for such chain services are:

- venus node *1: 32Core/128G/40G+2T(essd)；
- venus-auth, venus-messager *1: 16Core/32G/200G(essd)；
- venus-gateway *1: 16Core/32G/200G(essd)；
- venus-miner *1: 16Core/32G/200G(essd)；

One chain services can support multiple storage providers. To minimize the risks of single point failure, make sure there are redundancy for each venus modules and load balance to guard chain services from DDos.

### Deploy your chain services

Follow this guide for deployment of your [chain services](https://venus.filecoin.io/guide/How-To-Deploy-MingPool.html).
