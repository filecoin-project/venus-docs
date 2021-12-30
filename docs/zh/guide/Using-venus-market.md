##  使用 venus-market
## 构建venus-market
版本选择:
- venus-market用作独立组件(第一版): master/incubation分支或最近的v1.0.1;
- venus-market用作服务组件(第二版): feat/multi_miner分支.
```shell script
$ git clone https://github.com/filecoin-project/venus-market.git
# 切换到对应分支，如：incubation
$ git checkout -b incubation origin/incubation
# 可选：编译filecoin-ffi
$ make deps
$ make
```

## 启动venus-market服务
### venu-market全局配置
venus-market配置设置,配置文件目录为: `~/.venusmarket/config.toml`

#### 配置API端口监听:
venus-market默认监听端口为本地端口, 所以其它组件与venus-maret不在同一机器, 需要修改API的监听端口:

```yuml
[API]
ListenAddress = "/ip4/0.0.0.0/tcp/41235"
```

##### PieceStorage存储模式:
目前venus-market支持两种Piece数据的存储模式:文件系统模式和对象存储服务模式,通过配置文件中的`PieceStorage`节来设置

```yuml
[PieceStorage]
  [PieceStorage.Fs]
    Enable = false
    Path = ""
  [PieceStorage.S3]
    Enable = true
    EndPoint = "http://oss-cn-shanghai.aliyuncs.com/venus-market-test"
    AccessKey = "LTAI5t6HiFgsqN6eVJ......"
    SecretKey = "AlFNH9NakUsVjVRxMHaaYP7p......"
    Token = ""
```
#### 配置PublishMsgPeriod等待时间

venus-marke在收到market-client的订单时, 并不会马上就发布`ClientDealProposal`消息,会等待一定的周期, 这个周期是通过配置文件中的`PublishMsgPeriod`项来控制,在测试时可以将此项设置为较小值减少等待时间.下面的设置,将等待时间设置为10秒
```yuml
PublishMsgPeriod = "10s"
```

**目前venus-market有3种工作模式, 分别为作为**

- 独立组件方式
-  使用venus-wallet作为签名服务来启动
-  作为云服务组件方式

### venus-market作为独立组件启动

启动venus-market实例 作为独立组件方式启动时,只需要依赖venus全节点, 使用下面的命令启动:
```shell
./venus-market run \
  --node-url=/ip4/192.168.200.24/tcp/3453/ \
  --auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.YpkOx71toFNLBNFiu5wItMxFgAG7awj_Wwws51QHZww
  --miner=t01006:alias
```

注意:
- 此时`auth-token`应该为venus节点的的本地token, 可通过在venus运行的主机上运行`cat ~/.venus/token`命令获取.
- makret作为独立组件启动时,需要设置storage provider旷工地址,可以在启动时通过命令行参数`--miner=t01006:alias`或者在配置文件中增加`[[StorageMiners]]`项来设置
	```yuml
	[[StorageMiners]]
  Addr = "t01006"
  Account = "miner-01"
	[[StorageMiners]]
  Addr = "t01007"
  Account = "miner-02"
	```
	当venus-market作为独立组件启动时,需要在其连接中venus全节点的的wallet中添加旷工owner的私钥.
### venus-market + venus-wallet作为签名服务启动

此时market的所有消息都是通过venus-wallet提供的签名服务来签名,需要为venus-market设置远程wallet的相关配置,可以通过两种方法来设置:
- 通过配置文件
	```yuml
	[Signer]
  Type = "wallet"
  Url = "/ip4/10.10.11.43/tcp/5678/http"
  Token = "eyJhbGciOiJIUzI1NiIsInCJ9.eyJBbGxvdyI6FkIiwidIl19.lM9FA462FONHN806SlKZw"
	```
