# Venus wallet
1. venus-wallet is a remote wallet that provides policy for Filecoin and supports JsonRPC2.0 call. It can dynamically configure whether various data types to be signed are signed or not.
2. The project is decoupled from Lotus and Venus independently, and can be called by different implementations of Filecoin.
   
## quickstart
### 1-Downloadcode
```
git clone https://github.com/filecoin-project/venus-wallet.git
```

### 2-Compile
- go version ^1.15
```shell script
# Setting BLS compilation environment variables
export CGO_CFLAGS_ALLOW="-D__BLST_PORTABLE__"
export CGO_CFLAGS="-D__BLST_PORTABLE__"

# Compile the current platform executable
make

# If you need to cross compile Linux versions on MAC
# You need to install GCC related files (you can also download files to local via GitHub and install them locally by brew)
brew install FiloSottile/musl-cross/musl-cross
make linux
```

### 3-Startserviceprocess
```shell script
# It starts on the Mainnetwork by default(--network=main)
# The address begins with f
$ ./venus-wallet run 

# Start in test network
# The address begins with t
$ ./venus-wallet run  --network=test      
```

### 4-Configurationintroduction
- Default file location “~/.venus_wallet/config.toml”
```toml
[API]
  # The HTTP listening address of the local process
  ListenAddress = "/ip4/0.0.0.0/tcp/5678/http"

[DB]
  # Data files that embedded store the database  by default
  Conn = "~/.venus_wallet/keystore.sqlit"
  Type = "sqlite"
  DebugMode = true

[JWT]
  # JWT token hex，If it is not configured, it will be generated randomly
  Token = "65794a68624763694f694a49557a49314e694973496e523563434936496b705856434a392e65794a42624778766479493657794a795a57466b4969776964334a70644755694c434a7a615764754969776959575274615734695858302e7133787a356f75634f6f543378774d5463743870574d42727668695f67697a4f7a365142674b2d6e4f7763"
  # JWT secret hex，If it is not configured, it will be generated randomly
  Secret = "7c40ce66a492e35ac828e8333a5703e38b23add87f29bd8fc7343989e08b3458"

[Factor]
  # keystore private key symmetric encryption variable
  ScryptN = 262144
  ScryptP = 1

[Strategy]
  # Strategy level，0：Don't turn on strategy 1：Verify only the data type to be signed 2：Verify the data type to be signed, and verify the message type with the method policy configured
  Level = 2
  NodeURL = "/ip4/127.0.0.1/tcp/2345/http"

[APIRegisterHub]
  # The URL of the gateway. If not configured, the gateway will not be connected
  RegisterAPI = ["/ip4/127.0.0.1/tcp/45132"]
  # The token of the gateway
  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdG1pbmVyIiwicGVybSI6ImFkbWluIiwiZXh0IjoiIn0.oakIfSg1Iiv1T2F1BtH1bsb_1GeXWuirdPSjvE5wQLs"
  SupportAccounts = ["testminer"]
```

# CLIoperationguide
## ViewHelp

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
- The operation here is flat and single-layer. Different from the `./venus wallet list` operation of Venus or Lotus, only `./venus-wallet list` is needed in venus-wallet.
- Some commands are XX processed, such as `strategy`, which can be directly replaced by `st`.


## BasicoperationofVenusWallet
### Thestateofthewallet
1. Set the key of private key symmetric encryption
```shell script
# ./venus-wallet setpwd (aliase)
$ ./venus-wallet set-password
Password:******
Enter Password again:******

# res
Password set successfully
```
> Note: this password is only stored in memory for symmetric encryption of the private key. Once the service process exits in any form, it cannot be restored. Therefore, the private key managed by this program needs to be backed up by itself or directly.

- After setting the password, the default state of the wallet is unlock
2. Lock Wallet
> After the wallet is locked, the functions of signing, generating new address, importing and exporting private key will be disabled, which will affect the remote call chain, so please use it with caution.
```shell script
$ ./venus-wallet lock
Password:******

# res
wallet lock successfully
```
3. unlock wallet
> After unlocking, all functions of the wallet will be released.
```shell script
$ ./venus-wallet unlock
Password:******

# res
wallet unlock successfully
```
4. View the wallet status
```shell script
$ ./venus-wallet lockstate

#res 
wallet state: unlocked
```
### Privatekeymanagement
1. Generate new random private key
> venus-wallet new [command options] [bls|secp256k1 (default secp256k1)]
```shell script
$ ./venus-wallet new 

#res
t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy
```
- The default type is secp256k1. You can also use `./venus-wallet new bls` to generate BLS private key

2. Import the private key
> venus-wallet import [command options] [\<path\> (optional, will read from stdin if omitted)]
```shell script
$ ./venus-wallet import
Enter private key:7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22626e765665386d53587171346173384633654c647a7438794a6d68764e434c377132795a6c6657784341303d227d

#res 
imported key t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy successfully!
```
3. Export the private key
> venus-wallet export [command options] [address]
```shell script
$ ./venus-wallet export t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy

# res
7b2254797065223a22736563703235366b31222c22507269766174654b6579223a22626e765665386d53587171346173384633654c647a7438794a6d68764e434c377132795a6c6657784341303d227d
```

