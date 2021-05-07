## Venus: Multisig wallet
Multi-signature wallet is a wallet that needs multiple keys to authorize the same fil transaction. It is suitable for multi-party joint management. Set a percentage. When the proportion of managers supporting signature reaches this percentage, message signing is completed.

## CLI example
- The following demonstration will use the "t0" address for easy reading. In fact, it also supports the "T3" address operation.
- The example includes all the CLI operation modes of multi signature wallet, and introduces how to use multi signature wallet in a flow way.
- Label of instruction
    - "[]"：Optional
    - "[--phrase]" ：With descriptor parameter, you need to specify "--phrase" to use
    - "\<phrase\>"：the parameters to fill in the vacancy do not need to specify the meaning, but need to be filled in strictly according to the sequence
    - "[--]"： The boundary of the above two parameters
> Example of instruction label：venus msig create [--phrase1=\<phrase1>] [--] \<phrase2\> [\<phrase3\>] 
>1. phrase1: With descriptor parameter, optional. If it needs to be used, it must be specified with "--phrase1=xxx"
>2. phrase2: Parameter used to fill in the vacancy, required 
>3. phrase3: Parameter used to fill in the vacancy, required


### Create multi signature Wallet
>./venus msig create [--required=\<required>] [--value=\<value>] [--duration=\<duration>] [--from=\<from>] [--] \<addresses>

```shell script
$ ./venus msig create --from=t01001 --required=2 --value=1000 --duration=20000 "t01001,t01002,t01003"

"Created new multisig: t01004 <multiAddress>"
```
- from: it takes gas to initiate the wallet address and generate create msg. When creating a multi signature wallet, the initiated wallet address is not added to the multi signature key by default. If it needs to be added, it needs to be specified additionally (for example, t01001 appears twice in the following instruction, and the second time is to specify that the address is included in the multi signature Wallet)
- required: The number of signatures required for multiple wallets. The above wallets are set to 2 / 3, that is, when two of the three wallets contained in the multi signature wallets pass the resolution, they will take effect.
- value: The amount of FIL for direct transfer after wallet creation is provided by ‘from’.
- duration: The time period of fund unlocking, that is, the time period of amount locking in the created wallet.

### Query the status of the created multi signature wallet
>./venus msig inspect [--vesting] [--decode-params] [--] \<address>
```shell script
$ ./venus msig inspect t01004 --vesting=true --decode-params=true

# status
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
- vesting: The default is false. When true, more information will be presented
- decode-params: The params field of Transactions in the status is displayed in JSON format, and the default is hex format

### Transfer FIL to Multisig wallet
```shell script
$ ./venus send t01004 2000
```
> After the success of MSG on the Blockchain, multisig wallet will increase by 2000FIL


### Add a new wallet address to the multisig Wallet
>./venus msig add-propose [--increase-threshold] [--from=\<from>] [--] \<multisigAddress> \<signer>
```shell script
$ ./venus msig add-propose --increase-threshold=false --from=t01001 t01004 t01005

# reponse
sent add singer proposal in message: <msgCId>
TxnID: 0

# Change of state
Transactions:  1
ID      State    Approvals  To             Value   Method        Params
0       pending  1          t01004 (self)  0 FIL   AddSigner(5)  {"Signer":"t01005","Increase":false}
```
> Add t01005 to t01004 (multisig wallet), and the number of votes required for voting will not increase
- increase-threshold： Whether to automatically increase the number of votes required after adding a new address. The default is false
- signer：The wallet address to be added is not included in the multisig wallet

### Agree to add new address
>./venus msig add-approve [--from=\<from>] [--] \<multisigAddress> \<proposerAddress> \<txId> \<newAddress> \<increaseThreshold>
```shell script
$ ./venus msig add-approve --from=t01002 t01004 t01001 0 t01005 false

# reponse
"sent add approval in message: <msgCId>"

# Change of state
Threshold: 2 / 4
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>
t01005  <t3Address5>
```
> Because the previous voting ratio was 2 / 3, after an address is approved, the proposal will be implemented, and the voting threshold will become 2 / 4 due to the addition of new members
- proposerAddress: Address of the originator
- txId: The ID corresponding to the Transactions in the multisig address state
- newAddress: The new address to be added must be the same as the corresponding address under params in the status data
- increaseThreshold: The number of votes affected must be the same as the corresponding increase under params in the status data


### Propose to amend the voting threshold
>./venus msig propose-threshold [\<multisigAddress>] \<newM> 
```shell script
$ ./venus msig propose-threshold --from=t01001 t01004 3

# reponse
sent change threshold proposal in message: <msgCId>
TxnID: 1

