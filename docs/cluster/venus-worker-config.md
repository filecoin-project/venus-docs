# Configuration analysis of venus-worker

venus-worker is the execution body of data encapsulation. Let's take a look at its configuration file structure and configuration method.

The configuration file of `venus-worker` is in `toml` format. It should be noted that in this format, lines starting with `#` will be regarded as comments and will not take effect.

Taking a mock instance as an example, a basic configuration might look like this:

````toml
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
# max_deals = 3
max_retries = 3
# seal_interval = "30s"
# recover_interval = "60s"
# rpc_polling_interval = "180s"
# ignore_proof_check = false

[[sealing_thread]]
location = "./mock-tmp/store1"
# plan = "snapup"
# sealing.allowed_miners = [10123, 10124, 10125]
# sealing.allowed_sizes = ["32GiB", "64GiB"]
# sealing.enable_deals = true
# sealing.max_deals = 3
# sealing.max_retries = 3
# sealing.seal_interval = "30s"
# sealing.recover_interval = "60s"
# sealing.rpc_polling_interval = "180s"
# sealing.ignore_proof_check = false

[[sealing_thread]]
location = "./mock-tmp/store2"

[[sealing_thread]]
location = "./mock-tmp/store3"

#deprecated
# [remote_store]
# name = "persist-store1"
# location = "./mock-tmp/remote"

[[attached]]
# name = "persist-store1"
location = "./mock-tmp/remote"

[attached_selection]
# enable_space_weighted = false

[processors.limit]
# pc1 = 3
# pc2 = 2
# c2 = 1

[processors.ext_locks]
# gpu1 = 1

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
````

Below we will analyze the configurable items one by one.


## [worker]

The `worker` configuration item is used to configure some basic information of this instance.

### Basic configuration example

````toml
[worker]
# instance name, optional, string type
# By default, the IP address of the network card used to connect to `venus-sector-manager` is used as the instance name
# name = "worker-#1"

# rpc service listening address, optional, string type
# The default is "0.0.0.0", that is, listening to all addresses of the machine
# rpc_server.host = "192.168.1.100"

# rpc service listening port, optional, number type
# Default is 17890
# rpc_server.port = 17891
````

In most cases, each field in this configuration item does not need to be manually configured.

Only in some special cases, such as:

- want to name each `venus-worker` instance according to your own choreography
- Don't want to monitor all network card IPs, only allow local rpc requests
- Multiple `venus-workers` are deployed on one machine, in order to avoid port conflicts, they need to be distinguished

In other scenarios, you need to manually configure the options here as needed.



## [sector_manager]

`sector_manager` is used to configure `venus-sector-manager` related information so that `venus-worker` can connect to the corresponding service correctly.

### Basic configuration example

````toml
[sector_manager]
# The connection address used when constructing the rpc client, required, string type
# Can accept `multiaddr` format, also can accept url format such as `http://127.0.0.1:1789`, `ws://127.0.0.1:1789`
# Normally, use the `multiaddr` format for consistency with other components
rpc_client.addr = "/ip4/127.0.0.1/tcp/1789"

# The http header information, optional items, dictionary type used when constructing the rpc client
# default is null
# rpc_client.headers = { User-Agent = "jsonrpc-core-client" }

# The verification token carried when requesting order piece data, optional items, string type
# default is null
# This is usually set when this instance allows encapsulation of sectors with order data
# The value of this item is usually the token value of the venus series service used
# piece_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMS0xMjUiLCJwZXJtIjoic2lnbiIsImV4dCI6IiJ9.JenwgK0JZcxFDin3cyhBUN41VXNvYw-_0UUT2ZOohM0"
````

## [sealing]

`sealing` is used to configure common parameter options in the sealing process.

### Basic configuration example

````toml
[sealing]
# Allowed `SP`, optional, number array format
# Defaults to null, allows tasks from any `SP`
# After configuration, only package tasks from `SP` listed in the array can be executed
# allowed_miners = [10123, 10124, 10125]

# Allowed sector size, optional, string array format
# Defaults to null, allows sector tasks of any size
# After configuration, only tasks that match the sector size listed in the array can be executed
# allowed_sizes = ["32GiB", "64GiB"]

# Whether to allow adding orders to the sector, optional, boolean type
# Default is false
# When set to true, the `piece_token` item in `sector_manager` usually needs to be set at the same time
# enable_deals = true

# The maximum number of orders allowed to be added to the sector, optional, number type
# default is null
# max_deals = 3

# When an error of the temp type is encountered during the encapsulation process, the number of retries, optional items, number format
# default is 5
# max_retries = 3