4. View address list
```shell script
$ ./venus-wallet list

t3uktqgxtagiyk5cxrjn5h4wq4v247saxtfukfi6zsvt4sek2q2ufkg27biasg7247zhdpm2kpotukwsapr7pa
t3rcgmzisnusxvwrwvi7l5hcuissvmluvkrzfuehjdfawba75qlv3mxl6rtnxitt33z5fuwds76rbcyafhxrua
t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy
```
> Show all private key corresponding address, there are spec and bls two kinds of address
5. Delete the specified private key
> venus-wallet del [command options] \<address\>
```shell script
$ ./venus-wallet del t12mchblwgi243re5i2pg2harmnqvm6q3rwb2cnpy

#res 
success
```

### JWTauthoritymanagement
For remote access interface authorization

1. Gets the remote connection string
> venus-wallet auth api-info [command options] [arguments...]
```shell script
$ ./venus-wallet auth api-info --perm admin

#res
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.q3xz5oucOoT3xwMTct8pWMBrvhi_gizOz6QBgK-nOwc:/ip4/0.0.0.0/tcp/5678/http
```
- perm has four kinds of permissions: read, write, sign and Admin. They are generated by the corresponding `JWT` configuration in the configuration file and will not change dynamically.

### strategy
The main purpose of policy function is to restrict the use of private key for the specified type of signature, which can effectively prevent some non allowed data signatures.

- Concept
    + keyBind
        + Each address can be bound with multiple policies. Here, the name of the specified address binding policy is defined as keyBind.
        + The keywords are name, msgType and method.
        + name: The custom name of keyBind is globally unique.
        + msgType: Filecoin data type, such as block, msg, etc.
        + method: The method corresponding to the message type. There are more than 60 kinds in total.
    + group
        + A keyBind is composed of multiple keyBinds.
        + The keywords are name, keyBindName
        
    + token 
        + The keywords are token,groupName
        + For a group, a random token is generated and provided to remote wallet for strategic access. The relationship between group and token is 1:n.
    + template
        + At present, there are two kinds of template: msgType and method
        + Keywords：name,msgType,method
        + Multiple policy templates can be configured for subsequent private key fast binding
    
- Notes
    + At present, the change of keyBind will directly affect the group, and the group will directly affect the token policy configuration. At present, all these are linked.

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
#### 1. View msgType and method
```shell script
# View type （Code is the corresponding value of 1:1 of type, which never changes）
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

# View method（Alphabetic order. With the iteration of Filecoin, the index corresponding to method will change. Do not use index to mark method）

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
#### 1. Create keyBind
##### 1. Custom create
> venus-wallet strategy newKeyBindCustom [command options] [name, address, codes, methods]
```shell script
$ ./venus-wallet st newKBC kb1 <addr1> \
0,1,2,3 \
CreateMiner,Send

#res
success
```
- kb1 is the globally unique name of keyBind.
- addr1 refers to the address of BLS or SECP.

##### 2. Create from template

###### 2.1 Create msgType template
> venus-wallet strategy newMsgTypeTemplate [command options] [name, code1 code2 ...]

```shell script
$ ./venus-wallet st newMsgTypeTemplate mttmp1 0 1 2 3 4 5

#res
success
```
- mttmp1 is the globally unique name of msgType template.

###### 2.2 Create method template
> venus-wallet strategy newMethodTemplate [command options] [name, method1 method2 ...]
```shell script
$ ./venus-wallet st newMethodTemplate mtmp1 ActivateDeals AddBalance AddLockedFund

#res
success
```
- mtmp1 is the globally unique name of the method template.

###### 2.3 Create keyBind from template
> venus-wallet strategy newKeyBindFromTemplate [command options] [name, address, msgTypeTemplateName, methodTemplateName]
```shell script
$ ./venus-wallet st newKeyBindFromTemplate kb2 <addr2> \
mttmp1 mtmp1

#res
success
```
##### 3. Create group
> venus-wallet strategy newGroup [command options] [name, keyBindName1 keyBindName2 ...]
```shell script
$ ./venus-wallet st newGroup group1 kb1 kb2
```
- group1: group globally unique name
- kb1, kb2: the names of the two keyBind created previously.

##### 4. Generate a group token to call the public policy
> venus-wallet strategy newStToken [command options] [groupName]
```shell script
$ ./venus-wallet st newStToken group1

#res
660ceba5-13f8-4571-803e-706e4a4fd36e
```
- Here, a group can generate multiple tokens to distinguish call links. The token can be changed irregularly or quickly after leakage.

##### 4. Modify keyBind policy configuration

###### 4.1 Query keybind 
> venus-wallet strategy keyBind [command options] [name]
```shell script
$ ./venus-wallet st keyBind kb1

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```
###### 4.2 KeyBind add method
> venus-wallet strategy addMethodIntoKeyBind [command options] [keyBindName, method1 method2 ...]

```shell script
$ ./venus-wallet st addMethodIntoKeyBind kb1 Settle SwapSigner

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send,Settle,SwapSigner
```
- After adding successfully, Settle SwapSigner will be atomically added to methods. At present, this operation is to prevent concurrency.
###### 4.3 KeyBind adds msgType
> venus-wallet strategy pushMsgTypeIntoKeyBind [command options] [keyBindName, code1 code2 ...]
```shell script
$ ./venus-wallet st pushMsgTypeIntoKeyBind kb1 4 5 6

