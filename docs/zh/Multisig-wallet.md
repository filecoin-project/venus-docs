## Venus: Multisig wallet
多签（multi-signatrue）钱包是指需要多个密钥来授权一个FIL交易的钱包。它适用于多方共管一笔FIL，设置一定的赞成比阙值完成message的签发。

## CLI范例
- 以下示范为了方便阅读都将使用“t0”地址，实际上也支持“t3”地址操作。
- 范例中包含了多签钱包所有的CLI操作方式，并以流程性的方式介绍如何使用多签钱包，同时概念性描述也会随着逻辑的下沉而变少，相同业务逻辑的介绍只会被详细描述一次。
- 指令标签
    - "[]"：选填
    - "[--phrase]" ：带描述符参数，需要"--phrase"指定才能使用
    - "<phrase>"：占位参数，不需要指明含义，需要严格按照顺位填写
    - "[--]"： '带描述符参数' 和 '占位参数' 的边界
> 指令标签示例：venus msig create [--phrase1=\<phrase1>] [--] \<phrase2> [\<phrase3>] 
>1. phrase1: 带描述符参数，选填，如需使用，必须"--phrase1=xxx"指定 
>2. phrase2: 占位参数，必填 
>3. phrase3: 占位参数，选填


### 创建一个多签钱包
>./venus msig create [--required=\<required>] [--value=\<value>] [--duration=\<duration>] [--from=\<from>] [--] \<addresses>

```
$ ./venus msig create --from=t01001 --required=2 --value=1000 --duration=20000 "t01001,t01002,t01003"

"Created new multisig: t01004 <multiAddress>"
```
- from: 发起钱包地址，生成create msg用，需要花费gas。创建多签钱包时，发起的钱包地址默认不加入到多签密钥之中，如需添加，需要额外指定（如以下指令中t01001出现了2次，第2次为指定该地址包含在多签钱包之中）
- required: 多签钱包签名通过的阙值。以上钱包设置为2/3，即当多签钱包包含的3个地址中，有2个钱包地址通过决议即生效。
- value: 创建钱包后直接转账的FIL数额，由from提供。
- duration: 资金解锁的时间长度，即创建后的钱包中所带的金额锁定的时间长度。

### 查询创建的多签钱包状态
>./venus msig inspect [--vesting] [--decode-params] [--] \<address>
```
$ ./venus msig inspect t01004 --vesting=true --decode-params=true

# 状态信息
Balance: 1000 FIL
Spendable: 3.15 FIL
InitialBalance: 1000 FIL
StartEpoch: 0
UnlockDuration: 20000
Threshold: 2 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>
Transactions:  0
```
- vesting： 默认false,为true将呈现更多信息
- decode-params：将状态中Transactions的params字段以json格式显示，默认为hex格式

### 往多签钱包转账FIL
```
$ ./venus send t01004 2000
```
> msg打包成功后，多签钱包将会增加2000FIL


### 提议往多签钱包添加新的钱包地址
>./venus msig add-propose [--increase-threshold] [--from=\<from>] [--] \<multisigAddress> \<signer>
```
$ ./venus msig add-propose --increase-threshold=false --from=t01001 t01004 t01005

# reponse
sent add singer proposal in message: <msgCId>
TxnID: 0

# 状态变化
Transactions:  1
ID      State    Approvals  To             Value   Method        Params
0       pending  1          t01004 (self)  0 FIL   AddSigner(5)  {"Signer":"t01005","Increase":false}
```
> 往t01004多签钱包中提议新增t01005地址，且投票阙值不增加
- ncrease-threshold： 是否添加新地址成功后，自动增加投票阙值，默认为false
- signer：待添加的钱包地址，未包含与多签钱包中

### 同意添加新地址提议
>./venus msig add-approve [--from=\<from>] [--] \<multisigAddress> \<proposerAddress> \<txId> \<newAddress> \<increaseThreshold>
```
$ ./venus msig add-approve --from=t01002 t01004 t01001 0 t01005 false

# reponse
"sent add approval in message: <msgCId>"

# 状态变化
Threshold: 2 / 4
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>
t01005  <t3Address5>

```
> 因为之前的投票比是2/3，所以一个地址通过后，该提议将会执行，投票阙值会因为新成员的加入变为2/4
- proposerAddress: 发起者的地址
- txId: 多签地址状态中Transcations下对应的ID
- newAddress: 指定添加的新地址，必须和状态数据中的Params下对应的地址一样
- increaseThreshold: 是否影响投票阙值分母，必须与状态数据中Params下对应的Increase相同


### 提议修改投票阙值
>./venus msig propose-threshold [\<multisigAddress>] \<newM> 
```
.$ /venus msig propose-threshold --from=t01001 t01004 3

# reponse
sent change threshold proposal in message: <msgCId>
TxnID: 1

# 状态变化
Transactions:  1
ID      State    Approvals  To             Value   Method                          Params
1       pending  1          t01004 (self)  0 FIL   ChangeNumApprovalsThreshold(8)  {"NewThreshold":3}
```
- newM： 目标阙值分母

