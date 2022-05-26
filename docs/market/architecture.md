## Background

As the re-branding of filecoin terminology spearheaded by [FIP0018](https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0018.md) settled, consensus has been reached across communities (developers, providers, ecosystem partners and etc) to push for taking on more storage deals to improve the public perception on the fact that most of the network storage are still committed capacities (CCs). Given the above sentiment, design and implementation of venus-market module has been put into the spot light. A clear long-term roadmap is due for Venus community to discuss and iterate on, also as a means for better communications with filecoin ecosystem in general. As Venus team is picking up the reminiscences of the [Filecoin Component Architecture](https://docs.google.com/document/d/1ukPD8j6plLEbbzUjxfo7eCauIrOeC_tqxqYK_ls9xbc/edit#), emergent ways of how market could facilitate the dynamics between storage providers and storage clients are constatntly being intergrated into the long-term vision of Venus filecoin. 

## Architecture

One of the most distinctive features of Venus is easing storage providers into the Filecoin network by relieving the overhead coming with interacting with the Filecoin main chain through the usage of Venus chain service. Chain interactions including but not limited to chain synchronization, message sending and consolidated block producing can all be handled by a Venus chain service that may be shared among a group of storage providers. Taking another step further in this architecture powered by Venus chain service, venus-market can be deployed as a component of the chain service to mediate the deal-making process on behalf of the storage provider according to its own configurations and settings. With integration of `venus-cluster` and `venus-sealer` into the mix, a Venus storage provider can enjoy a deal-taking experience that is close to sealing a CC sector.

![venus-cluster](../.vuepress/public/vm_arc.jpg)

The above illustration shows a high-level overview of `venus-market` architecture (when deployed as a chain service component). On the left, we have a column of different types of storage clients like the lotus client, `venus-market` light weight client and platforms like Estuary and Filswan. In the middle, we have Venus chain service with `venus-market v2` at its core along with other components. On the right, we have storage providers using the chain service. 

### deal flow

A typical storage deal flow would go from clients initiating a deal to `venus-market`, storage providers agree to take the deal, deal data got transferred from the client to the `pieceStore` sub module of `venus-market` and lastly the deal data got transferred from chain service to storage providers through different types of data transfer protocols like OSS and graphsync. 

## Roadmap

Details of the roadmap for `venus-market` can be found [here](https://github.com/filecoin-project/venus/blob/master/documentation/venus-market%20module%20design%20%26%20roadmap.md). As of the date we publish this document, venus-market is now at phase 2 platform model. 