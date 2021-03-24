# Venus wallet
1. Venus wallet是一个针对filecoin提供的策略化远程wallet，支持JsonRPC2.0调用，它能动态配置各种待签名数据类型是否被放行。
2. 项目与Lotus以及Venus之间独立解耦，可以供Filecoin的各种不同实现调用

## 目录
- [快速启动](#快速启动)
    - [1. 下载代码](#1下载代码)
    - [2. 编译](#2编译)
    - [3. 启动服务进程](#3启动服务进程)
    - [4. 配置介绍](#4配置介绍)
- [CLI操作指南](#cli操作指南)
    - [查看帮助](#查看帮助)
    - [Venus wallet基本操作](#venus-wallet基本操作)
        - [wallet状态](#wallet状态)
        - [私钥管理](#私钥管理)
        - [JWT权限管理](#jwt权限管理)
        - [策略化](#策略化)
## 快速启动
### 1. 下载代码
```
git clone https://github.com/ipfs-force-community/venus-wallet.git
```

### 2. 编译
- go version ^1.15
```
# 设置bls编译环境变量
export CGO_CFLAGS_ALLOW="-D__BLST_PORTABLE__"
export CGO_CFLAGS="-D__BLST_PORTABLE__"

# 编译当前平台可执行文件
make

# 如果需要在mac上交叉编译Linux版本
# 需要安装gcc相关（也可以通过Github将文件下载到本地后,本地brew安装）
brew install FiloSottile/musl-cross/musl-cross
make linux
```

### 3. 启动服务进程
```
# 默认主网启动(--network=main)
# 地址f开头
$ ./venus-wallet run 

# 测试网启动
# 地址t开头
$ ./venus-wallet run  --network=test      
```

### 4. 配置介绍
- 默认文件位置 “~/.venus_wallet/config.toml”
```
[API]
  # 本地进程http监听地址
  ListenAddress = "/ip4/0.0.0.0/tcp/5678/http"

[DB]
  # 默认内嵌存储数据库数据文件
  Conn = "~/.venus_wallet/keystore.sqlit"
  Type = "sqlite"
  DebugMode = true

[JWT]
  # JWT token hex，未配置情况下会随机生成
  Token = "65794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a42624778766479493657794a795a57466b4969776964334a70644755694c434a7a615764754969776959575274615734695858302e7133787a356f75634f6f543378774d5463743870574d42727668695f67697a4f7a365142674b2d6e4f7763"
  # JWT secret hex，未配置情况下会随机生成
  Secret = "7c40ce66a492e35ac828e8333a5703e38b23add87f29bd8fc7343989e08b3458"

[Factor]
  # keystore私钥对称加密变量
  ScryptN = 262144
  ScryptP = 1

[Strategy]
  # 策略等级，0：不开启策略化 1：只验证待签名数据类型 2：验证待签名数据类型，且验证配置了method策略的message类型
  Level = 2
  NodeURL = "/ip4/127.0.0.1/tcp/2345/http"
```

# CLI 操作指南
## 查看帮助

```
$ ./venus-wallet -h


NAME:
   venus remote-wallet - A new cli application

USAGE:
   venus-wallet [global options] command [command options] [arguments...]

VERSION:
   1.0.0'+gitc04f451.dirty'

COMMANDS:
   run                   Start a venus wallet process
   auth                  Manage RPC permissions
   log                   Manage logging
   strategy, st          Manage logging
   new                   Generate a new key of the given type
   list, ls              List wallet address
   export                export keys
   import                import keys
   sign                  sign a message
   del                   del a wallet and message
   set-password, setpwd  Store a credential for a keystore file
   unlock                unlock the wallet and release private key
   lock                  Restrict the use of secret keys after locking wallet
   lockState, lockstate  unlock the wallet and release private key
   help, h               Shows a list of commands or help for one command

GLOBAL OPTIONS:
   --help, -h     show help (default: false)
   --version, -v  print the version (default: false)
```
- 这里的操作是扁平单层的，区别于Venus或者lotus的`./venus wallet list`等操作，Venus wallet 中只需要`./venus-wallet list`即可。
- 对于一些命令做了aliase处理，如`strategy`可以直接使用`st`代替。


## Venus wallet基础操作
### wallet状态
#### 1. 设置私钥对称加密Key
```
# ./venus-wallet setpwd (aliase)
$ ./venus-wallet set-password
Password:******
Enter Password again:******

# res
Password set successfully
```
> 注意：此密码只暂存于内存中，用于对私钥的对称加密，一旦服务进程以任何形式退出，都无法还原此密码，所以对于此程序管理的私钥，需自行进行额外备份，也可以直接备份此密码。

- 设定密码后，wallet默认为unlock状态
#### 2. 锁定wallet
> wallet锁定后，签名，生成新地址，导入，导出私钥等功能都将禁用，会影响到远程调用链，所以请慎用。
```
$ ./venus-wallet lock
Password:******

# res
wallet lock successfully
```
#### 3. 解锁wallet
> 与锁定wallet相反，解锁后将放行wallet所有功能。
```
$ ./venus-wallet unlock
Password:******

# res
wallet unlock successfully
```
#### 4. 查看wallet状态
```
$ ./venus-wallet lockstate

#res 
wallet state: unlocked
```
### 私钥管理
#### 1. 生成新随机私钥
> venus-wallet new [command options] [bls|secp256k1 (default secp256k1)]
```
$ ./venus-wallet new 

#res
t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy
```
- 默认secp256k1类型，也可`./venus-wallet new bls`生成bls类型私钥

#### 2. 导入私钥
> venus-wallet import [command options] [<path> (optional, will read from stdin if omitted)]
```
$ ./venus-wallet import
Enter private key:7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22626e765665386d53587171346173384633654c647a7438794a6d68764e434c377132795a6c6657784341303d227d

#res 
imported key t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy successfully!
```
#### 3. 导出私钥
> venus-wallet export [command options] [address]
```
$ ./venus-wallet export t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy

# res
7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22626e765665386d53587171346173384633654c647a7438794a6d68764e434c377132795a6c6657784341303d227d
```

#### 4. 查看地址列表
```
$ ./venus-wallet list

t3uktqgxtagiyk5cxrjn5h4wq4v247saxtfukfi6zsvt4sek2q2ufkg27biasg7247zhdpm2kpotukwsapr7pa
t3rcgmzisnusxvwrwvi7l5hcuissvmluvkrzfuehjdfawba75qlv3mxl6rtnxitt33z5fuwds76rbcyafhxrua
t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy
```
> 显示全部私钥对应地址，这里有spec和bls两种地址存在
##### 5. 删除指定私钥
> venus-wallet del [command options] <address>
```
$ ./venus-wallet del t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy

#res 
success
```

### JWT权限管理
用于远程访问接口授权

#### 1. 获取远程连接字符串
> venus remote-wallet auth api-info [command options] [arguments...]
```
$ ./venus-wallet auth api-info --perm admin

#res
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.q3xz5oucOoT3xwMTct8pWMBrvhi_gizOz6QBgK-nOwc:/ip4/0.0.0.0/tcp/5678/http
```
- perm有read,write,sign,admin由低到高4种权限，它们由配置文件中对应的`JWT`配置生成，不会发生动态改变。

### 策略化
策略化功能主要是为了限制私钥对指定类型签名用，可以有效的阻止一些非允许的数据签名。

- 概念
    + keyBind
        + 每个地址可以绑定多种策略，这里把指定地址绑定策略的名称定义为keyBind
        + 关键字有name,msgType,method
        + name: keyBind的自定义名称，全局唯一
        + msgType: filecoin数据类型,如：block,msg等
        + method: filecoin中message类型对应的method，共计60多种
    + group
        + 一个keyBind由多个由多个KeyBind组合而成
        + 关键字有name,keyBindName
        
    + token 
        + 关键字有token,groupName
        + 针对一个group生成随机token,用于提供给远程wallet策略化接入用，group和token的关系为1:n
    + template
        + template目前有msgType和method两种
        + 关键字：name,msgType,method
        + 可以配置多种策略模板，供后续私钥快速绑定用
    
- 注意事项
    + 目前keyBind的变动会直接影响到group，group会直接影响到token的策略配置，这一切目前都是联动的

```
$ ./venus-wallet strategy -h

NAME:
   venus remote-wallet strategy - Manage logging

USAGE:
   venus remote-wallet strategy command [command options] [arguments...]

COMMANDS:
   types                              show all msgTypes
   methods                            show all methods (index are used for counting only)
   msgTypeTemplate, mtt               show msgTypeTemplate by name
   methodTemplateByName, mt           show methodTemplate by name
   keyBind, kb                        show keyBind by name
   keyBinds, kbs                      show keyBinds by address
   group, g                           show group by name
   listGroup, lg                      show a range of groups (the element of groups only contain name)
   groupTokens, gts                   show a range of tokens belong to group
   listKeyBinds, lkb                  show a range of keyBinds (the element of groups only contain name)
   listMethodTemplates, lmt           show a range of method templates
   listMsgTypeTemplates, lmtt         show a range of method templates
   newMsgTypeTemplate, newMTT         create a msgType common template
   newMethodTemplate, newMT           create a msg methods common template
   newKeyBindCustom, newKBC           create a strategy about wallet bind msgType and methods
   newKeyBindFromTemplate, newKBFT    create a strategy about wallet bind msgType and methods with template
   newGroup, newG                     create a group with keyBinds
   newWalletToken, newWT              create a wallet token with group
   removeMsgTypeTemplate, rmMTT       remove msgTypeTemplate ( not affect the group strategy that has been created)
   removeMethodTemplate, rmMT         remove MethodTemplate ( not affect the group strategy that has been created)
   removeKeyBind, rmKB                remove keyBind ( not affect the group strategy that has been created)
   removeKeyBindByAddress, rmKBBA     remove keyBinds by address ( not affect the group strategy that has been created)
   removeGroup, rmG                   remove group by address ( not affect the group strategy that has been created)
   removeToken, rmT                   remove token
   pullMethodFromKeyBind, pullM4KB    remove elements of methods in keyBind
   pullMsgTypeFromKeyBind, pullMT4KB  remove elements of msgTypes in keyBind
   pushMethodIntoKeyBind, pushM2KB    append methods into keyBind
   pushMsgTypeIntoKeyBind, pushMT2KB  append msgTypes into keyBind
   help, h                            Shows a list of commands or help for one command

OPTIONS:

```
#### 1. 查看msgType和method
```
# 查看类型 （code 为 type的1:1对应值，永不变动）
$ ./venus-wallet st types
# res
code	type
0	unknown
1	chainMsg
2	block
3	dealProposal
4	drawRandomParam
5	signedVoucher
6	storageAsk
7	askResponse
8	netWorkResponse
9	providerDealState
10	clientDeal

# 查看method（字母排序，随着filecoin的迭代，method对应的index会变动，请勿使用index标记method）

$ ./venus-wallet st methods
index	method
1	ActivateDeals
2	AddBalance
3	AddLockedFund
4	AddSigner
5	AddVerifiedClient
6	AddVerifier
7	ApplyRewards
8	Approve
9	AwardBlockReward
10	Cancel
11	ChangeMultiaddrs
12	ChangeNumApprovalsThreshold
13	ChangeOwnerAddress
14	ChangePeerID
15	ChangeWorkerAddress
16	CheckSectorProven
17	Collect
18	CompactPartitions
19	CompactSectorNumbers
20	ComputeDataCommitment
21	ConfirmSectorProofsValid
22	ConfirmUpdateWorkerKey
23	Constructor
24	ControlAddresses
25	CreateMiner
26	CronTick
27	CurrentTotalPower
28	DeclareFaults
29	DeclareFaultsRecovered
30	DisputeWindowedPoSt
31	EnrollCronEvent
32	EpochTick
33	Exec
34	ExtendSectorExpiration
35	LockBalance
36	OnConsensusFault
37	OnDeferredCronEvent
38	OnEpochTickEnd
39	OnMinerSectorsTerminate
40	PreCommitSector
41	Propose
42	ProveCommitSector
43	PubkeyAddress
44	PublishStorageDeals
45	RemoveSigner
46	RemoveVerifier
47	RepayDebt
48	ReportConsensusFault
49	RestoreBytes
50	Send
51	Settle
52	SubmitPoRepForBulkVerify
53	SubmitWindowedPoSt
54	SwapSigner
55	TerminateSectors
56	ThisEpochReward
57	UpdateChannelState
58	UpdateClaimedPower
59	UpdateNetworkKPI
60	UpdatePledgeTotal
61	UseBytes
62	VerifyDealsForActivation
63	WithdrawBalance

```
#### 1. 创建keyBind
##### 1. 自定义创建
> venus remote-wallet strategy newKeyBindCustom [command options] [name, address, codes, methods]
```
$ ./venus-wallet st newKBC kb1 <addr1> \
0,1,2,3 \
CreateMiner,Send

#res
success
```
- kb1是keybind的全局唯一名称

##### 2. 从模板创建

###### 2.1 创建msgType模板
> venus remote-wallet strategy newMsgTypeTemplate [command options] [name, code1 code2 ...]

```
$ ./venus-wallet st newMsgTypeTemplate mttmp1 0 1 2 3 4 5

#res
success
```
- mtmp1为msgType template的全局唯一名称

###### 2.2 创建method模板
> venus remote-wallet strategy newMethodTemplate [command options] [name, method1 method2 ...]
```
$ ./venus-wallet st newMethodTemplate mtmp1 ActivateDeals AddBalance AddLockedFund

#res
success
```
- mttmp1为method template的全局唯一名称

###### 2.3 通过模板创建KeyBind
> venus remote-wallet strategy newKeyBindFromTemplate [command options] [name, address, msgTypeTemplateName, methodTemplateName]
```
$ ./venus-wallet st newKeyBindFromTemplate kb2 <addr2> \
mttmp1 mtmp1

#res
success
```
##### 3. 创建group
> venus remote-wallet strategy newGroup [command options] [name, keyBindName1 keyBindName2 ...]
```
$ ./venus-wallet st newGroup group1 kb1 kb2
```
- group1: group全局唯一名称
- kb1,kb2: 之前创建的2个KeyBind

##### 4. 生成group token用于对外暴露策略调用
> venus remote-wallet strategy newWalletToken [command options] [groupName]
```
$ ./venus-wallet st newWalletToken group1

#res
660ceba5-13f8-4571-803e-706e4a4fd36e
```
- 这里针对group1可以生成多个token，也就是说一个group可以生成多个token，用以区分调用链路

##### 4. 原子性修改keyBind策略配置

###### 4.1 查询以后keybind 
> venus remote-wallet strategy keyBind [command options] [name]
```
$ ./venus-wallet st keyBind kb1

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```
###### 4.2 keyBind增加method
> venus remote-wallet strategy pushMethodIntoKeyBind [command options] [keyBindName, method1 method2 ...]

```
$ ./venus-wallet st pushMethodIntoKeyBind kb1 Settle SwapSigner

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send,Settle,SwapSigner
```
- 添加成功后,Settle SwapSigner将会原子性的增加到methods中，目前这个操作是防并发的。
###### 4.3 keyBind增加msgType
> venus remote-wallet strategy pushMsgTypeIntoKeyBind [command options] [keyBindName, code1 code2 ...]
```
$ ./venus-wallet st pushMsgTypeIntoKeyBind kb1 4 5 6

#res
address	: <addr1>
types	: 0,1,2,3,4,5,6
methods	: CreateMiner,Send,Settle,SwapSigner
```
###### 4.4 keyBind移除method
> venus remote-wallet strategy pullMethodFromKeyBind [command options] [keyBindName, method1 method2 ...]
```
$ ./venus-wallet st pullMethodFromKeyBind kb1 Settle SwapSigner

#res
address	: <addr1>
types	: 0,1,2,3,4,5,6
methods	: CreateMiner,Send
```

###### 4.5 keyBind移除msgType
> venus remote-wallet strategy pullMsgTypeFromKeyBind [command options] [keyBindName, code1 code2 ...]
```
$ ./venus-wallet st pullMsgTypeFromKeyBind kb1 4 5 6

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```
##### 5. 查询操作
###### 5.1 查询msgType列表
> venus remote-wallet strategy listMsgTypeTemplates [command options] [from to]
```
$ ./venus-wallet st listMsgTypeTemplates 0 20

#res
num	: 1
name	: mttmp1
types	: 0,1,2,3,4,5

num	: 2
name	: mttmp2
types	: 0,1,2,3,4,5
```
- from: 偏移量开始位
- to: 偏移量截止位
- num: 计数,无其他作用

###### 5.2 查询指定msgType模板
>  venus remote-wallet strategy msgTypeTemplate [command options] [name]
```
$ ./venus-wallet st msgTypeTemplate mttmp1

# res
0,1,2,3,4,5
```

###### 5.3 查询method列表
> venus remote-wallet strategy listMethodTemplates [command options] [from to]
```
$ ./venus-wallet st listMethodTemplates 0 20

#res
num	: 1
name	: mtmp1
methods	: ActivateDeals,AddBalance,AddLockedFund

num	: 2
name	: mtmp2
methods	: ActivateDeals,AddBalance,AddLockedFund
```

###### 5.4 查询指定method模板
> venus remote-wallet strategy methodTemplateByName [command options] [name]
```
$ ./venus-wallet st methodTemplateByName mtmp1

#res
ActivateDeals,AddBalance,AddLockedFund
```

###### 5.5 查询keyBind列表
> venus remote-wallet strategy listKeyBinds [command options] [from to]
```
$ ./venus-wallet st listKeyBinds 0 20
#res
num	: 1
name	: kb1
addr    : <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send

num	: 2
name	: kb2
addr    : <addr2>
types	: 0,2,3
methods	: CreateMiner
```
###### 5.6 查询指定地址的keyBind列表
> venus remote-wallet strategy keyBinds [command options] [address]
```
$ ./venus-wallet st keyBinds <addr1>
#res
$ ./venus-wallet st listKeyBinds 0 20
num	: 1
name	: kb1
addr    : <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send

num	: 2
name	: kb2
addr    : <addr1>
types	: 0,2,3
methods	: CreateMiner
```
###### 5.6 查询指定name的keyBind
> venus remote-wallet strategy keyBind [command options] [name]
```
$ ./venus-wallet st keyBind kb1
#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```

###### 5.7 查询group列表
> venus remote-wallet strategy listGroup [command options] [from to]
```
$ ./venus-wallet st listGroup 0 20
#res
1	: group1
2	: group2
```
- 这里只显示group的名称列表，不包含详细数据

###### 5.8 查询指定group
> venus remote-wallet strategy group [command options] [name]
```
$ ./venus-wallet st group group1
#res
num	: 1
keybind	: kb1
types	: 0,1,2,3
methods	: CreateMiner,Send
```
###### 5.9 查询Group衍生的token列表
> venus remote-wallet strategy groupTokens [command options] [groupName]
```
$ ./venus-wallet st groupTokens group1
#res
041457f0-ea9a-4486-b648-1feb05dda0c0
a8f09b9f-ad28-8734-c40c-03c222d03982
```
###### 5.10 查询token对应的group详情
> venus remote-wallet strategy tokenInfo [command options] [token]
```
$ ./venus-wallet st tokenInfo 041457f0-ea9a-4486-b648-1feb05dda0c0
#res
groupName: group1
keyBinds:
	num	: 1
	name	: kb1
	addr	: t3uktqgxtagiyk5cxrjn5h4wq4v247saxtfukfi6zsvt4sek2q2ufkg27biasg7247zhdpm2kpotukwsapr7pa
	types	: 0,1,2,3
	methods	: CreateMiner,Send
```

##### 6. 删除数据
>这里是真删除，请谨慎使用

###### 6.1 删除msgType模板(不影响根据模板创建的keyBind)
> venus remote-wallet strategy removeMsgTypeTemplate [command options] [name]
```
$ ./venus-wallet st removeMsgTypeTemplate mttmp1
#res
success
```

###### 6.2 删除method模板(不影响根据模板创建的keyBind)
> venus remote-wallet strategy removeMethodTemplate [command options] [name]
```
$ ./venus-wallet st removeMethodTemplate mtmp1
#res
success
```

###### 6.3 根据名称删除keyBind(将影响group，从而影响token对应的group策略)
> venus remote-wallet strategy removeKeyBind [command options] [name]
```
$ ./venus-wallet st removeKeyBind kb1
```

###### 6.4 根据wallet地址删除keyBind(批量删除，将影响group，从而影响到token对应的group策略)
> venus remote-wallet strategy removeKeyBindByAddress [command options] [name]
```
$ ./venus-wallet st removeKeyBindByAddress <addr1>
#res
2 rows of data were deleted
```
- 返回移除的keyBind数量

###### 6.5 移除group(将导致所有该group对应的策略失效)
> venus remote-wallet strategy removeGroup [command options] [name]
```
$ ./venus-wallet st removeGroup group1
#res
success
```
###### 6.6 移除token
> venus remote-wallet strategy removeToken [command options] [token]
```
$ ./venus-wallet st removeToken 041457f0-ea9a-4486-b648-1feb05dda0c0
#res
success
```