### 同意修改投票阙值提议(approve指令为万用同意指令)
> ./venus msig approve [--from=\<from>] [--] \<multisigAddress> \<messageId> [\<proposerAddress>] [\<destination>] [\<value>] [\<methodId>] [\<methodParams>]
```
$ ./venus msig approve --from=t01002 t01004 1

# reponse
"sent approval in message: <msgCId>"

# 状态变化
Threshold: 3 / 4
```
> 普通情况下，同意一个提议只需要使用approve指令并指定多签地址和多签地址Transactions状态中的ID即可
- multisigAddress： 操作多签地址
- messageId： propose操作返回的TxID,在inspect指令中可以查寻
- proposerAddress：提议发起者钱包地址
- destination：目标地址（如：多签地址转账给第3方地址时，该字段就是第三方地址）
- value： 转账FIL数额
- methodId：propose对应的methodNum,在inspect指令中可以查寻
    - Propose: 2 
    - Approve: 3
    - Cancel: 4
    - AddSigner: 5
    - RemoveSigner: 6
    - SwapSinger: 7
    - ChangeNumApprovalsThreshold: 8
    - LockBalance: 9
- methodParams: 发起propose的操作参数，在inspect指令中可以查寻

### 提议移除多签成员
>./venus msig propose-remove [--decrease-threshold] [--from=\<from>] [--] \<multisigAddress> \<signer>

```
$  ./venus msig propose-remove --from=t01001 t01004 t01005 

# response
sent remove singer in message: <msgCId>
TxnID: 2

# 状态变化
Threshold: 3 / 4
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>
t01005  <t3Address5>
Transactions:  1
ID      State    Approvals  To             Value   Method           Params
2       pending  1          t01004 (self)  0 FIL   RemoveSigner(6)  {"Signer":"t01005","Decrease":false}


# propose-remove 在 approve 之后
Threshold: 3 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>

```


### 提议替换多签成员
>./venus msig swap-propose [--from=\<from>] [--] \<multisigAddress> \<oldAddress> \<newAddress>
```
$ ./venus msig swap-propose --from=t01001 t01004 t01003 t01005

# response
sent swap singer in message: <msgCId>
TxID: 3

# 状态变化
Threshold: 3 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>
Transactions:  1
ID      State    Approvals  To             Value   Method         Params
3       pending  1          t01004 (self)  0 FIL   SwapSigner(7)  {"From":"t01003","To":"t01005"}


# approve之后
Threshold: 3 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01005  <t3Address5>
Transactions:  0

```
### 取消多签成员地址替换提议
>./venus msig swap-cancel [\<multisigAddress>] \<txId> \<oldAddress> \<newAddress> 
```
# 发起新的替换提议
$ ./venus msig swap-propose --from=t01001 t01004 t01005 t01003

# 状态变化
Transactions:  1
ID      State    Approvals  To             Value   Method         Params
4       pending  1          t01004 (self)  0 FIL   SwapSigner(7)  {"From":"t01005","To":"t01003"}
$ ./venus msig swap-cancel --from=t01001 t01004 4 t01005 t01003
"sent swap cancellation in message: <msgCId>"
```


### 查询多签地址在指定间隔区块被授予的FIL数
> ./venus msig vested [--start-epoch=\<start-epoch>] [--end-epoch=\<end-epoch>] [--] \<multisigAddress>
```
$  ./venus msig vested --from=t01001 --start-epoch=10 --end-epoch=200 t01004

# reponse
"Vested: 9.5 FIL between 10 and 200"
```


### 提议冻结多签地址中的定量FIL
>./venus msig lock-propose [--from=\<from>] [--] \<multisigAddress> \<startEpoch> \<unlockDuration> \<amount>

```
$ ./venus msig lock-propose --from=t01001 t01004 500 100 50

# response
sent lock balance in message: <msgCId>
TxnID: 1

# 状态变化
Transactions:  1
ID      State    Approvals  To             Value   Method          Params
5       pending  1          t01004 (self)  0 FIL   LockBalance(9)  {"StartEpoch":1600,"UnlockDuration":100,"Amount":"50000000000000000000"}

```
- startEpoch：开始生效的块高
- unlockDuration：balance锁定区块跨度，startEpoch+unlockDuration后，锁定的balance将会自动解锁
- amount：目标锁定的FIL数额

### 取消冻结提议
> ./venus msig lock-cancel [--from=\<from>] [--] \<multisigAddress> \<txId> \<startEpoch> \<unlockDuration> \<amount>
```
$ ./venus msig lock-cancel --from=t01001 t01004 5 500 100 50

### 同意冻结
$ ./venus msig lock-approve --from=t01001 t01004 t01001 5 100 50 50

# 同意后状态变化
InitialBalance: 50 FIL
```
- startEpoch，unlockDuration，amount需要和lock-propose的参数一样
- 提议通过后，多签账户下的balance中将会把指定量的balance冻结锁定，显示为InitialBalance