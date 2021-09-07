## Venus系统架构简介

### 背景简介

VENUS项目是开源在[github仓库](https://github.com/filecoin-project)上的filecoin链的全节点实现, 用于filecoin链节点数据的同步,并对外提供对链数据的查询和相关操作的服务.

### Venus架构

Venus从功能逻辑上, 从上往下可以分为以下几个层级:
> <font color=blue>API接口层, 数据同步和状态管理层, 共识算法层</font>

#### 第一层: <font color=green>API接口层</font>

**venus节点对外提供链的相关服务,是基于对外提供API调用的方式.**
api接口层主的主要实包括API接口定义和实现, 代码位于
[接口定义](https://github.com/filecoin-project/venus/tree/master/app/client)和[功能实现](https://github.com/filecoin-project/venus/tree/master/app/submodule)两个目录中.

#### 第二层: <font color=green>数据同步</font>和<font color=green>状态管理层</font>

##### <font color=green>数据同步</font>

数据同步主要职能是遵循共识的基础上, 同步区块链数据,尽最大可能和效率保证本地节点上的数据与区块链保持一致.

数据同步主要包含以下几个模块.

1. [net](https://github.com/filecoin-project/venus/tree/master/pkg/net)模块

> 主要负责维持活跃的高质量的p2p节点池, 负责p2p节点池的管理.以及p2p协议上消息的推送和接收

2. [discovery](https://github.com/filecoin-project/venus/tree/master/pkg/discovery)模块

> discovery模块位于net模块的更高层, 基于p2p协议定义了一套应用层的hello协议,用于与其它节点进行chain head的交换.

3. [chainsync](https://github.com/filecoin-project/venus/tree/master/pkg/chainsync)模块

> chainsync位于数据同步功能的最顶层, 包括了链数据同步的主要业务

##### <font color=green>状态管理</font>

伴随着区块数据的同步,整个区块链的状态是持续发生变化, 每一次的变化的最终结果, 是基于前一次的状态发生的.

在venus中使用[statemanager](https://github.com/filecoin-project/venus/tree/master/pkg/statemanger)模块来管理区块链的状态, statemanager依赖更底层的<font color=green>共识</font>和<font color=green>数据存储
</font>

#### 第三层: <font color=green>共识</font>和<font color=green>数据存储</font>

##### <font color=green>共识层</font>
共识层包含了大量的算法和密码学内容, 提供了对区块中数据进行校验的方法.并负责执行Tipset中包含的消息,当某个tipset被共识层执行完毕以后,链的状态就发生了变化.
共识层主要包含两个子模块, 分别是:
1. [crypto](https://github.com/filecoin-project/venus/tree/master/pkg/crypto)模块

> 集合了filecoin链上使用到的几种密码学签名算法,提供了这些算法的签名和验证的功能.

2. [vm](https://github.com/filecoin-project/venus/tree/master/pkg/vm)模块

> 提供对actor的方法进行执行的运行环境.

3. [consensus](https://github.com/filecoin-project/venus/tree/master/pkg/consensus)模块

> 依赖<font color=green>vm</font>和<font color=green>crypto</font>模块,除了通过vm提供的功能来执行tipset上的消息之外,还提供对链数据进行校验,签名等功能.

##### <font color=green>数据存储和访问层</font>
venus底层数据库为badger, 在badger的基础上抽象出了[blockstore](https://github.com/ipfs/go-ipfs-blockstore/blob/b57a17e70abad652a163f43e28efffd47a2176c5/blockstore.go#L35)类型,

由再blockstore抽象出了[ChianStore](https://github.com/filecoin-project/venus/blob/ce33de1be09df3e71a688ed9a63aeb1a5cbd437a/pkg/chain/store.go#L109)和[MessageStore](https://github.com/filecoin-project/venus/blob/ce33de1be09df3e71a688ed9a63aeb1a5cbd437a/pkg/chain/message_store.go#L51)等.

所以venus的数据存储大致有以下几个模块:

1. [repo](https://github.com/filecoin-project/venus/tree/master/pkg/repo)模块

> repo模块负责打开badger数据库,并返回包装以后的blockstore.

2. [ChainStore](https://github.com/filecoin-project/venus/blob/ce33de1be09df3e71a688ed9a63aeb1a5cbd437a/pkg/chain/store.go#L109)模块.

> 将blockstore包装为ChainStore提供链block, state, actor等对象存储和访问的方法.

3. [MessageStore](https://github.com/filecoin-project/venus/blob/ce33de1be09df3e71a688ed9a63aeb1a5cbd437a/pkg/chain/message_store.go#L51)模块

> 将blockstore包装为MessageStore并提供消息存储和访问的方法.

**以上描述了Venus项目的总体架构, 但由于filecoin系统本身的复杂性,还有许多其它的模块在本文中并未提及**

### Venus同步时序图
<img src="https://raw.githubusercontent.com/filecoin-project/venus-docs/master/docs/.vuepress/public/venus_sequence.png"/>

### Venus架构图
<img src="https://raw.githubusercontent.com/filecoin-project/venus-docs/master/docs/.vuepress/public/venus-system-architecture.png" width = "600" height = "400" />

### 总结
Venus的系统比较庞大, 本文只是对主要的系统架构进行了简单的介绍, 
随着代码的演进venus的系统架构也在不断的变化中,我们会持续对venus的系统架构进行优化和改进.

