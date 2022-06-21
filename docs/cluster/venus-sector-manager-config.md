# Configuration analysis of venus-sector-manager

`venus-sector-manager` is to interact with the chain and maintain the sector's attention. Let's take a look at its configuration file structure and configuration.

After initialization, we can get a copy of the original configuration:

````toml
# Default config:
[Common]
[Common.API]
#Chain = "/ip4/{api_host}/tcp/{api_port}"
#Messager = "/ip4/{api_host}/tcp/{api_port}"
#Market = "/ip4/{api_host}/tcp/{api_port}"
#Gateway = ["/ip4/{api_host}/tcp/{api_port}"]
#Token = "{some token}"
#ChainEventInterval = "1m0s"
#
[[Common.PieceStores]]
#Name = "{store_name}"
#Path = "{store_path}"
#
[[Common.PersistStores]]
#Name = "{store_name}"
#Path = "{store_path}"
#Strict = false
#ReadOnly = false
#Weight = 1
[Common.PersistStores.Meta]
#SomeKey = "SomeValue"
#
[[Miners]]
#Actor = 10086
[Miners.Sector]
#InitNumber = 0
#MinNumber = 10
#MaxNumber = 1000000
#Enabled = true
#EnableDeals = false
#LifetimeDays = 540
#Verbose = false
[Miners.SnapUp]
#Enabled = false
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#SendFund = true
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
#MessageConfidential = 15
#ReleaseCondidential = 30
[Miners.SnapUp.Retry]
#MaxAttempts = 10
#PollInterval = "3m0s"
#APIFailureWait = "3m0s"
#LocalFailureWait = "3m0s"
[Miners.Commitment]
#Confidence = 10
[Miners.Commitment.Pre]
#SendFund = true
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
[Miners.Commitment.Pre.Batch]
#Enabled = false
#Threshold = 16
#MaxWait = "1h0m0s"
#CheckInterval = "1m0s"
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
[Miners.Commitment.Prove]
#SendFund = true
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
[Miners.Commitment.Prove.Batch]
#Enabled = false
#Threshold = 16
#MaxWait = "1h0m0s"
#CheckInterval = "1m0s"
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
[Miners.Commitment.Terminate]
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#SendFund = true
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
[Miners.Commitment.Terminate.Batch]
#Enabled = false
#Threshold = 5
#MaxWait = "1h0m0s"
#CheckInterval = "1m0s"
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
[Miners.Post]
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#Enabled = true
#StrictCheck = true
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
#Confidence = 10
#ChallengeConfidence = 10
[Miners.Proof]
#Enabled = false
````



We will analyze the configurable items one by one.



## [Common]

`Common` is a public configuration, which is divided into three sub-configuration items:



### [Common.API]

`Common.API` is interface-related configuration, its content includes:

````toml
[Common.API]
# Chain service address, required, string type
# Fill in according to the actual situation of the service used
Chain = "/ip4/{api_host}/tcp/{api_port}"

# Message service address, required, string type
# Fill in according to the actual situation of the service used
Messager = "/ip4/{api_host}/tcp/{api_port}"

# Market service address, required, string type
# Fill in according to the actual situation of the service used
Market = "/ip4/{api_host}/tcp/{api_port}"

# Event gateway service address, required, string type
# Fill in according to the actual situation of the service used
Gateway = ["/ip4/{api_host}/tcp/{api_port}"]

# service token, required, string type
# Fill in according to the actual situation of the service used
Token = "{some token}"

# Interval time for detecting chain height changes, optional, time type
# Default is 1min
#ChainEventInterval = "1m0s"
````



### [[Common.PieceStores]]

`Common.PieceStores` is an option for configuring local order `piece` data. When there is available offline storage, you can configure this item to avoid getting the `piece` data of the order through the public network.

Each local store directory corresponds to a `Common.PieceStores` configuration block.



#### Basic configuration example

````toml
[[Common.PieceStores]]
# path, required, string type
Path = "/mnt/mass/piece1"
````



### [[Common.PersistStores]]

`Common.PersistStores` is used to configure sector persistent data stores. It corresponds to the `remote_store` concept in `venus-worker`.

Similar to `Common.PieceStores`, each persistent store directory corresponds to a `Common.PersistStores` configuration block.



#### Basic configuration example

````toml
[[Common.PersistStores]]
# name, optional, string type
# The default is the absolute path corresponding to the path
#Name = "remote-store1"

# path, required, string type
# It is recommended to use absolute paths
Path = "/mnt/remote/10.0.0.14/store"

