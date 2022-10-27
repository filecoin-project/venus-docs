## 大数据集数据准备

以`aws`的开源大数据仓库为基础数据，下载完成后使用`filedrive-team`开源的[go-graphsplit](https://github.com/filedrive-team/go-graphsplit.git) 
进行切割成指定大小的`piece`文件(建议切成16-32G)，移动到`venus-cluster`和`venus-maket`共用的`pieceStore`路径下。

## 下载大数据集

由于下载的目标数据集过于庞大，建议存放在存储服务器上，分批下载数据集；需要使用aws工具进行下载

1、下载aws命令行工具
centos系统:
```shell
$ yum install -y awscli
```
ubuntu系统:
```shell
$ apt install -y awscli
```

2、查看数据集大小，并下载文件
```shell
$ aws s3 ls s3://stpubdata/tess/public/ffi/s0006/2018 --recursive --human-readable --summarize --no-sign-request

Total Objects: 23568
Total Size: 1.2 TiB
```

开始下载文件到`/mnt/nas/venus-data`目录下:
```shell
$ nohup aws s3 sync s3://stpubdata/tess/public/ffi/s0006/2018 /mnt/nas/venus-data/tess/public/ffi/s0006/2018 --no-sign-request 2>&1 > download.log &
```
下载速度根据用户自身的机房出口网络情况而定

## 关于大数据的选择:
```url
https://github.com/awslabs/open-data-registry/tree/main/datasets
```
里面包含aws所有开源的大数据集，请与用户(或venus-team)确认所下载的大数据是否符合datacap申请的数据类型。

例如:开普勒的光度测量数据，可以看到github上open-data-registry仓库下有一个k2.yaml的文件;
只需在aws仓库后跟上大数据集名称，就可以在浏览器上得到下载的地址

https://registry.opendata.aws/k2/

## go-graphsplit

编译`go-graphsplit`用于切`piece`工具

```bash
git clone https://github.com/filedrive-team/go-graphsplit.git

cd go-graphsplit

# get submodules
git submodule update --init --recursive

# build filecoin-ffi
make ffi

make
```

## 切piece

在`piece`过程中，通过`TMPDIR`变量来指定切过程中临时文件存放的路径，默认是在`/tmp`目录下，如果使用普通的系统盘做为临时数据目录，可能会因为系统盘的IO不足，导致进程报出**Bus error**错误后异常退出。

```shell
$ TMPDIR=/mnt/nvme01 /root/graphsplit chunk \
--car-dir=/mnt/nas/venus-data/16g-pice-data \
--slice-size=17179869184 \
--parallel=1 \
--graph-name=gs-test \
--calc-commp \
--rename \
--parent-path=/mnt/nas/venus-data/tess/ \
/mnt/nas/venus-data/tess/ >> /root/nas-nas-para15-30.log 2>&1 &
```

:::tip
`--car-dir`: 指定切割完成后`CAR`文件存储的路径；
`--slice-size`: 指定切割后输出的的`piece`文件大小，以`byte`为基础单位；1024 * 1024 * 1024 = 1073741824 这个就表示是`1G`的`piece`文件, 推荐大小为 `16G`(`17179869184`) 或 `32G`(`34359738368`)
`--parallel`: 指定并发的数量，值越大消耗的CPU和内存会越高
`--calc-commp`: 计算`commp`的值；
`--rename`: 将`CAR`文件自动转换成piece文件
:::

在切割完成后，在`--car-dir`指定的目录下会有很多pice文件和一个`manifest.csv`文件；
把`piece`文件移到`venus-market`和`venus-sector-manager`共享的`pieceStore`路径下。

:::tip
`manifest.csv`包含了发单的必要信息。
:::

:::tip
期望DataCap订单的生命周期，默认是生命周期是530天，订单需要在7天内封装完成`PreCommitSector`消息上链，不然DataCap订单会直接过期。
:::

## Venus体系接收订单

### venus-market查看收到订单状态

当订单的状态为`undefine`，就表示此订单等待`venus-sector-manager`将订单转换成扇区`id`

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

### venus-sector-manager配置注意事项

确认配置文件`.venus-sector-manager/sector-manager.cfg`中的**Enabled和EnableDeals**的值都为**true**，表示开启封装算力和开启接入封装订单任务。

```shell
[Miners.Sector]
InitNumber = 1000
MaxNumber = 1000000
Enabled = true
EnableDeals = true
LifetimeDays = 210
```

venus-worker需要在连接venus-sector-manager时需要携带token，才可以获取到Piece数据
```shell
[sector_manager]
  # 构造 rpc 客户端时使用的连接地址，必填项，字符串类型
  rpc_client.addr = "/ip4/192.168.100.1/tcp/1789"
  rpc_client.headers = { User-Agent = "jsonrpc-core-client" }
  piece_token = "eyJhbGciOiJIUzxxxxxxxx.eyJuYW1lIjoibGpoOG1xxx.gY3ymGxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  
  
[[sealing_thread]]
  sealing.enable_deals = true
  sealing.max_retries = 5
```