- 通过启动时在启动命令中设置flag项:
  ```shell
  ./venus-market run \
  --node-url=/ip4/192.168.200.24/tcp/3453/ \
  --auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... \
  --signer-url /ip4/10.10.11.43/tcp/5678/http \
  --signer-token eyJhbGciOiJIUzI1NiIsInCJ9.eyJBbGxvdyI6FkIiwidIl19.lM9FA462FONHN806SlKZw \
  --signer-type wallet \
  --miner t01006:alias
  ```
  如果在配置文件中已经配置了`Signer`项,就可以不用在命令行参数中指定了.
  

**提示:**
`signer-token`为venus-wallet的token,通过下面的命令生成:

```shell
./venus-wallet auth api-info --perm sign 
eyJhbGciOiJIUzI1NiIsInCJ9.eyJBbGxvdyI6FkIiwidIl19.lM9FA462FONHN806SlKZw:/ip4/0.0.0.0/tcp/5678/http
```

### venus-market作为云服务组件来启动

venus-market作为云服务组件来启动时,需要配置
- venus全节点, 对应命令行的`node-url`, `auth-token`和配置中的`[Node]`项
- venus-messager组件服务,对应命令行`messager-url`, `auth-token`和配置中的`[Messager]`项
- venus-auth组件服务,对应命令行`auth-url`, `auth-token`和配置中的`[AuthNode]`项
- venus-gateway组件服务(作为签名服务),对应命令行`signer-url`, `signer-token`,`signer-type=gateway`和配置中的`[Signer]`项

#### 相关token配置

`auth-token`项,是从venus-auth服务上获取,用于验证venus-market访问venus,venus-messager的访问权限.可以使用已经存在的token, 或者创建新的token.

- 查看venus-auth已授权token:
```shell
./venus-auth token list
num	name		perm		createTime		token
1	200-22		sign	2021-11-11 17:31:46	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjAwLTIyIiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.15iGGy1YOr02GOjCNV7PDnO6D5gw1DJi6l16I1UwHAg
2	200-27		sign	2021-11-09 03:18:46	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjAwLTI3IiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.un57v1L1_6gwFrJEdrGuFJ5HnSD4DbhH59EAMIJMu18
```
- 创建新token
```shell
./venus-auth token gen token-02 --perm admin
generate token success: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9rZW4tMDIiLCJwZXJtIjoicmVhZCIsImV4dCI6IiJ9.hgFSVZmWlqsf_H10bs7iTp7iNLh5uc3ItLsAAq3_EBc
```

#### 命令行指定参数启动

```shell
./venus-market run \
--node-url=/ip4/192.168.200.24/tcp/3453/ \
--auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.8Dm1D7mnX4-kp2ORuPpff1-5U6f_BoiAB0Xi5p6uMQ4 \
--signer-url=/ip4/192.168.200.24/tcp/45132/http \
--signer-type=gateway \
--messager-url=/ip4/192.168.200.24/tcp/39812/http \
--auth-url=http://192.168.200.24:8989
```

#### 通过配置文件指定参数启动

修改配置文件后
```yuml
[Node]
  Url = "/ip4/192.168.200.24/tcp/3453/"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWFya2V0LWNsaWVudCIsInBlcm0iOiJzaWduIiwiZXh0IjoiIn0.8lSYccRSO-nZuAoH--1s2HG11HUxSvRLDWdpvXkdV-4"
[Messager]
  Url = "/ip4/192.168.200.24/tcp/39812/http"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWFya2V0LWNsaWVudCIsInBlcm0iOiJzaWduIiwiZXh0IjoiIn0.8lSYccRSO-nZuAoH--1s2HG11HUxSvRLDWdpvXkdV-4"
[Signer]
  Type = "gateway"
  Url = "/ip4/192.168.200.24/tcp/45132/http"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.Z8eqEfmVmlk7wvCWJ_0bgyuQSk6Nhx8gmLir4nQvAF0"
[AuthNode]
  Url = "http://192.168.200.24:8989"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibWFya2V0LWNsaWVudCIsInBlcm0iOiJzaWduIiwiZXh0IjoiIn0.8lSYccRSO-nZuAoH--1s2HG11HUxSvRLDWdpvXkdV-4"
```
:tipping_hand_woman:**:对于market作为云服务组件启动的情况,所有请求权限的验证都是通过venu-auth来进行,所以只需要配置`auth-token`就可以了.**

