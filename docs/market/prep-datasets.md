## Preping large datasets

A typic workflow for preping large datasets are as following:

- Download datasets
- Process data into piece files
- Store them to `pieceStore` of both `venus-cluster` and `venus-maket` for sealing

## Download large datasets

Download large datasets from your storage client to your storage system by means of your choice.

## go-graphsplit

Install `go-graphsplit` for splitting deal data.

```bash
git clone https://github.com/filedrive-team/go-graphsplit.git

cd go-graphsplit

# get submodules
git submodule update --init --recursive

# build filecoin-ffi
make ffi

make
```

## Getting piece files

Use `TMPDIR` to specify where the cache files for processing piece files should be stored. 

:::tip
The process requires large volumes of disk IOs. A **Bus error** may indicate that you may need faster disks.
:::

```shell
$ TMPDIR=/mnt/nvme01 /root/graphsplit chunk \
--car-dir=/mnt/nas/venus-data/16g-pice-data \
--slice-size=1073741824 \
--parallel=1 \
--graph-name=gs-test \
--calc-commp \
--rename \
--parent-path=/mnt/nas/venus-data/tess/ \
/mnt/nas/venus-data/tess/ >> /root/nas-nas-para15-30.log 2>&1 &
```

:::tip
`--car-dir`: Specify the path where the `CAR` files should be stored

`--calc-commp`: Compute value of `commp`
:::

When processing is done, there will be many piece files and a `manifest.csv` under `--car-dir`. Transfer piece files to the path defined by `pieceStore` for both `venus-market` and `venus-sector-manager`.

:::tip
`manifest.csv` contains information for proposing storage deals.
:::

:::tip
Check deal `start epoch` and make sure to seal the deal before the deal starts.
:::

## Sealing the deal

### venus-market

Check deal status using `venus-market`.

:::tip
If deal status is `Undefined`, it means deal is waiting for `venus-sector-manager` to prepare the deal sector id.
:::

```shell
venus-market storage-deals list
/root/.venusmarket
ProposalCid  DealId  State              PieceState  Client                                     Provider  Size    Price  Duration
...hbgguc6a  172163  StorageDealWait  Undefind    t1yusfltophrl3z5zgemgr3pwgg3nzdjbjky          t0xxxx   16GiB   0 FIL  1059840
...t2wycjiq  172164  StorageDealWait  Undefind    t1yusfltophrl3z5zgemgr3pwgg3nzdjbjky          t0xxxx   16GiB   0 FIL  1059840
...5tkvirfe  172165  StorageDealWait  Undefind    t1yusfltophrl3z5zgemgr3pwgg3nzdjbjky          t0xxxx   16GiB   0 FIL  1059840
...btsawgt2  172166  StorageDealWait  Undefind    t1yusfltophrl3z5zgemgr3pwgg3nzdjbjky          t0xxxx   16GiB   0 FIL  1059840
...feczgggg  172167  StorageDealWait  Undefind    t1yusfltophrl3z5zgemgr3pwgg3nzdjbjky          t0xxxx   16GiB   0 FIL  1059840
```

### venus-sector-manager

Please make sure the configurations of `venus-sector-manager` are set to take storage deals.

:::tip
Check if both **Enabled** and **EnableDeals** are set to **true** in `.venus-sector-manager/sector-manager.cfg`
:::

```shell
[Miners.Sector]
InitNumber = 1000
MaxNumber = 1000000
Enabled = true
EnableDeals = true
LifetimeDays = 210
```