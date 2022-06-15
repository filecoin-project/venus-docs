## 下载大数据集方法

以aws的开源大数据仓库为基础数据，下载完成后使用filedrive-team开源的[go-graphsplit](https://github.com/filedrive-team/go-graphsplit.git) 
进行切割成指定大小的pice文件(建议切成16-32G)，移动到venus-cluster和venus-maket共用的piceStore路径下。

由于下载的目标数据集过于庞大，建议存放在存储服务器上，分批下载数据集；需要使用aws工具进行下载

1、下载aws命令行工具
centos系统:
```shell
yum install -y awscli
```
ubuntu系统:
```shell
apt install -y awscli
```

2、查看数据集大小，并下载文件
```shell
aws s3 ls s3://stpubdata/tess/public/ffi/s0006/2018 --recursive --human-readable --summarize --no-sign-request
```
Total Objects: 23568
Total Size: **1.2 TiB**

开始下载文件到/mnt/nas/venus-data目录下:
```shell
nohup aws s3 sync s3://stpubdata/tess/public/ffi/s0006/2018 /mnt/nas/venus-data/tess/public/ffi/s0006/2018 --no-sign-request 2>&1 > download.log &
```
下载速度根据用户自身的机房出口网络情况而定

#### 编译go-graphsplit用于切pice工具
```bash
git clone https://github.com/filedrive-team/go-graphsplit.git

cd go-graphsplit

# get submodules
git submodule update --init --recursive

# build filecoin-ffi
make ffi

make
```

#### 大数据集下载完成后，开始进行切pice
在pice过程中，通过TMPDIR变量来指定切过程中临时文件存放的路径，默认是在/tmp目录下，如果使用普通的系统盘做为临时数据目录，可能会因为系统盘的IO不足，导致进程报出**Bus error**错误后异常退出。
```shell
TMPDIR=/mnt/nvme01 /root/graphsplit chunk \
--car-dir=/mnt/nas/venus-data/16g-pice-data \
--slice-size=1073741824 \
--parallel=1 \
--graph-name=gs-test \
--calc-commp \
--rename \
--parent-path=/mnt/nas/venus-data/tess/ \
/mnt/nas/venus-data/tess/ >> /root/nas-nas-para15-30.log 2>&1 &
```
注:
--car-dir: 指定切割完成后CAR文件存储的路径；
--slice-size: 指定切割的pice文件大小，以bite为基础单位；1024*1024*1024=1073741824 这个就表示是16G的pice文件
--parallel: 指定并发的数量，值越大消耗的CPU和内存会越高
--calc-commp: 计算commp的值；
--rename: 将car文件自动转换成pice文件

在切割完成后，在--car-dir指定的目录下会有很多pice文件和一个manifest.csv文件；
把pice文件移到venus-market和venus-sector-manager共享的piceStore路径下，manifest.csv文件在slack上发送给[Venus-Ops](https://filecoinproject.slack.com/archives/C028PCH8L31/p1654855478377659?thread_ts=1654852741.258759&cid=C028PCH8L31)
提前告诉Venus-Ops期望DataCap订单的生命周期，默认是生命周期是530天，订单需要在7天内封装完成PreCommitSector消息上链，不然DataCap订单会直接过期；
最后Venus-Ops会使用Datacap地址签名pice文件，并生成对应的消息上链。

#### venus-market查看收到订单状态
当订单的状态为Undefine，就表示此订单等待venus-sector-manager将订单转换成扇区id
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

#### venus-sector-manager配置注意事项
确认配置文件.venus-sector-manager/sector-manager.cfg中的**Enabled和EnableDeals**的值都为**true**，表示开启封装算力和开启接入封装订单任务
```shell
[Miners.Sector]
InitNumber = 1000
MaxNumber = 1000000
Enabled = true
EnableDeals = true
LifetimeDays = 210
```