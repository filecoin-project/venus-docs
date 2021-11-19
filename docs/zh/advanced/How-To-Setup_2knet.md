# 如何启动测试网络

> 本文以在 Ubuntu 系统部署2k网络为例

:::warning

目前在 CentOS 系统存在问题, 具体请参考：[issue](https://github.com/filecoin-project/lotus/issues/7136)

:::


## 服务组件搭建

&ensp;&ensp; 组件下载及编译请参考文档：https://venus.filecoin.io/guide/How-To-Deploy-MingPool.html#pre-requisites

### venus-auth
```bash
$ nohup ./venus-auth run > auth.log 2>&1 &

# token列表
$ ./venus-auth token list
 
# user列表
$ ./venus-auth user list
```

### venus-gateway

```bash
$ nohup ./venus-gateway --listen=/ip4/0.0.0.0/tcp/45132 run --auth-url=http://127.0.0.1:8989 > gateway.log 2>&1 &

# wallet列表
$ ./venus-gateway  wallet list
 
# miner列表
$ ./venus-gateway  miner list
```

日志
```
2021-09-27T11:05:26.736+0800    INFO    main    venus-gateway/main.go:95        venus-gateway current version 1.1.1'+git770f19a', listen /ip4/0.0.0.0/tcp/45032
2021-09-27T11:05:26.736+0800    INFO    event_stream    walletevent/wallet_event.go:51          {"rand secret": "IkR/US2MFJr1g53mucqPep0GQZ8DzC780QDJIm48yV8="}
2021-09-27T11:05:26.736+0800    INFO    main    venus-gateway/main.go:104       Setting up control endpoint at /ip4/0.0.0.0/tcp/45032
```

### venus

- 生成预密封文件和数据
```bash
$ ./venus seed pre-seal --sector-size 2048 --num-sectors 2
$ ./venus seed genesis new localnet.json
$ ./venus seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json
```
> `seed pre-seal` 需要root权限,请在root用户下执行

- 启动venus
```sh
$ nohup ./venus daemon --make-genesis=devgen.car --genesis-template=localnet.json --network=2k --auth-url=http://127.0.0.1:8989 > venus.log 2>&1 &
```
> venus作为公共服务组件需要监听不同IP时需要修改配置文件 `.venus/config.json`
```bash
"apiAddress": "/ip4/0.0.0.0/tcp/3453",
```

此时全网只有创世区块
```
$ ./venus chain head
{
        "Height": 0,
        "ParentWeight": "0",
        "Cids": [
                {
                        "/": "bafy2bzacedq52xonfsuaf6o66tkpaavkjwg43cs63weekhzz76wps4ih22lww"
                }
        ],
        "Timestamp": "2021-09-27 11:10:53"
}
```

### venus-message

&ensp;&ensp; venus-auth管理着其他venus模块使用的jwt令牌，以便它们在网络上安全地相互通信.为共享模块生成token。

```bash
# --perm specifies admin, sign, wirte or read permission of the token generated
$ ./venus-auth token gen --perm admin <SHARED>
<SHARED_ADMIN_AUTH_TOKEN>
```
> SHARED是token名，共享组件可以随便起。

- 为矿工t01000和wallet生成token
```bash
$ ./venus-auth user add --name=test --miner=t01000
$ ./venus-auth token gen --perm write test
<USER_WRITE_AUTH_TOKEN>
```

查询token及user
```bash
$ ./venus-auth user list
number: 1
name: test
miner: f01000
sourceType: 0   // miner:1
state 0         // 0: disable, 1: enable
comment: 
createTime: Thu, 05 Aug 2021 09:36:00 CST
updateTime: Thu, 05 Aug 2021 09:36:00 CST

$ ./venus-auth token list
num     name            perm            createTime              token
1       share-test      admin   2021-08-05 09:27:56     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoic2hhcmUtdGVzdCIsInBlcm0iOiJhZG1pbiIsImV4dCI6IiJ9.q3Euz4CwlqlLCTUciT4gkee6au_zhhyUAkyTXlkG51E
2       test            write   2021-08-05 09:36:44     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsInBlcm0iOiJ3cml0ZSIsImV4dCI6IiJ9.X8L5SWVzoRpr5X5hEOAh17n22zOgfkla7POva0zCihY
```

```bash
nohup ./venus-messager run \
--auth-url=http://127.0.0.1:8989 \
--node-url=/ip4/127.0.0.1/tcp/3453 \
--gateway-url=/ip4/127.0.0.1/tcp/45132 \
--auth-token=<SHARED_ADMIN_AUTH_TOKEN> \
--db-type=sqlite \
> msg.log 2>&1 &
```
> db-type还支持mysql，配置如下：
```bash
--db-type=mysql --mysql-dsn "<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_messager?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s"
```

2k网络4s出一个块，故需修改配置文件的WaitingChainHeadStableDuration为2s。
```
# 默认是8s
[messageService]
  WaitingChainHeadStableDuration = "2s"
```


### venus-miner
```bash
# init miner repo
./venus-miner init --nettype=2k --auth-api=http://127.0.0.1:8989 \
 --gateway-api=/ip4/127.0.0.1/tcp/45132 \
 --api=/ip4/127.0.0.1/tcp/3453 --token=<SHARED_ADMIN_AUTH_TOKEN> \
 --slash-filter local
```

&ensp;&ensp; 此时没有启动venus-sealer,所以无法出块,因为获得出块权后需要计算证明，这个是venus-sealer负责的(管理所有的扇区永久存储),故暂时不启动venus-miner。


## 创世节点

### venus-wallet

```sh
$ nohup ./venus-wallet run > wallet.log 2>&1 &

# 设置密码
$ ./venus-wallet setpwd
Password:******
Enter Password again:******

# 导入钱包
$ ./venus-wallet import ~/.genesis-sectors/pre-seal-t01000.key

# 查询
$ ./venus-wallet list
t3sjhgun7xcklmyga6x3c5sq6pbncdlmrjmepfz7ms4fuqimtk4fida37dhq7kpq3tn7nyu5hpnn7mtp3a7lia
```

设置接入venus-gateway，提供签名服务,这一步很重要,否则出块,消息等都没法签名,业务无法正常运行.
```bash
# 修改`~/.venus_wallet/config.toml`
[APIRegisterHub]
RegisterAPI = ["/ip4/127.0.0.1/tcp/45132"]
Token = "<USER_WRITE_AUTH_TOKEN>"
# 矿工集群的别名，在venus-auth中注册
SupportAccounts = ["test"]
```
***保存后重启venus-wallet,需要unlock***
```bash
$ ./venus-wallet unlock
```

查看是否成功,在venus-gateway的日志中查询:
```bash
2021-08-05T10:01:07.665+0800    INFO    event_stream    walletevent/wallet_conn_mgr.go:89       add wallet connection   {"channel": "58309445-87da-4160-831a-44e5236ab3c7", "walletName": "test", "addrs": ["t3sjhgun7xcklmyga6x3c5sq6pbncdlmrjmepfz7ms4fuqimtk4fida37dhq7kpq3tn7nyu5hpnn7mtp3a7lia"], "support": {"test":{}}, "signBytes": "6VzoKBejPzmFp/DvJzSO16s5SziYZKYjU2l2EkDUKy0="}
2021-08-05T10:01:07.666+0800    INFO    event_stream    walletevent/wallet_event.go:79  add new connections test 58309445-87da-4160-831a-44e5236ab3c7
```
或用命令查询
```bash
$ ./venus-gateway wallet list
[
        {
                "Account": "test",
                "SupportAccounts": [
                        "test"
                ],
                "ConnectStates": [
                        {
                                "Addrs": [
                                        "t3sjhgun7xcklmyga6x3c5sq6pbncdlmrjmepfz7ms4fuqimtk4fida37dhq7kpq3tn7nyu5hpnn7mtp3a7lia"
                                ],
                                "ChannelId": "58309445-87da-4160-831a-44e5236ab3c7",
                                "Ip": "127.0.0.1:45138",
                                "RequestCount": 0,
                                "CreateTime": "2021-08-05T10:01:06.261321253+08:00"
                        }
                ]
        }
 ]
```
> 上面日志即表示wallet注册服务组件成功,可提供签名服务.


### venus-sealer

- 初始化
```bash
$ ./venus-sealer --network=2k init --genesis-miner --actor=t01000 --sector-size=2048 --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync \
--node-url=/ip4/127.0.0.1/tcp/3453 \
--messager-url=/ip4/127.0.0.1/tcp/39812 \
--gateway-url=/ip4/127.0.0.1/tcp/45132 \
--auth-token=<USER_WRITE_AUTH_TOKEN>
--no-local-storage
```
   
- 启动
```bash
$  TMPDIR=<SPECIFIC_PATH> nohup ./venus-sealer --network=2k run --nosync > sealer.log 2>&1 &

$ ./venus-sealer info
Chain: [sync behind! (15h45m53s behind)] [basefee 100 pFIL]
Sealer: t01000 (2 KiB sectors)
Power: 40 Ki / 40 Ki (100.0000%)
        Raw: 4 KiB / 4 KiB (100.0000%)
        Committed: 4 KiB
        Proving: 4 KiB
Projected average block win rate: 20024.16/week (every 30s)
Projected block win with 99.9% probability every 41s
(projections DO NOT account for future network and miner growth)

Sealer Balance:    3.242 μFIL
      PreCommit:  0
      Pledge:     1.192 μFIL
      Vesting:    0
      Available:  2.05 μFIL
Market Balance:   0
       Locked:    0
       Available: 0
Worker Balance:   50000000 FIL
Total Spendable:  50000000 FIL

Sectors:
        Total: 2
        Proving: 2
```

查看是不是在服务组件注册成功,gateway日志:
```bash
2021-09-27T14:06:13.135+0800    INFO    proof_stream    proofevent/proof_event.go:71    add new connections 6295d403-275b-430e-a008-1b7491522d86 for miner t01000
```
或
```
$ ./venus-gateway miner list
t01000
```

- 开始出块
&ensp;&ensp; 这个时候我们就可以启动venus-miner了
```
# run 
nohup ./venus-miner run --nettype=2k --nosync > miner.log 2>& 1 &
```

启动时会从venus-auth请求当前已加入venus分布式矿池中的miner列表,可以根据命令查询:
```
$ ./venus-miner address state
[
        {
                "Addr": "f01000",
                "IsMining": true,
                "Err": nil,
        }
]
```

在venus-miner的运行过程中可以暂停或继续某个miner_id的出块:
```
./venus-miner address stop/start f01000
```

查看venus-miner日志
```
2021-08-05T12:04:28.562+0800    INFO    miner   miner/minerwpp.go:88    GenerateWinningPoSt took 3.202841ms
2021-08-05T12:04:28.562+0800    INFO    miner   miner/warmup.go:94      winning PoSt warmup successful  {"took": 0.00494326}
2021-08-05T12:04:28.695+0800    INFO    miner   miner/multiminer.go:592 attempting to mine a block      {"tipset": ["bafy2bzacebmqknjl3nzdqsfalfe57u6nzzg5c5uphf3ctm4p2gvdgg33lhels"], "miner": "t01000"}
2021-08-05T12:04:28.699+0800    INFO    miner   miner/multiminer.go:628 Time delta between now and our mining base: 61560s (nulls: 0), miner: t01000
2021-08-05T12:04:28.705+0800    INFO    miner   miner/minerwpp.go:72    Computing WinningPoSt ;[{SealProof:5 SectorNumber:0 SealedCID:bagboea4b5abcbicxvd7mvaigrtsinxy33tjgg6yu24brzazyfwrtoe4ca7efhkav}]; [46 110 203 67 43 156 84 228 212 143 45 167 11 151 84 34 99 202 39 85 145 136 126 180 78 134 159 125 210 112 219 223]
2021-08-05T12:04:28.707+0800    INFO    miner   miner/minerwpp.go:88    GenerateWinningPoSt took 1.802124ms
2021-08-05T12:04:28.707+0800    INFO    miner   miner/multiminer.go:704 mined new block ( -> Proof)     {"took": 0.012012063, "miner": "t01000"}
2021-08-05T12:04:28.707+0800    INFO    miner   miner/multiminer.go:385 mining compute end      {"number of wins": 1, "total miner": 1}
2021-08-05T12:04:28.707+0800    INFO    miner   miner/multiminer.go:394 select message  {"tickets": 1}
2021-08-05T12:04:28.715+0800    INFO    miner   miner/multiminer.go:420 mined new block {"cid": "bafy2bzacedyy2xr3bvsyfd42qzpeiprojza2yyt7wdggeawj2cmtisfjnn4lo", "height": "1", "miner": "t01000", "parents": ["t00"], "took": 0.020098632}
```

至此公共组件和创世节点搭建已经完成。
```
$ ./venus chain ls
2: (2021-08-05 14:09:55) [ bafy2bzacect5pja2prfkugczbdv2jfpbou4qr3edxxr6g7oo5bny6qklzgama: t01000, ]
3: (2021-08-05 14:09:59) [ bafy2bzacedsl7eyaaiu7oifsdy6zpj2zotbcsnuml45hu5n4erdhygiyeua6s: t01000, ]
4: (2021-08-05 14:10:03) [ bafy2bzacea42xioz3ki33uw7bbjkc5ydt4qs2j55ku2aqy2box4wjcgmzxtny: t01000, ]
5: (2021-08-05 14:10:07) [ bafy2bzacecbmetsiwgms7sbukkkgzstpie5wsdwqsw5hwjqt6eqkuaq23wugs: t01000, ]
6: (2021-08-05 14:10:11) [ bafy2bzacea3ojun5fx2rpplsnevvedhgxgpvwy7afmubcvhf463hdhlfpw4ye: t01000, ]
7: (2021-08-05 14:10:15) [ bafy2bzaced4jqw2p5cejdtlfi7cq4o2treiynkp2lnhfpyss352qlbcdtknti: t01000, ]
8: (2021-08-05 14:10:19) [ bafy2bzacecpmmlobk6qrzoclzu2duy6t4irvnqryyq4libvrlh4ekz3lmihhm: t01000, ]
9: (2021-08-05 14:10:23) [ bafy2bzaceadvy5inclxdbtd2hsd72mijarkzz3rwpzznisf2yhlghushlooeg: t01000, ]
10: (2021-08-05 14:10:27) [ bafy2bzacea3rn3zuiqgp5kxbam3fc3dqnoccktpsfwaukko3amxerpjud2zns: t01000, ]
11: (2021-08-05 14:10:31) [ bafy2bzaceay2tzyd45k3e7tisbbp47gkjsrqs23jgl64wkj6jqryk4grrr7ss: t01000, ]
```

## 普通节点

&ensp;&ensp; 普通节点和其他网络接入共享组件流程一致,可参考文档: https://venus.filecoin.io/guide/Using-venus-Shared-Modules.html#pre-requisites

&ensp;&ensp; 唯一需要说明的是给普通节点钱包转账的问题:因为venus服务组件是限制Send消息的,而2k私网的原始fil在创世钱包里,故需要一个转账节点.

- 启动一个venus节点,仅用于转账
```sh
 nohup ./venus daemon --genesisfile=devgen.car --network=2k > venus.log 2>&1 &
```

- 导入创世钱包
```
# 在venus-wallet导出钱包密钥
$ ./venus-wallet export t3sjhgun7xcklmyga6x3c5sq6pbncdlmrjmepfz7ms4fuqimtk4fida37dhq7kpq3tn7nyu5hpnn7mtp3a7lia
Password:*
7b2254797065223a22626c73222c22507269766174654b6579223a224541326e6a463363326b4f467977323079564f574b66733371794d6451767a35334c667459497347456b673d227d

# 设置密码
$ ./venus wallet set-password
Password:*
Enter Password again:*
Password set successfully 
You must REMEMBER your password! Without the password, it's impossible to decrypt the key!

# 导入钱包
$ ./venus wallet import
ipfs: Reading from /dev/stdin; send Ctrl-d to stop.

```

- 转账
```sh
 ./venus send <to> 100
```
-- 常用命令
```
# 查询钱包列表
$ ./venus wallet list

# 查询指定钱包余额
$ ./venus wallet balance <wallet>

# 设置和查询默认钱包,转账的from即是默认钱包
$ ./venus wallet default
$ ./venus wallet set-default <wallet>
```
> venus转账节点重启后也需要unlock,不然无法转账.

## 扇区封装

&ensp;&ensp; 和主网逻辑差不多，请查阅：[扇区封装](https://venus.filecoin.io/zh/guide/Using-venus-Shared-Modules.html#开始封装)，需要注意的是：

1. 文档中init时没有添加storage，故如果要做扇区封装，先attach storage；

2. 如果机器上同时运行看了别的占用gpu的程序，如多个venus-worker，需要用TMP_DIR指定不同路径，避免竞争锁。

3. 第一个sector时没有生成/var/tmp/s-basic-unsealed-2048，需要手动执行拷贝命令：
```
cp <unsealed file> /var/tmp/s-basic-unsealed-2048
```

&ensp;&ensp; 测试结果: 2~8 是新做的Sector，已上链
```
$ ./venus-sealer sectors list
ID  State    OnChain  Active  Expiration                   Deals  DealWeight  
0   Proving  YES      YES     1550097 (in 10 weeks 1 day)  CC                 
1   Proving  YES      YES     1550097 (in 10 weeks 1 day)  1      0B          
2   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC                 
3   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC                 
4   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC                 
5   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC                 
6   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC                 
7   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC                 
8   Proving  YES      NO      1550097 (in 10 weeks 1 day)  CC  

$ ./venus-sealer info
Chain: [sync behind! (22s behind)] [basefee 100 aFIL]
Sealer: f01000 (2 KiB sectors)
Power: 40 Ki / 40 Ki (100.0000%)
        Raw: 4 KiB / 4 KiB (100.0000%)
        Committed: 18 KiB
        Proving: 4 KiB
```