执行命令:

```shell
./venus-market run
```
## 启动venus-sealer
在启动venus-sealer时,根据venu-market的启动模式(独立组件/云服务组件),venus-sealer中对于venus-market的配置有所区别.
- venus-market作为独立组件启动的情况,配置项为:
```yuml
[MarketNode]
  Mode = "solo"
  Url = "/ip4/192.168.200.24/tcp/41235"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFya2V0TG9jYWxUb2tlbiIsInBlcm0iOiJhZG1pbiIsImV4dCI6IiJ9.2ALeThV4x_eqwsceOoRTAaOL6AkXmfP7DJj4D3LSkc0"
```
​	此时`Token`项为venus-market的本地token,在venus-market的主机上运行命令获取:
```shell
cat ~/.venusmarket/token
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiTWFya2V0TG9jYWxUb2tlbiIsInBlcm0iOiJhZG1pbiIsImV4dCI6IiJ9.2ALeThV4x_eqwsceOoRTAaOL6AkXmfP7DJj4D3LSkc0
```
- venus-market作为云服务组件运行的情况, 配置项为:
```shell
[RegisterMarket]
  Urls = ["/ip4/192.168.200.24/tcp/41235"]
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```
`Token`项为venus-auth中授权访问集群的token, 获取方式请参考[相关token配置](#相关token配置)

  启动sealer:

```shell
./venus-sealer run
```
如果sealer连接venus-market成功, 在venus-market的输出中可以看到下面的输出:
```shell
2021-12-09T13:37:28.405+0800	INFO	market_stream	marketevent/market_event.go:72	add new connections a35bf1d7-0772-4051-8b04-ac7c371a1ea2 for miner t01006
```
## venus-market设置storage provider 监听地址
1. 查看market监听地址
```shell
./venus-market net listen
/ip4/192.168.200.24/tcp/58418/p2p/12D3KooWA9Su6TbZDQ4vBTy5WsxbegyW6K6gidBCTp7voSTqXjqp
/ip4/127.0.0.1/tcp/58418/p2p/12D3KooWA9Su6TbZDQ4vBTy5WsxbegyW6K6gidBCTp7voSTqXjqp
/ip6/::1/tcp/34159/p2p/12D3KooWA9Su6TbZDQ4vBTy5WsxbegyW6K6gidBCTp7voSTqXjqp
```
2. 查看要设置的storage provider
```shell
./venus-market actor list
miner                                                                                   account
t01006                                                                                  miner-01
t3s4rddnwwaafkeplebzv2ahz2nlmknbwis2vqln5puhtcnjmcj4imwdhnx273mhr37iwt7gqfu6npqsxgpz2a  miner-01
t3wwgqnxk4hagorptdlgnwcy6q66pd2tc5dcqwo4aa5xbgkm5jmudyjohebvoubvbofhpvdstvkfk3qa5vjg2a  miner-01
```
3. 设置`t01006`的存储服务监听地址和peerid为market
```shell
#设置监听地址
/venus-market actor set-addrs --miner=t01006 /ip4/192.168.200.24/tcp/58418
Requested multiaddrs change in message bafk4bzacia6dbj4qhgoo2vrsamjrwsfbpan5ptli2qcoalv5zllkbost2sfcqsrmjwk6kzgww7vh436jat2c4eyreuzltvaifslxv5pahaxhrd44
#设置peerid
./venus-market actor set-peer-id --miner=t01006 12D3KooWA9Su6TbZDQ4vBTy5WsxbegyW6K6gidBCTp7voSTqXjqp
/root/.venusmarket
Requested peerid change in message bafk4bzacicvr4rzpuehj57b72zyarxbpex4nmqxtmzed7gxkymle4zbyr3avqoyefwh46cnsiy5tfjzsndaepngnqjiixubxsuryhiw5kwc2k3up
```
等到消息都执行成功后,`t01006`的provider监听地址就修改成功了.
4. 查看`t01006`的storage provider监听地址:
```shell
./venus-market actor info --miner=t01006
peers: 12D3KooWPDik7S2a5YQ4SjUGBaHd3WNaB3fWpZVXXGoH9G5iw6T5
addr: /ip4/192.168.200.24/tcp/58418
```

## venus-market为storage provider挂单

```bash
# 给矿工`t01006`挂单
./venus-market storage-deals set-ask --miner=t01006 --price=0.01fil --verified-price=0.01fil --min-piece-size=512b --max-piece-size=8M --miner=t01006
# 查询矿工`t01006`的挂单列表
./venus-market storage-deals get-ask --miner=t01006
Price per GiB/Epoch  Verified  Min. Piece Size (padded)  Max. Piece Size (padded)  Expiry (Epoch)  Expiry (Appx. Rem. Time)  Seq. No.
0.01 FIL             0.01 FIL  512 B                     8 MiB                     172613          720h0m0s                  0
```

## 使用market-client开始存储订单
### 启动market-client服务
market-client是用于给存储客户和检索用户发单的工具.
有两种使用方式来使用
- 连接有签名钱包的lotus/venus节点
- 通过venus云组件来接入使用
#### 连接有签名私钥的lotus/venus节点

```bash
./market-client run \
--node-url=/ip4/192.168.200.24/tcp/3453 \
--auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjAwLTIyIiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.15iGGy1YOr02GOjCNV7PDnO6D5gw1DJi6l16I1UwHAg
--addr=t1pwtw2c74ugrpqdx7xgwxv6wspqli7vnwby6y2hy
```

启动参数说明:

- `node-url`和`auth-token`请参考[venus-market作为独立组件启动](#venus-market作为独立组件启动)

- `addr`:存储客户的地址

#### 连接venus云服务

```bash
./market-client run \
--node-url=/ip4/192.168.200.24/tcp/3453/ \
--auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiMjAwLTIyIiwicGVybSI6InNpZ24iLCJleHQiOiIifQ.15iGGy1YOr02GOjCNV7PDnO6D5gw1DJi6l16I1UwHAg \
--signer-url=/ip4/192.168.200.24/tcp/45132/http \
--messager-url=/ip4/192.168.200.24/tcp/39812/http \
--signer-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.Z8eqEfmVmlk7wvCWJ_0bgyuQSk6Nhx8gmLir4nQvAF0 \
--addr=t1pwtw2c74ugrpqdx7xgwxv6wspqli7vnwby6y2hy
```

启动参数说明:

- `node-url`,`messager-url`,`auth-token`,`signer-url`,`signer-tokend`等配置请参考[venus-market作为云服务组件来启动](#venus-market作为云服务组件来启动)
- `addr`:存储客户地址

### 发起线上存储订单

导入任意一个文件。

```bash
$ ./market-client import <文件路径>
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

### 发起线下存储订单

1.导入数据

```bash
./market-client import offline.txt 
Import 1637565204342417963, Root bafkqatdinewca2lqmzzscijbbjxwmztmnfxgkcqkpr6hyctpnm7quctgmvuwg2dbnztsbsvhyog4fi6cuhbkhqvbykr4fiikmrthgzqkbjusaylneb3gk4tzebsgczak
```

2.转为CAR文件

```bash
 ./market-client generate-car offline offline.car
```

3.计算CAR文件的`CID`和`Piece size`

```bash
./market-client commP offline.car
CID:  baga6ea4seaqilvbx5t3rmekkvnbg22srnisjlp7wbg4f76v5ylgaszszsvb3wkq
Piece size:  508 B
```

4.发起订单

```bash
./market-client deal \
--manual-piece-cid=baga6ea4seaqilvbx5t3rmekkvnbg22srnisjlp7wbg4f76v5ylgaszszsvb3wkq \
--manual-piece-size=508 \
bafkqatdinewca2lqmzzscijbbjxwmztmnfxgkcqkpr6hyctpnm7quctgmvuwg2dbnztsbsvhyog4fi6cuhbkhqvbykr4fiikmrthgzqkbjusaylneb3gk4tzebsgczak \
t01006 \
0.0000000000000005 \
518400
bafyreihcf6giplyljkqkg2vzfpfdixl47ithjqjqwyhimj66z4d7tz3rva
```

- `manual-piece-cid`: 上述第3步生成的CID;
- `manual-piece-size`: 上述第3步生成的Piece size;
- 紧接着4个参数: 文件根Root,矿工号,协商支付的fil(需要除以10^18次方,如0.0000000000000005标识此订单支付500fil),过期间隔(
  及现在到合约到期之间的出块数,最小518400,即6个月).
- 这个命令执行成功会打印ProposalCid,接着发送提议订单消息到链上,消息确认(大概几分钟)后就可以在venus-market上查询到:

```bash
 ./venus-market storage-deals list --miner t01006 --verbose
Creation         Verified  ProposalCid                                                  DealId  State                      Client                                                                                  Size    Price                     Duration  T
Nov 25 16:27:58  false     bafyreihcf6giplyljkqkg2vzfpfdixl47ithjqjqwyhimj66z4d7tz3rva  0       StorageDealWaitingForData  t3u42kmjnixunzm55qqcf3m5hlvqitaysukthfa27it5ahqxxi53x2hs2d4sikh7s2f7jn6ubu4k6nvwdpgfaq  512B    0.000000000261453 FIL     522906
```

5.将CAR文件线下传给venus-market,venus-market导入数据

```bash
./venus-market storage-deals import-data bafyreihcf6giplyljkqkg2vzfpfdixl47ithjqjqwyhimj66z4d7tz3rva /mnt/piece/offline.car
```

这个命令执行成功后会在venus-market的repo下生成临时文件,订单确认后(即订单状态为StorageDealAwaitingPreCommit,大概需要几分钟)
会在设置的piece目录下生成文件名为Piece CID的文件,如果venus-sealer没有使用挂载,需要手动将此文件拷贝到venus-sealer设置的piece目录.

### venus-sealer拉取订单并开始密封扇区

使用venus-sealer可以查询到这个订单的详细信息。

```bash
$ ./venus-sealer deals list
DealId  PieceCID  PieceSize  Client Provider StartEpoch  EndEpoch  Price Verified  Packed  FastRetrieval  Status
33177 baga6ea4seaqpwx4dldvtojugowvm7ete4rgghsbwvbli37ovaqk7eg4pfrld6nq  536870912  f3v5shsytrnz7ycr7ou4yxq2nf2xm34idnvfgnom6wyru7lrmu2ykuvtte2hq6brk2v3qttrsysvssr42cxt6a  f019411   375049      924634    250000000  false     false   true           Undefine
```

:tipping_hand_man:venus-sealer等待订单的时间也可以修改为10s，方便测试。

```shell
$ cat .venussealer/config.toml
  WaitDealsDelay = "10s"
```

:tipping_hand_man:使用`venus-sealer sectors deal`命令下发deal订单，然后使用./venus-sealer sectors list可以查看一个新的任务。

```bash
$ ./venus-sealer sectors deal
$ ./venus-sealer sectors list
454  Packing  NO       NO      n/a                           1
# 完成后状态变为
454  Proving     YES      NO      957273 (in 30 weeks 3 hours)  1      116MiB
```