# Change of state
Transactions:  1
ID      State    Approvals  To             Value   Method                          Params
1       pending  1          t01004 (self)  0 FIL   ChangeNumApprovalsThreshold(8)  {"NewThreshold":3}
```
- newM： Total voting rights

### Agree to change the number of votes required (approve instruction is universal consent instruction)
> ./venus msig approve [--from=\<from>] [--] \<multisigAddress> \<messageId> [\<proposerAddress>] [\<destination>] [\<value>] [\<methodId>] [\<methodParams>]
```shell script
$ ./venus msig approve --from=t01002 t01004 1

# reponse
"sent approval in message: <msgCId>"

# Change of state
Threshold: 3 / 4
```
> Generally, to agree to a proposal, you only need to use the approve instruction and specify the multisig address and the ID in the multi signer address Transactions state
- multisigAddress： Operation multisig address
- messageId： The TxID returned by the propose operation can be found in the inspect instruction
- proposerAddress：Proposed originator wallet address
- destination：Destination address (for example, when multisig addresses are transferred to other addresses, this field is the other address)
- value： Amount of fil transferred
- methodId：The methodNum corresponding to propose can be found in the inspect instruction
    - Propose: 2 
    - Approve: 3
    - Cancel: 4
    - AddSigner: 5
    - RemoveSigner: 6
    - SwapSinger: 7
    - ChangeNumApprovalsThreshold: 8
    - LockBalance: 9
- methodParams: The operation parameters of initiating ‘ proposal ’ , can be found in the inspect instruction

### Proposal to remove multisigners
>./venus msig propose-remove [--decrease-threshold] [--from=\<from>] [--] \<multisigAddress> \<signer>

```shell script
$ ./venus msig propose-remove --from=t01001 t01004 t01005 

# response
sent remove singer in message: <msgCId>
TxnID: 2

# Change of state
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


# Propose-remove after approve
Threshold: 3 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>

```


### Propose to replace multisigner
>./venus msig swap-propose [--from=\<from>] [--] \<multisigAddress> \<oldAddress> \<newAddress>
```shell script
$ ./venus msig swap-propose --from=t01001 t01004 t01003 t01005

# response
sent swap singer in message: <msgCId>
TxID: 3

# Change of state
Threshold: 3 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01003  <t3Address3>
Transactions:  1
ID      State    Approvals  To             Value   Method         Params
3       pending  1          t01004 (self)  0 FIL   SwapSigner(7)  {"From":"t01003","To":"t01005"}


# After approve
Threshold: 3 / 3
Signers:
ID      Address
t01001  <t3Address1>
t01002  <t3Address2>
t01005  <t3Address5>
Transactions:  0

```
### The proposal of canceling address replacement of multisiger
>./venus msig swap-cancel [\<multisigAddress>] \<txId> \<oldAddress> \<newAddress> 
```shell script
# Launch a new replacement proposal
$ ./venus msig swap-propose --from=t01001 t01004 t01005 t01003

# Change of state
Transactions:  1
ID      State    Approvals  To             Value   Method         Params
4       pending  1          t01004 (self)  0 FIL   SwapSigner(7)  {"From":"t01005","To":"t01003"}
$ ./venus msig swap-cancel --from=t01001 t01004 4 t01005 t01003
"sent swap cancellation in message: <msgCId>"
```


### Query the number of FILs granted by multisig address in the specified block interval
> ./venus msig vested [--start-epoch=\<start-epoch>] [--end-epoch=\<end-epoch>] [--] \<multisigAddress>
```shell script
$  ./venus msig vested --from=t01001 --start-epoch=10 --end-epoch=200 t01004

# response
"Vested: 9.5 FIL between 10 and 200"
```


### Propose to freeze part of FIL in multisig address
>./venus msig lock-propose [--from=\<from>] [--] \<multisigAddress> \<startEpoch> \<unlockDuration> \<amount>

```shell script
$ ./venus msig lock-propose --from=t01001 t01004 500 100 50

# response
sent lock balance in message: <msgCId>
TxnID: 1

# Change of state
Transactions:  1
ID      State    Approvals  To             Value   Method          Params
5       pending  1          t01004 (self)  0 FIL   LockBalance(9)  {"StartEpoch":1600,"UnlockDuration":100,"Amount":"50000000000000000000"}

```
- startEpoch：Effective block epoch
- unlockDuration：Balance lock block span. After startEpoch + unlockduration, the locked balance will be automatically unlocked
- amount：Locked FIL amount

### Proposal to lock
> ./venus msig lock-cancel [--from=\<from>] [--] \<multisigAddress> \<txId> \<startEpoch> \<unlockDuration> \<amount>
```shell script
$ ./venus msig lock-cancel --from=t01001 t01004 5 500 100 50

### Agree to lock
$ ./venus msig lock-approve --from=t01001 t01004 t01001 5 100 50 50

# Change of state after consent
InitialBalance: 50 FIL
```
- startEpoch, unlockDuration and amount need to be the same parameters as lock-propose
- After the proposal is approved, the balance under the multisign account will freeze and lock the specified amount of balance and display it as InitialBalance
