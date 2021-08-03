# venus 分布式矿池常见问题

## venus

### 异常关闭venus或者某些特殊情形下可能会对本地存储造成破坏，并且是不可逆的，故需要定时备份本地存储，以便存储损坏是及时替换。

1. 停止venus
2. rm -rf ~/.venus/*
3. 用备份的解压或覆盖到~/.venus目录
4. 重启venus

### worker fil 不足未及时处理或venus节点出口流量被打满，大量任务卡在WaitSeed

&ensp;&ensp; 在venus-auth节点上使用`./venus-messager msg list-fail`命令打开失败的消息，然后使用`./venus-messager msg mark-bad --really-do-it <失败消息id>`命令将失败的消息打回sealer侧重启判断消息是否有问题；再次检查是否还有失败的消息


### venus节点宕机或磁盘空间将满，切换备机

venus-message: 修改用户家目录下的messager.toml配置文件里的内容,指向新节点后，重启venus-message服务
```
cat ~/messager.toml
[node]
    url = "/ip4/192.168.1.134/tcp/3453"
    token= "eyJhbGciOIUacbciIsInR5cCI6I.iLCJwZXJtIjoic2lnbiIs.c65GtR7IVjJYE"
```
kill掉之前的venus-messager进程后，再重新启动即可

venus-miner: 修改用户家目录下的配置文件，连接的ip地址
```
cat ~/.venusminer/config.toml
ListenAPI = "/ip4/192.168.0.98/tcp/3453/http"
Token = "eyJhbGciOiJIUzIsInR5c.eyJuYW1lIjoibWMmV4dCI6IiJ9.3P0x6StVjJYEhv198"
```
重新启动venus-miner服务

winning-post和sealer节点修改.lotus/api和.lotus/token值
```
cat .venus/api
/ip4/120.78.159.125/tcp/3453/http
```
修改完成后使用重启winning-post和sealer

## venus-messager

### venus-messager 中大量消息卡住

&ensp;&ensp; 默认每个worker地址30秒只往链上发送的消息数最多只有20条，可以根据实际体量进行稍微增加到30条（值越大同一高度往链上发送的消息数就越多，可能造成小部分的SysErrOutOfGas消息）

```sh
./venus-messager address set-sel-msg-num --num 30 <worker 地址>
```

### <span id="signed-failed">venus-message消息签名失败</span>

```bash
ERROR[2021-07-12T16:37:45+8:00] wallet sign failed 65735211-9b4f-447q-9c8f-ad23791c75e fail **could not decrypt key with given password**
```

从日志中发现消息在签名时失败，主要是wallet设置了错误的钱包密码。

```sh
ERROR wallet sign failed 7edd68a5-4a6f-42c1-bded-acfd7d320118 **fail no connect found for account sealer** and from ...
```

主要是wallet没有支持`sealer`这个账户，[解决方案](https://github.com/filecoin-project/venus-sealer/issues/63#issuecomment-880363242)

## venus-miner

## venus-miner无法出块

- 确认venus-miner连接的venus节点同步高度正常，并检查其日志是否正常；
- 在venus-miner节点上logs/venus-miner.log日志信息；使用 ./venus-miner address state 命令确认IsMining为true
```sh
$ ./venus-miner address state
[
    {
         "Addr": "f0xxx",     # 矿工号
         "IsMining": true,    # 是否在挖矿（出块）
         "Err": null          # 是否有报错信息
    }
]
```

## venus-wallet

### venus-wallet启动之后报错

```
ERROR	wallet_event	wallet_event/listenevent.go:192 WalletSign error password not set {"api hub": "/ip4/<IP_ADDRESS>/tcp/45132"}
```

是由于没有执行./venus-wallet set-password命令设置密码导致的，每次venus-wallet重启都需要执行设置密码的操作，也可以在启动时设置密码：`./venus-wallet run --password=<password>`
设置密码后，如果有下列报错，则需要检查配置文件。

```bash
ERROR	wallet_event	wallet_listen/listenevent.go:120 listen wallet event errored: listenWalletRequestOnce listenWalletRequestOnce call failed: handler: websocket connection closed {"api hub": "/ip4/47.251.6.27/tcp/45132"}
```

直到到connect to server返回正确的消息为止。

```bash
INFO	wallet_event	wallet_event/listenevent.go:156 connect to server 65735211-9b4f-447q-9c8f-ad23791c75e {"api hub": "/ip4/47.251.6.27/tcp/45132"}
```

### venus-wallet 连接gateway

1. token错误

错误日志：2021-08-02T11:37:33.063+0800    ERROR   wallet_event    wallet_event/listenevent.go:65  connect to api hub /ip4/127.0.0.1/tcp/45132/ws failed websocket: **bad handshake**


## venus-sealer

* 开启rust日志：export RUST_LOG=debug

### venus-sealer 创建矿工失败

1. 检查 sealer的日志是否有异常
> 日志中会输出创建矿工的消息：Pushed CreateMiner message: 556f3c3b-35cb-40e5-b096-924e33920420

2. 查看消息是否推送到messager
```
./venus-messager msg search --id="9965e5ea-8142-4b61-8312-425d5598092e"

{
        "ID": "9965e5ea-8142-4b61-8312-425d5598092e",
        "SignedCid": null,
        "from": "t3wjbqsk5wvm7troa72xnnzjvxuspvtdemdcetrml3rmq3h4lghhqw5ys42vymitoanacinmkaf5pwf2kfclsa",
        "Height": 0,
        "Receipt": {
                "ExitCode": -1,
                "ReturnValue": "",
                "GasUsed": 0
        },
        "State": "UnFillMsg",
 }
```

:::info
消息各个状态代表的含义：
UnFillMsg：未签名消息
FillMsg：已签名消息
OnChainMsg：已上链消息
FailedMsg：由于各种原因失败的消息
:::

3. 消息已推送到messager，检查消息状态，初始状态是 `UnFillMsg`
* 若消息长时间是`UnFillMsg`状态，查看日志，可能是gas预估失败或者[签名失败](#signed-failed)
* 若消息状态是`FillMsg`，但长时间未上链，先查看messager日志，再检查是否已推送到节点消息池：`./venus mpool pending --from <address>`，若不在消息池，查看节点日志
* 若消息状态是`FailedMsg`，查看失败原因：`./venus-messager msg list-fail --from <address>`

4. 消息未推送到messager，sealer日志会有错误提示

### 创建矿工提示钱包不存在

* 错误日志：**wallet(admin_2)** address t3s22ny35ai24f23avj5s4nmc6hq3wt3uegnigqrdvzid5hplskg2wmqei3j433w4qoxdiy5jxk5yrqcn7p2aq not exists
* 解决方法：需要在`venus-wallet`中支持下`admin_2` `./venus-wallet support admin_2`

### 启动遇到矿工不存在 `address t02871 not exit`

* 错误日志：2021-08-03T10:11:14.154+0800    ERROR   proof_event     proof_client/proof_event.go:28  listen head changes errored: listenHeadChanges ChainNotify call failed: **address t02871 not exit**
* 解决方法：在`venus_auth`中添加该矿工 `./venus-auth update --name =admin_2 --miner=t02871`

### wdPoSt
venus-sealer需要周期性进行wdPoSt,一旦失败,将有惩罚算力和扣除抵押的风险.故需要特别重视:

- sealer所在机器要预留一定的cpu资源给wdPoSt;
- 如果有gpu的话,其他抢占gpu资源的任务不能同sealer在一台机器运行,否则会造成wdPoSt等待gpu无法开始.
- 需要关注wdPoSt的证明周期,特别是sector被分配的那些窗口期(如下图deadline 0和2),一旦出现wdPoSt任务未开始或失败及时处理
```
$ ./venus-sealer proving deadlines
Sealer: t0***
deadline partitions sectors (faults) proven partitions
0        1          9 (9)            0
1        0          0 (0)            0
2        1          1 (1)            0
3        0          0 (0)            0
4        0          0 (0)            0
5        0          0 (0)            0
6        0          0 (0)            0
7        0          0 (0)            0
8        0          0 (0)            0
9        0          0 (0)            0
10       0          0 (0)            0
11       0          0 (0)            0
12       0          0 (0)            0
13       0          0 (0)            0
14       0          0 (0)            0
15       0          0 (0)            0
16       0          0 (0)            0
17       0          0 (0)            0
18       0          0 (0)            0
19       0          0 (0)            0
20       0          0 (0)            0
21       0          0 (0)            0
22       0          0 (0)            0
23       0          0 (0)            0
24       0          0 (0)            0
25       0          0 (0)            0
26       0          0 (0)            0
27       0          0 (0)            0
28       0          0 (0)            0
29       0          0 (0)            0
30       0          0 (0)            0
31       0          0 (0)            0
32       0          0 (0)            0 (current)
33       0          0 (0)            0
34       0          0 (0)            0
35       0          0 (0)            0
36       0          0 (0)            0
37       0          0 (0)            0
38       0          0 (0)            0
39       0          0 (0)            0
40       0          0 (0)            0
41       0          0 (0)            0
42       0          0 (0)            0
43       0          0 (0)            0
44       0          0 (0)            0
45       0          0 (0)            0
46       0          0 (0)            0
47       0          0 (0)            0
```
