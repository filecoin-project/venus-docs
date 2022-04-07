## What is venus-cluster?

venus-cluster is the next generation venus-sealer, which offers a configurable, expandable and customizable storage power solution for the Filecoin storage providers.  

## venus-cluster Features

### Complete revamp of existing job scheduling

Managing sealing pipeline traditionally not only requires extensive knowledge across sealing mechanism and hardware specifications, but also demand a lot of devOps attentions for maintenance and troubleshooting. By allowing venus-workers to change the state machine of a sealing sector, instead of having an active and centralized job scheduling model, venus-cluster introduced a new model that worker itself actively grabs new tasks.

### Horizontal scaling of your workers

With extensive configurations venus-cluster supports to optimize your setups, a storage provider can easily take the config file of one worker and apply it to another worker with same hardware specification. Thus enabling ultra fast expansion of a storage provider’s sealing capacity. 

### Decoupling of Post workers

venus-cluster supports worker machines to be setup as dedicated Post workers, relieve the headache that sealing tasks may compete resources with essential post tasks. 

### Pooling of worker resources

Thanks to the new scheduling model, storage power services (sealing pipeline and Post workers) by venus-cluster can be used to serve multiple nodes (miner_id). The pooling of workers essentially allows storage providers more flexibility in their deployment and saves hardware resources and operation overhead.

### Customized sealing tasks

If storage provider has extensive background in optimizing a particular phase of sealing task, maintaining a forked reference implementation of Filecoin is no longer as venus-cluster allows your custom code to be plugged into the sealing pipeline directly through simple configuration. 