## Venus: send and receive FIL

This guide will show you how to create and manage a Venus wallet and how to use it to send some Filecoin to a different address.
Each node can have multiple addresses.

[[TOC]]

## Creating a wallet

### Create a bls wallet

```
venus wallet new bls
```

### Create a secp256k1 wallet

```
venus wallet new --type=secp256k1
```

### Create a multisig wallet

```
venus msig create address1 address2..
```

This will create a new address and print it. You can distinguish mainnet from testnet addresses because they start with `f` for mainnet and `t` for testnets.

::: warning
The information for the addresses in your wallet is stored in the ~/.venus/wallet.
Removing these folders will also remove the keys, and you will lose control of any funds in those wallets.
:::

### Listing addresses

You can create as many addresses as you need. One of them will be the *default address*.

You can see a list of all addresses for your current node:

```
venus wallet ls
```

You can see the default address with:

```
venus wallet default
```

If you wish, you can change the default address to a different one:

```
venus wallet set-default <address>
```

### Obtaining FIL

For non-mainnet networks, `FIL` can be obtained from a faucet. A list of faucets is available on the [networks dashboard](https://network.filecoin.io/).
For mainnet, the easiest is to buy `FIL` from an exchange. Not all exchanges support `FIL`, so do your research before signing up.

Once you have received some `FIL`, use wallet balance to check your balance:

```
venus wallet balance <address>
```

Remember that you will only see the latest balance when your daemon is fully synced.

### Sending FIL

Use the send command followed by the receiving address and the amount of `FIL` you want to send

```
venus send <target-address> --value=<FIL amount>

If you want to specify the sending address:
venus send <target-address> --value=<FIL amount> --from=<address>
```

For advanced sending options:

````
venus send --help
````

### Transaction fees

Every transaction that sends `FIL` pays an additional fee based on its gas usage. By default, Venus automatically sets all the necessary values.
However, you may want to use the --gas-feecap flag in the send command to avoid surprises when network congestion is high.

### Exporting and importing addresses

::: warning
Keep your addresses' private keys safe! Do not share them with anyone! Store them in a secure location!
:::

You can export and re-import a wallet, including a different Venus node. Exporting private key from nodes takes two steps:

````
first step:
venus wallet export <address>

second step:
enter wallet password
````

Use wallet import to import an address into a node:

```
venus wallet import <private_key>
```

### Offline nodes

Each node stores its wallet in `~/.venus/wallet`:

```
    |--- 000000.vlog
    |--- 000001.sst
    |--- KEYREGISTRY
    |--- LOCK
    |--- MANIFEST
```

To export a wallet when a node is offline, copy these files from `~/.venus/wallet` to another location. To import this wallet, copy these files into `~/.venus/wallet`. The Venus node will automatically use these keys when it next starts.