# read only, optional, boolean
# Default is false
# Since v0.4.0, the persistent storage allocation logic goes to vsmgr
# This configuration can be used to set whether the storage can continue to write
#ReadOnly = false

# weight, optional, number type
# Default is 1
# When the fill value is 0, it is equivalent to 1
# Since v0.4.0, the persistent storage allocation logic goes to vsmgr
# This configuration can be used to set the weight allocation ratio between multiple persistent stores
#Weight = 1

# Meta information, optional items, dictionary type
# The internal value is in the format of Key = "Value"
# Default value is null
# Used to support the preparation of different types of storage schemes, currently has no effect
[Common.PersistStores.Meta]
#SomeKey = "SomeValue"
````



##[[Miners]]

`Miners` is an important configuration item, which is used to define its behavior and policy for a certain `SP`.

 `venus-cluster` is designed to support multiple `SP`s with the same set of components. The specific performance in `venus-sector-manager` is that you can set multiple `Miners` configuration blocks as needed.



### Main configuration item

````toml
[[Miners]]
# `SP` actor id, required, numeric type
Actor = 10086
````

In addition to the main configuration, `Miners` also contains a number of different sub-configuration blocks, let's analyze them one by one



### [Miners.Sector]

Policy used to control sector allocation.

````toml
[Miners.Sector]
# Sector start number, optional, number type
# Default value is 0
# Obsolete
InitNumber = 0

# Minimum sector number, optional, number type
# Default value is null
# Compared to InitNumber, when this is set,
# 1. At any time, the allocator will not give a sector number less than or equal to this value.
# 2. The value of this item can be adjusted during cluster operation.
# Increase the config value, the assignment result will always follow the description of 1).
# Lowering the config value usually has no effect.
#
# When this item is not set, if InitNumber is a non-zero value, it is equivalent to this item.
#MinNumber = 10

# Sector number upper limit, optional, number type
# The default value is null, which means no upper limit
#MaxNumber = 1000000

# Whether to allow allocation of sectors, optional, boolean type
# The default value is true, that is, the allocation is enabled
#Enabled = true

# Whether to allow allocation of orders, optional, boolean
# Default is false
#EnableDeals = false

# The life cycle of the CC sector, the unit is days, optional, number type
# Default is 540
#LifetimeDays = 540

# Sector log verbosity of related modules, optional items, boolean type
# The default value is false, which simplifies the log output
#Verbose = false
````

### [Miners.SnapUp]

Production strategy for controlling `SnapDeal`
````toml
[Miners.SnapUp]
# Whether to enable, optional, boolean type
# Default is false
#Enabled = false

# Send address, required if enabled, address type
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

# Whether to send the necessary funds from Sender when submitting the on-chain message, optional, boolean type
# Default value is true
#SendFund = true

# Gas estimate multiple for a single commit message, optional, floating point type
# Default is 1.2
#GasOverEstimation = 1.2

# FeeCap limit for a single commit message, optional, FIL value type
# Default is 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"

# The confidence height of the update message on the chain, optional, number type
# Default is 15
#MessageConfidential = 15

# Confidence height to release old data storage space, optional, number type
# Default is 30
#ReleaseCondidential = 30

# SnapUp submit retry policy
[Miners.SnapUp.Retry]

# maximum number of retries, optional, number type
# The default is NULL, which means no limit
#MaxAttempts = 10

# Polling status interval, optional, event type
# Default is 3min
#PollInterval = "3m0s"

# API interface exception retry interval, optional items, event type
# Default is 3min
#APIFailureWait = "3m0s"

# Retry interval for local exceptions, such as local database exceptions, local storage exceptions, etc., optional items, event type
# Default is 3min
#LocalFailureWait = "3m0s"
````

### [Miners.Commitment]

Generic section for configuring encapsulated message submission policies.



````toml
[Miners.Commitment]
# Stable height of the message, optional, number type
# Default is 10
#Confidence = 10
````



### [Miners.Commitment.Pre]

Strategy for configuring `PreCommit` message commits



````toml
[Miners.Commitment.Pre]
# Whether to send the necessary funds from Sender when submitting the on-chain message, optional, boolean type
# Default value is true
#SendFund = true

# Sending address, required items, address type
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

# Gas estimate multiple for a single commit message, optional, floating point type
# Default is 1.2
#GasOverEstimation = 1.2

# FeeCap limit for a single commit message, optional, FIL value type
# Default is 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"

