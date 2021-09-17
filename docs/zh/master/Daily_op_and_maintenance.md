## 日常运维篇

### 独立组件

#### 存储

```bash
# 设置密封扇区的存储路径，密封完成之后该路径下的数据会被自动清空，相当于临时目录
venus-worker storage attach --seal --init /sea01

# 设置数据存储路径，该路径用来存储最终密封好的数据
venus-sealer storage attach --store --init /storage01

# 如果存储已经被初始化后，但是.venussealer或.venusworker目录被误删除，在重新配置存储的时候不需要--init命令
venus-sealer storage attach --store /storage01

# 查看本地存储列表
venus-sealer storage list
```

#### 任务

```bash
# 下发复制任务
venus-sealer sectors pledge

# 查看下发的所有任务状态
venus-sealer sectors list

# 查看 Worker 列表
venus-sealer sealing workers

# 查看当前 miner 任务调度列表
venus-sealer  sealing jobs

# 修改扇区123的状态为WaitSeed
venus-sealer sectors update-state --really-do-it 123 WaitSeed

# 查看扇区123的历史状态
venus-sealer sectors status --log 123
```

#### 钱包

- venus-wallet启动后，注意观察日志

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

#### 时空证明

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

### 链服务性能监控

#### 组件调用统计

- all

- venus

- messager

- gateway

#### 接口调用统计

中间那张图

#### 最下面一栏messager和gateway
