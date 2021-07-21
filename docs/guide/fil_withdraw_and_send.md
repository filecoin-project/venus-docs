## Why do we do this

&ensp;&ensp; In the Venus distributed mine pool, Venus-Wallet is a separate component, one for each cluster. The purpose of this is to ensure that the customer fully controls the wallet keys of the cluster and is not disclosed to the outside world. This is also consistent with the original design of Venus to improve the security of the system and protect the security of the user's Fil.

&ensp;&ensp; In Venus mine pool, we have shielded the processing of "Send" message to avoid the means of simulating transfer message to attack the system, but this also brings some troubles to customer transfer. Therefore, this document explains how to extract the available balance of the miner's account and the transfer method.



## How to do

### Query the available balance

Execute the command on the Venus-Sealer side

```sh
$ ./venus-sealer info

Chain: [sync behind! (1h26m35s behind)] [basefee 100 aFIL]
...
Sealer Balance: 253.94 FIL
PreCommit: 23.045 FIL
Pledge: 3 FIL
Vesting: 102.474 FIL
The Available: 125.421 FIL
...
```
The balance will be updated as the block is released or the mortgage is released


### Extract available balance

Execute the command on the Venus-Sealer side

```sh

$ ./venus-sealer actor withdraw [amount (FIL)]

```

This command will fetch the specified number of FIL to the owner address of the miner. The owner can be found in several ways. Here is how to query the owner on Venus-Sealer:

```sh
$ ./venus-sealer actor control list
name ID key use balance
owner t01763 t3qsek22y... *** FIL
worker t01762 t3rcktwpg... other *** FIL
```

### send

&ensp;&ensp; Miners can use [fil-wallet APP](https://fivetoken.io/download) for sending Fils.

&ensp;&ensp; There are other options available to the user, such as synchronizing a Venus/Lotus node, importing the wallet private key and executing the Send command.
