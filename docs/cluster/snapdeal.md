# SnapDeal support

## SnapDeal Brief
`SnalDeal` is a sector proposed in [FIP-19](https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0019.md), which is launched on `network15` upgrade plan.
Compared with the huge overhead of the previous upgrade plan, which needs to complete the packaging process again and again, `SnalDeal` is quite lightweight, and its overhead is about:
- Complete an `add piece`
- complete `tree d` once
- Complete one `snap_encode`, the cost is approximately equal to one `pc2`
- To complete a `snap_prove`, the cost is approximately equal to one `c1` + `c2`
Therefore, `SnalDeal` is quite attractive whether it is for the new real data storage requirements or the conversion of the stock `CC sectors`.

## venus-cluster support for SnapDeal
Currently, in the existing computing power schemes of `lotus` and `venus`, the support for `SnapDeal` is limited to a relatively crude way of manually triggering.
`venus-cluster` was designed to provide a computing power production solution in the production line mode. For this reason, we provide a `SnapDeal` production solution that requires less manual intervention, which we call `SnapUp`. Its steps are roughly as follows:

1. Batch import existing `CC sectors` as local candidate sectors
2. Configure `venus-sector-manager` to enable `SnapUp` support for the specified `SP`
3. Configure `venus-worker`, convert existing `sealing_thread` into `SnapUp` production plan, or add `sealing_thread` for `SnapUp`
During the whole process, the user only needs to pay attention to the import and allowance of the local candidate sector, and the rest of the process will be completed automatically.

## example
The following takes a production cluster on the `butterfly` network as an example to demonstrate step by step how to configure the production scheme of `SnapUp`.

### Import of candidate sectors
Using the new `util sealer snap fetch` tool, you can import `CC sectors` that meet the limit (the remaining life cycle is greater than 180 days, which meets the minimum life cycle of the order) as local candidate sectors according to the `deadline`.
````bash
./dist/bin/venus-sector-manager --net butterfly util sealer snap fetch 1153 3
2022-04-15T04:28:03.380Z DEBUG policy policy/const.go:18 NETWORK SETUP {"name": "butterfly"}
2022-04-15T04:28:03.401Z INFO cmd internal/util_sealer_snap.go:53 cadidate sectors fetched {"available-in-deadline": 2, "added": 2}
````

### Observe the margin of the candidate sector
````bash
./dist/bin/venus-sector-manager --net butterfly util sealer snap candidates 1153
2022-04-15T04:28:13.955Z DEBUG policy policy/const.go:18 NETWORK SETUP {"name": "butterfly"}
deadline count
3 2
````
It can be seen that there are currently 2 `CC sectors` in `#3 deadline` as candidates for upgrade

### Configure `venus-worker`
The content that needs to be configured in `venus-worker` is mainly `sealing_thread` for `SnapUp` task, and computing resource allocation for `snap_encode`, `snap_prove`.

An example is as follows:
````toml
[[sealing_thread]]
location = "/data/local-snap"
plan = "snapup"

[processors.limitation.concurrent]
...
tree_d = 1
snap_encode = 1
snap_prove = 1

[[processors.snap_encode]]
cgroup.cpuset = "48-63"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.snap_prove]]
cgroup.cpuset = "16-31"
envs = { CUDA_VISIBLE_DEVICES = "1" }
````

The computing resource allocation of `snap_encode` can refer to `pc2`, and the computing resource allocation of `snap_prove` can refer to `c2`

### Configure `venus-sector-manager`
The configuration content required in `venus-sector-manager` is mainly to enable `SnapUp` for the specified `SP`, the example is as follows:

````toml
[[Miners]]
Actor = 1153
[Miners.Sector]
InitNumber = 0
MaxNumber = 10000
Enabled = true
EnableDeals = false

[Miners.SnapUp]
Enabled = true
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
````

in
- The configuration content in the `[Miners.Sector]` block does not affect the operation of `SnapUp`.
- Under this configuration, it will be possible to support:
  - `CC Sector` continuous production
  - `SnapUp` keeps producing if the local candidate sector has slack

### Precautions:
1. Considering the computing resources required by `snap_encode` and `snap_prove`, if you enable both regular sector encapsulation and `SnapUp` in the same `venus-worker` instance, you may need to consider the resource competition situation, you can refer to [07.Example configuration of venus-worker external actuator](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/07.venus-worker%E5%A4%96%E9%83%A8%E6%89%A7%E8%A1%8C%E5%99%A8%E7%9A%84%E9%85%8D%E7%BD%AE%E8%8C%83%E4%BE%8B.md)
2. Considering the distribution of persistent data in sectors, the `venus-worker` used for `SnapUp` needs to be able to access all persistent storage spaces (`persist store`) in a readable and writable manner at the same time, and ensure that they The naming is the same as in `venus-sector-manager`.
3. Based on the above two points, we recommend using a separate device for the production of `SnapUp`, so as to avoid the complexity of configuration and operation and maintenance caused by the mixed distribution of regular sectors and `SnapUp`.

## Continuous optimization
The improvement and optimization of the `SnapUp` program is still in progress. At present, we mainly focus on:
- Convert semi-automatic candidate sector import to automatic mode, or provide equivalent operation and maintenance tools
- More candidate sector import rules, such as import by storage configuration
- Aggregation of on-chain messages to reduce costs
- Other optimizations and tools that simplify operations, reduce costs, and increase efficiency