#res
address	: <addr1>
types	: 0,1,2,3,4,5,6
methods	: CreateMiner,Send,Settle,SwapSigner
```
###### 4.4 KeyBind remove method
> venus-wallet strategy addMsgTypeIntoKeyBind [command options] [keyBindName, method1 method2 ...]
```shell script
$ ./venus-wallet st addMsgTypeIntoKeyBind kb1 Settle SwapSigner

#res
address	: <addr1>
types	: 0,1,2,3,4,5,6
methods	: CreateMiner,Send
```

###### 4.5 KeyBind remove msgType
> venus-wallet strategy removeMsgTypeFromKeyBind [command options] [keyBindName, code1 code2 ...]
```shell script
$ ./venus-wallet st removeMsgTypeFromKeyBind kb1 4 5 6

#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```
##### 5. Query operation
###### 5.1 Query msgType list
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

###### 5.2 Query the specified msgType template
>  venus-wallet strategy msgTypeTemplate [command options] [name]
```shell script
$ ./venus-wallet st msgTypeTemplate mttmp1

# res
0,1,2,3,4,5
```

###### 5.3 Query method list
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

###### 5.4 Query the specified method template
> venus-wallet strategy methodTemplateByName [command options] [name]
```shell script
$ ./venus-wallet st methodTemplateByName mtmp1

#res
ActivateDeals,AddBalance,AddLockedFund
```

###### 5.5 Query keyBind list
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
###### 5.6 Query the keyBind list of the specified address
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
###### 5.6 Query the keyBind of the specified name
> venus-wallet strategy keyBind [command options] [name]
```shell script
$ ./venus-wallet st keyBind kb1
#res
address	: <addr1>
types	: 0,1,2,3
methods	: CreateMiner,Send
```

###### 5.7 Query group list
> venus-wallet strategy listGroup [command options]
```shell script
$ ./venus-wallet st listGroup
#res
1	: group1
2	: group2
```
- Here, only the name list of group is displayed, and detailed data is not included

###### 5.8 Query the specified group
> venus-wallet strategy group [command options] [name]
```shell script
$ ./venus-wallet st group group1
#res
num	: 1
keybind	: kb1
types	: 0,1,2,3
methods	: CreateMiner,Send
```
###### 5.9 Query the token list derived from group
> venus-wallet strategy groupTokens [command options] [groupName]
```shell script
$ ./venus-wallet st groupTokens group1
#res
041457f0-ea9a-4486-b648-1feb05dda0c0
a8f09b9f-ad28-8734-c40c-03c222d03982
```
###### 5.10 Query the group details corresponding to the token
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

##### 6. Delete data
>Please use with caution

###### 6.1 Delete msgType template (keyBind created from template is not affected)
> venus-wallet strategy removeMsgTypeTemplate [command options] [name]
```shell script
$ ./venus-wallet st removeMsgTypeTemplate mttmp1
#res
success
```

###### 6.2 Delete method template (keyBind created from template is not affected)
> venus-wallet strategy removeMethodTemplate [command options] [name]
```shell script
$ ./venus-wallet st removeMethodTemplate mtmp1
#res
success
```

###### 6.3 Delete keyBind according to the name (it will affect the group and thus the group policy corresponding to the token)
> venus-wallet strategy removeKeyBind [command options] [name]
```shell script
$ ./venus-wallet st removeKeyBind kb1
```

###### 6.4 Delete keyBind according to the wallet address (batch deletion will affect the group, thus affecting the group policy corresponding to the token)
> venus-wallet strategy removeKeyBindByAddress [command options] [name]
```shell script
$ ./venus-wallet st removeKeyBindByAddress <addr1>
#res
2 rows of data were deleted
```
- Returns the number of keyBind removed

###### 6.5 Remove group (all policies corresponding to the group will be invalid)
> venus-wallet strategy removeGroup [command options] [name]
```shell script
$ ./venus-wallet st removeGroup group1
#res
success
```
###### 6.6 Remove token
> venus-wallet strategy removeStToken [command options] [token]
```shell script
$ ./venus-wallet st removeStToken 041457f0-ea9a-4486-b648-1feb05dda0c0
#res
success
```


### Config in venus 

format: [apitoken]___[stragetoken]:[地址]. the reason for using ___ here is to allow lotus address resolution to pass the stragety id. 

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

format: [apitoken]___[stragetoken]:[地址]. the same reason as before

```toml
[Wallet]
   RemoteBackend = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIl19.gCLPHlI5r9lyxfbPoeU8nSGQI9CpUBaBGA54EzgZ9vE_e78f9e6c-9033-4144-8992-a1890ad76ead:/ip4/192.168.5.64/tcp/5678/http"
  #EnableLedger = false
  #DisableLocal = false
```