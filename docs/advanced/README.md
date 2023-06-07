## Retrieve rewards

When storage provider get block rewards from the network, 25% percent of the reward will be immediately released to your miner actor's available balance and the rest 75% will become locked funds and be released linearly in 180 days. This tutorial will walk you through how to withdraw your rewards.

## Withdraw balance from miner

Query available balance using `venus-sealer`.

```bash
$ ./venus-sealer info
```

Check available balance from the output.

```bash
...
Vesting: 102.474 FIL
The Available: 125.421 FIL
...
```

Withdraw available balance. Then check if your owner address recieves the funds using [filscan](https://filscan.io/). 

```bash
$ ./venus-sealer actor withdraw <FIL_AMOUNT>
```

List all addresses using `venus-sealer`.

```bash
$ ./venus-sealer actor control list
```

## Send funds from your addresses

`venus-wallet` doesn't support sending funds from `cli`. Sending funds can be realized by exporting private key to a [wallet](https://docs.filecoin.io/basics/assets/wallets/) that supports filecoin. And then send funds through the said wallet.

Note that venus shared modules also blocks `send` messages for security reason, making your storage system more secure from potential attacks. This design makes sending funds less convienent but allows the seperation of an admin role and a node operator role for increased security. 
