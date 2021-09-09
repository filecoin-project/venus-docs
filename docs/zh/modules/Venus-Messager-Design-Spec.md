# Venus Messager 设计说明书

venus-messager是一个用于管理本地消息的组件，用于保存地址消息、管理消息状态和控制推送消息的频率。

* 支持多个miner：提供了较为实用的API给miner推送消息
* 持久化存储：支持MySQL和SQLlite两种存储方案
* nonce管理：合理的分配nonce，降低nonce冲突
* 动态的控制推送频率和消息量
* 集成权限验证、trace及API限流
* 提供较为完善的命令行工具

## 详细设计

### 整体架构

![](/venus-messager/venus-messager-design.jpg)

### 功能模块

#### 权限验证

该验证分两部分，一是对访问venus-messager 使用token是否合法的验证，二是验证是否具有访问API的权限，下图是权限验证流程图。

![](/venus-messager/venus-messager-token-verify.jpg)

##### token 合法性验证

token 分为两种，一种是由venus-auth服务生成，另外一种是venus-messager本身生成，该token只用于本机的命令行命令。
token 会被venus-messager和venus-auth依次验证合法性，只要其中一个验证通过就算合法token。
venus-auth 验证token合法后会返回该token的权限信息。

##### API权限验证

API权限分为4种：`read`, `write`, `sign`, `admin`，权限依次由低到高，token的权限必须等于或者大于API设定的权限才算验证通过。

#### 消息选择

* 获取所有需推送消息的地址，然后并发的按地址选择消息
* 判断该地址能否推送消息
* 获取该地的actor，主要是为了获得链上nonce
* 比较链上nonce和该地址的nonce，若链上nonce大，则更新该地址nonce
* 获取该地的fill消息并放到待推送列表
* 与该地址的最大选择消息数比较并计算可推送消息数
* 获取改地址的unfill消息，并排查已过期消息，最后获得候选消息
* 通过节点预估候选消息的gas，预估完成后筛除预估失败消息
* 逐个消息进行签名，直到达到可推送消息，该地址该次选择消息完成
* 等待各个地址选择消息完成
* 更新消息信息和地址nonce
* 推送消息到节点

> 下图是消息选择流程图

![](/venus-messager/venus-messager-select-message.jpg)

#### 数据库模块

该模块设计为能够支持MySQL和SQLlite两种数据库，并能够通过配置文件来配置具体使用那个数据库，因此需要将该模块对外交互部分抽象成接口，减少外部对使用不同数据库的感知。
使用单元测试对该模块各个具体实现进行测试。
```
# 统一对外接口
type Repo interface {
    AddressRepo() AddressRepo
    MessageRepo() MessageRepo
}

# 地址表接口
type AddressRepo interface {}
# 消息表接口
type MessageRepo interface {}
```

#### 消息状态管理

消息总共分以下几种状态：
```
UnKnown：    unkonwn
UnFillMsg：  未签名
FillMsg：    已签名
OnChainMsg： 已上链
FailedMsg：  失败
ReplacedMsg：被替换
NoWalletMsg：未找到钱包
```

> 下图是消息状态转换图

![](/venus-messager/venus-messager-message-state.jpg)

#### head 处理

通过调用节点ChainNotify接口可以不断的获得新的head，head 里面包含current、apply和revert三种tipset，需要分别对其处理。
首先对current类型的tipset进行处理，与venus-messager已处理的tipset做对比，防止漏处理某些tipset。
然后处理revert tipsets，再处理apply tipsets，根据apply tipset拿到已经上链的消息，然后再逐一更新venus-messager中对应的消息信息。


#### 命令行命令

* 全局参数
    * 查询全局参数
    * 设置全局参数
* 地址
    * 查询地址信息
    * 禁止和激活地址
    * 设置选择消息数
* 消息
    * 查询消息信息
    * 列出失败、阻塞消息
    * 更新消息状态
    * 调整消息状态
* 节点
    * 查询节点信息
    * 增加节点

### 数据表设计

venus-messager 用到了4张数据表，分别是全局参数表，地址表，消息表，节点信息表，以下是各个表的详细结构。

1. 全局参数表，用于保存全局参数信息

name | type | desc
---|---|---|
id | smallint(2) | primary key
gas_over_estimation | double | gas 预估超出的系数
max_fee | varchar(256) |
max_fee_cap | varchar(256) |
sel_msg_num | bigint(20) | 单次选择的最大消息数

2. 地址表，用于保存地址相关信息

name | type | desc
---|---|---|
id | varchar(256) | primary key
addr | varchar(256) | uniqueIndex, 地址
nonce | bigint | 地址的nonce
weight | bigint |
sel_msg_num | bigint(20) | 改地址单次选择的最大消息数
state | int | 地址状态
gas_over_estimation | decimal(10,2) | gas 预估超出的系数
max_fee | varchar(256) |
max_fee_cap | varchar(256) |
is_deleted | int | 是否删除，-1：否，1：是
created_at | datetime | 创建时间
updated_at | datetime | 更新时间

3. 消息表，用于保存消息初始信息，执行结果等信息

name | type | desc
---|---|---|
id | varchar(256) | primary key
version | bigint | 消息版本
nonce | bigint | 消息使用的nonce
from_addr | varchar(256) | 消息发送地址
to | varchar(256) | 消息接收地址
value | varchar(256) | 转账消息表示转账金额
gas_limit | bigint |
gas_fee_cap | varchar(256) |
gas_premium | varchar(256) |
method | int | 执行消息的函数代号
params | blob |
signed_data | blob | 消息签名结果
unsigned_cid | varchar(256) | unsigned消息的CID
signed_cid | varchar(256) | signed消息的CID
height | bigint | 消息打包高度
receipt_exit_code | bigint | 消息执行完的退出码
receipt_return_value | blob | 消息执行返回值
receipt_gas_used | bigint | 消息执行消耗的gas
tipset_key | varchar(1024) | 消息打包高度的tipset的key
meta_expire_epoch | bigint | 过期高度
meta_gas_over_estimation | gas 预估超出的系数
meta_max_fee | varchar(256) |
meta_max_fee_cap | varchar(256) |
wallet_name | varchar(256) | 钱包名，用于指定具体签名钱包
from_user | varchar(256) | 用户名，用于指定具体签名用户
state | int | 消息状态
is_deleted | int | 是否删除，-1：否，1：是
created_at | datetime | 创建时间
updated_at | datetime | 更新时间

4. 节点信息表，用于保存节点相关信息

name | type | desc
---|---|---|
id | varchar(256) | primary key
name | varchar(256) | 节点名
url | varchar(256) | 节点 URL
token | varchar(256) | 节点 token
node_type | int | 节点类型
is_deleted | int | 是否删除，-1：否，1：是
created_at | datetime | 创建时间
updated_at | datetime | 更新时间
