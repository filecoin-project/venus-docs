## Background

Sealing as a service has grown from an [idea](https://filecoinproject.slack.com/archives/C0320QCV8SY/p1644244480718559) summarized in a [Google doc](https://docs.google.com/document/d/1zF1F6Q_Ya6IOUe9nfDOa0bNifvIa0TY4nR89omxy0kQ/edit) to one of the priorities among Filecoin data-onboarding roadmap. There are many potential merits of SaaS which includes lowering entry to Filecoin network, further separation of different roles, and the possibility of creating [new line of business](https://github.com/filecoin-project/lotus/discussions/9079).

![image](https://user-images.githubusercontent.com/1591330/185077991-a8db1738-2611-4ba2-9b09-d88d14b66800.png)

## Abstract

There are many ways that Sealing-as-a-Service could be carried out, but we think that an all-purpose and generic solution would include the following...

- SaaS which can serve different miner_id at the same time
- SaaS which can be scaled quickly to meet SP's sealing needs
- SaaS which allows SP to retain control of their funds needed for PoRep 
- A smart transfer scheme to send sealed sectors to SP (out of scope of this discussion)
- Sectors meta information for SP to continue PoST on sealed sectors

Given the above, [venus-cluster](https://venus.filecoin.io/cluster/) is well situated to serve as the underlying platform of such SaaS type of service.

## `venus-cluster` Features

For readers who may not as well versed in Venus, please refer to this [document](https://venus.filecoin.io/cs/#mining-architecture) to get an overall idea of Venus architecture.

Through working with many SPs (small and large) and directing much efforts into the development, `venus-cluster` storage power solution has been built from ground up to be configurable, scalable and customizable. Some of the design principles and key features make it very compatible with the SaaS initiative include...(but not limited to)

- Revamped sealing pipeline where hardware resources for each sealing tasks are pre-configured and could be used as a template to scale sealing operattions
- Revamped job scheduling where instead of active scheduling tasks to workers, a manager now passively receive reports on the progress of workers. We think this could be one of the keys to a generic SaaS solution
- Configurable target miner_id for the sealing resources
- Customizable proof code and execution stack (CPU, GPU, sector sealing storage)
- Customizable persistent storage strategy
- And much more

## SaaS design

For a comprehensive understanding of what `venus-cluster` is, please refer to the documentation [here](https://venus.filecoin.io/cluster/#what-is-venus-cluster). We believe that it will be crucial for the understanding of the design we presented below.

Again there are many ways that `SaaS` could be achieved, below are 3 different approaches...

### SaaS Architecture 1

![image](https://user-images.githubusercontent.com/1591330/185859458-2025492b-5b5b-4eb1-a0d5-44a76c0d9e58.png)

This is clearly not the "renting computation resources" model of `sealing-as-a-service` initiative but is a good starting point for understanding `venus-cluster` architecture. 

In the design presented above, the "SaaS" actually take care of both sealing and persistent storage while storage provider maintain full custody of its wallets and funds. Storage provider essentially, in this scenario, outsourced both PoRep and PoST to a third-party service provider. When signatures are needed for either PoRep or PoST, storage provider could remotely sign the necessary messages through its secure connection to `venus-gateway` with a trusted Venus chain service, decoupling message signing with the rest of the systems.

### SaaS Architecture 2

![image](https://user-images.githubusercontent.com/1591330/185875453-ab331a3d-44af-408a-b03d-772452c0cb09.png)

In the design above, a storage provider would need to manage its persistent storage and maintain PoSTing while PoRep is completely outsourced to a `SaaS`. Again the setup is similar for storage provider in design 1 where it needs to setup `venus-wallet` (owner, worker, controller) and connect it to a trusted Venus chain service to sign PoRep messages that are produced by `SaaS` with the benefit of storage provider retaining full control of their private keys.

On the `SaaS` side, by taking advantages of [passive job scheduling](https://venus.filecoin.io/cluster/#complete-revamp-of-existing-job-scheduling) feature of `venus-cluster` where venus-worker is able to change the state machine of a sealing sector, a pool of `venus-worker` can be configured to report to a remote `venus-sector-manager` and start sealing for a particular miner_id. 

Then by the flexibility of `venus-cluster`'s customizable framework, a `SaaS` provider could write their own storage strategy and plug it into `venus-worker`'s [configuration file](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/en/03.venus-worker-config.md#processorsstage_name) so that when a sector is sealed the custom storage logic will be executed by the said worker. 

```toml
[[processors.transfer]]
# Custom external processor executable file path, optional, string type
# By default, the executable file path corresponding to the main process will be used
bin = "./dist/bin/venus-worker-plugin-transfer"

# Customize the parameters of the external processor, optional item, string array type
# The default value is null, `venus-worker`'s own executor default parameters will be used
args = ["--args-1", "1", "--args-2", "2"]
```

### SaaS Architecture 3 

![image](https://user-images.githubusercontent.com/1591330/185887602-14fc834d-bce2-4b36-81b1-2091e198c47b.png)

In the design 3 above, it further builds upon the architecture of design 2 and potentially optimize the work flow on both `SaaS` side and storage provider side. For example, APIs for `SaaS` related admin features, a `venus-sector-manager` for `SaaS` provider to transfer meta data of sealed sectors to its counter-part on storage provider side, worker pool configurations specific to `SaaS` provider and etc. 

## Conclusion

We believe that `venus-cluster` along with Venus systems are well positioned to be one of the platforms for a fully fledged `SaaS` solution. Relevant API designs and how exactly `venus-sector-manager` interact with `venus-worker` could be found at [venus-cluster repo](https://github.com/ipfs-force-community/venus-cluster). Thoughts, comments or questions are welcomed! 

## Other Solutions on the Market

- [ ] https://github.com/ipfs-force-community/venus-cluster/discussions/359