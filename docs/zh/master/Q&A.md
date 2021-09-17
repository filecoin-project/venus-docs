## 答疑篇

&ensp;&ensp; 用户在接入孵化器过程或集群日常运维中，会遇到各种各样的问题，为了快速定位、高效解决问题，对已经遇到过的问题
记录在案是必要的。根据功能模块的不同，我们将问题归为两类：链服务问题和独立组件问题。

### 链服务问题



### 独立组件问题

#### venus-sealer

1)、venus-sealer启动后报错**key for worker not found in local wallet**

```bash
ERROR    storageminer    storage/wdpost_run.go:107    runPoStCycle failed: getting network version:
    github.com/filecoin-project/venus-sealer/storage.(*WindowPoStScheduler).runPoStCycle
        /home/mixman/venus-sealer/storage/wdpost_run.go:548
RPC client error: sendRequest failed: Post "https://node.filincubator.com:81/rpc/v1": context canceled
2021-09-10T11:38:33.428-0700    DEBUG    advmgr    sector-storage/sched_worker.go:494    worker 50e56d31-7b2a-4d7e-b8f3-e2271a37a339 dropped
ERROR: creating node: starting node: miner preflight checks failed: key for worker not found in local wallet
```

由于venus-wallet没有注册到venus-gateway上，所以venus-sealer启动后到gateway上没有发现节点的私钥，就会直接报错。



2)、venus-sealer启动后，一直报 **JWT Verification** 错误

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

把配置文件中的ListenAddress和RemoteListenAddress从127.0.0.1改为本要的内网IP地址或者0.0.0.0

```bash
# head .venussealer/config.toml
DataDir = "~/.venussealer"

[API]
  ListenAddress = "/ip4/0.0.0.0/tcp/2345/http"
  RemoteListenAddress = "0.0.0.0:2345"
```



3)、如果你发现一个任务长时间没有完成（也许是 worker 掉线了），你可以使用下面的命令取消任务

```bash
# venus-sealer sealing abort <job-id>

这时日志中会产生相应的报错信息，例如下面是C2任务，当终止后就会把状态改为ComputeProofFailed，等待1分钟后，其它未领取到任务的worker就可以来领取了;
vebus-sealer的日志中报ComputeProofFailed;
[0.214ms] [rows:1] SELECT * FROM `sectors_infos` WHERE sector_number=111 LIMIT 1
INFO	sectors	storage-sealing/states_failed.go:32	ComputeProofFailed(111), waiting 59.474264909s before retrying
```



4)、时空证明开始，但是venus-sealer没有收到任务。

通过在venus-sealer输出日志中过滤**chain-random**，查看是否收到来自链上的时空证明，如果没有过滤到需要重启一下venus-sealer

```bash
# cat logs/venus-sealer.log | grep chain-random
INFO	storageminer	storage/wdpost_run.go:635	running window post	{"chain-random": "LQoWxGJONq9JSm7fu8qvmEHBnoYqnKMHjoFELSOvuvo=", "deadline": {"CurrentEpoch":1109280,"PeriodStart":1109289,"Index":0,"Open":1109289,"Close":1109349,"Challenge":1109269,"FaultCutoff":1109219,"WPoStPeriodDeadlines":48,"WPoStProvingPeriod":2880,"WPoStChallengeWindow":60,"WPoStChallengeLookback":20,"FaultDeclarationCutoff":70}, "height": "1109280", "skipped": 0}
```

任务完成后，在venus-sealer的日志中会生成一条**Submitted window post**消息，消息会先发送到venus-message，签名后上链。则完成1个**partitions**；

```bash
INFO	storageminer	storage/wdpost_run.go:863	Submitted window post: 06df4a21-a0b7-4436-9473-07eae0fd382f
```

如果提交消息超过5分钟还没有上链，则有如下两种可能性:

- 发送post消息的地址里面，没有足够的FIL支付上边所需的手续费，导致消息上链；一般小于0.5FIL就可能导致post消息无法上链
- venus-wallet进程down掉，消息虽然生成后发送到venus-message处，但是没有venus-wallet对消息进行签名

#### venus-cluster

> 目前正在测试中，在一个月左右发布源码及使用文档。
