# Configuration example of venus-worker external executor
In other documents, we introduced the basic concept of `processor`, and also analyzed the configuration items of `processor` in `venus-worker`.
Next, let's take an actual scenario as an example to see how to arrange the external processor.

## Case Analysis

### Hardware Configuration
The configuration we are targeting is:
- Dual `AMD EPYC 7642 48-Core Processor`
- 2T memory
- `GeForce RTX 3080` x 2
- Sufficient local NVME data disks

Thus, our available computing resources are approximately:
- 96 CPU physical cores at 3c/DIE, for a total of 32 usable pc1 multicore groups
- about 1.96TiB available physical memory
- 2x `GeForce RTX 3080` GPUs

### Proportioning scheme
Considering the encapsulation of a 32GiB CC sector, we have two possible matching schemes, which are described below.
**Note**: The following design can be used as a reference, but should not be used directly in the production environment.
Users need to make adjustments according to the actual situation and the output in the experimental stage.


#### Scheme A: 28 pc1, 1 pc2, 1 c2, each group of pc2 and c2 has exclusive GPU
The idea of ​​this scheme is to share an independent pc2 and c2 external actuators on the premise of meeting the consumption capacity.
Its `processors` section is configured as follows:

````toml
[processors.limitation.concurrent]
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
cgroup.cpuset = "2,5,8,11,50,53,56,59"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.c2]]
cgroup.cpuset = "14,17,20,23,26,29,32,35,42-47,62,65,68,71,74,77,80,83,90-95"
envs = { CUDA_VISIBLE_DEVICES = "1" }
````

In this configuration, a total of 2 external `pc1` executors, 1 external `pc2` executor, and 1 external `c2` executor are started:
- 1 `pc1` external processor, specify memory affinity to numa 0 area, use the configuration of 1 main core + 1 Producer core, allocate CPU core `0-41` located in numa 0 area;
- 1 `pc1` external processor, specify memory affinity to numa 1 area, use the configuration of 1 main core + 1 Producer core, and allocate CPU cores `48-89` located in numa 1 area;
- 1 `pc2` external processor, use CPU core `2,5,8,11,50,53,56,59`, specify the GPU with visible serial number 0;
  The reason this approach works is that under the current `pc1` configuration, each DIE will free up a core that can be used to perform light computing tasks. In the case of `pc2` using GPU, the CPU is basically only used for data transfer;
- 1 `c2` external processor, using CPU cores `14,17,20,23,26,29,32,35,42-47,62,65,68,71,74,77,80,83, 90-95`, specify the GPU with visible serial number 1;
- Spare CPU cores `38, 41, 86, 89`, which can be used for other light tasks, such as operation and maintenance management.

The advantage of this scheme is that both `pc2` and `c2` have exclusive resources, and there will be no scheduling problems.


#### Scheme B: 28 pc1, 2 pc2, 2 c2, each pc2 and one c2 form a group, each group occupies 1 GPU, the tasks of different stages in the group form a competitive relationship
The idea of ​​this solution is actually to regard the dual-channel hardware configuration as a combination of two sets of single-channel hardware, and implement the same configuration strategy for each single-channel group.
Its `processors` section is configured as follows:

````toml

[processors.limitation.concurrent]
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
cgroup.cpuset = "2,5,8,11,14,17,20,23"
locks = ["gpu1"]
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "50,53,56,59,62,65,68,71"
locks = ["gpu2"]
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }

[[processors.c2]]
cgroup.cpuset = "2,5,8,11,14,17,20,23,26,29,32,35,42-47"
locks = ["gpu1"]
envs = { CUDA_VISIBLE_DEVICES = "0" }

[[processors.c2]]
cgroup.cpuset = "50,53,56,59,62,65,68,71,74,77,80,83,90-95"
locks = ["gpu2"]
envs = { CUDA_VISIBLE_DEVICES = "1" }
````

In this configuration, a total of 2 external pc1 actuators, 2 external pc2 actuators, and 2 external c2 actuators are activated:
- 1 `pc1` external processor, specify memory affinity to numa 0 area, use the configuration of 1 main core + 1 Producer core, allocate CPU core `0-41` located in numa 0 area;
- 1 `pc1` external processor, specify memory affinity to numa 1 area, use the configuration of 1 main core + 1 Producer core, and allocate CPU cores `48-89` located in numa 1 area;
- 1 `pc2` competes with 1 `c2` around the custom control lock `gpu1` to form a group where:
  - 1 `pc2`, use CPU core `2,5,8,11,14,17,20,23`, specify the GPU with visible serial number 0;
  - 1 `c2`, using CPU cores `2,5,8,11,14,17,20,23,26,29,32,35,42-47`, specifying the GPU whose visible serial number is 0;
  The reason for this is that, limited by the custom control lock, the `pc2` and `c2` processors in this group will not perform tasks at the same time, so they can share some CPU and GPU resources;
- 1 `pc2` competes with 1 `c2` around the custom control lock `gpu2` to form a group where:
  - 1 `pc2`, using CPU cores `50, 53, 56, 59, 62, 65, 68, 71`, specifying a GPU with a visible sequence number of 1;
  - 1 `c2`, using CPU cores `50,53,56,59,62,65,68,71,74,77,80,83,90-95`, specifying a GPU with a visible sequence number of 1;
- Spare CPU cores `38, 41, 86, 89`, which can be used for other light tasks, such as operation and maintenance management.

Compared with scheme A, this scheme may have an extreme situation: that is, the control lock is always held by one kind of task, and the other task cannot execute the task for a long time, resulting in unsmooth sector consumption.
In layman's terms, it can be analogized as follows: the GPU is used to execute `pc2` for a long time and cannot be released to `c2`, resulting in the accumulation of sectors waiting for `c2` resources.

## Conclusion
This document provides *how to design a matching scheme that suits you*, not *a set of matching schemes that apply to all scenarios*.
In the future, we hope to provide more automatic configuration tools and calculators to simplify the process of designing solutions for users, but at the same time, it is still recommended that users have a basic understanding of the key links in the solution.