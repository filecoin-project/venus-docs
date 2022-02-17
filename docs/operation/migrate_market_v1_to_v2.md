# market v1 to v2 upgrade guide

During the process of upgrading market v1 to v2, the data structure has changed. If you need current data in venus-market v1, please follow the existing steps to migrate the data.

## bild upgrade tool

```
git clone https://github.com/filecoin-project/venus-market.git
git checkout feat/export_v1_data

make deps
cd cli/market_export
go build
```

market_export tool will be build after performing the above steps, which is used to export the data of the v1 version

## step for upgrade v1 to v2

1. stop venus-market

2. backup venus-market repo, it always in ~/.venusmarket by default.

3. export data in v1 venus-market, 

    ```sh
     ./market_export --repo <venus-market repo> export <path of export data file> 
    ```

4. reinit venusmarket v2 (version must be higher than 2.0.0 rc2)

5. excute migrate cmd in market v2, this cmd used to import v1 data that generated in step 3.

    ```sh
    ./market_export --repo <venus-market repo> migrate import_v1 <path of export data file>
    ```

***To be safe, please make sure that there are no storage deals in the (Publish/Publishing/StorageDealAwaitingPreCommit) state before doing the upgrade***