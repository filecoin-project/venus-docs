## 日常运维篇

### 独立组件

&ensp;&ensp;venus系统的独立组件是指venus-sealer/venus-cluster和venus-wallet。venus-sealer是旧版的算力积累与维持组件，在孵化器第二期将不再维护。venus-cluster是新版的算力积累与维持组件，相比venus-sealer在任务调度和系统资源使用上有很大的提升，将是venus社区长期维护并推荐使用的组件。


#### venus-wallet

- 是否成功启动？

```bash
INFO	main	cmd/rpc.go:73	start rpc server at [/ip4/0.0.0.0/tcp/5678/http] ...
ERROR	wallet_event	wallet_event/listenevent.go:236	WalletSign error password not set	{"api hub": "/dns/gateway.filincubator.com/tcp/83/wss"}
WARN	wallet_event	wallet_event/listenevent.go:164	listenWalletRequestOnce quit	{"api hub": "/dns/gateway.filincubator.com/tcp/83/wss"}
INFO	wallet_event	wallet_event/listenevent.go:173	restarting listenWalletRequestOnce	{"api hub": "/dns/gateway.filincubator.com/tcp/83/wss"}
INFO	wallet_event	wallet_event/listenevent.go:184		{"rand sign byte": "TCzGneQnvI2N6LqBVf0AHwaEr+NueDnk1aCSo+1G3SA="}
```
日志中报**WalletSign error password not set**，需要执行**venus-wallet setpwd**

```bash
# venus-wallet setpwd
Password:********
Enter Password again:********
Password set successfully
```

- 私钥导入与导出

```bash
# venus-wallet import
Enter private key: 7b2254797065223a22626c73222c22626c73222c22507269766174654b6579223a227135
imported key t3w42mmqem7wfhmqf2ovrssz6qe24ymkfdsafdnkjnjknkjndafsadafn25ztb6e7a successfully!

# venus-wallet export t3w42mmqem7wfhmqf2ovrssz6qe24ymkfdsafdnkjnjknkjndafsadafn25ztb6e7a
Password:********
7b2254797065223a22626c73222c22626c73222c22507269766174654b6579223a227135
```

#### venus-sealer

```bash
# 查看矿工的proving相关信息
venus-sealer proving info

# 查看第0个deadline的信息
venus-sealer proving deadline 0

# 查看所有deadline的信息
venus-sealer proving deadlines

# 查看所有deadline的信息
venus-sealer proving deadlines

# 检查第0个deadline的扇区证明文件是否存在
venus-sealer  proving check 0 

# 检查证明失败的sector列表
venus-sealer  proving faults

# 只检查第7个deadlines证明失败的sector列表
venus-sealer proving check --only-bad 7
```

#### venus-cluster

> 目前正在测试中，在一个月左右发布源码及使用文档。


### 链服务性能监控

#### 组件接口调用统计

- 全组件

![venus-all](../../../docs/.vuepress/public/monitor/venus-all.jpg)

统计特定矿工的独立组件请求链服务所有组件提供接口的次数，起始点后和结束点前的半个小时数据可以忽略。

- venus

![venus](../../../docs/.vuepress/public/monitor/venus.jpg)

独立组件对venus接口的请求占比很大，大部分事件的触发机制都是通过请求venus接口来判断的。

- venus-messager

![venus-messager](../../../docs/.vuepress/public/monitor/venus-messager.jpg)
  
矿工在做算力时需要发送PreCommitSector和ProveCommitSector消息，在完成一个窗口期的windowPoSt时需要发送SubmitWindowedPoSt消息，消息发送需要请求venus-messager接口。因此，当矿工正常封装扇区时其请求次数应该维持在一个比较固定的范围内，起始点后和结束点前的半个小时数据可以忽略；

- venus-gateway
  
![venus-gateway](../../../docs/.vuepress/public/monitor/venus-gateway.jpg)
 
在venus系统中，venus-cluster/venus-sealer通过venus-gateway提供winningPoSt的证明计算服务，venus-wallet通过venus-gateway提供签名服务。

#### venus-sealer调用接口详细列表

![filecoin-interface](../../../docs/.vuepress/public/monitor/filecoin-interface.jpg)

#### 消息相关接口

![venus-mesager-gateway-interface](../../../docs/.vuepress/public/monitor/venus-mesager-gateway-interface.jpg)
 
 venus-sealer向链上发送消息和签名消息用到的一些接口，对不同接口的统计可以看到消息发送到链上的频率。