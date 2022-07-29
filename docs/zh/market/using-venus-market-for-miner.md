## venus-market-v2 miner用户指南

venus-market v2支持两种运行模式
- 作为链服务运行模式
- 作为独立组件运行模式

矿工搭建自己的venus-market只为自己服务, 推荐使用**独立组件**模式, 如果你是一个链服务的提供者, 
需要使用venus-market搭建一个服务面向许多分散的旷工,需要使用链服务模式, 请参考[venus-market for master](./using-venus-market-for-master.md)

### 全局配置
venus-market配置设置,配置文件目录为: `~/.venusmarket/config.toml`

#### 配置API端口监听:
venus-market默认监听端口为本地端口, 所以其它组件与venus-maret不在同一机器, 需要修改API的监听端口:
```yuml
[API]
ListenAddress = "/ip4/0.0.0.0/tcp/41235"
```

#### PieceStorage存储模式
目前`venus-market`支持两种`Piece`数据的存储模式：
- 文件系统模式
- 对象存储服务模式
该配置决定了等待封装的扇区数据的存储位置，建议`Market`和`Sealer`的`PieceStorage`配置为同一个存储路径，这样可以减少不必要的网络传输。

该配置通过配置文件中的`PieceStorage`节来设置，具体参见[Market配置文档](https://github.com/filecoin-project/venus-market/blob/master/docs/zh/venus-market%E9%85%8D%E7%BD%AE%E8%A7%A3%E9%87%8A.md#扇区存储配置)。


#### 配置PublishMsgPeriod等待时间
venus-marke在收到market-client的订单时, 并不会马上就发布`ClientDealProposal`消息,会等待一定的周期, 这个周期是通过配置文件中的`PublishMsgPeriod`项来控制,在测试时可以将此项设置为较小值减少等待时间.下面的设置,将等待时间设置为10秒
```yuml
PublishMsgPeriod = "10s"
```

### 启动market服务
旷工在启动自己的market时, 有两种方案可以选择
- 使用孵化器提供的venus节点 + venus-wallet
- 使用自己的venus全节点

#### 使用venus-wallet作为签名服务
```shell
./venus-market solo-run --node-url=/ip4/192.168.200.19/tcp/3453/ \
  --node-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMS0xMjUiLCJwZXJtIjoic2lnbiIsImV4dCI6IiJ9.JenwgK0JZcxFDin3cyhBUN41VXNvYw-_0UUT2ZOohM0 \
  --wallet-url=/ip4/127.0.0.1/tcp/5678/http \
  --wallet-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.lE180EhNrEu1yGmnVEmT2vySD3UpiUU73kKTYpgQhJ0 \
```
参数说明:
- node-url, 可以为自己的venus节点, 也可以是链服务的venus节点
- node-token 分成两种情况
  1. node-url为自己的节点, `node-token` 直接通过`cat ~/.venus/token`命令获取
  2. node-url为链服务组件的连接地址, `node-token`为`venus-auth`中授权账户的token.从链服务管理员处获取
- wallet-url, wallet的url地址
- wallet-token, 通过venus-wallet的命令查看:
```shell
./venus-wallet auth api-info --perm admin
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.lE180EhNrEu1yGmnVEmT2vySD3UpiUU73kKTYpgQhJ0:/ip4/127.0.0.1/tcp/5678/http
```

#### 使用自己的venus节点

```shell
./venus-market solo-run --node-url=/ip4/192.168.200.21/tcp/3454/ --node-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.OmJkVf10xXip7U0mSvX09gDG806tkFximCOrTxROIPg --miner=t01041:accountName
```

参数说明:
- node-url: venus全节点url
- node-token: market 连接全节点时用于验证的token
- piecestorage: 存储piece的路径,目前fs(文件系统)和oss(阿里云对象存储服务)两种
    - fs模式参数格式为:`fs:/mnt/piece`
    - 对象存储模式参数的格式为:`s3:{access key}:{secret key}:{option token}@{region}host/{bucket}`
- miner:指定旷工ID:账户

:tipping_hand_woman::**此时`node-token`为venus节点的本地token,在venus所在的机器上运行下面的命令来查看**:

```shell
cat ~/.venus/token
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.OmJkVf10xXip7U0mSvX09gDG806tkFximCOrTxROIPg
```

这些参数既可以通过命令指定, 也能通过配置文件中的对应配置项来配置.

如果配置文件完全正确, 则可以直接下面的命令来启动:
```shell
./venus-market solo-run
```

:warning::**独立模式下运行,是将venus节点作为签名服务, 所以在venus节点上需要提供miner的owner私钥**
在venus上导入私钥:

```shell
./venus wallet import private_key 
```

当miner使用venus-market作为代理时,需要将miner的`Multiaddrs`和`PeerID`设置为market的对应地址, 运行以下命令:
- 查看market的节点信息
```shell
./venus-market net listen
/ip4/127.0.0.1/tcp/58418/p2p/12D3KooWQftXTGFBKooKuyaNkugapUzi4VmjxEKTgkpsNCQufKBK
/ip4/192.168.19.67/tcp/58418/p2p/12D3KooWQftXTGFBKooKuyaNkugapUzi4VmjxEKTgkpsNCQufKBK
/ip6/::1/tcp/49770/p2p/12D3KooWQftXTGFBKooKuyaNkugapUzi4VmjxEKTgkpsNCQufKBK
```

- 设置miner的`Multiaddrs`
```shell
./venus-market actor set-addrs --miner=t01041 /ip4/192.168.19.67/tcp/58418/
Requested multiaddrs change in message bafy2bzaceceqgxmiledunzjwbajpghzzn4iibvxhoifsrz4q2grzsirgznzdg
```

- 设置miner的`peerid`:
```shell
 ./venus-market actor set-peer-id --miner=f01041 12D3KooWQftXTGFBKooKuyaNkugapUzi4VmjxEKTgkpsNCQufKBK
  Requested peerid change in message bafy2bzacea4ruzf4hvyezzhjkt6hnzz5tpk7ttuw6jmyoadqasqtujypqitp2
```

- 等待消息在链上执行完成后, 查看命令可以查看miner的相关信息:
```shell
./venus-market actor info --miner t01041
peers: 12D3KooWQftXTGFBKooKuyaNkugapUzi4VmjxEKTgkpsNCQufKBK
addr: /ip4/192.168.19.67/tcp/58418
```

### venus-sealer接入market

#### venus-sealer初始化

```shell
./venus-sealer --network=force init --actor f01051 \
--worker t3qyzbwduolr7xhbwyyojo3sopr573nu43l65aj65zdi7ic3bpv4mbmkefevpdcnjzvr4i4u4x3ihjue3pwccq \
--owner t3qyzbwduolr7xhbwyyojo3sopr573nu43l65aj65zdi7ic3bpv4mbmkefevpdcnjzvr4i4u4x3ihjue3pwccq \
--sector-size 8MiB \
--messager-url /ip4/192.168.200.21/tcp/39812 \
--node-url=/ip4/192.168.200.21/tcp/3454/ \
--gateway-url /ip4/192.168.200.21/tcp/45132 \
--auth-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ \
--market-mode pool \
--market-url /ip4/127.0.0.1/tcp/41235 \
--market-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ \
--no-local-storage
```

参数说明:
- actor 使用已经存在的旷工, 如果要创建新的旷工, 则不要设置此项
- worker, owner 旷工的worker和owner地址
- sector-size 旷工的sector size
- messager-url venus-messager地址
- node-url venus节点的url
- gateway-url gateway组件的url
- auth-token sealer访问链服务各个组件时验证权的token, 参考[token配置](./using-venus-market-for-master.md#token配置)
- market-url venus-market服务的url地址
- market-mode 要接入的market运行模式,`solo`(独立组件模式)或者`pool`(链服务模式)
- market-token 此时分为两个情况
  1. market-mode为`pool`, 此时`market-token`不用填写. 会默认使用`auth-token`覆盖此设置
  2. market-mode为`solo`, 此时`market-token`为venus-market服务的本地token,通过`cat ~/.venusmarket`命令查看.

#### 启动venus-sealer
初始化完毕以后, 各项参数都已经默认写入了配置文件, 所以直接运行:
```shell
./venus-sealer run
```
启动完成后, 需要为其设置seal目录和store目录
设置seal目录:
```shell
./venus-sealer storage attach --init --store /path/store
./venus-sealer storage attach --init --seal /path/seal
```

查看是否成功:
```shell
./venus-sealer storage list
264b51dd-da09-4945-a067-23b452814801:
	[###                                               ] 510.9 GiB/7.218 TiB 6%
	Unsealed: 0; Sealed: 0; Caches: 0; Reserved: 0 B
	Weight: 10; Use: Seal
	Local: /path/seal
	URL: http://127.0.0.1:2345/remote
dda7399c-fee1-4899-a9c0-0ea94d6d9d99:
	[###                                               ] 510.9 GiB/7.218 TiB 6%
	Unsealed: 1; Sealed: 3; Caches: 3; Reserved: 0 B
	Weight: 10; Use: Store
	Local: /path/store
	URL: http://127.0.0.1:2345/remote
```

#### 对于已经初始化过的sealer想要接入market

在venus-sealer的配置文件中修改market相关配置项`MarketNode`:
```yuml
[MarketNode]
  Mode = "solo"
  Url = "/ip4/127.0.0.1/tcp/41235"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFya2V0TG9jYWxUb2tlbiIsInBlcm0iOiJhZG1pbiIsImV4dCI6IiJ9.3Zb06umKhroUKtx60VHOs_lwwLOcRRQBZ9JmRvIl_mI"
```
其中`Token`项的配置也是取决于`Mode`的具体值, 可以参考[venus-sealer初始化](#venus-sealer初始化)中, `market-token`参数的设置方法.

### 使用market为miner挂单
设置挂单信息:
```shell
./venus-market storage-deals set-ask --miner=t01041 --price=0.02fil --verified-price=0.01fil --min-piece-size=512b --max-piece-size=8M
```
查看挂单信息:
```shell
./venus-market storage-deals get-ask --miner=t01041
Price per GiB/Epoch  Verified  Min. Piece Size (padded)  Max. Piece Size (padded)  Expiry (Epoch)  Expiry (Appx. Rem. Time)  Seq. No.
0.02 FIL             0.01 FIL  512 B                     8 MiB                     161256          719h59m0s                 0
```

此时market作为独立组件运行就完成了.

### 使用market-client开始存储订单

#### 启动market-client

启动market-client时需要连接一个venus全节点

```shell
./market-client run \
  --node-url=/ip4/192.168.200.21/tcp/3454 \
  --auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.OmJkVf10xXip7U0mSvX09gDG806tkFximCOrTxROIPg
  --addr=t1pwtw2c74ugrpqdx7xgwxv6wspqli7vnwby6y2hy
```

启动参数说明:
- `node-url`和`auth-token`分别为venus节点的地址和token, 获取token的方式和之前一样,运行命令`cat ~/.venus/token`
- `addr`:存储客户的地址

#### 发起线上订单

1. 导入订单存储文件
```shell
./market-client data import <path>/<filename>
Import 1642491708527303001, Root bafk2bzacedgv2xqys5ja4gycqipmg543ekxz3tjj6wwfexda352n55ahjldja
```

2. 发起询价
```shell
./market-client storage asks query f01041 
Ask: t01041
Price per GiB: 0.02 FIL
Verified Price per GiB: 0.01 FIL
Max Piece size: 8 MiB
Min Piece size: 512 B
```

3. 生成订单任务
```shell
/market-client storage deals init
# 输入需要存储的数据的cid, `./market-client data local`命令查看
Data CID (from lotus client import): bafk2bzacedgv2xqys5ja4gycqipmg543ekxz3tjj6wwfexda352n55ahjldja
.. calculating data size
PieceCid:  baga6ea4seaqpz47j4kqdiixpehmzk3uw5c4cmqvs5iyi7xf7rwkepfhdvowdiai  PayLoadSize: 809 PieceSize: 1024
# 输入数据存储周期
Deal duration (days): 180
Miner Addresses (f0.. f0..), none to find: f01051
.. querying miner asks
-----
Proposing from t16qnfduxzpneb2m3rbdasvhgk7rmmo32zpiypkaq
	Balance: 9499.999999856612207905 FIL
Piece size: 1KiB (Payload size: 809B)
Duration: 4320h0m0s
Total price: ~0.0098876953124352 FIL (0.000000019073486328 FIL per epoch)
Verified: false
# 确认是否接受订单价格
Accept (yes/no): yes
.. executing
Deal (t01051) CID: bafyreihiln2ha6eaaos7kuhwpnvjvjlxmjnpsklym6hhucu2z776bf2or4
```

此时在venus-market的日志中可以看到关于订单的日志,其中有`PublishStorageDeals`消息的cid,可以在节点上查看消息状态:
```shell
2022-01-20T09:44:03.382+0800	INFO	storageadapter	storageprovider/dealpublisher.go:258	add deal with piece CID baga6ea4seaqpz47j4kqdiixpehmzk3uw5c4cmqvs5iyi7xf7rwkepfhdvowdiai to publish deals queue - 1 deals in queue (max queue size 8)
2022-01-20T09:44:03.382+0800	INFO	storageadapter	storageprovider/dealpublisher.go:283	waiting publish deals queue period of 10s before publishing
2022-01-20T09:44:13.385+0800	INFO	storageadapter	storageprovider/dealpublisher.go:298	publish deals queue period of 10s has expired, publishing deals
2022-01-20T09:44:13.475+0800	INFO	storageadapter	storageprovider/dealpublisher.go:386	publishing 1 deals in publish deals queue with piece CIDs: baga6ea4seaqpz47j4kqdiixpehmzk3uw5c4cmqvs5iyi7xf7rwkepfhdvowdiai
2022-01-20T09:44:14.658+0800	WARN	clients	clients/mix_msgclient.go:92	push message bafy2bzaceaeqffghdahk3pgv5mixzwpym4rbo57yidb27l67kwoe36qwsn7pk to daemon
```

4. 查看订单任务

在market-client端查看:
```shell
./market-client storage deals list
DealCid      DealId  Provider  State                          On Chain?  Slashed?  PieceCID     Size    Price                    Duration  Verified
...76bf2or4  0       t01051    StorageDealCheckForAcceptance  N          N         ...dvowdiai  1016 B  0.00992212295525724 FIL  520205    false
  Message: Provider state: StorageDealPublish
```

在market端查看:
```shell
./venus-market storage-deals list
ProposalCid  DealId  State                  Client                                     Provider  Size  Price                     Duration
...76bf2or4  0       StorageDealPublishing  t16qnfduxzpneb2m3rbdasvhgk7rmmo32zpiypkaq  t01051    1KiB  0.00992212295525724 FIL   520205
```

最后等待订单状态变化为`StorageDealAwaitingPreCommit` 就可以进入[封装扇区阶段](#venus-sealer封装扇区)


#### 发起线下订单
1. 导入订单存储文件

```bash
./market-client data import ./README.md
Import 1642643014364955003, Root bafk2bzaceaf4sallirkt63fqrojz5gaut7akiwxrclcsymqelqad7man3hc2c
```

2.转为CAR文件

```bash
./market-client data generate-car ./README.md ./readme.md.car
```

3.计算CAR文件的`CID`和`Piece size`

```shell
./market-client data commP ./readme.md.car
CID:  baga6ea4seaqfewgysi3n3cjylkbfknr56vbemb2gwjfvpctqtjgpdweu7o3d6mq
Piece size:  3.969 KiB
```

4.发起订单

```bash
./market-client storage deals init \
--manual-piece-cid=baga6ea4seaqfewgysi3n3cjylkbfknr56vbemb2gwjfvpctqtjgpdweu7o3d6mq \
--manual-piece-size=4064 \
bafk2bzaceaf4sallirkt63fqrojz5gaut7akiwxrclcsymqelqad7man3hc2c \
f01051 \
0.01fil \
518400
bafyreiecguaxgtmgcanfco6huni4d6h6zs3w3bznermmiurtdos7r6hftm
```

- `manual-piece-cid`: 在第3步计执行`data commP`后输出的`CID`
- `manual-piece-size`: 在第3步执行`data commP`后输出的`Piece size`.需要注意的是, 在使用这个参数时, 这个值需要转换成`byte`的大小, 在这里为3.969kib转换成byte的大小是4064.
之后4个参数分别是:
- 第一步执行`import`命令后输入的`Root`
- 旷工ID
- 协商支付订单的费用`0.01fil`, **这个值必须大于旷工设置的`storage ask`中的最小值, 不然订单会被拒绝掉.
- 合约周期, 必须大于等于180天, 这个值也需要换成epoch为单位, 每个epoch=30秒, 示例中:518400 = 180天.

最后的输出`bafyreidfs2w7lxacq6zpqck7q4zimyitidxyahojf7dbbuz5zr7irdlmqa`为propose的cid.
线上订单一样, 此时可以通过market-client查看deal信息, 订单的最后状态会停止在`StorageDealWaitingForData`

```shell
./market-client storage deals list
DealCid      DealId  Provider  State                          On Chain?        Slashed?  PieceCID     Size       Price                    Duration  Verified  
...s7r6hftm  0       t01051    StorageDealCheckForAcceptance  N                N         ...u7o3d6mq  3.969 KiB  5196.63 FIL              519663    false     
  Message: Provider state: StorageDealWaitingForData
```

:warning:**独此时关注market client的日志, 如果出现下面的内容:**
```shell
2022-01-20T12:47:27.966+0800	ERROR	storagemarket_impl	clientstates/client_states.go:324	deal bafyreif2k2e4acraxk33z3llwo5gqmk32tfrdj2kocjanojbfbf6vj72vm failed: adding market funds failed: estimating gas used: message execution failed: exit SysErrInsufficientFunds(6)
```
说明market client的market余额不足,调用命令`./market-client actor-funds add 100fil`充值后重新执行命令.

5. 导入离线订单的数据文件
需要将之前第2步生成的`.car`文件线下传输到venus-market, 并通过venus-market命令导入数据:
```shell
./venus-market storage-deals import-data bafyreiecguaxgtmgcanfco6huni4d6h6zs3w3bznermmiurtdos7r6hftm ./readme.md.car
```

再次查看状态, 订单状态更新为`StorageDealPublishing`:
```shell
./market-client storage deals list
DealCid      DealId  Provider  State                          On Chain?        Slashed?  PieceCID     Size       Price                    Duration  Verified  
...s7r6hftm  0       t01051    StorageDealCheckForAcceptance  N                N         ...u7o3d6mq  3.969 KiB  5196.63 FIL              519663    false     
Message: Provider state: StorageDealPublishing
```

最后等待订单状态变化为`StorageDealAwaitingPreCommit` 就可以进入[封装扇区阶段](#venus-sealer封装扇区)


#### venus-sealer封装扇区

使用venus-sealer可以查询到这个订单的详细信息。

```bash
./venus-sealer deals list
DealId  PieceCID                                                          PieceSize  Client                                     Provider  StartEpoch  EndEpoch  Price        Verified  Packed  FastRetrieval  Status
36      baga6ea4seaqpz47j4kqdiixpehmzk3uw5c4cmqvs5iyi7xf7rwkepfhdvowdiai  1024       f16qnfduxzpneb2m3rbdasvhgk7rmmo32zpiypkaq  f01051    102947      623152    19073486328  false     false   true           Undefine
```

:tipping_hand_man:venus-sealer等待订单的时间也可以修改为10s，方便测试。

```yaml
  WaitDealsDelay = "10s"
```

封装deal有两种方式

- 直接执行`./venus-sealer sectors deal`将数据封装到一个新的扇区.
```bash
./venus-sealer sectors deal
Assign Deals 36 sector 8 piece baga6ea4seaqpz47j4kqdiixpehmzk3uw5c4cmqvs5iyi7xf7rwkepfhdvowdiai offset 0 length 1024
./sealer sectors list
ID  State          OnChain  Active  Expiration                    Deals  DealWeight
8   PreCommitWait  NO       NO      n/a                           1      [0B]
```

- 使用snapdeal的方式,将现有的cc-sector升级为真实数据的sector.过程如下:
  1. 首先查看sector 信息, 选择一个`State`为`Proving`,`OnChain`状态为`YES`, `Active`为`YES`的sector.
```shell
./venus-sealer sectors list
ID  State              OnChain  Active  Expiration                    Deals  DealWeight
1   Proving            YES      YES     1590156 (in 1 year 23 weeks)  CC
```
  2. 执行命令标记sector为`cc-update`
```shell
./venus-sealer sectors snap-up 9
```
  3. 再次执行`sectors list`查看sector, 此时`state`会标记为`SnapDealsWaitDeals`
  4. 执行`./venus-sealer sectors deal`此时, `venus-sealer`会自动选择状态为`SnapDealsWaitDeals`升级为真实订单的扇区.
  5. 执行命令后, sector的会进入`UpdateReplica`, 生成新的证明参数文件, 进入`ProveReplicaUpdate`状态, 此过程如果使用GPU的情况需要20分钟左右;如果使用2*32核的CPU大概需要1小时20分钟.
  6. 成功完成以后, sector会发送`SubmitReplicaUpdate`消息, 然后等待消息`ReplicaUpdateWait`.

:tipping_hand_man: 提示:**使用snapdeal的升级cc-sector要求机器至少有150G的内存.**

如果一切顺利, deal封装完成, `State`状态为`Proving`

:warning::**venus-market和sealer都有`PieceStorage`的配置项,他们最好指向同一个存储路径。参见[Piecestorage存储模式](#piecestorage存储模式)**

在设置为`Fs`模式下,market和sealer的`Path`配置应该是指向的同一个物理机的同一个路径下.
在测试时,如果没有指向同样的配置, 或者market和sealer不在同一个机器上也没有映射共享目录, sealer会找不到piece文件的.
这种情况需要在开始封装扇区之前将market目录下的对应deal的piece文件拷贝到sealer的piece store目录中.
其中PieceStorage中的Name 属性应该是全局唯一的。
