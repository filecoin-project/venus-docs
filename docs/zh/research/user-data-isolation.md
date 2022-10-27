<!--着重借鉴了FIP的模版：[这里](https://raw.githubusercontent.com/filecoin-project/FIPs/master/templates/template_FTP.md)-->

## Simple Summary (概述)
<!--"If you can't explain it simply, you don't understand it well enough." Provide a simplified and layman-accessible explanation of the design.-->
<!--俗话说："如果你不能以简单的话解释，说明你还不够懂他"提供一个简单的，非技术人员也能理解的介绍。-->
链服务对其用户（SP等）数据隔离，并提供访问接口。

## Abstract (功能简介)
<!--A short (~200 word) description of the technical issue being addressed.-->
<!--一个简短的200字以内的，描述当前的功能设计。-->
`SP` 的很多业务数据保存在链服务端，并由其负责跟踪与维护。
为了 `SP` 用户能够管理自己的数据，如：订单，消息，出块，转账等，需要链服务对用户的数据进行隔离，并提供请求的接口，同时，独立组件需要提供便捷地用户操作界面。

关联：
- [ ] 提案的[issue](https://github.com/filecoin-project/venus/issues/5384)

## Motivation (来源/背景)
<!--The motivation is critical for new feature design that want to change the product. It should clearly explain why the existing product specification is inadequate to address the problem that this new feature solves.-->
<!--功能设计动机是很重要的。当前现有产品的哪儿些不足，功能需求的来源和背景，等等。在这个feature（设计）完成后，哪儿些问题会得到解决？-->
`Venus` 系统分为链服务和独立组件，在多数情况下，链服务和独立组件的维护者不是同一类用户，比如孵化器就是专门维护一套链服务给众多的SP终端用户使用。

## Specification (feature Spec)
<!--The technical specification should describe the syntax and semantics of any new feature. The specification should be detailed enough to allow others to easily translate into product implementations. -->
<!--具体的技术spec，需要对feature的syntax，semantics进行描述。Spec需要能够让别人更容易的按照spec去实现这个feature。-->
### 数据分类

`API token` 可以确认绑定的用户，按每个链服务组件分类用户数据：

#### venus-auth

- 矿工列表
- Signer列表：在签名时 `venus-gateway` 反向查找 `signer` 归属的用户列表，从中选择可正常服务的 `venus-wallet` 进行签名。

#### venus-messager

- 算力关联的消息，通常由 `venus-sector-manager`  产生；
- `miner actor` 消息，比如 `withdraw`, 更换各种地址等;
- 其他消息，如转账。

#### venus-miner

- 历史出块权

#### venus-gateway

- 支持用户签名的 `venus-wallet` 列表。可以提前验证某个钱包的消息能否被签名等。

#### venus-market

- 订单数据(deals)
- 挂单数据(ask)
- `pieces`


### 数据获取

根据token配合`venus-auth` 验证用户身份，查找绑定的的 `minerID`，`signers` 等验证接口参数，再根据参数去对应的组件数据库中查询所需数据。

### 用户界面

- venus-sector-manager：actor地址管理，订单，pieces及消息管理等；
- venus-tools： 转账，***
- venus-wallet：`signer`与用户关系管理

## Design Rationale (设计思路)
<!--The rationale fleshes out the specification by describing what motivated the design and why particular design decisions were made. It should describe alternate designs that were considered and related work. -->
<!--设计思路基于上面的spec，描述了设计上的一些选择，以及为什么使用了这些选择。-->

## Backwards Compatibility（兼容性）
<!--All design/feature that introduce backwards incompatibilities must include a section describing these incompatibilities and their severity. The design/feature must explain how the author proposes to deal with these incompatibilities.-->
<!--所有功能设计都需要包含向前兼容性问题的描述。如，有哪儿些和之前版本不兼容的地方，不兼容地方的严重性，等等。功能设计文档需要包含作者如何处理/解决这些不兼容问题。-->

## Test Cases (测试用例)
<!--Test cases for an implementation. Links to test cases if applicable.-->
<!--测试用例，如果有的话。-->

## Security Considerations (安全考量)
<!--All design/feature must contain a section that discusses the security implications/considerations relevant to the proposed change. Include information that might be important for security discussions, surfaces risks and can be used throughout the life cycle of the proposal. E.g. include security-relevant design decisions, concerns, important discussions, implementation-specific guidance and pitfalls, an outline of threats and risks and how they are being addressed.-->
<!--安全问题，如果有的话。-->

## Implementation（实施）
<!--Include any implementation details that you find may be helpful to elaborate your design. This may be a flow chart, an architecture diagram, system work flow chart.-->
<!--任何有助于展示设计意图的图标，等等都可以添加在这里。-->
