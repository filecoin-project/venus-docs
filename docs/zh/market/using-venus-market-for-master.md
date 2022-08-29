## venus-market-v2 master部署指南

venus-market v2支持两种运行模式
- 作为链服务运行模式
- 作为独立组件运行模式

链服务提供者需要搭建一个venus-market, 为其下的多个旷工提供存储市场的服务时, 需要venus-market工作在链服务模式,如果你是一个旷工, 只想搭建一个简单的服务, 单独为自己提供存储市场的服务, 请参考[venus-market v2 for miner](using-venus-market-for-miner.md)

### 全局配置
全局配置对于独立运行模式和链服务组件模式都完全一样, 请参考独立运行模式中的[全局配置](using-venus-market-for-miner.md#全局配置)

### 启动venus-market

venus-market作为云服务组件来启动时,需要配置
- venus 全节点, 对应命令行的`node-url`
- venus-messager组件服务,对应命令行`messager-url`
- venus-auth组件服务,对应命令行`auth-url`
- venus-gateway组件服务(作为签名服务),对应命令行`signer-url`
- auth-token 用于venus-market在云服务中访问其它组件时验证权限的token

:tipping_hand_woman:**:对于market作为云服务组件启动的情况,所有请求权限的验证都是通过venu-auth来进行, 设置`auth-token`就可以了.**

#### token配置

`auth-token`项,是从venus-auth服务上获取,用于market访问其它云组件时验证权限.可以使用已经存在的token, 或者创建新的token.

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
./venus-market pool-run \
--node-url=/ip4/192.168.200.21/tcp/3453/ \
--auth-url=http://192.168.200.21:8989 \
--gateway-url=/ip4/192.168.200.21/tcp/45132/ \
--messager-url=/ip4/192.168.200.21/tcp/39812/ \
--auth-token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ \
```

#### 通过配置文件指定参数启动

当第一次启动时venus-market时,按[命令行指定启动参数](#命令行指定参数启动)后, 配置文件的对应项看起来是这样的.
```yuml
[Node]
  Url = "/ip4/192.168.200.21/tcp/3453/"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ"
[Messager]
  Url = "/ip4/192.168.200.21/tcp/39812/"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ"
[Signer]
  Type = "gateway"
  Url = "/ip4/192.168.200.21/tcp/45132/"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ"
[AuthNode]
  Url = "http://192.168.200.21:8989"
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiemwiLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.3u-PInSUmX-8f6Z971M7JBCHYgFVQrvwUjJfFY03ouQ"
```
同时, 也可以在后续的操作中通过修改配置文件来指定启动参数,如果配置文件都正确,只需要用下面这样简单的命令来启动venus-market:
```shell
./venus-market run
```

### 使用market为miner挂单
market以链服务方式启动, 不需要设置默认miner(market会自动从gateway取得),通过命令查看miner信息:
```shell
./venus-market actor list                                                                
miner                                                                                   account
t01041                                                                                  BY
t01051                                                                                  zl
```
从上面的列表中可以看到, 此时market可以同时为多个注册到链服务中的旷工进行服务.

之后的操作与独立模式启动完全一样,可以参考[market为miner挂单](./using-venus-market-for-miner.md#使用market为miner挂单)

### 使用market-client开始存储订单
market-client的使用与venus-market以独立方式运行还是链服务方式运行没有关系,所以可以参考[market-client开始存储订单](./using-venus-market-for-miner.md#使用market-client开始存储订单)

### venus-sealer封装扇区
参考[venus-sealer封装扇区](./using-venus-market-for-miner.md#venus-sealer封装扇区)