# When a temp type error is encountered during the encapsulation process, the retry interval, optional items, time string format
# The default is "30s", which is 30 seconds
# recover_interval = "30s"

# Idle `sealing_store` application interval for sealing tasks, optional, time string format
# The default is "30s", which is 30 seconds
# seal_interval = "30s"

# rpc status polling request interval, optional, time string format
# The default is "180s", which is 180 seconds
# During the encapsulation process, some links use the polling method to obtain non-real-time information, such as message uploading.
# This value helps to avoid overly frequent requests consuming network resources
# rpc_polling_interval = "180s"

# Whether to skip the local verification link of proof, optional, boolean format
# Default is false
# Usually only set this for things like testing
# ignore_proof_check = false
````

The configuration items in `sealing` usually have default items preset by experience, which makes us not need to configure it by ourselves in most cases.



### Special configuration example

#### 1. Test network, serving only specific `SP`

````toml
allowed_miners = [2234, 2236, 2238]
````



#### 2. Large-scale clusters to reduce network usage

````toml
# Among the recoverable exceptions, a considerable part is caused by network jitter, increase the interval of automatic recovery and reduce the frequency of requests
recover_interval = "90s"

# The polling request in the normal process also increases the interval time and reduces the request frequency
rpc_polling_interval = "300s"
````



#### 3. Increase the possibility of abnormal self-healing of sectors

````toml
# Increase the number of autorecovery attempts
max_retries = 10

# Increase the auto-recovery interval
recover_interval = "60s"
````

##[[sealing_thread]]

`sealing_thread` is used to configure for each sector worker thread. Multiple `sealing_thread` configuration groups can exist in a configuration file.


### Basic configuration example

````toml
[[sealing_thread]]
# Sector data directory path, required, string type
# It is recommended to use an absolute path, the data directory and the worker thread are bound one-to-one
location = "/mnt/nvme1/store"

# task type, optional, string type
# Default value is null
# Optionally fill in sealer or snapup, when not filled in, the default is equivalent to selaer
# plan = "snapup"

# Custom parameters of the encapsulation process, only valid for the current worker thread
# sealing.allowed_miners = [10123, 10124, 10125]
# sealing.allowed_sizes = ["32GiB", "64GiB"]
# sealing.enable_deals = true
# sealing.max_retries = 3
# sealing.seal_interval = "30s"
# sealing.recover_interval = "60s"
# sealing.rpc_polling_interval = "180s"
# sealing.ignore_proof_check = false

[[sealing_thread]]
location = "/mnt/nvme2/store"


[[sealing_thread]]
location = "/mnt/nvme3/store"
````

The number of `sealing_thread` and the corresponding data paths need to be arranged according to the planning situation.

In order to facilitate combination and matching, each `sealing_thread` can be configured with an independent `sealing` sub-item, which satisfies:

- The naming, type and effect of configurable items are consistent with the general `sealing` items

- Only valid for the current worker thread
- When not configured use the value in the generic `sealing` item



### Special configuration example

#### 1. Two worker threads, each serving a different `SP`

````toml
[[sealing_thread]]
location = "/mnt/nvme2/store"
sealing.allowed_miners = [1357]


[[sealing_thread]]
location = "/mnt/nvme3/store"
sealing.allowed_miners = [2468]
````

#### 2. Two worker threads, each serving different sector sizes

````toml
[[sealing_thread]]
location = "/mnt/nvme2/store"
sealing.allowed_sizes = ["32GiB"]


[[sealing_thread]]
location = "/mnt/nvme3/store"
sealing.allowed_sizes = ["64GiB"]
````

## [remote_store] deprecated

`remote_store` is used to configure where the completed sector persistent data is saved.



### Basic configuration example

````toml
[remote_store]
# name, optional, string type
# The default is the absolute path corresponding to the path
# name = "remote-store1"

# path, required, string type
# It is recommended to fill in the absolute path directly
location = "/mnt/remote/10.0.0.14/store"

````

Due to the need to coordinate storage location information between `venus-worker` and `venus-sector-manager`, in many cases the same persistent storage directory is on the `venus-worker` machine and the `venus-sector-manager` The mount paths on the machines are not exactly the same, so we decided to use `name` as the basis for coordination.

You can also choose not to configure `name` on both sides of `venus-worker` and `venus-sector-manager` during configuration if the mount path of the persistent storage directory is the same on all machines. In this case, both will use the absolute path as the `name`, which will also match.

## [attached_selection]
`attached_selection` is used to configure the location where the persistent data of the selected sector is saved

