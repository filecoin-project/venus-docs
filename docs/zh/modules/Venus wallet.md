# Venus wallet
1. venus-wallet是一个针对Filecoin提供的策略化远程wallet，支持JsonRPC2.0调用，它能动态配置各种待签名数据类型是否被放行。
2. 项目与Lotus以及Venus之间独立解耦，可以供Filecoin的各种不同实现调用

## 快速启动
### 1. 下载代码
```shell script
git clone https://github.com/filecoin-project/venus-wallet.git
```

### 2. 编译
- go version ^1.15
```shell script
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
```shell script
# 默认主网启动(--network=main)
# 地址f开头
$ ./venus-wallet run 

# 测试网启动
# 地址t开头
$ ./venus-wallet run  --network=test      
```

### 4. 配置介绍
- 默认文件位置 “~/.venus_wallet/config.toml” 钱包配置文件务必备份好
```toml
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

[APIRegisterHub]
  # gateway的URL，不配置则不连接gateway
  RegisterAPI = ["/ip4/127.0.0.1/tcp/45132"]
  # gateway的token
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.oakIfSg1Iiv1T2F1BtH1bsb_1GeXWuirdPSjvE5wQLs"
  SupportAccounts = ["testminer"]
```

# CLI 操作指南
## 查看帮助

```shell script
$ ./venus-wallet -h


NAME:
   venus-wallet - A new cli application

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
```shell script
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
```shell script
$ ./venus-wallet lock
Password:******

# res
wallet lock successfully
```
#### 3. 解锁wallet
> 与锁定wallet相反，解锁后将放行wallet所有功能。
```shell script
$ ./venus-wallet unlock
Password:******

# res
wallet unlock successfully
```
#### 4. 查看wallet状态
```shell script
$ ./venus-wallet lockstate

#res 
wallet state: unlocked
```
### 私钥管理
#### 1. 生成新随机私钥
> venus-wallet new [command options] [bls|secp256k1 (default secp256k1)]
```shell script
$ ./venus-wallet new 

#res
t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy
```
- 默认secp256k1类型，也可`./venus-wallet new bls`生成bls类型私钥

#### 2. 导入私钥
> venus-wallet import [command options] [\<path\> (optional, will read from stdin if omitted)]
```shell script
$ ./venus-wallet import
Enter private key:7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22626e765665386d53587171346173384633654c647a7438794a6d68764e434c377132795a6c6657784341303d227d

#res 
imported key t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy successfully!
```
#### 3. 导出私钥
> venus-wallet export [command options] [address]
```shell script
$ ./venus-wallet export t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy

# res
7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22626e765665386d53587171346173384633654c647a7438794a6d68764e434c377132795a6c6657784341303d227d
```

#### 4. 查看地址列表
```shell script
$ ./venus-wallet list

t3uktqgxtagiyk5cxrjn5h4wq4v247saxtfukfi6zsvt4sek2q2ufkg27biasg7247zhdpm2kpotukwsapr7pa
t3rcgmzisnusxvwrwvi7l5hcuissvmluvkrzfuehjdfawba75qlv3mxl6rtnxitt33z5fuwds76rbcyafhxrua
t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy
```
> 显示全部私钥对应地址，这里有spec和bls两种地址存在
##### 5. 删除指定私钥
> venus-wallet del [command options] \<address\>
```shell script
$ ./venus-wallet del t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy

#res 
success
```

### JWT权限管理
用于远程访问接口授权

#### 1. 获取远程连接字符串
> venus-wallet auth api-info [command options] [arguments...]
```shell script
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

```shell script
$ ./venus-wallet strategy -h

NAME:
   venus-wallet strategy - Manage logging

USAGE:
   venus-wallet strategy command [command options] [arguments...]

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
   stTokenInfo, ti                    show info about token
   listMethodTemplates, lmt           show a range of method templates
   listMsgTypeTemplates, lmtt         show a range of method templates
   newMsgTypeTemplate, newMTT         create a msgType common template
   newMethodTemplate, newMT           create a msg methods common template
   newKeyBindCustom, newKBC           create a strategy about wallet bind msgType and methods
   newKeyBindFromTemplate, newKBFT    create a strategy about wallet bind msgType and methods with template
   newGroup, newG                     create a group with keyBinds
   newStToken, newWT                  create a wallet token with group
   removeMsgTypeTemplate, rmMTT       remove msgTypeTemplate ( not affect the group strategy that has been created)
   removeMethodTemplate, rmMT         remove MethodTemplate ( not affect the group strategy that has been created)
   removeKeyBind, rmKB                remove keyBind ( not affect the group strategy that has been created)
   removeKeyBindByAddress, rmKBBA     remove keyBinds by address ( not affect the group strategy that has been created)
   removeGroup, rmG                   remove group by address ( not affect the group strategy that has been created)
   removeStToken, rmT                 remove token
   removeMethodFromKeyBind, rmM4KB    remove elements of methods in keyBind
   removeMsgTypeFromKeyBind, rmMT4KB  remove elements of msgTypes in keyBind
   addMethodIntoKeyBind, addM2KB      append methods into keyBind
   addMsgTypeIntoKeyBind, addMT2KB    append msgTypes into keyBind
   help, h                            Shows a list of commands or help for one command

OPTIONS:

```
#### 1. 查看msgType和method
```shell script
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
> venus-wallet strategy newKeyBindCustom [command options] [name, address, codes, methods]
```shell script
$ ./venus-wallet st newKBC kb1 <addr1> \
0,1,2,3 \
CreateMiner,Send