# Aggregate submitted policy configuration blocks
[Miners.Commitment.Pre.Batch]
# Whether to enable aggregate submission, optional, boolean type
# The default value is false, i.e. not enabled
#Enabled = false

# Minimum number of aggregates, optional, number type
# The default value is 16, that is, the minimum number of aggregates is 16
#Threshold = 16

# maximum waiting time, optional, time type
# The default value is 1h, that is, the maximum wait time is 1 hour
#MaxWait = "1h0m0s"

# check interval, optional, time type
# The default value is 1min, that is, every 1min to check whether the aggregation conditions are met
#CheckInterval = "1m0s"

# Gas estimation multiple of aggregated commit messages, optional, floating point type
# Default is 1.2
#GasOverEstimation = 1.2

# FeeCap limit for aggregated commit messages, optional items, FIL value type
# Default is 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"
````



### [Miners.Commitment.Prove]

The strategy used to configure `ProveCommit` message submission, its configuration items and functions are exactly the same as those in `Miners.Commitment.Pre`.



### [Miners.Commitment.Terminate]

The strategy used to configure `TerminateSectors` message submission, its configuration items and functions are basically the same as those in `Miners.Commitment.Pre`. In actual scenarios, such messages are not sent very frequently. It is recommended to configure single submission mode. When using aggregate submission mode, `Threshold` is recommended to be configured with a smaller value to ensure that messages are uploaded on the chain in time.

### [Miners.PoSt]

Related policies for configuring `WindowPoSt`.

````toml
[Miners.Post]
# Sending address, required items, address type
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

# Whether to enable, optional, boolean type
# Default value is true
#Enabled = true

# Whether to perform strong verification on sector files, optional, boolean type
# Default value is true
# When enabled, in addition to judging the existence of the file, it will also try to read some information, such as metadata, etc.
#StrictCheck = true

# Gas estimation multiple of WindowPoSt message, optional, floating point type
# Default is 1.2
#GasOverEstimation = 1.2

# FeeCap limit of WindowPoSt message, optional, FIL value type
# Default is 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"

# Stable height of the message, optional, number type
# Default is 10
#Confidence = 10

# Start the stable height of WindowPoSt, optional, number type
# Default is 10
# This value determines how many heights to wait for the chain to enter a stable state, and the WindowPoSt task can be started
# The smaller this value is set, the earlier it will start, but at the same time, the more vulnerable it is to fork
# When set to 0, the default value of 10 will be used
#ChallengeConfidence = 10
````



### [Miners.Proof]

Used to configure WinningPoSt Proof related policies

````toml
[Miners.Proof]
# Whether to enable, optional, boolean type
# Default is false
#Enabled = false
````



### [Miners.Deal] `Deprecated`

Used to configure order-related policies.

````toml
[Miners.Deal]
# Whether to enable, optional, boolean type
# Default is false
#Enabled = false
````



## A minimal working configuration file example

Let's take the example of starting a `venus-sector-manager` that supports a `SP` operation,

````toml
[Common]
[Common.API]
Chain = "/ip4/{api_host}/tcp/{api_port}"
Messager = "/ip4/{api_host}/tcp/{api_port}"
Market = "/ip4/{api_host}/tcp/{api_port}"
Gateway = ["/ip4/{api_host}/tcp/{api_port}"]
Token = "{some token}"

[[Common.PieceStores]]
Path = "{store_path}"

[[Common.PersistStores]]
Name = "{store_name1}"
Path = "{store_path1}"

[[Common.PersistStores]]
Name = "{store_name2}"
Path = "{store_path2}"

[[Common.PersistStores]]
Name = "{store_name3}"
Path = "{store_path3}"

[[Common.PersistStores]]
Name = "{store_name4}"
Path = "{store_path4}"

[[Miners]]
Actor = 10086
[Miners.Sector]
InitNumber = 1000
Enabled = true
EnableDeals = true

[Miners.Commitment]
[Miners.Commitment.Pre]
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

[Miners.Commitment.Pre.Batch]
Enabled = false

[Miners.Commitment.Prove]
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

[Miners.Commitment.Prove.Batch]
Enabled = true

[Miners.Post]
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
Enabled = true

[Miners.Proof]
Enabled = true
````

This activates one:

- Have 1 local PieceStore
- Has 4 local persistent stores
- Enable sector allocation, whose initial number is 1000
- Do not enable aggregated PreCommit
- Enable aggregated ProveCommit
- Enable WinningPost module
- enable order

An instance of `venus-sector-manager`.