### Basic configuration example
````toml
[attached_selection]
# Whether to enable the selection strategy with the remaining space as the weight, optional, boolean type
# Default is false
# enable_space_weighted = false

````


## [[attached]]

`attached` is used to configure where the completed sector persistent data is saved, allowing multiple configurations at the same time.



### Basic configuration example

````toml
[attached]
# name, optional, string type
# The default is the absolute path corresponding to the path
# name = "remote-store1"

# path, required, string type
# It is recommended to fill in the absolute path directly
location = "/mnt/remote/10.0.0.14/store"

# read only, optional, boolean
# Default is false
# readonly = true

````

Due to the need to coordinate storage location information between `venus-worker` and `venus-sector-manager`, in many cases the same persistent storage directory is on the `venus-worker` machine and the `venus-sector-manager` The mount paths on the machines are not exactly the same, so we decided to use `name` as the basis for coordination.

You can also choose not to configure `name` on both sides of `venus-worker` and `venus-sector-manager` during configuration if the mount path of the persistent storage directory is the same on all machines. In this case, both will use the absolute path as the `name`, which will also match.



## [processors]

`processors` is used to configure encapsulated executors, and to encapsulate some information during computation.

This configuration item is actually divided into three sub-items, and we analyze them one by one.



### [processors.limit]

`processors.limit` is used to configure the control of the number of parallel tasks for different packaging stages. This is to reduce the competition for resources at different stages.

It should be noted that when external executors are configured, the number of external executors and the total allowed concurrency will also affect the number of parallel tasks.



#### Basic configuration example

````toml
[processors.limit]
# tree_d stage concurrency limit, optional, number type
# tree_d = 1

# Concurrency limit for the pc1 stage, optional, number type
# pc1 = 3

# Concurrency limit of the pc2 stage, optional, number type
# pc2 = 2

# Concurrency limit for stage c2, optional, number type
# c2 = 1
````

For example, if `pc2 = 2` is set, then at most two sectors can perform tasks in the `pc2` phase at the same time.


### [processors.ext_locks]

`processors.ext_locks` is used to configure some custom lock restrictions, which is used in conjunction with the `locks` configuration item in `[[processors.{stage_name}]]`.
This configuration item allows users to customize some restrictions and make different external processors subject to them.


#### Basic configuration example

````toml
[processors.ext_locks]
# some_name = some_number
````


#### Special configuration example
`processors.ext_locks` is not self-contained.

##### A GPU, shared by pc2 and c2

````toml
[processors.ext_locks]
gpu=1

[[processors.pc2]]
locks = ["gpu"]

[[processors.c2]]
locks = ["gpu"]
````

In this way, `pc2` `c2` will each start an external processor, and the two will compete, which means that the two will not happen at the same time.

##### Two GPUs, common to pc2 and c2

````toml
[processors.ext_locks]
gpu1 = 1
gpu2 = 1

[[processors.pc2]]
locks = ["gpu1"]

[[processors.pc2]]
locks = ["gpu2"]

[[processors.c2]]
locks = ["gpu1"]

[[processors.c2]]
locks = ["gpu2"]
````

In this way, `pc2` `c2` will each start two external processors, which will create a two-two competition relationship, which allows to limit a GPU to only execute one of the stages of tasks.


### [processors.static_tree_d]

`processors.static_tree_d` is a configuration item introduced to improve the efficiency of `cc sector`.

When a static file path is configured for the corresponding sector size, this file will be used directly as the tree_d file for `cc sector` without trying to generate it again.



#### Basic configuration example

````toml
[processors.static_tree_d]
2KiB = "/var/tmp/2k/sc-02-data-tree-d.dat"
32GiB = "/var/tmp/32g/sc-02-data-tree-d.dat"
64GiB = "/var/tmp/64g/sc-02-data-tree-d.dat"
````



### [[processors.{stage_name}]]

This is the configuration group used to configure external actuators.

Currently `{stage_name}` is optional

- `tree_d`
- `pc1`
- `pc2`
- `c2`



Each such configuration group means that an external executor of the corresponding stage will be started. The optional configuration items include:

````toml
[[processors.pc1]]
# Custom external executor executable file path, optional, string type
# By default, the executable file path corresponding to the main process will be used
# bin = "./dist/bin/venus-worker-plugin-pc1"

# Customize the parameters of the external actuator, optional items, string array type
# The default value is null, `venus-worker`'s own executor default parameters will be used
# args = ["--args-1", "1", --"args-2", "2"]

