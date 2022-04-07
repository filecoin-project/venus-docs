# venus-cluster 离线订单

## 场景

&ensp;&ensp; venus-market为多个集群提供真实数据交易服务，当订单过多，特别是订单数据较大时会产生很大的网络流量，可能影响服务性能。离线订单的数据可以线下传输，交易双方只需将必要的验证消息发送到Filecoin网络既可。

## 准备工作

- [稳定的链服务](https://venus.filecoin.io/zh/guide/How-To-Deploy-MingPool.html)

- [部署cc扇区的venus-cluster集群](https://venus.filecoin.io/zh/guide/Using-venus-cluster-alt.html)

## 封装offline-deal

1. 修改`venus-sector-manager`和`venus-worker`的配置项使其可封装deal扇区.以下说明只截取必要的配置字段.

    sector-manager.cfg
    ```
    [Common.API]
    Market = "/ip4/{api_host}/tcp/{api_port}"

    [[Common.PieceStores]]
    #Name = "{store_name}"
    #Path = "{store_path}"
    #Strict = false
    #ReadOnly = false

    [[Miners]]
    [Miners.Deal]
    Enabled = true
    ```

    venus-worker.toml
    ```toml
    [sealing]
    enable_deals = true
    ```

2. `PieceStore`配置

- `venus-sector-manager`的PieceStores和发单工具的piece目录一致，这样在AP阶段不会向venus-market请求订单数据；

     sector-manager.cfg
     ```
     [[Common.PieceStores]]
     Path = "/mnt/market-pieces"
     ```

- 使用`venus-market`统一管理，将订单数据存储到venus-market指定的目录，在AP阶段向venus-market请求。

    sector-manager.cfg
    ```
    [[Common.PieceStores]]
    # 不需要配置
    #Path = "/mnt/market-pieces"
    ```

    需要根据实际应用场景选择合适的方案，一般venus-market和集群在同一局域网优先选择后一个，否则选择前一个。

## 发单工具

