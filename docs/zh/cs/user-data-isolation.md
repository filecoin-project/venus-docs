# 用户数据隔离

`Venus` 系统分为链服务和独立组件，在多数情况下，链服务和独立组件的维护者不是同一类用户，比如孵化器就是专门维护一套链服务给众多的SP终端用户使用。

`SP` 的很多业务数据保存在链服务端，并由其负责跟踪与维护。
为了 `SP` 用户能够管理自己的数据，如：订单，消息，出块，转账等，需要链服务对用户的数据进行隔离，并提供请求的接口，同时，独立组件需要提供便捷地用户操作界面。

[提案 issue](https://github.com/filecoin-project/venus/issues/5384)

## 数据分类

`API token` 可以确认绑定的用户，按每个链服务组件分类用户数据：

### venus-auth

- 矿工列表
- Signer列表：在签名时 `venus-gateway` 反向查找 `signer` 归属的用户列表，从中选择可正常服务的 `venus-wallet` 进行签名。

### venus-messager

- 算力关联的消息，通常由 `venus-sector-manager`  产生；
- `miner actor` 消息，比如 `withdraw`, 更换各种地址等;
- 其他消息，如转账。

### venus-miner

- 历史出块权

### venus-gateway

- 支持用户签名的 `venus-wallet` 列表。可以提前验证某个钱包的消息能否被签名等。

### venus-market

- 订单数据(deals)
- 挂单数据(ask)
- `pieces`


## 数据获取

根据token配合`venus-auth` 验证用户身份，查找绑定的的 `minerID`，`signers` 等验证接口参数，再根据参数去对应的组件数据库中查询所需数据。

## 用户界面

- venus-sector-manager：actor地址管理，订单，pieces及消息管理等；

- venus-tools： 转账，***

- venus-wallet：`signer`与用户关系管理
