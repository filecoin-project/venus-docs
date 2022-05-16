# SnapDeal 的支持

## SnapDeal 简述
`SnalDeal` 是在 [FIP-19](https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0019.md) 中提出，在 `network15` 上线的一种扇区升级方案。
相比之前的升级方案需要重新、完整完成一遍封装过程的巨大开销，`SnalDeal` 显得相当轻量，它的开销大约为：
- 完成一次 `add piece`
- 完成一次 `tree d`
- 完成一次 `snap_encode`，其开销约等于一次 `pc2`
- 完成一次 `snap_prove`，其开销约等于一次 `c1` + `c2`
因此，无论是对于新增的真实数据存储需求，还是对存量 `CC 扇区` 进行转化，`SnalDeal` 都具备相当的吸引力。

## venus-cluster 对 SnapDeal 的支持
目前，在 `lotus` 和 `venus` 现存的算力方案中，对于 `SnapDeal` 的支持都局限于手动触发这样一种相对简陋的方式。
`venus-cluster` 在设计之初就着眼于提供生产线模式的算力生产方案，为此我们提供了一种不太需要人工介入的 `SnapDeal` 生产方案，我们称之为 `SnapUp`。它的步骤大致如下：

1. 将已有的 `CC 扇区` 批量导入为本地候选扇区
2. 配置 `venus-sector-manager`，对指定 `SP` 启用 `SnapUp` 支持
3. 配置 `venus-worker`，将已有的 `sealing_thread` 转化成 `SnapUp` 生产计划，或新增用于 `SnapUp` 的 `sealing_thread`
整个过程中，使用者仅需关注本地候选扇区的导入和余量，其余过程都会自动完成。

## 示例
下面以一套 `butterfly` 网络上的生产集群为例，逐步演示如何配置 `SnapUp` 的生产方案。

### 候选扇区的导入
使用新增的 `util sealer snap fetch` 工具，能够按 `deadline` 将满足限制（剩余生命周期大于180天，满足订单的最小生命周期）的 `CC 扇区` 导入为本地候选扇区。
```
./dist/bin/venus-sector-manager --net butterfly util sealer snap fetch 1153 3
2022-04-15T04:28:03.380Z        DEBUG   policy  policy/const.go:18      NETWORK SETUP   {"name": "butterfly"}
2022-04-15T04:28:03.401Z        INFO    cmd     internal/util_sealer_snap.go:53 cadidate sectors fetched        {"available-in-deadline": 2, "added": 2}
```

### 观察候选扇区的余量
```
./dist/bin/venus-sector-manager --net butterfly util sealer snap candidates 1153
2022-04-15T04:28:13.955Z        DEBUG   policy  policy/const.go:18      NETWORK SETUP   {"name": "butterfly"}
deadline  count
3         2
```
可以看到，当前存在 2 个 `#3 deadline` 中的 `CC 扇区` 作为候选，可供升级

### 配置 `venus-worker`
`venus-worker` 中需要配置的内容主要是用于 `SnapUp` 任务的 `sealing_thread`， 和针对 `snap_encode`、`snap_prove` 的计算资源分配。

示例如下：
```
[[sealing_thread]]
location = "/data/local-snap"
plan = "snapup"

[processors.limit]
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
```

`snap_encode` 的计算资源分配可以参考 `pc2`，`snap_prove` 的计算资源分配可以参考 `c2`

### 配置 `venus-sector-manager`
`venus-sector-manager` 中需要的配置内容主要是为指定的 `SP` 启用 `SnapUp`，示例如下：

```
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
```

其中
- `[Miners.Sector]` 块中的配置内容不会影响 `SnapUp` 的运转。
- 在这套配置下，将可以支持：
  - `CC 扇区` 持续生产
  - `SnapUp` 在本地候选扇区有余量的情况下持续生产

### 注意事项：
1. 考虑到 `snap_encode` 和 `snap_prove` 所需的计算资源，如果在同一个 `venus-worker` 实例中同时启用常规扇区封装和 `SnapUp` 的话，可能需要考虑资源竞争的情况，可以参考 [07.venus-worker外部执行器的配置范例](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/07.venus-worker%E5%A4%96%E9%83%A8%E6%89%A7%E8%A1%8C%E5%99%A8%E7%9A%84%E9%85%8D%E7%BD%AE%E8%8C%83%E4%BE%8B.md)
2. 考虑到扇区持久化数据的分布情况，用于 `SnapUp` 的 `venus-worker` 需要同时能够以可读可写的方式访问所有持久化存储空间(`persist store`)，且确保他们的命名和 `venus-sector-manager` 中一致。
3. 基于以上两点，我们推荐使用单独的设备专门进行 `SnapUp` 的生产，从而避免常规扇区和 `SnapUp` 混布带来的配置和运维的复杂度。

## 持续优化
对于 `SnapUp` 方案的完善和优化还在不断进行中，目前我们主要关注：
- 将半自动的候选扇区导入转换成自动方式，或提供等效的运维工具
- 更多候选扇区导入规则，如按存储配置导入
- 上链消息的聚合，以降低成本
- 其他能够简化运维、降低成本、提高效率的优化和工具