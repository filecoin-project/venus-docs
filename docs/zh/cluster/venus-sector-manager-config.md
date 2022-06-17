# venus-sector-manager 的配置解析

`venus-sector-manager` 是与链交互、维持扇区的注意，我们来了解一下它的配置文件结构和配置方式。

在完成初始化之后，我们可以得到一份原始的配置内容：

```

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
[Miners.PoSt]
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
#Enabled = true
#StrictCheck = true
#GasOverEstimation = 1.2
#MaxFeeCap = "5 nanoFIL"
#Confidence = 10
#ChallengeConfidence = 10
[Miners.Proof]
#Enabled = false
#
```



我们将逐一分析其中的可配置项。



## [Common]

`Common` 是公共配置，又分成三个子配置项：



### [Common.API]

`Common.API` 是接口相关的配置，其内容包含：

```
[Common.API]
# 链服务地址，必填项，字符串类型
# 根据所使用的服务实际情况填写
Chain = "/ip4/{api_host}/tcp/{api_port}"

# 消息服务地址，必填项，字符串类型
# 根据所使用的服务实际情况填写
Messager = "/ip4/{api_host}/tcp/{api_port}"

# 市场服务地址，必填项，字符串类型
# 根据所使用的服务实际情况填写
Market = "/ip4/{api_host}/tcp/{api_port}"

# 事件网关服务地址，必填项，字符串类型
# 根据所使用的服务实际情况填写
Gateway = ["/ip4/{api_host}/tcp/{api_port}"]

# 服务 token， 必填项，字符串类型
# 根据所使用的服务实际情况填写
Token = "{some token}"

# 侦测链高度变化的间隔时间，选填项，时间类型
# 默认值为 1min
#ChainEventInterval = "1m0s"
```



### [[Common.PieceStores]]

`Common.PieceStores`是用于配置本地订单 `piece` 数据的选项。当存在可用的离线存储时，可以配置此项，避免通过公网获取订单的`piece` 数据。

每一个本地存储目录对应一个 `Common.PieceStores` 配置块。



#### 基础配置范例

```
[[Common.PieceStores]]
# 路径，必填项，字符串类型
Path = "/mnt/mass/piece1"

```



### [[Common.PersistStores]]

`Common.PersistStores` 用于配置扇区持久化数据存储。与之对应的是 `venus-worker` 中的 `remote_store` 概念。

与 `Common.PieceStores` 类似，每一个持久化存储目录对应一个 `Common.PersistStores` 配置块。



#### 基础配置范例

```
[[Common.PersistStores]]
# 名称， 选填项，字符串类型
# 默认为路径对应的绝对路径
#Name = "remote-store1"

# 路径，必填项，字符串类型
# 建议使用绝对路径
Path = "/mnt/remote/10.0.0.14/store"

# 只读，选填项，布尔类型
# 默认值为 false
# 自 v0.4.0 起，持久化存储分配逻辑转到 vsmgr 上
# 可通过此配置设置存储是否可以继续写入
#ReadOnly = false

# 权重，选填项，数字类型
# 默认值为 1
# 当填写值为 0 时，等效于 1
# 自 v0.4.0 起，持久化存储分配逻辑转到 vsmgr 上
# 可通过此配置设置多个持久化存储之间的权重配比
#Weight = 1

# 元信息，选填项，字典类型
# 内部值为 Key = "Value" 的格式
# 默认值为 null
# 用于支持不同类型存储方案的预备，目前没有任何作用
[Common.PersistStores.Meta]
#SomeKey = "SomeValue"
#
```



## [[Miners]]

`Miners` 是较为重要的一个配置项，用于针对某一个 `SP` 定义其行为和策略。

 `venus-cluster` 被设计为同一套组件可以支持多个 `SP` ，在 `venus-sector-manager` 中的具体表现就是可以根据需要设置多个 `Miners` 配置块。



### 主配置项

```
[[Miners]]
# `SP` actor id， 必填项，数字类型
Actor = 10086
```

除主配置向外， `Miners` 同样包含多个不同的子配置块，下面我们一一分析



### [Miners.Sector]

用于控制扇区分配的策略。

```
[Miners.Sector]
# 扇区起始编号，选填项，数字类型
# 默认值为 0
# 已废弃
InitNumber = 0

# 扇区最小编号，选填项，数字类型
# 默认值为 null
# 与 InitNumber 相比，当设置此项时，
# 1. 任何时刻，分配器都不会给出小于等于此值的扇区编号。
# 2. 此项的值可以在集群运行过程中调整。
#    提高配置值，分配结果将始终遵循 1) 的描述。
#    降低配置值通常不会产生效果。
#
# 未设置此项时，如果 InitNumber 为非0值，则等效于此项。
#MinNumber = 10

# 扇区编号上限，选填项，数字类型
# 默认值为 null， 表示无上限限制
#MaxNumber = 1000000

# 是否允许分配扇区， 选填项，布尔类型
# 默认值为 true， 即开启分配
#Enabled = true

# 是否允许分配订单， 选填项，布尔类型
# 默认值为 false
#EnableDeals = false

# CC 扇区的生命周期，单位为 天，选填项，数字类型
# 默认值为 540
#LifetimeDays = 540

# Sector 相关模块的日志详尽程度，选填项，布尔类型
# 默认值为 false，即精简日志输出
#Verbose = false
```

### [Miners.SnapUp]

