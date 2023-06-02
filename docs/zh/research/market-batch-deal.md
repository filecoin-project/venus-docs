<!--着重借鉴了FIP的模版：[这里](https://raw.githubusercontent.com/filecoin-project/FIPs/master/templates/template_FTP.md)-->

## Simple Summary (概述)
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the design.-->
<!--俗话说："如果你不能以简单的话解释，说明你还不够懂他"提供一个简单的，非技术人员也能理解的介绍。-->

`market` 批量发单是指基于 [go-graphsplit](https://github.com/filedrive-team/go-graphsplit) 工具实现一个能够批量发离线订单的工具，并且 `DC` 订单符合 `DC 发单要求`。

## Abstract (功能简介)
<!--A short (~200 word) description of the technical issue being addressed.-->
<!--一个简短的200字以内的，描述当前的功能设计。-->

`market-client` 需要实现以下功能：

* 增加批量发布订单命令和接口
* 离线订单持久化存储，订单状态追踪
* 增加获取离线订单、订单分布情况接口
* 命令行可以输出离线订单信息和 `DC` 订单分布信息
* 批量导入订单及聚合抵押
* 支持 f+ 对 LDN 发单要求，简称：`DC 发单要求`

关联：
- [x] 提案的[issue](https://github.com/filecoin-project/venus/issues/5809)

## Motivation (来源/背景)
<!--The motivation is critical for new feature design that want to change the product. It should clearly explain why the existing product specification is inadequate to address the problem that this new feature solves.-->
<!--功能设计动机是很重要的。当前现有产品的哪儿些不足，功能需求的来源和背景，等等。在这个feature（设计）完成后，哪儿些问题会得到解决？-->

目前 `market-client` 一次只能发布一个订单，当有大量订单需要发布时，需要一个一个发，发单的效率并不高。批量发单可以一次对多个 `SP` 发布多个订单，可以提高效率。

## Specification (feature Spec)
<!--The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow others to easily translate into product implementations. -->
<!--具体的技术spec，需要对feature的syntax，semantics进行描述。Spec需要能够让别人更容易的按照spec去实现这个feature。-->

### 名词解释

- 批量发单：指批量发布离线订单
- 订单：分普通订单和 `DC` 订单，`DC` 订单是被分配了 `datacap` 的订单
- SP：存储提供者
- 发单地址：发单时使用的地址，可以是具有 `datacap` 的地址
- go-graphsplit：一种用于将数据集切分成固定大小的 car 文件的工具
- datacap发单要求：
  * Storage provider should not exceed 25% of total datacap(`client` 给一个 `SP` 发的 `DC` 订单不能超过  `SP` 总 `DC` 订单的 25%)
  * Storage provider should not be storing duplicate data for more than 20%(`SP` 不能超过 20% 的重复数据)
  * Storage provider should have published its public IP address(`SP` 需要公开公告 IP 地址)
  * All storage providers should be located in different regions(`SP` 需要位于不同地区)

### 订单持久化

把离线订单存储到 `badger` 数据库，以 `proposal cid` 作为 key，把订单 JSON marshal 后的结果作为 value。

### 接口

`market-client` 新增接口

```
# 批量导入订单
ClientBatchDeal(ctx context.Context, params *client.DealsParams) (*client.DealResults, error)
# 获取 DC 订单分布情况
ClientGetVerifiedDealDistribution(ctx context.Context, providers []address.Address, client address.Address) (*client.DealDistribution, error)
# 查询所有离线订单
ClientListOfflineDeals(ctx context.Context) ([]client.DealInfo, error)    
```

`venus-market` 新增接口

```
# 批量导入离线订单数据
DealsBatchImportData(ctx context.Context, refs market.ImportDataRefs) ([]*market.ImportDataResult, error)
```

### 新增命令

* market-client 批量发单：支持对多 `SP` 发布多个离线订单，
* market-client 查询离线订单：能够查询单个订单和列出所有离线订单
* market-client 查询订单分布情况：可以按 `SP` 和 发单地址查询
* market-client 导出离线订单：当订单状态为 StorageDealWaitingForData 时，导出订单 proposalcid 和 piececid
* venus-market 批量导入订单：支持输入多个 proposalcid 和 car 文件组合，也支持根据文件导入


## Design Rationale (设计思路)
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. -->
<!--设计思路基于上面的spec，描述了设计上的一些选择，以及为什么使用了这些选择。-->

存储离线订单使用 JSON marshal 是为了方便以后加字段

根据用户使用 `go-graphsplit` 生成的 `manifest.csv` 文件内容来批量生成离线订单。

## Backwards Compatibility（兼容性）
<!--All design/feature that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The design/feature must explain how the author proposes to deal with these incompatibilities.-->
<!--所有功能设计都需要包含向前兼容性问题的描述。如，有哪儿些和之前版本不兼容的地方，不兼容地方的严重性，等等。功能设计文档需要包含作者如何处理/解决这些不兼容问题。-->

需要兼容已有的发单逻辑

## Test Cases (测试用例)
<!--Test cases for an implementation. Links to test cases if applicable.-->
<!--测试用例，如果有的话。-->

## Security Considerations (安全考量)
<!--All design/feature must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed.-->
<!--安全问题，如果有的话。-->


## Implementation（实施）
<!--Include any implementation details that you find may be helpful to elaborate your design. This may be a flow chart, an architecture diagram, system work flow chart.-->
<!--任何有助于展示设计意图的图标，等等都可以添加在这里。-->


### 查询离线订单

1. 按 proposal cid 查询单个离线订单信息
2. 列出所有离线订单信息

### 持久化订单数据

离线订单数据结构如下：

[ClientDealProposal](https://github.com/filecoin-project/venus/blob/master/venus-shared/types/state_types_gen.go#L24)

```sh
  types.ClientDealProposal
  ProposalCID    cid.Cid
	DataRef        *storagemarket.DataRef
	Message        string
	State          uint64
	DealID         uint64
	AddFundsCid    *cid.Cid
	PublishMessage *cid.Cid
	FastRetrieval  bool
	SlashEpoch     abi.ChainEpoch
	CreatedAt      time.Time
	UpdatedAt      time.Time
```

接口：

```
type ClientOfflineDealRepo interface {
	SaveDeal(ctx context.Context, deal *ClientOfflineDeal) error
	GetDeal(ctx context.Context, proposalCid cid.Cid) (*ClientOfflineDeal, error)
	ListDeal(ctx context.Context) ([]*ClientOfflineDeal, error)
  ListDeal(ctx context.Context) ([]*types2.ClientOfflineDeal, error)
}
```

### 离线订单状态追踪

粗略的把订单分成 active 订单和 inactive 订单，循序检查订单状态，如果订单状态是 `StorageDealActive` 则为 active 订单，反之是 inactive 订单。

* active 订单：间隔一段较长时间去链上查询订单是否 slash
* inactive 订单：间隔较短时间使用 libp2p 去获取订单状态


### 批量发布订单接口

[DealsParams](https://github.com/filecoin-project/venus/blob/master/venus-shared/types/market/client/deal.go#L16)

```
ClientBatchDeal(ctx context.Context, params *client.DealsParams) (*client.DealResults, error)

type DealResults struct {
	Results []*DealResult
}

type DealResult struct {
	ProposalCID cid.Cid
	// Create deal failed
	Message string
}

type DealsParams struct {
	Params []*DealParams
}
```

### 统计 DC 订单分布情况

1. 统计 `SP` `DC` 订单数据重复率，重复率 = 不重复 `DC` 订单 / `SP` 所有 `DC` 订单。

```
假如有两个 piece1，三个 piece3，则重复率 = 1 - (piece1+piece3) / (2 * piece1 + 3 * piece3)
```
2. 统计发单地址分配给 `SP` 的 `DC` 订单占比

```
# 获取 DC 订单分布情况
ClientGetVerifiedDealDistribution(ctx context.Context) (*PieceDistribution, error) 

type ProviderDistribution struct {
	Provider address.Address
	// Total deal
	Total uint64
	// Uniq deal
	Uniq uint64
	// May be too large
	UniqPieces map[string]uint64
	// (Total-Uniq) / Total
	DuplicationPercentage float64
}

type ReplicaDistribution struct {
	// Datacap address
	Client address.Address
	// Total deal
	Total uint64
	// Uniq deal
	Uniq uint64
	// (Total-Uniq) / Uniq
	DuplicationPercentage float64
	// ProviderTotalDeal / Total
	ReplicasPercentage   map[string]float64
	ReplicasDistribution []*ProviderDistribution
}

type DealDistribution struct {
	ProvidersDistribution []*ProviderDistribution
	ReplicasDistribution  []*ReplicaDistribution
}
```
