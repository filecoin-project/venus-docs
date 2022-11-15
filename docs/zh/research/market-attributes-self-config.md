<!--着重借鉴了FIP的模版：[这里](https://raw.githubusercontent.com/filecoin-project/FIPs/master/templates/template_FTP.md)-->

# 市场属性配置

## Simple Summary (概述)

矿工可以自己配置存储市场和检索市场的属性。

## Abstract (功能简介)

`venus-market` 支持矿工的市场交易属性可独立配置，并可以由矿工自己配置，而不是通过链服务维护人员间接进行。

关联：
- [ ] 提案的[issue](https://github.com/filecoin-project/venus/issues/5410)
- [ ] [社区discussion](https://github.com/filecoin-project/venus/discussions/5425)

## Motivation (来源/背景)

<!--The motivation is critical for new feature design that want to change the product. It should clearly explain why the existing product specification is inadequate to address the problem that this new feature solves.-->
<!--功能设计动机是很重要的。当前现有产品的哪儿些不足，功能需求的来源和背景，等等。在这个feature（设计）完成后，哪儿些问题会得到解决？-->
`Filecoin` 网络中的矿工参与市场交易需要一些属性来保证交易过程正常进行，也可以通过一些属性来设置自己的交易取向，如：仅接受可验证订单、只进行离线订单等。可配置属性如下：

```toml
# Default config:
ConsiderOnlineStorageDeals = true
ConsiderOfflineStorageDeals = true
ConsiderOnlineRetrievalDeals = true
ConsiderOfflineRetrievalDeals = true
ConsiderVerifiedStorageDeals = true
ConsiderUnverifiedStorageDeals = true
PieceCidBlocklist = []
ExpectedSealDuration = "24h0m0s"
MaxDealStartDelay = "336h0m0s"
PublishMsgPeriod = "30s"
MaxDealsPerPublishMsg = 8
MaxProviderCollateralMultiplier = 2
Filter = ""
RetrievalFilter = ""
TransfePath = ""
MaxPublishDealsFee = "0 FIL"
MaxMarketBalanceAddFee = "0 FIL"

[AddressConfig]
  DisableWorkerFallback = false
  
[RetrievalPricing]
  Strategy = "default"
  [RetrievalPricing.Default]
    VerifiedDealsFreeTransfer = true
  [RetrievalPricing.External]
    Path = ""
```

在目前的 `venus-market` 实现中，所有的矿工共用一份配置，无法单独为某个矿工配置交易属性。


### 延伸问题

- 批量发单的问题: `market-client` 需要支持批量发单：自动切分文件、发单；

- `venus-market` 统一 `pool-run` 和 `solo-run` 两种部署模式为一种，倾向于部署在链下。


## Specification (feature Spec)
<!--The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow others to easily translate into product implementations. -->
<!--具体的技术spec，需要对feature的syntax，semantics进行描述。Spec需要能够让别人更容易的按照spec去实现这个feature。-->

### 属性配置

- 有一套全局的属性表，当矿工没有独立配置时采用全局配置；
- 支持矿工有独立的属性表；
- 提供更新属性的 `API`及界面。

支持多矿工属性的配置项如下：
```toml
# global
[CommonProviderConfig]
  ConsiderOnlineStorageDeals = true
  ConsiderOfflineStorageDeals = true
  ConsiderOnlineRetrievalDeals = true
  ConsiderOfflineRetrievalDeals = true
  ConsiderVerifiedStorageDeals = true
  ConsiderUnverifiedStorageDeals = true
  PieceCidBlocklist = []
  ExpectedSealDuration = "24h0m0s"
  MaxDealStartDelay = "336h0m0s"
  PublishMsgPeriod = "1h0m0s"
  MaxDealsPerPublishMsg = 8
  MaxProviderCollateralMultiplier = 2
  Filter = ""
  RetrievalFilter = ""
  TransferPath = ""
  MaxPublishDealsFee = "0 FIL"
  MaxMarketBalanceAddFee = "0 FIL"
  [CommonProviderConfig.RetrievalPricing]
    Strategy = "default"
    [CommonProviderConfig.RetrievalPricing.Default]
      VerifiedDealsFreeTransfer = true
    [CommonProviderConfig.RetrievalPricing.External]
      Path = ""
  [CommonProviderConfig.AddressConfig]
    DisableWorkerFallback = false

# 每个矿工的属性表，没有配置则使用全局配置
[[Miners]]
  Addr = "f01000"
  Account = "testuser01"
  
   ConsiderOnlineStorageDeals = true
   ConsiderOfflineStorageDeals = true
   ConsiderOnlineRetrievalDeals = true
   ConsiderOfflineRetrievalDeals = true
   ConsiderVerifiedStorageDeals = true
   ConsiderUnverifiedStorageDeals = true
   PieceCidBlocklist = []
   ExpectedSealDuration = "24h0m0s"
   MaxDealStartDelay = "336h0m0s"
   PublishMsgPeriod = "1h0m0s"
   MaxDealsPerPublishMsg = 8
   MaxProviderCollateralMultiplier = 2
   Filter = ""
   RetrievalFilter = ""
   TransferPath = ""
   MaxPublishDealsFee = "0 FIL"
   MaxMarketBalanceAddFee = "0 FIL"
   [CommonProviderConfig.RetrievalPricing]
     Strategy = "default"
     [CommonProviderConfig.RetrievalPricing.Default]
       VerifiedDealsFreeTransfer = true
     [CommonProviderConfig.RetrievalPricing.External]
       Path = ""
   [CommonProviderConfig.AddressConfig]
     DisableWorkerFallback = false
      
[[Miners]]
  Addr = "f01002"
  Account = "testuser02"
  
   ConsiderOnlineStorageDeals = true
   ConsiderOfflineStorageDeals = true
   ConsiderOnlineRetrievalDeals = true
   ConsiderOfflineRetrievalDeals = true
   ConsiderVerifiedStorageDeals = true
   ConsiderUnverifiedStorageDeals = true
   PieceCidBlocklist = []
   ExpectedSealDuration = "24h0m0s"
   MaxDealStartDelay = "336h0m0s"
   PublishMsgPeriod = "1h0m0s"
   MaxDealsPerPublishMsg = 8
   MaxProviderCollateralMultiplier = 2
   Filter = ""
   RetrievalFilter = ""
   TransferPath = ""
   MaxPublishDealsFee = "0 FIL"
   MaxMarketBalanceAddFee = "0 FIL"
   [CommonProviderConfig.RetrievalPricing]
     Strategy = "default"
     [CommonProviderConfig.RetrievalPricing.Default]
       VerifiedDealsFreeTransfer = true
     [CommonProviderConfig.RetrievalPricing.External]
       Path = ""
   [CommonProviderConfig.AddressConfig]
     DisableWorkerFallback = false
```

### 用户界面

- `venus-market` 的命令行;
- `venus-sector-manager/venus-tools` 的命令行(可选);


## Design Rationale (设计思路)
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. -->
<!--设计思路基于上面的spec，描述了设计上的一些选择，以及为什么使用了这些选择。-->

## Backwards Compatibility（兼容性）
<!--All design/feature that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The design/feature must explain how the author proposes to deal with these incompatibilities.-->
<!--所有功能设计都需要包含向前兼容性问题的描述。如，有哪儿些和之前版本不兼容的地方，不兼容地方的严重性，等等。功能设计文档需要包含作者如何处理/解决这些不兼容问题。-->

本需求的实现会改变配置项的结构，需要实现配置文件的自动升级.

## Test Cases (测试用例)
<!--Test cases for an implementation. Links to test cases if applicable.-->
<!--测试用例，如果有的话。-->

- 配置文件自动升级；
- 矿工交易属性可通过命令行或手动改配置文件设置；

## Security Considerations (安全考量)
<!--All design/feature must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed.-->
<!--安全问题，如果有的话。-->

## Implementation（实施）
<!--Include any implementation details that you find may be helpful to elaborate your design. This may be a flow chart, an architecture diagram, system work flow chart.-->
<!--任何有助于展示设计意图的图标，等等都可以添加在这里。-->
