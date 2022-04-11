# venus-worker 的配置解析

venus-worker 是数据封装的执行主体，我们来了解一下它的配置文件结构和配置方式。

`venus-worker` 的配置文件采用了 `toml` 格式，需要注意的是，这种格式中，以 `#` 开头的行将被视为注释，不会生效。

以 mock 实例为例，一份基础的配置大概会是这样：

```
[worker]
# name = "worker-#1"
# rpc_server.host = "192.168.1.100"
# rpc_server.port = 17891

[sector_manager]
rpc_client.addr = "/ip4/127.0.0.1/tcp/1789"
# rpc_client.headers = { User-Agent = "jsonrpc-core-client" }
# piece_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMS0xMjUiLCJwZXJtIjoic2lnbiIsImV4dCI6IiJ9.JenwgK0JZcxFDin3cyhBUN41VXNvYw-_0UUT2ZOohM0"

[sealing]
# allowed_miners = [10123, 10124, 10125]
# allowed_sizes = ["32GiB", "64GiB"]
enable_deals = true
max_retries = 3
# seal_interval = "30s"
# recover_interval = "30s"
# rpc_polling_interval = "30s"
# ignore_proof_check = false

[[sealing_thread]]
location = "./mock-tmp/store1"
# sealing.allowed_miners = [10123, 10124, 10125]
# sealing.allowed_sizes = ["32GiB", "64GiB"]
# sealing.enable_deals = true
# sealing.max_retries = 3
# sealing.seal_interval = "30s"
# sealing.recover_interval = "30s"
# sealing.rpc_polling_interval = "30s"
# sealing.ignore_proof_check = false

[[sealing_thread]]
location = "./mock-tmp/store2"

[[sealing_thread]]
location = "./mock-tmp/store3"

[remote_store]
# name = "persist-store1"
location = "./mock-tmp/remote"

[processors.limit]
# pc1 = 3
# pc2 = 2
# c2 = 1

[processors.static_tree_d]
# 2KiB = "./tmp/2k/sc-02-data-tree-d.dat"

# fields for tree_d processor
[[processors.tree_d]]

# fields for pc1 processors
[[processors.pc1]]
# bin = "./dist/bin/venus-worker-plugin-pc1"
# args = ["--args-1", "1", --"args-2", "2"]
numa_preferred = 0
cgroup.cpuset = "4-5"
envs = { RUST_LOG = "info" }

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "6-7"

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "12-13"

# fields for pc2 processors
[[processors.pc2]]
# cgroup.cpuset = "24-27"

[[processors.pc2]]
cgroup.cpuset = "28-31"


# fields for c2 processor
[[processors.c2]]
cgroup.cpuset = "32-47"
```

下面我们将逐一分析其中的可配置项。



## [worker]

`worker` 配置项用于配置本实例的一些基础信息。

### 基础配置范例

```
[worker]
# 实例名，选填项，字符串类型
# 默认以连接 `venus-sector-manager` 所使用的网卡 IP 地址作为实例名
# name = "worker-#1"

# rpc 服务监听地址，选填项，字符串类型
# 默认为 "0.0.0.0"，即监听本机所有地址
# rpc_server.host = "192.168.1.100"

# rpc 服务监听端口，选填项，数字类型
# 默认为 17890
# rpc_server.port = 17891
```

绝大多数情况下，本配置项内的各个字段无需手工配置。

仅在一些特殊情况，诸如：

- 希望按照自己的编排习惯命名每个 `venus-worker` 实例
- 不希望监听所有网卡IP，仅允许本地的 rpc 请求
- 一台机器上部署了多个 `venus-worker`，为避免端口冲突，需要进行区分

等场景，需要按需手动配置这里的选项。



## [sector_manager]

`sector_manager` 用于配置 `venus-sector-manager` 相关的信息，以使得 `venus-worker` 可以正确的连接到对应的服务。

### 基础配置范例

```
[sector_manager]
# 构造 rpc 客户端时使用的连接地址，必填项，字符串类型
# 可以接受 `multiaddr` 格式，也可以接受诸如 `http://127.0.0.1:1789`，`ws://127.0.0.1:1789` 这样的 url 格式
# 通常情况下，使用 `multiaddr` 格式以和其他组件保持一致
rpc_client.addr = "/ip4/127.0.0.1/tcp/1789"

