# venus组件替换已有lotus集群

## venus与lotus集群简介

本文档以各自官方版本为主进行说明，略带部分自我改造的集群方案。

Tips:
 - 以下所有`<>`都是需替换参数，根据自己的实际情况替换
 - 具体版本请自行使用git checkout选择 
 - 环境依赖：
     - golang ^1.15
        - go env -w GOPROXY=https://goproxy.io,direct
        - go env -w GO111MODULE=on
     - git
     
### venus集群组件

程序 | 服务器 | 类型 | 作用
--- | --- | --- | ---
venus-auth     |   \<IP1\> | 共享|Venus-auth 用于统一授权，当矿工组件访问共享组件的时候需要使用此服务注册生成的token
venus-wallet   |   \<IP2\> | 共享| 钱包管理，数据签名
venus          |   \<IP3\> | 共享| Filecoin节点数据同步
venus-messager |   \<IP4\> | 共享| 管理集群中的消息，保证消息上链，控制消息流量，重试等。可对接多个钱包，针对这些钱包做消息管理
venus-miner    |   \<IP5\> | 共享| 管理多矿工出块,打包消息，通过访问Venus-sealer获取数据证明;签名时调用venus-wallet
venus-sealer   |   \<IP6\> | 非共享| sector状态机管理;算力增长调度;算力维持
venus-worker   |   \<IP7\> | 非共享| 数据封装(P1,P2,C1,C2等阶段任务执行者)

### lotus集群组件

程序 | 服务器 | 类型 | 作用 | 对应venus组件
--- | --- | --- | --- | ---
lotus          |   \<IP1\> | 可共享| Filecoin节点数据同步；消息池；钱包管理，数据签名等 | venus,venus-messager部分功能,venus-wallet部分功能
lotus-miner    |   \<IP2\> | 非共享| sector状态机管理;算力增长调度;算力维持;出块 | venus-miner部分功能,venus-sealer
lotus-worker   |   \<IP3\> | 非共享| 数据封装(P1,P2,C1,C2等阶段任务执行者) | venus-worker

venus-wallet对钱包做了更加精细化的管理,比如权限管理:用户可以指定钱包能签名的数据类型,管理员可以锁定某个钱包,限制签名等;venus-message允许消息在将要发送到消息池时再分配nonce值,对于不同的消息可指定优先级,能够较好控制消息的打包节奏;venus-miner将多个矿工的出块集中到一个组件,而lotus只能负责一个miner的出块.

## lotus集群组件替换为venus
1.替换说明

venus在管理多个集群时更具优越性,其共享组件可为多个集群服务.如果集群比较少时,不建议搭建一套共享服务,可以联合多个集群公用一套venus服务组件.

2.共享组件替换lotus

venus服务的共享组件包括：venus、venus-messager、venus-auth、venus-wallet、venus-miner,部署可参考 [How-To-Deploy-MingPool](How-To-Deploy-MingPool.md).

3.官方版lotus-miner组件替换

* 停止产生新的sector封装任务,等待所有在做的sector任务完成;
* 用venus-sealer替换lotus-miner重启服务,venus-sealer部署参考 [How-To-Deploy-MingPool](How-To-Deploy-MingPool.md).

替换前
![lotus-cluster-1](./images/lotus-cluster-1.png)


替换后
![venus-replace-lotus-cluster-1](./images/venus-replace-lotus-cluster-1.png)

4.定制化lotus-miner组件替换

部分用户自己改造了lotus-miner,想继续沿用的话,需要对lotus-miner做如下改造:
* 不起用lotus-miner的winingPoSt,需要改动代码; 
* 已有Sector数据转换,需要代码实现;
* lotus-miner对接venus-messager,需要代码实现;
* 如果没有开发人员,此方案暂无法实现,venus社区会推出该方案相关工具及开发者文档.

替换前
![lotus-cluster-2](./images/lotus-cluster-2.png)


替换后
![venus-replace-lotus-cluster-2](./images/venus-replace-lotus-cluster-2.png)