#res
success
```
- kb1是keyBind的全局唯一名称
- `<addr1>`为指代，正式的address为BLS，或者SECP的地址

##### 2. 从模板创建

###### 2.1 创建msgType模板
> venus-wallet strategy newMsgTypeTemplate [command options] [name, code1 code2 ...]

```shell script
$ ./venus-wallet st newMsgTypeTemplate mttmp1 0 1 2 3 4 5

#res
success
```
- mttmp1为msgType template的全局唯一名称

###### 2.2 创建method模板
> venus-wallet strategy newMethodTemplate [command options] [name, method1 method2 ...]
```shell script
$ ./venus-wallet st newMethodTemplate mtmp1 ActivateDeals AddBalance AddLockedFund

#res
success
```
- mtmp1为method template的全局唯一名称

###### 2.3 通过模板创建KeyBind
> venus-wallet strategy newKeyBindFromTemplate [command options] [name, address, msgTypeTemplateName, methodTemplateName]
```shell script
$ ./venus-wallet st newKeyBindFromTemplate kb2 <addr2> \
mttmp1 mtmp1

#res
success
```
##### 3. 创建group
> venus-wallet strategy newGroup [command options] [name, keyBindName1 keyBindName2 ...]
```shell script
$ ./venus-wallet st newGroup group1 kb1 kb2
```
- group1: group全局唯一名称
- kb1,kb2: 之前创建的2个KeyBind的名称

##### 4. 生成group token用于对外暴露策略调用
> venus-wallet strategy newStToken [command options] [groupName]
```shell script
$ ./venus-wallet st newStToken group1

#res
660ceba5-13f8-4571-803e-706e4a4fd36e
```
- 这里一个group可用生成多个token，用以区分调用链路，以及token可以做到不定期替换，或者暴露后快速替换用

##### 4. 原子性修改keyBind策略配置

###### 4.1 查询以后keybind 
> venus-wallet strategy keyBind [command options] [name]
```shell script
$ ./venus-wallet st keyBind kb1

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```
###### 4.2 keyBind增加method
> venus-wallet strategy addMethodIntoKeyBind [command options] [keyBindName, method1 method2 ...]

```shell script
$ ./venus-wallet st addMethodIntoKeyBind kb1 Settle SwapSigner

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send,Settle,SwapSigner
```
- 添加成功后,Settle SwapSigner将会原子性的增加到methods中，目前这个操作是防并发的。
###### 4.3 keyBind增加msgType
> venus-wallet strategy addMsgTypeIntoKeyBind [command options] [keyBindName, code1 code2 ...]
```shell script
$ ./venus-wallet st addMsgTypeIntoKeyBind kb1 4 5 6

#res
address	: <addr1>
types	: 0,1,2,3,4,5,6
methods	: CreateMiner,Send,Settle,SwapSigner
```
###### 4.4 keyBind移除method
> venus-wallet strategy removeMethodFromKeyBind [command options] [keyBindName, method1 method2 ...]
```shell script
$ ./venus-wallet st removeMethodFromKeyBind kb1 Settle SwapSigner

#res
address	: <addr1>
types	: 0,1,2,3,4,5,6
methods	: CreateMiner,Send
```

###### 4.5 keyBind移除msgType
> venus-wallet strategy removeMsgTypeFromKeyBind [command options] [keyBindName, code1 code2 ...]
```shell script
$ ./venus-wallet st removeMsgTypeFromKeyBind kb1 4 5 6

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```
##### 5. 查询操作
###### 5.1 查询msgType列表
> venus-wallet strategy listMsgTypeTemplates [command options]
```shell script
$ ./venus-wallet st listMsgTypeTemplates

#res
num	: 1
name	: mttmp1
types	: 0,1,2,3,4,5

num	: 2
name	: mttmp2
types	: 0,1,2,3,4,5
```

###### 5.2 查询指定msgType模板
>  venus-wallet strategy msgTypeTemplate [command options] [name]
```shell script
$ ./venus-wallet st msgTypeTemplate mttmp1