# 构造 rpc 客户端时使用的 http 头信息，选填项，字典类型
# 默认为 null
# rpc_client.headers = { User-Agent = "jsonrpc-core-client" }

# 请求订单 piece 数据时携带的校验 token， 选填项，字符串类型
# 默认为 null
# 当本实例允许封装带有订单数据的扇区时，通常需要设置此项
# 此项的值通常即为所使用的 venus 系列服务的 token 值
# piece_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMS0xMjUiLCJwZXJtIjoic2lnbiIsImV4dCI6IiJ9.JenwgK0JZcxFDin3cyhBUN41VXNvYw-_0UUT2ZOohM0"
```



## [sealing]

`sealing` 用于配置封装过程中的通用参数选项。

### 基础配置范例

```
[sealing]
# 允许的`SP`，选填项，数字数组格式
# 默认为 null，允许来自任何 `SP` 的任务
# 配置后，仅可执行来自数组中罗列的 `SP` 的封装任务
# allowed_miners = [10123, 10124, 10125]

# 允许的扇区大小，选填项，字符串数组格式
# 默认为 null， 允许任意大小的扇区任务
# 配置后，仅可执行符合数组中罗列的扇区大小的任务
# allowed_sizes = ["32GiB", "64GiB"]

# 是否允许向扇区内添加订单，选填项，布尔类型
# 默认为 false
# 当设置为 true 时，通常需要同时设置 `sector_manager` 中的 `piece_token` 项
# enable_deals = true

# 封装过程中遇到 temp 类型的错误时，重试的次数，选填项，数字格式
# 默认为 5
# max_retries = 3

# 封装过程中遇到 temp 类型的错误时，重试的间隔，选填项，时间字符串格式
# 默认为 “30s"， 即30秒
# recover_interval = "30s"

# 空闲的 `sealing_store` 申请封装任务的间隔， 选填项，时间字符串格式
# 默认为 ”30s"， 即30秒
# seal_interval = "30s"

# rpc 状态轮询请求的间隔，选填项，时间字符串格式
# 默认为 ”30s"， 即30秒
# 封装过程中，部分环节使用了轮询方式来获取非实时的信息，如消息上链等。
# 这个值有助于避免过于频繁的请求占用网络资源
# rpc_polling_interval = "30s"

# 是否跳过 proof 的本地校验环节，选填项，布尔格式
# 默认为 false
# 通常只在诸如测试之类的情况下设置此项
# ignore_proof_check = false
```

`sealing` 中的配置项通常有根据经验预设的默认项，这使得我们在绝大多数情况下无需自行配置。



### 特殊配置范例

#### 1. 测试网络，仅为特定 `SP`  提供服务

```
allowed_miners = [2234, 2236, 2238]
```



#### 2. 大规模集群，降低网络占用

```
# 在可恢复的异常中，有相当一部分是网络抖动带来的，增大自动恢复的间隔时间降低请求频率
recover_interval = "90s"

# 正常过程中的轮询请求也增大间隔时间降低请求频率
rpc_polling_interval = "90s"
```



#### 3. 增大扇区异常自愈的可能性

```
# 增大自动恢复的尝试次数
max_retries = 10

# 增大自动恢复的间隔时间
recover_interval = "60s"
```



## [[sealing_thread]]

`sealing_thread` 用于为每个扇区工作线程进行配置。一份配置文件中可以存在多个 `sealing_thread` 配置组。



### 基础配置范例

```
[[sealing_thread]]
# 扇区数据目录路径，必填项，字符串类型
# 建议使用绝对路径，数据目录和工作线程是一对一绑定的
location = "/mnt/nvme1/store"

# 封装过程的定制参数，仅对当前工作线程生效
# sealing.allowed_miners = [10123, 10124, 10125]
# sealing.allowed_sizes = ["32GiB", "64GiB"]
# sealing.enable_deals = true
# sealing.max_retries = 3
# sealing.seal_interval = "30s"
# sealing.recover_interval = "30s"
# sealing.rpc_polling_interval = "30s"
# sealing.ignore_proof_check = false

