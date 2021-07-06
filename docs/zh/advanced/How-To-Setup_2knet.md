# 如何启动测试网络

>本文以建立2k网络为例,在 CentOS 7.* 系统部署venus集群. 

## 必要系统环境

```sh
yum install epel-release -y
yum install ocl-icd-devel -y
yum install opencl-headers -y
yum install hwloc
yum install jq -y 
```
在此过程中，系统会提示您安装所有组件。

## 创世节点

### 生成预密封文件和数据
   
```sh
./venus seed pre-seal --sector-size 2048 --num-sectors 2
./venus seed genesis new localnet.json
./venus seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json
```

### venus-auth
   
```sh
nohup ./venus-auth > auth.log 2>&1 &
# 生成服务组件间相互访问API所需的验证token
./venus-auth genToken --perm admin admin
```

### venus-gateway

```sh
nohup ./venus-gateway --listen=/ip4/0.0.0.0/tcp/45132 run --auth-url=http://<auth_ip>:8989 gateway.log 2>&1 &
```

### venus

```sh
nohup ./venus daemon --make-genesis=devgen.car --genesis-template=localnet.json --network=2k --auth-url=http://<auth_ip>:8989 > venus.log 2>&1 &
```

### venus-wallet

```sh
# 服务组件venus-auth需要为每个集群的venus-wallet生成具有wallet权限的token，用于向venus-gateway注册服务时验证请求合法性
$ ./venus-auth genToken --perm write w1

$ nohup ./venus-wallet run > wallet.log 2>&1 &

$ ./venus-wallet setpwd
Password:******
Enter Password again:******

$ ./venus wallet import ~/.genesis-sectors/pre-seal-t01000.key

# venus-wallet 需要向 venus-gateway注册服务，故需要配置venus-gateway的监听和验证
[APIRegisterHub]
RegisterAPI = ["/ip4/<gateway_ip>/tcp/45132"]
Token = "<w1 token>"
# 矿工集群的别名，在venus-auth中注册
SupportAccounts = ["m1","m2"]
```

### venus-messager
```sh
nohup ./venus-messager run --auth-url=http://<auth_ip>:8989 --node-url=/ip4/<fullnode_ip>/tcp/3453 --gateway-url=/ip4/<gateway_ip>/tcp/3453 --auth-token=<admin token> --db-type=sqilte > msg.log 2>&1 &
```
 
### 初始化矿工
   
```sh
# 服务组件venus-auth需要为venus-sealer生成标识信息，比如：具有write权限的token，集群别明等，这些作为独立组件访问服务的必要信息，需要在请求API中带入：
./venus-auth addUser --name=m1 --miner=t01000
./venus-auth genToken --perm write m1
 
# 初始化 sealer
./venus-sealer init --genesis-miner --actor=t01000 --sector-size=2048 --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync --network=2k \
--node-url /ip4/<fullnode_ip>/tcp/3453 \
--messager-url /ip4/<messager_ip/tcp/39812 \
--gateway-url /ip4/<IP3>/gateway_ip/45132 \
--auth-token <m1 token>

nohup ./venus-sealer run > sealer.log 2>&1 &
```

### 启动出块服务

```sh
./venus-miner init --nettype=2k ---auth-api=/ip4/<auth_ip>/tcp/3453 \
 --gateway-api=/ip4/<gateway_ip>/tcp/45132
 --api=/ip4/<fullnode_ip>/tcp/3453 --token <token for admin>
 
nohup ./venus-miner run > miner.log 2>& 1 &

# 每次启动时会从venus-auth请求当前已加入venus分布式矿池中的miner列表,可以根据命令查询:
./venus-miner address state 
[
	{
		"Addr": "<MINER_ID>",
		"IsMining": true,
		"Err": null
	}
]
```

## 普通矿工

### 启动sealer服务

```sh
# 矿建一个钱包
$ ./venus-wallet new bls
<bls address 1>

# 转账，在创世节点执行
./venus send <bls address 1> --value=[value]
# 查询
./venus wallet balance <bls address 1>

# 服务组件venus-auth需要为venus-sealer生成标识信息，比如：具有write权限的token，集群别明等，这些作为独立组件访问服务的必要信息，需要在请求API中带入：
./venus-auth addUser --name=m2
./venus-auth genToken --perm write m2

# 生成普通矿工
./venus-sealer init --worker=<bls address 1> --owner=<bls address 1> --sector-size=2k --network=2k \
--node-url /ip4/<fullnode_ip>/tcp/3453 \
--messager-url /ip4/<messager_ip/tcp/39812 \
--gateway-url /ip4/<IP3>/gateway_ip/45132 \
--auth-token <m2 token>

# 更新venus-auth中的User信息
./venus-auth updateUser --name=m2 --miner=<t0***> --state=1

# 启动
nohup ./venus-sealer run > sealer.log 2>&1 &

# 执行sector封装，这个命令只支持单次
# 可以通过crontab 做定时任务，也可以自行编写策略脚本执行
./venus-sealer sectors pledge 
```

### 启动挖矿服务

&ensp;&ensp; 在venus-miner中执行命令:
```sh
./venus-miner address update

# 查看状态为true即表示正常出块:
./venus-miner address state 
[
	{
		"Addr": "<MINER_ID>",
		"IsMining": true,
		"Err": null
	}
]
```
