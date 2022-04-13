# venus-worker外部执行器的配置范例
在其他文档中，我们介绍了 `processor` 的基本概念，也分析了 `venus-worker` 中关于 `processor` 的配置项。
接下来，我们以一个实际场景为例，来看看具体如何编排外部处理器。

## 实例分析

### 硬件配置
我们针对的配置为：
- 双路 `AMD EPYC 7642 48-Core Processor`
- 2T 内存
- `GeForce RTX 3080` x 2
- 足量的本地 NVME 数据盘

这样，我们可使用的计算资源约为：
- 96个CPU物理核，以 3c/DIE 计，共 32 个可用的 pc1 multicore 组
- 约 1.96TiB 可用物理内存
- 2块 `GeForce RTX 3080` GPU

### 配比方案
考虑 32GiB CC 扇区的封装，我们存在两种可能的配比方案，以下分别阐述。
**注意**：以下的设计可以作为方案参考，但不宜直接用于生产环境。
使用者需要根据实际情况，以及试验阶段的产量情况进行调整。


#### 方案 A: 28 pc1，1 pc2, 1 c2，pc2 与 c2 各组独占GPU
这种方案的思路，是在满足消费能力的前提下，共用各一个的独立 pc2、c2 外部执行器。
其 `processors` 部分的配置如下：

```
[processors.limit]
pc1 = 28
pc2 = 1
c2 = 1

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-41"
concurrent = 14
envs = { FIL_PROOFS_MAXIMIZE_CACHING="1", FIL_PROOFS_USE_MULTICORE_SDR = "1", FIL_PROOFS_MULTICORE_SDR_PRODUCERS = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "48-89"
concurrent = 14
envs = { FIL_PROOFS_MAXIMIZE_CACHING="1", FIL_PROOFS_USE_MULTICORE_SDR = "1", FIL_PROOFS_MULTICORE_SDR_PRODUCERS = "1" }

[[processors.pc2]]
cgroup.cpuset =  "2,5,8,11,50,53,56,59"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.c2]]
cgroup.cpuset =  "14,17,20,23,26,29,32,35,42-47,62,65,68,71,74,77,80,83,90-95"
envs = { CUDA_VISIBLE_DEVICES = "1" }
```

在此配置下，共启动 2 个外部 `pc1` 执行器，1 个外部 `pc2` 执行器，1 个外部 `c2` 执行器：
- 1 个 `pc1` 外部处理器，指定内存亲和 numa 0 区，使用 1 个主核 + 1 个 Producer 核的配置，分配位于 numa 0 区的 CPU核 `0-41`；
- 1 个 `pc1` 外部处理器，指定内存亲和 numa 1 区，使用 1 个主核 + 1 个 Producer 核的配置，分配位于 numa 1 区的 CPU核 `48-89`；
- 1 个 `pc2` 外部处理器，使用 CPU 核 `2,5,8,11,50,53,56,59`，指定可见序号为 0 的 GPU；
  这种方法可行的原因是在当前的 `pc1` 配置下，每个 DIE 会空出一个核，可以用来执行轻量的计算任务。而 `pc2` 在使用 GPU 的情况下，CPU 基本只用于数据搬运；
- 1 个 `c2` 外部处理器，使用 CPU 核 `14,17,20,23,26,29,32,35,42-47,62,65,68,71,74,77,80,83,90-95`，指定可见序号为 1 的 GPU；
- 空余 CPU 核 `38,41,86,89`，可以用于其他轻量任务，如运维管理等。

这种方案的优势是，`pc2` 和 `c2` 都各自独占资源，不会出现调度上的问题。


#### 方案 B: 28 pc1，2 pc2, 2 c2，每个 pc2 与 一个 c2 形成一组，每组占用 1 GPU，组内不同阶段的任务形成竞争关系
这种方案的思路，实际上是将双路的硬件配置视作2组单路硬件的组合，对于每一个单路组执行一样的配置策略。
其 `processors` 部分的配置如下：

```

[processors.limit]
pc1 = 28
pc2 = 2
c2 = 2

[processors.ext_locks]
gpu1 = 1
gpu2 = 1

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-41"
concurrent = 14
envs = { FIL_PROOFS_MAXIMIZE_CACHING="1", FIL_PROOFS_USE_MULTICORE_SDR = "1", FIL_PROOFS_MULTICORE_SDR_PRODUCERS = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "48-89"
concurrent = 14
envs = { FIL_PROOFS_MAXIMIZE_CACHING="1", FIL_PROOFS_USE_MULTICORE_SDR = "1", FIL_PROOFS_MULTICORE_SDR_PRODUCERS = "1" }

[[processors.pc2]]
cgroup.cpuset =  "2,5,8,11,14,17,20,23"
locks = ["gpu1"]
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset =  "50,53,56,59,62,65,68,71"
locks = ["gpu2"]
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }

[[processors.c2]]
cgroup.cpuset =  "2,5,8,11,14,17,20,23,26,29,32,35,42-47"
locks = ["gpu1"]
envs = { CUDA_VISIBLE_DEVICES = "0" }

[[processors.c2]]
cgroup.cpuset =  "50,53,56,59,62,65,68,71,74,77,80,83,90-95"
locks = ["gpu2"]
envs = { CUDA_VISIBLE_DEVICES = "1" }
```

在此配置下，共启动 2 个外部 pc1 执行器，2 个外部 pc2 执行器，2 个外部 c2 执行器：
- 1 个 `pc1` 外部处理器，指定内存亲和 numa 0 区，使用 1 个主核 + 1 个 Producer 核的配置，分配位于 numa 0 区的 CPU核 `0-41`；
- 1 个 `pc1` 外部处理器，指定内存亲和 numa 1 区，使用 1 个主核 + 1 个 Producer 核的配置，分配位于 numa 1 区的 CPU核 `48-89`；
- 1 个 `pc2` 与 1 个 `c2` 围绕自定义控制锁 `gpu1` 形成竞争关系，继而形成一个组，其中：
  - 1 个 `pc2`，使用 CPU 核 `2,5,8,11,14,17,20,23`, 指定可见序号为 0 的 GPU；
  - 1 个 `c2`， 使用 CPU 核 `2,5,8,11,14,17,20,23,26,29,32,35,42-47`，指定可见序号为 0 的 GPU；
  可以这样做的原因是，受限于自定义控制锁，本组内的 `pc2` 和 `c2` 处理器不会同时执行任务，因而可以共用部分 CPU 和 GPU 资源；
- 1 个 `pc2` 与 1 个 `c2` 围绕自定义控制锁 `gpu2` 形成竞争关系，继而形成一个组，其中：
  - 1 个 `pc2`，使用 CPU 核 `50,53,56,59,62,65,68,71`, 指定可见序号为 0 的 GPU；
  - 1 个 `c2`， 使用 CPU 核 `50,53,56,59,62,65,68,71,74,77,80,83,90-95`，指定可见序号为 0 的 GPU；
- 空余 CPU 核 `38,41,86,89`，可以用于其他轻量任务，如运维管理等。

相比方案 A，本方案可能存在一种极端情况：即控制锁始终被一种任务持续持有，而导致另一种任务长时间无法执行任务，导致扇区消费不通畅。
用通俗的话来说，可以类比为：GPU 长时间被用于执行 `pc2`，无法释放给 `c2`， 导致等待 `c2` 资源的扇区堆积。

## 总结
本文档提供的，是 *如何设计一个适合自身的配比方案*，而非 *一套适用一切场景的配比方案*。
后续我们希望能提供更多的自动配置工具、计算器来简化使用者设计方案的过程，但同时，仍然建议使用者对方案中的关键环节有基本的理解。