[[sealing_thread]]
location = "/mnt/nvme2/store"


[[sealing_thread]]
location = "/mnt/nvme3/store"

```

`sealing_thread` 的数量和对应的数据路径需要根据规划情况编排。

为了方便组合搭配，每个 `sealing_thread` 可以配置独立的 `sealing` 子项，它满足：

- 可配置项的命名、类型、效果与通用的 `sealing` 项保持一致

- 仅对当前工作线程生效
- 未配置时使用通用的 `sealing` 项内的值



### 特殊配置范例

#### 1. 两个工作线程，分别为不同的 `SP` 服务

```
[[sealing_thread]]
location = "/mnt/nvme2/store"
sealing.allowed_miners = [1357]


[[sealing_thread]]
location = "/mnt/nvme3/store"
sealing.allowed_miners = [2468]
```



#### 2. 两个工作线程，分别为不同的扇区大小服务

```
[[sealing_thread]]
location = "/mnt/nvme2/store"
sealing.allowed_sizes = ["32GiB"]


[[sealing_thread]]
location = "/mnt/nvme3/store"
sealing.allowed_sizes = ["64GiB"]
```





## [remote_store]

`remote_store` 用于配置已完成的扇区持久化数据保存的位置。



### 基础配置范例

```
[remote_store]
# 名称， 选填项，字符串类型
# 默认为路径对应的绝对路径
# name = "remote-store1"

# 路径，必填项，字符串类型
# 建议直接填写绝对路径
location = "/mnt/remote/10.0.0.14/store"

```

由于需要在 `venus-worker` 和 `venus-sector-manager` 之间协调存储位置信息，而在很多情况下，同一个持久化存储目录在`venus-worker` 机器和 `venus-sector-manager` 机器上的挂载路径不完全一致，因此我们决定使用 `name` 作为协调的基础信息.

如果持久化存储目录在所有机器上的挂载路径都统一的话，配置时也可以选择在 `venus-worker` 和`venus-sector-manager` 两侧都不配置 `name`。这种情况下，两者都会使用绝对路径作为 `name`，也能匹配。



## [processors]

`processors` 用于配置封装执行器，和封装计算过程中的一些信息。

这个配置项实际上分为三个子项，我们逐一分析。



### [processors.limit]

`processors.limit` 用于配置不同封装阶段的并行任务数量控制。这是为了降低不同阶段的资源相互争抢的情况。

需要注意的是，`processors.limit`通常只在对应的封装阶段未使用外部执行器的情况下有明显效果。当配置了外部执行器时，外部执行器的数量也会影响并行任务数量。



#### 基础配置范例

```
[processors.limit]
# tree_d 阶段的并发数限制，选填项，数字类型
# tree_d = 1

# pc1 阶段的并发数限制，选填项，数字类型
# pc1 = 3

# pc2 阶段的并发数限制，选填项，数字类型
# pc2 = 2

# c2 阶段的并发数限制，选填项，数字类型
# c2 = 1
```

举例来说，如果设置了 `pc2 = 2`，那么同一时间最多只会有两个扇区可以执行 `pc2` 阶段的任务。



### [processors.static_tree_d]

`processors.static_tree_d` 是为了提升 `cc 扇区` 的效率而引入的配置项。

当为相应扇区大小配置了静态文件路径时，将会直接使用此文件作为 `cc 扇区` 的 tree_d 文件，而不会尝试再次生成。



#### 基础配置范例

```
[processors.static_tree_d]
2KiB = "/var/tmp/2k/sc-02-data-tree-d.dat"
32GiB = "/var/tmp/32g/sc-02-data-tree-d.dat"
64GiB = "/var/tmp/64g/sc-02-data-tree-d.dat"

```



### [[processors.{stage_name}]]

这是用于配置外部执行器的配置组。

目前 `{stage_name}` 可选

- `tree_d`
- `pc1`
- `pc2`
- `c2`



每一个这样的配置组意味着将启动一个对应阶段的外部执行器，可选的配置项包含：

```
[[processors.pc1]]
# 自定义外部执行器可执行文件路径，选填项，字符串类型
# 默认会使用主进程对应的可执行文件路径
# bin = "./dist/bin/venus-worker-plugin-pc1"

