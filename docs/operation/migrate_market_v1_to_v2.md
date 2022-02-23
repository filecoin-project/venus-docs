## Upgrade market v1 to market v2 

:::warning

Before upgrading, please make sure that there are no deals in the state of `Publish`, `Publishing` or `StorageDealAwaitingPreCommit`.

:::

Stop venus-market process.

```bash
# grep [PID] of venus-market process
$ ps -ef | grep market
root   6704  2.3  0.0 2361236 43148 pts/2   Sl   17:33   0:18 ./venus-market run

$ kill -9 [PID]
```

Backup venus-market repo. Default path is `~/.venusmarket`.

```bash
$ cp -a ~/.venusmarket ~/.venusmarket-bak
```

(Optional) Export v1 data

:::tip

As v1 meta data structure depreciates, in order to view deals sealed using v1, an export tools could be built to export v1 data and import data into v2. 

:::

:::tip

Build export tool.

```
git clone https://github.com/filecoin-project/venus-market.git
git checkout feat/export_v1_data

make deps
cd cli/market_export
go build
```

:::

:::tip

Export v1 data. 

```sh
$ ./market_export --repo <VENUS_MARKET_REPO> export <EXPORT_DATA_FILE_PATH>
```
    
:::

Build and init market v2 (2.0.0-rc2 or higher). Please refer to market v2 document for more details.

(Optional) Lastly import v1 data to market v2.

```bash
$ ./market_export --repo <VENUS_MARKET_REPO> migrate import_v1 <EXPORT_DATA_FILE_PATH>
```