# market v1-v2 升级指南

market v1 升级到 v2 的过程中数据结构发生了变化，如果需要现有的数据请按照现有的步骤进行升级数据

## 编译升级工具

```
git clone https://github.com/filecoin-project/venus-market.git
git checkout feat/export_v1_data

make deps
cd cli/market_export
go build
```

执行上述步骤后会生成一个工具，这个工具用于导出 v1 版本的数据

## 升级步骤

1. 停止 venus-market 程序

2. 备份 venus-market 数据目录，这个目录默认保存在 ~/.venusmarket.

3. 导出 v1 版本的数据

    ```sh
     ./market_export --repo <venus-market repo> export <path of export data file> 
    ```

4. 重新初始化 v2 版本的 venus-market(版本号必须高于 2.0.0 rc2)

5. 执行 v2 版本的升级命令，这个命令用于导入步骤 3 中导出的数据。

    ```sh
    ./market_export --repo <venus-market repo> migrate import_v1 <path of export data file>
    ```

***稳妥起见，做升级之前请确保没有处于 (Publish/Publishing/StorageDealAwaitingPreCommit) 状态的订单***