# 自定义外部执行器的参数，选填项，字符串数组类型
# 默认值为 null，将使用 `venus-worker` 自己的执行器默认参数
# args = ["--args-1", "1", --"args-2", "2"]

# numa 亲和性分区 id，选填项，数字类型
# 默认值为 null，不会设置亲和性
# 需要根据宿主机的 numa 分区进行填写
# numa_preferred = 0

# cpu 核绑定和限制选项，选填项，字符串类型
# 默认值为 null，不设置绑定
# 值的格式遵循标准 cgroup.cpuset 格式
# cgroup.cpuset = "4-5"

# 外部执行器的附加环境变量，选填项，字典类型
# 默认值为 null
# envs = { RUST_LOG = "info" }
```



#### 基础配置范例

```
[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-3"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "4-7"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "12-15"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "16-19"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }


[[processors.pc2]]
cgroup.cpuset = "8-11,24-27"
env = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "20-23,36-39"
env = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }


[[processors.c2]]
cgroup.cpuset = "28-35"
env = { CUDA_VISIBLE_DEVICES = "2,3" }


[[processors.tree_d]]
cgroup.cpuset = "40-45"
```

以上是基于一台 48C + 4GPU 的设备的 `processors.{stage_name}`  配置范例，在这套配置下，将启动：

- 4个 `pc1` 外部执行器，采用 `MULTICORE_SDR` 模式，各分配 4核，且内存分配优先使用本 numa 分区
- 2个 `pc2` 外部执行器，各分配 8 核，各使用一块 GPU
- 1个 `c2` 外部执行器，分配 8 核， 使用一块 GPU
- 1 个 `tree_d` 外部执行器，分配 6 核



#### 特殊配置范例

##### 1. 使用 patch 了闭源的、经过算法优化的 c2 外部执行器

```
[[processors.c2]]
bin = /usr/local/bin/venus-worker-c2-optimized
cgroup.cpuset = "40-47"
env = { CUDA_VISIBLE_DEVICES = "2,3" }
```



##### 2. 使用外包模式的 c2 外部执行器

```
[[processors.c2]]
bin = /usr/local/bin/venus-worker-c2-outsource
args = ["--url", "/ip4/apis.filecoin.io/tcp/10086/https", "--timeout", "10s"]
env = { LICENCE_PATH = "/var/tmp/c2.licence.dev" }
```



##### 3. GPU 不足的情况下使用 CPU 模式弥补 pc2 计算能力

```
[[processors.pc2]]
cgroup.cpuset = "8-11,24-27"
env = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "20-23,36-45"
```



## 一份最简可工作的配置文件范例

```
[sector_manager]
rpc_client.addr = "/ip4/{some_ip}/tcp/1789"

# 根据实际资源规划
[[sealing_thread]]
location = "{path to sealing store1}"

[[sealing_thread]]
location = "{path to sealing store2}"

[[sealing_thread]]
location = "{path to sealing store3}"

[[sealing_thread]]
location = "{path to sealing store4}"

[[sealing_thread]]
location = "{path to sealing store5}"

[[sealing_thread]]
location = "{path to sealing store6}"

[[sealing_thread]]
location = "{path to sealing store7}"

[[sealing_thread]]
location = "{path to sealing store8}"


[remote_store]
name = "{remote store name}"
location = "{path to remote store}"

[processors.static_tree_d]
32GiB = "{path to static tree_d for 32GiB}"
64GiB = "{path to static tree_d for 64GiB}"

# 根据实际资源规划
[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-3"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "4-7"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "12-15"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "16-19"
env = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }


[[processors.pc2]]
cgroup.cpuset = "8-11,24-27"
env = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "20-23,36-39"
env = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }


[[processors.c2]]
cgroup.cpuset = "28-35"
env = { CUDA_VISIBLE_DEVICES = "2,3" }


[[processors.tree_d]]
cgroup.cpuset = "40-45"
```



在按实际情况进行规划并填写相应信息后，以上就是一份:

- 只进行 `cc 扇区`
- 32GiB 和 64GiB 扇区免 tree_d
- 一体化资源分配

的最简配置文件了。