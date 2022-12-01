<!--着重借鉴了FIP的模版：[这里](https://raw.githubusercontent.com/filecoin-project/FIPs/master/templates/template_FTP.md)-->

## Simple Summary / 概述
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the design.-->
<!--俗话说：“如果你不能以简单的话解释，说明你还不够懂它”。提供一个简单的，非技术人员也能理解的介绍。-->

Metrics for montoring general health of Venus system. 

## Abstract / 功能简介
<!--A short (~200 word) description of the technical issue being addressed.-->
<!--一个简短的200字以内的，描述当前的功能设计。-->

Metrics provides the toolbox for SP to minimize the impact of their operation errors, to get to see if winidowPost messages get properly sent out in time, to monitor time/latency for PoST computation and much more so that SPs do not get punished by the protocol unintentionally.
 

- Live heart beat map of all critical information of your storage system
- Lower protocol penalties from mechanics such as PCD, PoST slashes, missing block etc
- Easy integration with third party monitoring solution


## Motivation / 来源和背景
<!--The motivation is critical for new feature design that want to change the product. It should clearly explain why the existing product specification is inadequate to address the problem that this new feature solves.-->
<!--功能设计动机是很重要的。当前现有产品的哪儿些不足，功能需求的来源和背景，等等。在这个feature（设计）完成后，哪儿些问题会得到解决？-->

One of the issues that new SPs or even many veteran SPs facing everyday when they on-board loads of sectors is getting a clear picture of the heartbeat for their storage system to diagnose whatever has gone wrong in their pipeline. A thousand things could go wrong when moving sectors through SP’s storage systems such as chain head out of sync, messages stuck in mpool, missing block producing round, high API latency and etc. SPs have to navigate through these anomalies all the time and be quick to response to these conditions.
 
This is where Data Onboarding Metrics for Venus Filecoin comes into play. We propose to build a series of critical metrics for each component of Venus Filecoin to reflect the live health of a storage system so that operators could have better knowledge of what’s going with their systems and then could better react to different situations instead of relying on guessing, digging through tons of logs or overly extensive dev-ops experience. 

## Specification / Spec
<!--The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow others to easily translate into product implementations. -->
<!--具体的技术spec，需要对feature的syntax，semantics进行描述。Spec需要能够让别人更容易的按照spec去实现这个feature。-->

venus-miner

```go
// latency for GetBaseInfo API
GetBaseInfoDuration   (Milliseconds)
// latency for ComputeTicket API
ComputeTicketDuration (Milliseconds)
// latency for IsRoundWinner API
IsRoundWinnerDuration (Milliseconds)
// latency for ComputeProof API
ComputeProofDuration (Seconds)

// number of block produced
NumberOfBlock (Dimensionless)
// number of rounds that miner_id is winner
NumberOfIsRoundWinner (Dimensionless)
```

venus-messager

```go

// Below metrics are updated on a per wallet address granularity 
WalletBalance  (UnitDimensionless)
WalletDBNonce (UnitDimensionless)
WalletChainNonce (Dimensionless)

// Current number of messages that are waiting for venus-messager to fill out parameters like signature, gas usage, nonce etc.
// This metric is updated on a per wallet address granularity 
NumOfUnFillMsg (UnitDimensionless)
// Current number of messages that venus-messager has filled out parameters like signature, gas usage, nonce etc.
// This metric is updated on a per wallet address granularity 
NumOfFillMsg  (Dimensionless)
// Current number of messages that venus-messager has failed to fill out parameters like signature, gas usage, nonce etc.
// This metric is updated on a per wallet address granularity 
NumOfFailedMsg (UnitDimensionless)

// Current number of messages that haven't being on-chain for more than 3 minutes
NumOfMsgBlockedThreeMinutes (Dimensionless)
// Current number of messages that haven't being on-chain for more than 5 minutes
NumOfMsgBlockedFiveMinutes  (UnitDimensionless)

// Number of message being selected by venus-messager during last round of message pushing
SelectedMsgNumOfLastRound (UnitDimensionless)
// Number of message being pushed by venus-messager during last round of message pushing
ToPushMsgNumOfLastRound  (UnitDimensionless)
// Number of message being expired by venus-messager during last round of message pushing
ExpiredMsgNumOfLastRound (UnitDimensionless)
// Number of message encountered errors during last round of message pushing
ErrMsgNumOfLastRound  (UnitDimensionless)

// Current time difference between chain head time and time on venus-messager machine system time
ChainHeadStableDelay  (UnitSeconds)
// Histogram of time difference between chain head time and time on venus-messager machine system time
ChainHeadStableDuration (UnitSeconds)
)
```

venus-gateway

```go
// Number of wallet connecting to the gateway
WalletCount
// Number of wallet addresses connecting to the gateway
WalletAddressCount
// IP of remote wallet connecting to the gateway
WalletIPAddress

// Number of SP connecting to the gateway
SPCount
// Number of SP addresses connecting to the gateway
SPAddressCount
// IP of remote SP connecting to the gateway
SPIPAddress

// Number of signature gateway initiated
SignCount
```

venus-market 

```go
// Count of storage deals accepted
StorageDealAccepted
// Number of active data transfer 
NumberOfActiveTransfer
// Speed of data transfer, per transfer, unit = Mbps
DataTransferSpeed
// The rate of successful data transfer
SucessTransferRate
```

venus-cluster 

```go
// Count of new sectors, per miner_id 
SectorManagerNewSector

// Count of preCommit, per miner_id 
SectorManagerPreCommitSector

// count of commit, per miner_id 
SectorManagerCommitSector

// time of computing winningPost, per miner_id, unit = Seconds
ProverWinningPostDuration

// time of computing WindowPost, per miner_id, unit = Minutes
ProverWindowPostDuration

// Completion rate for partition that have passed windowPost, per miner_id
// Eg: ProverWindowPostCompleteRate=0.9 when 9 out 10 partition complete windowPost submission
ProverWindowPostCompleteRate

// Latency of sector manage API calls, unit = ms
APIRequestDuration
```

Note that all metrics are not final and subject to have more parameters when community see fit.

## Design Rationale / 设计思路
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. -->
<!--设计思路基于上面的spec，描述了设计上的一些选择，以及为什么使用了这些选择。-->

Metrics designs allows user to use any exporters to its liking through configuration, which expands the usability of the metrics system so that it can be easily integrated to either new or existing monitoring solution user may already have.

```yml
[Metrics]
  # 是否开启metrics指标统计，默认为false
  Enabled = false
  
  [Metrics.Exporter]
    # 指标导出器类型，目前可选：prometheus或graphite，默认为prometheus
    Type = "prometheus"
    
    [Metrics.Exporter.Prometheus]
      # multiaddr
      EndPoint = "/ip4/0.0.0.0/tcp/4568"
      # 命名规范: "a_b_c", 不能带"-"
      Namespace = "messager01" 
      # 指标注册表类型，可选：default（默认，会附带程序运行的环境指标）或 define（自定义）
      RegistryType = "define"
      # prometheus 服务路径
      Path = "/debug/metrics"
      # 上报周期
      ReportingPeriod = "10s"
      
    [Metrics.Exporter.Graphite]
      # 命名规范: "a_b_c", 不能带"-"
      Namespace = "messager01" 
      # graphite exporter 收集器服务地址
      Host = "127.0.0.1"
      # graphite exporter 收集器服务监听端口
      Port = 4568
      # 上报周期
      ReportingPeriod = "10s"
```

## Backwards Compatibility / 兼容性
<!--All design/feature that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The design/feature must explain how the author proposes to deal with these incompatibilities.-->
<!--所有功能设计都需要包含向前兼容性问题的描述。如，有哪些和之前版本不兼容的地方，不兼容地方的严重性，等等。功能设计文档需要包含作者如何处理/解决这些不兼容问题。-->

n/a

## Test Cases / 测试用例
<!--Test cases for an implementation. Links to test cases if applicable.-->
<!--测试用例，如果有的话。-->

n/a

## Security Considerations / 安全考量
<!--All design/feature must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed.-->
<!--所有设计文档必须包含讨论设计上安全问题的一部分。包括整个功能的生命周中可能包含的风险等等。-->

n/a

## Related

A [grant](https://github.com/filecoin-project/devgrants/issues/858) was filed for this initiative to fund the development of this project.