用于控制 `SnapDeal` 的生产策略
```
[Miners.SnapUp]
# 是否启用，选填项，布尔类型
# 默认值为 false
#Enabled = false

# 发送地址，在启用的情况下为必填项，地址类型
#Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

# 提交上链消息时是否从 Sender 发送必要的资金，选填项，布尔类型
# 默认值为 true
#SendFund = true

# 单条提交消息的 Gas 估算倍数，选填项，浮点数类型
# 默认值为1.2
#GasOverEstimation = 1.2

# 单条提交消息的FeeCap 限制，选填项，FIL值类型
# 默认值为 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"

# Update 消息上链的确信高度，选填项，数字类型
# 默认值为 15
#MessageConfidential = 15

# 释放旧数据存储空间的确信高度，选填项，数字类型
# 默认值为 30
#ReleaseCondidential = 30

# SnapUp 提交重试策略
[Miners.SnapUp.Retry]

# 最大重试次数，选填项，数字类型
# 默认为 NULL，表示不做限制
#MaxAttempts = 10

# 轮询状态的间隔，选填项，事件类型
# 默认值为 3min
#PollInterval = "3m0s"

# API 接口异常的重试间隔，选填项，事件类型
# 默认值为 3min
#APIFailureWait = "3m0s"

# 本地异常的重试间隔，如本地数据库异常、本地存储异常等，选填项，事件类型
# 默认值为 3min
#LocalFailureWait = "3m0s"
```

### [Miners.Commitment]

用于配置封装消息提交策略的通用部分。



```
[Miners.Commitment]
# 消息的稳定高度，选填项，数字类型
# 默认值为 10
#Confidence = 10
```



### [Miners.Commitment.Pre]

用于配置 `PreCommit` 消息提交的策略



```
[Miners.Commitment.Pre]
# 提交上链消息时是否从 Sender 发送必要的资金，选填项，布尔类型
# 默认值为 true
#SendFund = true

# 发送地址，必填项，地址类型
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

# 单条提交消息的 Gas 估算倍数，选填项，浮点数类型
# 默认值为1.2
#GasOverEstimation = 1.2

# 单条提交消息的FeeCap 限制，选填项，FIL值类型
# 默认值为 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"

# 聚合提交的策略配置块
[Miners.Commitment.Pre.Batch]
# 是否启用聚合提交，选填项，布尔类型
# 默认值为 false， 即不启用
#Enabled = false

# 最小聚合条数，选填项，数字类型
# 默认值为 16，即最小聚合条数为 16条
#Threshold = 16

# 最大等待时间，选填项，时间类型
# 默认值为 1h，即最大等待 1 小时
#MaxWait = "1h0m0s"

# 检查间隔，选填项，时间类型
# 默认值为 1min，即每隔 1min 检查一次是否满足聚合条件
#CheckInterval = "1m0s"

# 聚合提交消息的 Gas 估算倍数，选填项，浮点数类型
# 默认值为 1.2
#GasOverEstimation = 1.2

# 聚合提交消息的FeeCap 限制，选填项，FIL值类型
# 默认值为 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"
```



### [Miners.Commitment.Prove]

用于配置 `ProveCommit` 消息提交的策略，其配置项和作用与 `Miners.Commitment.Pre`内的完全一致。



### [Miners.Commitment.Terminate]

用于配置 `TerminateSectors` 消息提交的策略，其配置项和作用与 `Miners.Commitment.Pre` 内的基本一致。实际场景中发送此类消息不会很频繁，建议配置单条提交模式，使用聚合提交模式时,`Threshold` 建议配置较小的值，保证消息及时上链。



### [Miners.PoSt]

用于配置 `WindowPoSt` 的相关策略。

```
[Miners.PoSt]
# 发送地址，必填项，地址类型
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"

# 是否启用，选填项，布尔类型
# 默认值为 true
#Enabled = true

# 是否对扇区文件进行强校验，选填项，布尔类型
# 默认值为 true
# 开启时，除了对文件存在性进行判断外，还会尝试读取部分信息，如元数据等
#StrictCheck = true

# WindowPoSt 消息的 Gas 估算倍数，选填项，浮点数类型
# 默认值为 1.2
#GasOverEstimation = 1.2

# WindowPoSt 消息的FeeCap 限制，选填项，FIL值类型
# 默认值为 5 nanoFIL
#MaxFeeCap = "5 nanoFIL"

# 消息的稳定高度，选填项，数字类型
# 默认值为 10
#Confidence = 10

# 启动 WindowPoSt 的稳定高度，选填项，数字类型
# 默认值为 10
# 这个值决定了需要等待多少个高度才认定链进入稳定状态，可以启动 WindowPoSt 任务
# 此值设定越小，会越早启动，但同时也越容易受到分叉影响
# 当设置为 0 时，会使用默认值 10
#ChallengeConfidence = 10
```



### [Miners.Proof]

用于配置 WinningPoSt Proof 相关的策略

```
[Miners.Proof]
# 是否启用，选填项，布尔类型
# 默认值为 false
#Enabled = false
```



### [Miners.Deal] `已废弃`

用于配置订单相关的策略。

```
[Miners.Deal]
# 是否启用，选填项，布尔类型
# 默认值为 false
#Enabled = false
```



## 一份最简可工作的配置文件范例

我们以启动支持一个 `SP`  运作的 `venus-sector-manager` 为例，

```
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

[Miners.PoSt]
Sender = "t1abjxfbp274xpdqcpuaykwkfb43omjotacm2p3za"
Enabled = true

[Miners.Proof]
Enabled = true

```

这样就激活了一个：

- 拥有1个本地 PieceStore
- 拥有4个本地 持久化 Store
- 启用扇区分配，其初始编号为1000
- 不启用聚合 PreCommit
- 启用聚合 ProveCommit
- 启用 WinningPoSt 模块
- 启用订单

的 `venus-sector-manager` 实例。