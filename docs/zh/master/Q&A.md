# 答疑篇

用户在接入[Filecoin存储提供者孵化中心](https://venushub.io/incubator)的过程或集群日常运维中，会遇到各种各样的问题，为了快速定位、高效解决问题，对已经遇到过的问题
记录在案是必要的。根据功能模块的不同，我们将问题归为两类：

- 链服务的问题
- 独立组件的问题

## 链服务的问题

**1、** Venus共享组件报错`ERROR: must set url or token`，或者提示

```bash
2021-09-08T11:05:33.796+0800 WARN cliutil apiinfo/apiinfo.go:125 parse libp2p address error , plz confirm this error failed to parse multiaddr "": empty multiaddr
```

检查url或者token是否配置正确，url样式遵循PL定义的[multiaddr](https://github.com/multiformats/go-multiaddr)格式。

错误示例：`--node-url= /ip4/127.0.0.1/tcp/3453`；

正确示例：`--node-url=/ip4/127.0.0.1/tcp/3453`；

</br>

**2、** 其他Venus共享组件连接venus时提示`connect to node failed cannot dialer to addr ws://192.168.10.73:3453/rpc/v0 due to unexpected EOF`，节点没有配置成允许其他ip访问。

错误示例：`198.172.0.3：3453`；

正确示例：`0.0.0.0:3453`；

</br>

**3、** Venus共享组件报错`too many files open`[ * ](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631578830055000?thread_ts=1631506523.042700&cid=CEHHJNJS3)，系统可打开文件数量设置太小。`$ ulimit -n 1048576`

</br>

**4、** venus-messager或venus报错[ * ](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631597560068400?thread_ts=1631506523.042700&cid=CEHHJNJS3)

```bash
ERROR[2021-09-14T01:30:03-04:00] listen head changes errored: process new head error: process apply failed got parent receipt failed amt load: failed to root: blockstore: block not found: amt load: failed to root: blockstore: block not found
```

高度同步错误。

</br>

**5、** venus-messager报警`WARN[2021-09-14T01:54:21-04:00] no broadcast node config` [* ](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631599790073100?thread_ts=1631506523.042700&cid=CEHHJNJS3),此报警可忽略。

</br>

**6、** venus-miner报错`ERROR miner miner/baseinfo.go:355 [t01011] failed to compute winning post proof: no connections for this miner t01011`，节点号对应的`venus-sealer`没有连接到`venus-gateway`。

</br>

**7、** venus-miner报错`ERROR miner miner/multiminer.go:168 create WinningPoStProver failed for [<empty>], err: getting sector size: not found resolve address` [ * ](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631621284077800?thread_ts=1631506523.042700&cid=CEHHJNJS3)

网络不支持用户自init的区块大小；

</br>

**8、** venus-messager报错`ERROR[2021-09-14T08:54:29-04:00] listen head changes errored: RPC error (-32601): method 'Filecoin.ChainNotify' not supported in this mode (no out channel support)` [ * ](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631624179079100?thread_ts=1631506523.042700&cid=CEHHJNJS3)，使用ws或者wss用于共享组件之间的url。url样式遵循PL定义的[multiaddr](https://github.com/multiformats/go-multiaddr)格式。

</br>

**9、** venus和venus-messager之间报错`bad handshake` [*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631626576083200?thread_ts=1631506523.042700&cid=CEHHJNJS3)，venus-messager的url配置中，IP，端口，或者token配置有问题。

</br>

**10、** venus节点报错`Proof type 7 not allowed for new miner actors` [*](https://filecoinproject.slack.com/archives/C02E95ZU5PG/p1631758710080500)，矿工init的时候，扇区大小选择错误。

</br>

**11、** 发消息过程中报错`Address txxxxxxx not exit` [* ](https://filecoinproject.slack.com/archives/C02E95ZU5PG/p1631762887093700)，先看venus-gateway钱包地址有没有注册，然后看venus-message和venus-gateway链接是否正常。

</br>

## 独立组件问题

### venus-sealer

**1、** venus-sealer启动后报错**key for worker not found in local wallet**。

```bash
ERROR    storageminer    storage/wdpost_run.go:107    runPoStCycle failed: getting network version:
    github.com/filecoin-project/venus-sealer/storage.(*WindowPoStScheduler).runPoStCycle
        /home/mixman/venus-sealer/storage/wdpost_run.go:548
RPC client error: sendRequest failed: Post "https://node.filincubator.com:81/rpc/v1": context canceled
2021-09-10T11:38:33.428-0700    DEBUG    advmgr    sector-storage/sched_worker.go:494    worker 50e56d31-7b2a-4d7e-b8f3-e2271a37a339 dropped
ERROR: creating node: starting node: miner preflight checks failed: key for worker not found in local wallet
```

由于venus-wallet没有注册到venus-gateway上，所以venus-sealer启动后到gateway上没有发现节点的私钥，就会直接报错。

</br>

**2、** venus-sealer启动后，一直报 **JWT Verification** 错误。

```bash
/root/filecoin/venus/venus-sealer/models/sqlite/sector_info.go:268
[0.195ms] [rows:1] SELECT * FROM `sectors_infos` WHERE sector_number=1 LIMIT 1
INFO	sectors	storage-sealing/states_sealing.go:787	Proving sector 1
WARN	advmgr	sector-storage/manager.go:593	ReturnReleaseUnsealed todo
WARN	auth	auth/handler.go:39	JWT Verification failed (originating from 127.0.0.1:39758): JWT Verification failed: jwt: HMAC verification failed
WARN	auth	auth/handler.go:39	JWT Verification failed (originating from 127.0.0.1:39758): JWT Verification failed: jwt: HMAC verification failed
WARN	auth	auth/handler.go:39	JWT Verification failed (originating from 127.0.0.1:39758): JWT Verification failed: jwt: HMAC verification failed
WARN	auth	auth/handler.go:39	JWT Verification failed (originating from 127.0.0.1:39758): JWT Verification failed: jwt: HMAC verification failed
WARN	auth	auth/handler.go:39	JWT Verification failed (originating from 127.0.0.1:39758): JWT Verification failed: jwt: HMAC verification failed
```

把配置文件中的ListenAddress和RemoteListenAddress从`127.0.0.1`改为`本要的内网IP地址`或者`0.0.0.0`。

```bash
# head .venussealer/config.toml
DataDir = "~/.venussealer"

[API]
  ListenAddress = "/ip4/0.0.0.0/tcp/2345/http"
  RemoteListenAddress = "0.0.0.0:2345"
```

</br>

**3、** 如果发现一个任务长时间没有完成（也许是venus-worker掉线了），你可以使用下面的命令取消任务。

```bash
# venus-sealer sealing abort <job-id>

这时日志中会产生相应的报错信息，例如下面是C2任务，当终止后就会把状态改为ComputeProofFailed，等待1分钟后，其它未领取到任务的worker就可以来领取了;

vebus-sealer的日志中报ComputeProofFailed;
[0.214ms] [rows:1] SELECT * FROM `sectors_infos` WHERE sector_number=111 LIMIT 1
INFO	sectors	storage-sealing/states_failed.go:32	ComputeProofFailed(111), waiting 59.474264909s before retrying
```

</br>

**4、** 时空证明开始，但是venus-sealer没有收到任务。

通过在venus-sealer输出日志中过滤**chain-random**，查看是否收到来自链上的时空证明，如果没有过滤到需要重启一下venus-sealer。

```bash
# cat logs/venus-sealer.log | grep chain-random
INFO	storageminer	storage/wdpost_run.go:635	running window post	{"chain-random": "LQoWxGJONq9JSm7fu8qvmEHBnoYqnKMHjoFELSOvuvo=", "deadline": {"CurrentEpoch":1109280,"PeriodStart":1109289,"Index":0,"Open":1109289,"Close":1109349,"Challenge":1109269,"FaultCutoff":1109219,"WPoStPeriodDeadlines":48,"WPoStProvingPeriod":2880,"WPoStChallengeWindow":60,"WPoStChallengeLookback":20,"FaultDeclarationCutoff":70}, "height": "1109280", "skipped": 0}
```

任务完成后，在venus-sealer的日志中会生成一条**Submitted window post**消息，消息会先发送到venus-message，签名后上链。则完成1个**partitions**；

```bash
INFO	storageminer	storage/wdpost_run.go:863	Submitted window post: 06df4a21-a0b7-4436-9473-07eae0fd382f
```

如果提交消息超过5分钟还没有上链，则有如下两种可能性:

- 发送post消息的地址里面，没有足够的FIL支付所需的手续费，导致消息不能上链；一般小于0.5FIL就可能导致post消息无法上链；
- venus-wallet进程down掉，消息虽然生成后发送到venus-messager处，但是没有venus-wallet对消息进行签名；

</br>

### venus-cluster

`venus-cluster`相关问题，请在 [#fil-venus-cn](https://filecoinproject.slack.com/archives/C028PCH8L31) 阅览相关聊天记录。特别是 [@dtynn大神](https://filecoinproject.slack.com/team/UMK2CF76W) 关于cluster的相关发言。