# numa affinity partition id, optional, number type
# Default value is null, no affinity will be set
# Need to fill in according to the host's numa partition
# numa_preferred = 0

# cpu core binding and limit options, optional, string type
# The default value is null, no binding is set
# The format of the value follows the standard cgroup.cpuset format
# cgroup.cpuset = "4-5"

# Additional environment variables for external executors, optional, dictionary type
# Default value is null
# envs = { RUST_LOG = "info" }

# The maximum number of concurrent tasks allowed by this executor
# The default value is null, unlimited, but whether the task is executed concurrently depends on the implementation of the external executor used
# Mainly used in pc1 so that multiple parallel links can be used, which can effectively save resources such as shared memory and thread pools
# concurrent = 4

# Custom external limit lock name, optional, string array type
# Default value is null
# locks = ["gpu1"]
````



#### Basic configuration example

````toml
[processors.limit]
pc1 = 4
pc2 = 2
c2 = 1

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-7"
concurrent = 2
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "12-19"
concurrent = 2
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc2]]
cgroup.cpuset = "8-11,24-27"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "20-23,36-39"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }


[[processors.c2]]
cgroup.cpuset = "28-35"
envs = { CUDA_VISIBLE_DEVICES = "2,3" }


[[processors.tree_d]]
cgroup.cpuset = "40-45"
````

The above is an example `processors.{stage_name}` configuration for a 48C + 4GPU based device. Under this configuration, it will start:

- 2 `pc1` external executors, using `MULTICORE_SDR` mode, each with 8 cores, allowing 2 concurrent tasks, and memory allocation preferentially uses this numa partition
- 2 `pc2` external executors, each with 8 cores, each using a GPU
- 1 `c2` external executor, allocated 8 cores, using a GPU
- 1 `tree_d` external executor with 6 cores allocated



#### Special configuration example

##### 1. Closed source, algorithmically optimized c2 external executor using patch

````toml
[[processors.c2]]
bin=/usr/local/bin/venus-worker-c2-optimized
cgroup.cpuset = "40-47"
envs = { CUDA_VISIBLE_DEVICES = "2,3" }
````



##### 2. c2 external executor using outsourced mode

````toml
[[processors.c2]]
bin=/usr/local/bin/venus-worker-c2-outsource
args = ["--url", "/ip4/apis.filecoin.io/tcp/10086/https", "--timeout", "10s"]
envs = { LICENCE_PATH = "/var/tmp/c2.licence.dev" }
````



##### 3. Use CPU mode to make up for pc2 computing power when GPU is insufficient

````toml
[[processors.pc2]]
cgroup.cpuset = "8-11,24-27"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "20-23,36-45"
````

#### 4. Under the optimal ratio, the total amount of pc1 is odd and cannot be divided equally

````toml
[processors.limit]
pc1 = 29
pc2 = 2
c2 = 1

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-41"
concurrent = 14
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "48-92"
concurrent = 15
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }
````


#### 5. Hope to use numa 0 area to complete pc1 first

````toml
[processors.limit]
pc1 = 29
pc2 = 2
c2 = 1

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-47"
concurrent = 16
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "48-86"
concurrent = 13
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }
````


## A minimal working configuration file example

````toml
[sector_manager]
rpc_client.addr = "/ip4/{some_ip}/tcp/1789"

# According to actual resource planning
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

# According to actual resource planning
[processors.limit]
pc1 = 4
pc2 = 2
c2 = 1

[[processors.pc1]]
numa_preferred = 0
cgroup.cpuset = "0-7"
concurrent = 2
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }

[[processors.pc1]]
numa_preferred = 1
cgroup.cpuset = "12-19"
concurrent = 2
envs = { FIL_PROOFS_USE_MULTICORE_SDR = "1" }


[[processors.pc2]]
cgroup.cpuset = "8-11,24-27"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "0" }

[[processors.pc2]]
cgroup.cpuset = "20-23,36-39"
envs = { FIL_PROOFS_USE_GPU_COLUMN_BUILDER = "1", FIL_PROOFS_USE_GPU_TREE_BUILDER = "1", CUDA_VISIBLE_DEVICES = "1" }


[[processors.c2]]
cgroup.cpuset = "28-35"
envs = { CUDA_VISIBLE_DEVICES = "2,3" }


[[processors.tree_d]]
cgroup.cpuset = "40-45"
````



After planning according to the actual situation and filling in the corresponding information, the above is a copy:

- only do `cc sector`
- tree_d free for 32GiB and 64GiB sectors
- Integrated resource allocation

The minimal configuration file.