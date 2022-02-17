# market v1-v2升级指南

market v1升级到v2的过程中数据结构发生了变化，如果需要现有的数据请按照现有的步骤进行升级数据

## 编译升级工具

```
git clone https://github.com/filecoin-project/venus-market.git
git checkout feat/export_v1_data

make deps
cd cli/market_export
go build
```

执行上述步骤后会生成一个工具，这个工具用于导出v1版本的数据

## 升级步骤

1. 停止venus-market程序

2. 备份venus-market数据目录, 这个目录默认保存在 ~/.venusmarket.

3. 导出v1版本的数据

    ```sh
     ./market_export --repo <venus-market repo> export <path of export data file> 
    ```

4. 重新初始化v2版本的venus-market(版本号必须高于2.0.0 rc2)

5. 执行v2版本的升级命令， 这个命令用于导入步骤3中导出的数据.

    ```sh
    ./market_export --repo <venus-market repo> migrate import_v1 <path of export data file>
    ```

***稳妥起见，做升级之前请确保没有处于(Publish/Publishing/StorageDealAwaitingPreCommit)状态的订单***