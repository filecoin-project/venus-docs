# 市场部署

`venus-market` 是 `venus` 系统中的市场服务组件，由两部分组成：`venus-market` 和 `market-client`，通俗理解为市场服务端和客户端。

- `venus-market` 的服务对象是存储提供商；

- `market-client` 的服务对象是有检索需求或存储需求的用户。

## `venus-market`  部署

`venus-market` 提供的功能有：

- 为加入链服务的`miner`配置存储挂单及检索挂单；

- 存储交易的自动化支持；

- 跟踪存储交易订单的封装过程；

- 检所交易过程的自动化支持。

部署方式请参考[venus-market 部署](https://github.com/filecoin-project/venus-market/blob/master/docs/zh/%E5%BF%AB%E9%80%9F%E5%90%AF%E7%94%A8.md#配置启动venus-market)

## `market-client`  部署

`market-client` 提供的功能有：

- 查询网络中`miner`的挂单信息，包括存储挂单和检索挂单；

- 存储交易的全流程命令行支持；

- 检所交易的全流程命令行支持。

部署方式请参考[market-client 部署](https://github.com/filecoin-project/venus-market/blob/master/docs/zh/%E5%BF%AB%E9%80%9F%E5%90%AF%E7%94%A8.md#配置启动market-client)
