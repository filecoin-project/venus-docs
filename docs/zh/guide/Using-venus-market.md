## 安装venus-market

下载源代码。

```shell script
$ git clone https://github.com/filecoin-project/venus-market.git
```

编译。

```shell script
$ make deps
$ make
```

:::tip

请使用f3c3eb27b05652b1ba5d463afdf3d78f67982a79或者更高commit号编译。

:::

## 启动venus-market

启动venus-market的provider端。

```bash
$ ./venus-market run \
--node-url /ip4/47.88.31.65/tcp/6666/ws \
--messager-url /ip4/47.88.31.65/tcp/39812/ws \
--auth-token eyJhbGciOiJIUzI1NiIsInCJ9.eyJuYW1lIjoieXotY2J9.oQmfNysESCAOI43Wo2kQ_6sY \
--signer-url /ip4/10.10.11.43/tcp/5678/http \
--signer-token eyJhbGciOiJIUzI1NiIsInCJ9.eyJBbGxvdyI6FkIiwidIl19.lM9FA462FONHN806SlKZw \
--piecestorage fs:/mnt/filestore \
--miner f019411 >> market.log 2>&1 &
```

:::tip 注意1

**signer-url**和**signer-token**都是指向venus-wallet，market的所有消息都是直接通过钱包签名，可以通过如下命令获取。

```bash
$ ./venus-wallet auth api-info --perm sign
eyJhbGciOiJIUzI1NiIsInCJ9.eyJBbGxvdyI6FkIiwidIl19.lM9FA462FONHN806SlKZw:/ip4/0.0.0.0/tcp/5678/http
```

默认venus-wallet只监控本机的5678端口，如果market和wallet不在一台机器上，可以修改如下信息后重启venus-wallet。

```bash
$ cat .venus_wallet/config.toml
[API]
  ListenAddress = "/ip4/0.0.0.0/tcp/5678/http"
```

:::

:::tip 注意2

venus-market默认时间PublishMsgPeriod是1小时，测试时可以改的小一些来减少等待时间，修改配置文件后需重启venus-market。

```bash
$ cat .venusmarket/config.toml 
PublishMsgPeriod = "10s"

$ ./venus-market run >> market.log 2>&1 &
```

:::

设置监听地址。

```bash
$ ./venus-market net listen
/root/.venusmarket
/ip4/10.10.8.16/tcp/58418/p2p/12D3KooWMk8nBpKXgRVBqkw45rc2pvRs9RhAZsFXFQGEqwuStMq
/ip4/127.0.0.1/tcp/58418/p2p/12D3KooWMk8nBpKXgRVBqkw45rc2pvRs9RhAZsFXFQGEqwuStMq
/ip6/::1/tcp/39379/p2p/12D3KooWMk8nBpKXgRVBqkw45rc2pvRs9RhAZsFXFQGEqwuStMq

$ ./venus-market actor set-addrs /ip4/10.10.8.16/tcp/58418

$ ./venus-market actor set-peer-id 12D3KooWMk8nBpKXgRVBqkw45rc2pvRs9RhAZsFXFQGEqwuStMq

$ ./venus-market actor info
/root/.venusmarket
peers: 12D3KooWMk8nBpKXgRVBqkw45rc2pvRs9RhCAZsFXFQGEqwuStMq
addr:
	 /ip4/10.10.8.16/tcp/58418
```

配置venus-sealer，使其能和market交互。

```toml
$ cat .venussealer/config.toml
[Market]
  # venus-market的URL
  Url = "/ip4/127.0.0.1/tcp/41235"
  # venus-market的token
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e......"
```

:::warning

通过`cat .venusmarket/token`获取market的token。

:::

## 启动maket-client

启动venus-market客户端程序`market-client`。