# res
0,1,2,3,4,5
```

###### 5.3 查询method列表
> venus-wallet strategy listMethodTemplates [command options]
```shell script
$ ./venus-wallet st listMethodTemplates

#res
num	: 1
name	: mtmp1
methods	: ActivateDeals,AddBalance,AddLockedFund

num	: 2
name	: mtmp2
methods	: ActivateDeals,AddBalance,AddLockedFund
```

###### 5.4 查询指定method模板
> venus-wallet strategy methodTemplateByName [command options] [name]
```shell script
$ ./venus-wallet st methodTemplateByName mtmp1

#res
ActivateDeals,AddBalance,AddLockedFund
```

###### 5.5 查询keyBind列表
> venus-wallet strategy listKeyBinds [command options]
```shell script
$ ./venus-wallet st listKeyBinds
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
> venus-wallet strategy keyBinds [command options] [address]
```shell script
$ ./venus-wallet st keyBinds <addr1>
#res
$ ./venus-wallet st listKeyBinds
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
> venus-wallet strategy keyBind [command options] [name]
```shell script
$ ./venus-wallet st keyBind kb1
#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```

###### 5.7 查询group列表
> venus-wallet strategy listGroup [command options]
```shell script
$ ./venus-wallet st listGroup
#res
1	: group1
2	: group2
```
- 这里只显示group的名称列表，不包含详细数据

###### 5.8 查询指定group
> venus-wallet strategy group [command options] [name]
```shell script
$ ./venus-wallet st group group1
#res
num	: 1
keybind	: kb1
types	: 0,1,2,3
methods	: CreateMiner,Send
```
###### 5.9 查询Group衍生的token列表
> venus-wallet strategy groupTokens [command options] [groupName]
```shell script
$ ./venus-wallet st groupTokens group1
#res
041457f0-ea9a-4486-b648-1feb05dda0c0
a8f09b9f-ad28-8734-c40c-03c222d03982
```
###### 5.10 查询token对应的group详情
> venus-wallet strategy stTokenInfo [command options] [token]
```shell script
$ ./venus-wallet st stTokenInfo 041457f0-ea9a-4486-b648-1feb05dda0c0
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
> venus-wallet strategy removeMsgTypeTemplate [command options] [name]
```shell script
$ ./venus-wallet st removeMsgTypeTemplate mttmp1
#res
success
```

###### 6.2 删除method模板(不影响根据模板创建的keyBind)
> venus-wallet strategy removeMethodTemplate [command options] [name]
```shell script
$ ./venus-wallet st removeMethodTemplate mtmp1
#res
success
```

###### 6.3 根据名称删除keyBind(将影响group，从而影响token对应的group策略)
> venus-wallet strategy removeKeyBind [command options] [name]
```shell script
$ ./venus-wallet st removeKeyBind kb1
```

###### 6.4 根据wallet地址删除keyBind(批量删除，将影响group，从而影响到token对应的group策略)
> venus-wallet strategy removeKeyBindByAddress [command options] [name]
```shell script
$ ./venus-wallet st removeKeyBindByAddress <addr1>
#res
2 rows of data were deleted
```
- 返回移除的keyBind数量

###### 6.5 移除group(将导致所有该group对应的策略失效)
> venus-wallet strategy removeGroup [command options] [name]
```shell script
$ ./venus-wallet st removeGroup group1
#res
success
```
###### 6.6 移除token
> venus-wallet strategy removeStToken [command options] [token]
```shell script
$ ./venus-wallet st removeStToken 041457f0-ea9a-4486-b648-1feb05dda0c0
#res
success
```


### Config in venus 

格式： []token_[stragetoken]:[地址]. 这里使用_的原因在于为了让lotus的地址解析能够把策略id传过来。

```json
        "walletModule": {
                "defaultAddress": "f3ueri27yppflsxodo66r2u4jajw5d4lhrzlcv4ncx7efrrxyivnrsufi7wuvdjmpbepwb2npvj7wglla6gtcq",
                "passphraseConfig": {
                        "scryptN": 2097152,
                        "scryptP": 1
                },
                "remoteEnable": true,
                "remoteBackend": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.gCLPHlI5r9lyxfbPoeU8nSGQI9CpUBaBGA54EzgZ9vE_e78f9e6c-9033-4144-8992-a1890ad76ead:/ip4/192.168.5.64/tcp/5678/http"
        },
```

### Config in lotus

格式： []token_[stragetoken]:[地址]. 原因同上

```toml
[Wallet]
   RemoteBackend = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.gCLPHlI5r9lyxfbPoeU8nSGQI9CpUBaBGA54EzgZ9vE_e78f9e6c-9033-4144-8992-a1890ad76ead:/ip4/192.168.5.64/tcp/5678/http"
  #EnableLedger = false
  #DisableLocal = false
```