# Lotus集群替换为Venus集群

## Venus与Lotus集群简介

本文档基于[Lotus](https://github.com/filecoin-project/lotus/releases) & [Venus](https://github.com/filecoin-project/venus/releases)公开版本进行说明。部分内容涉及到矿工对程序的定制化修改，需要有针对性的方案。

Tips:
 - 以下所有`<>`都是需替换的参数，根据矿工的实际情况替换
 - 具体版本请使用git checkout选择 
 - 环境依赖：
     - golang ^1.15
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git
     
### venus集群的组件

程序 | 服务器 | 类型 | 作用
--- | --- | --- | ---
venus-auth     |   \<IP1\> | 共享|Venus-auth 用于统一授权，当矿工组件访问共享组件的时候需要使用此服务注册生成的token
venus-wallet   |   \<IP2\> | 共享| 钱包管理，数据签名
venus          |   \<IP3\> | 共享| Filecoin节点数据同步
venus-messager |   \<IP4\> | 共享| 管理集群中的消息，保证消息上链，控制消息流量，重试等。可对接多个钱包，针对这些钱包做消息管理
venus-miner    |   \<IP5\> | 共享| 管理多个矿工赢得选票，打包消息，通过访问venus-sealer获取数据证明;签名时调用venus-wallet
venus-sealer   |   \<IP6\> | 非共享| sector状态机管理；算力增长调度;算力维持
venus-worker   |   \<IP7\> | 非共享| 数据封装(P1,P2,C1,C2等阶段任务的执行)

### lotus集群的组件

程序 | 服务器 | 类型 | 作用 | 对应venus组件
--- | --- | --- | --- | ---
lotus          |   \<IP1\> | 可共享| Filecoin节点数据同步；消息池；钱包管理，数据签名等 | venus，venus-messager部分功能，venus-wallet部分功能
lotus-miner    |   \<IP2\> | 非共享| sector状态机管理；算力增长调度；算力维持；赢得选票 | venus-miner部分功能，venus-sealer
lotus-worker   |   \<IP3\> | 非共享| 数据封装(P1,P2,C1,C2等阶段任务执行者) | venus-worker

venus-wallet对钱包做了更加精细化的管理，比如权限管理：用户可以指定钱包能签名的数据类型，管理员可以锁定某个钱包，限制签名等；

venus-message允许消息在将要发送到消息池时再分配nonce值，对于不同的消息可指定优先级，能够较好控制消息的打包节奏；

venus-miner将多个矿工的出块集中到一个组件，而lotus只能负责一个miner的出块。

## Lotus集群替换为Venus集群
### 1.替换说明

Venus在管理多集群时更具优越性，其共享组件可为多个集群服务。如果集群比较少时，不建议搭建一整套共享组件，可以联合多个集群共用一套Venus共享组件以满足服务。

### 2.替换操作

#### 1）Venus共享组件替换Lotus组件

Venus服务的共享组件包括：[venus](https://github.com/filecoin-project/venus)、[venus-messager](https://github.com/ipfs-force-community/venus-messager)、[venus-auth](https://github.com/ipfs-force-community/venus-auth)、[venus-wallet](https://github.com/ipfs-force-community/venus-wallet)、[venus-miner](https://github.com/filecoin-project/venus-miner)，部署请参考 [How-To-Deploy-MingPool](How-To-Deploy-MingPool.md)。

#### 2）Venus独立组件替换Lotus组件

##### 方案1: 公开版lotus-miner组件替换

* 停止产生新的sector封装任务,等待所有进行中的sector任务完成；
* 用venus-sealer替换lotus-miner后重启服务，venus-sealer的部署请参考 [How-To-Deploy-MingPool](How-To-Deploy-MingPool.md)。

替换前Lotus集群流程
![lotus-cluster-1](./images/lotus-cluster-1.png)


替换后Venus集群流程
![venus-replace-lotus-cluster-1](./images/venus-replace-lotus-cluster-1.png)

##### 方案2: 定制化lotus-miner组件替换

因为存在矿工自己修改了lotus-miner代码的情况，如果想继续沿用，需要对lotus-miner做如下调整：
* 不要启用lotus-poster的winingPoSt程序，这需要改动代码；
* 已有Sector数据的转换，这需要开发；
* lotus-miner对接venus-messager，这需要开发；
* 矿工可以自己做相关工具的开发，或者等待Venus开发者后续推出相关工具及开发者文档。

替换前Lotus集群流程
![lotus-cluster-2](./images/lotus-cluster-2.png)


替换后Venus集群流程
![venus-replace-lotus-cluster-2](./images/venus-replace-lotus-cluster-2.png)