```bash
$ ./market-client run \
--node-url /ip4/47.88.31.65/tcp/6666/ws \
--auth-token eyJhbGciOiJIUzI1NiIsInCJ9.eyJuYW1lIjoieXotY2J9.oQmfNysESCAOI43Wo2kQ_6sY \
--messager-url /ip4/47.88.31.65/tcp/39812/ws \
--signer-url /ip4/10.10.11.43/tcp/5678/http \
--signer-token eyJhbGciOiJIUzI1NiIsInCJ9.eyJBbGxvdyI6FkIiwidIl19.lM9FA462FONHN806SlKZw \
--addr t3v5shsytrnz7ycr7ou4yxq2nf2xm34idnvfgnom6wyru7lrmu2ykuvtte2hq6brk2v3qttrsysvssr42cxt6a >> client.log 2>&1 &
```

## 发起存储订单

导入任意一个文件。

```bash
$ ./market-client import <文件路径>
/root/.marketclient
Import 1634298060645056875, Root bafykbzacedj3oowcc22kt5qmpebil3szmes5c3l64ls2qtmx45ej43dvgylsw
```

生成订单任务

```bash
$ ./market-client deal

/root/.marketclient
Data CID (from lotus client import): 
# 输入CID
bafykbzacedj3oowcc22kt5qmpebil3szmes5c3l64ls2qtmx45ej43dvgylsw
.. calculating data size
PieceCid:  baga6ea4seaqpwx4dldvtojugowvm7ete4rgghsbwvbli37ovaqk7eg4pfrld6nq  PayLoadSize: 302017178 PieceSize: 536870912
# 输入订单日长
Deal duration (days): 190
# 输入矿工号
Miner Addresses (f0.. f0..), none to find: f019411

.. querying miner asks

Proposing from f3v5shsytrnz7ycr7ou4yxq2nf2xm34idnvfgnom6wyru7lrmu2ykuvtte2hq6brk2v3qttrsysvssr42cxt6a
        Balance: 12362.167968899390936035 FIL

Piece size: 512MiB (Payload size: 288MiB)
Duration: 4560h0m0s
Total price: ~0.0001368 FIL (0.00000000025 FIL per epoch)
Verified: false

# 是否接受矿工的价格？
Accept (yes/no): yes
.. executing
Deal (f019411) CID: bafyreifbfpaayuwdd42pxgpql7fqo7bpjdccb7wscqn6tkix6qd5gni6xe
```

此时需要稍等一会，大约6-10分钟，当状态变为StorageDealAwaitingPreCommit时，venus-sealer就可以下发订单的任务了。

```bash
$ ./market-client list-deals
DealCid    DealId   Provider   State   On Chain?    Slashed?   PieceCID  Size      Price     Duration   Verified
...d5gni6xe 33177 f019411 StorageDealAwaitingPreCommit N N  ...pfrld6nq 508 MiB 0.00013739625 FIL 549585 false
```

### 使用venus-sealer将订单任务下发

使用venus-sealer可以查询到这个订单的详细信息。

```bash
$ ./venus-sealer deals list
DealId  PieceCID  PieceSize  Client Provider StartEpoch  EndEpoch  Price Verified  Packed  FastRetrieval  Status
33177 baga6ea4seaqpwx4dldvtojugowvm7ete4rgghsbwvbli37ovaqk7eg4pfrld6nq  536870912  f3v5shsytrnz7ycr7ou4yxq2nf2xm34idnvfgnom6wyru7lrmu2ykuvtte2hq6brk2v3qttrsysvssr42cxt6a  f019411   375049      924634    250000000  false     false   true           Undefine
```

:::tip

venus-sealer等待订单的时间也可以修改为10s，方便测试。

```bash
$ cat .venussealer/config.toml
  WaitDealsDelay = "10s"
```

:::

使用`venus-sealer sectors deal`命令下发deal订单，然后使用./venus-sealer sectors list可以查看一个新的任务。

```bash
$ ./venus-sealer sectors deal

$ ./venus-sealer sectors list
454  Packing  NO       NO      n/a                           1

# 完成后状态变为
454  Proving     YES      NO      957273 (in 30 weeks 3 hours)  1      116MiB
```





