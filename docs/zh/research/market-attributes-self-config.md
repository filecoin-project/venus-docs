<!--着重借鉴了FIP的模版：[这里](https://raw.githubusercontent.com/filecoin-project/FIPs/master/templates/template_FTP.md)-->

# 市场属性配置

## Simple Summary (概述)

矿工可以自己配置存储市场和检索市场的属性。

## Abstract (功能简介)

`venus-market` 支持矿工的市场交易属性可独立配置，并可以由矿工自己配置，而不是通过链服务维护人员间接进行。

`venus-market` 推荐作为独立组件部署，将 `solo-run` 模式作为默认启动方式或者直接废弃 `pool-run` 模式。（为什么这样做后文会详细讨论）

关联：
- [ ] 提案的[issue](https://github.com/filecoin-project/venus/issues/5410)
- [ ] [社区discussion](https://github.com/filecoin-project/venus/discussions/5425)

## Motivation (来源/背景)

<!--The motivation is critical for new feature design that want to change the product. It should clearly explain why the existing product specification is inadequate to address the problem that this new feature solves.-->
<!--功能设计动机是很重要的。当前现有产品的哪儿些不足，功能需求的来源和背景，等等。在这个feature（设计）完成后，哪儿些问题会得到解决？-->
`Filecoin` 网络中的矿工参与市场交易需要一些属性来保证交易过程正常进行，也可以通过一些属性来设置自己的交易取向，如：仅接受可验证订单、只进行离线订单等。目前的可配置属性如下：

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
SimultaneousTransfersForStorage = 20
SimultaneousTransfersForStoragePerClient = 20
SimultaneousTransfersForRetrieval = 20
Filter = ""
RetrievalFilter = ""
TransfePath = ""
MaxPublishDealsFee = "0 FIL"
MaxMarketBalanceAddFee = "0 FIL"
```

在目前的 `venus-market` 实现中，所有的矿工共用一份配置，无法单独为某个矿工配置交易属性。

`venus-market` `pool-run` 模式下，矿工无法对交易属性进行直接管理：查询和配置。

`venus-market` `pool-run` 模式下，`pieces`数据在目前的协议下无法直接存储到`SP`的封装机器，在封装过程中需要下载，当订单量较大时，对网络带宽的要求较高，故推荐将`venus-market`作为独立组件部署。
后续协议(boost?待考察)支持订单交易中可以将数据直接存到`SP`封装机器上时优先推荐作为链服务组件?

### 延伸问题

- 批量发单的问题: market-client需要支持批量发单，并将发单记录到数据库，便于统计为 `miners` 发单情况；


## Specification (feature Spec)
<!--The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow others to easily translate into product implementations. -->
<!--具体的技术spec，需要对feature的syntax，semantics进行描述。Spec需要能够让别人更容易的按照spec去实现这个feature。-->
### 默认的部署方式

目前的可选项有：

- 将 `solo-run` 模式作为默认的启动方式。主要是为了减少不必要的数据传输，原因见上文。存在的缺点是：
    - `SP` 需要维护一个固定的公网`IP`,并开放一个端口；（安全性降低？）
    - 野望的降低：从服务于多个用户的多个矿工 --> 服务于一个用户的多个矿工。在市场检索方面的多样性降低？

- 废弃 `pool-run` 模式，将 `solo-run` 模式作为唯一的部署方式。
> 如果废弃 `pool-run` 模式,需要考虑历史订单的迁移问题，如何把孵化器或其他链服务 `venus-market` 的历史 `deals`发给各自的用户 `SP venus-market`.

个人倾向于第2个，与其维护带有缺陷的模式，不如全力做好 `solo-run` 模式，完善整个接发单流程，如：批量发单、离线交易等。
还有一点是要支持 `pool-run` 模式，额外的工作量也不小，对于新的多矿工交易属性配置需要提供额外的用户界面。

### 属性配置

- 有一套全局的属性表，当矿工没有独立配置时采用全局配置；
- 矿工有独立的属性表。


### 用户界面

- `pool-run` 模式下，通过 `venus-sector-manager` 提供的命令进行配置；
- `solo-run` 模式下，通过 `venus-market` 提供的命令修改配置文件（`config.toml`）进行配置；


## Design Rationale (设计思路)
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. -->
<!--设计思路基于上面的spec，描述了设计上的一些选择，以及为什么使用了这些选择。-->

## Backwards Compatibility（兼容性）
<!--All design/feature that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The design/feature must explain how the author proposes to deal with these incompatibilities.-->
<!--所有功能设计都需要包含向前兼容性问题的描述。如，有哪儿些和之前版本不兼容的地方，不兼容地方的严重性，等等。功能设计文档需要包含作者如何处理/解决这些不兼容问题。-->
不存在兼容问题，将原本的配置作为全局配置，矿工未配置独立的属性时采用全局属性。

## Test Cases (测试用例)
<!--Test cases for an implementation. Links to test cases if applicable.-->
<!--测试用例，如果有的话。-->

## Security Considerations (安全考量)
<!--All design/feature must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed.-->
<!--安全问题，如果有的话。-->

## Implementation（实施）
<!--Include any implementation details that you find may be helpful to elaborate your design. This may be a flow chart, an architecture diagram, system work flow chart.-->
<!--任何有助于展示设计意图的图标，等等都可以添加在这里。-->
