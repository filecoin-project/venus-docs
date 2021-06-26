---
title: 'Venus Miner: Addresses'
description: 'A miner can be configured with an owner address, a worker address, and additional control addresses. These allow granularity in how the funds sent and received from the miner are managed and provide additional security to the mining operation.'
breadcrumb: 'Miner addresses'
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

During miner initialization, a _miner actor_ is created on the chain, and this actor gives the miner its ID `t0...`. The miner actor is in charge of collecting all the payments sent to the miner. For example, when a payment is sent for honoring the different types of deals, that payment goes to the miner actor, not the miner itself.

The currently configured addresses used by a miner can be listed with:

```sh
venus-miner actor control list
```

The different types of addresses associated with a miner are described below:

## The owner address

The owner address corresponds to a Venus node address provided during the miner initialization. The _owner address_ is only needed when:

- Changing the owner or the worker address in the _miner actor_.
- Withdrawing balance from the _miner actor_.
- Submit _WindowPoSts_, **unless _control addresses_ are defined and have enough balance** (continued below).

The owner address can be updated with the following command:

```sh
venus-miner actor set-owner --really-do-it <address>
```


## The worker address

The _worker address_ is used to send and pay for day-to-day operations performed by the miner:

- Initializing the miner on the chain.
- Changing the miner peer id or the multiaddresses.
- Interacting with market and payment channel actors.
- Signing new blocks.
- Submitting proofs, declaring faults. _WindowPoSts_ are submitted using the _worker address_ if:
  - Control addresses are not defined or do not have enough balance.
  - The _owner address_ does not have enough balance.

Unlike the _owner address_, the address set as the miner's _worker address_ should be part of the Venus local wallet and accessible by the miner. The Venus Miner will trigger all the necessary transactions using the Venus node to which it is connected. The _worker address_ must have enough funds to pay for the day-to-day operations of the miner, including initialization.

## Control addresses

_Control addresses_ are used to submit _WindowPoSts_ proofs to the chain. _WindowPoSt_ is the mechanism through which storage is verified in Filecoin and is required by miners to submit proofs for all sectors every 24 hours. Those proofs are submitted as messages to the blockchain and therefore need to pay the respective fees.

Many mining-related actions require sending messages to the chain, but not all of those are as high-value as _WindowPoSts_. By using _control addresses_ you can stop the first transaction holding up a line of transactions. This blocking problem is known as [head-of-line blocking.](https://en.wikipedia.org/wiki/Head-of-line_blocking)

Multiple _control addresses_ can be created and configured. The first _control address_ that has enough funds to submit a _WindowPoSt_ transaction will be used. If there are no control addresses with sufficent funds then the owner address will be used. If the owner address has insufficent funds, or is unavailable, then the worker address will be used to submit a _WindowPoSt_.

Otherwise, Venus fails over to the _owner_ and ultimately to the _worker_ address.

To set up a _control address_:

1. Create a new address and send it some funds for gas fees:

   ```sh
   venus wallet new bls
   > f3defg...

   venus send --from <address> f3defg... 100
   ```

2. Inform the miner of the new address:

   ```sh
   venus-miner actor control set --really-do-it f3defg...

   > Add f3defg...
   > Message CID: bafy2...
   ```

3. Wait for the message to land on chain:

   ```sh
   venus state wait-msg bafy2...

   > ...
   > Exit Code: 0
   > ...
   ```

4. Check the miner control address list to make sure the address was correctly added:

   ```sh
   venus-miner actor control list

   > name       ID      key        use    balance
   > owner      t01111  f3abcd...  other  300 FIL
   > worker     t01111  f3abcd...  other  300 FIL
   > control-0  t02222  f3defg...  post   100 FIL
   ```

Repeat this procedure to add additional addresses.

### Use control addresses for commits

Clean up the tasks required for your worker address by setting your control addresses to perform pre-commits and commits. With this, only market messages are sent from the worker address. If the basefee is high, then you can still put sectors on chain without those messages being blocked by things like publishing deals.

This feature is enabled as of 2020-12-09 within the [`master` branch of `filecoin-project/venus`](https://github.com/filecoin-project/venus/), but is not yet within a tagged release. You need to build Venus from GitHub using the `master` branch to use this feature.

1. Create two control addresses. Control addresses can be any _type_ of address: `secp256k1 ` or `bls`:

   ```bash
   venus wallet new bls

   > f3rht...

   venus wallet new bls

   > f3sxs...

   venus wallet ls

   > Address   Balance  Nonce  Default
   > f3rht...  0 FIL    0      X
   > f3sxs...  0 FIL    0
   ```

2. Add some funds into those two addresses.
3. Wait for around 5 minutes for the addresses to be assigned IDs.
4. Get ID of those addresses:

   ```bash
   venus wallet list -i

    > Address   ID        Balance                   Nonce  Default
    > f3rht...  f0100933  0.59466768102284489 FIL   1      X
    > f3sxs...  f0100939  0.4 FIL                   0
   ```

5. Add control addresses:

   ```bash
   venus-miner actor control set --really-do-it=true f0100933 f0100939

    > Add f3rht...
    > Add f3sxs...
    > Message CID: bafy2bzacecfryzmwe5ghsazmfzporuybm32yw5q6q75neyopifps3c3gll6aq

    venus actor control list

    > name       ID      key        use    balance
    > owner      t01...  f3abcd...  other  15 FIL
    > worker     t01...  f3abcd...  other  10 FIL
    > control-0  t02...  f3defg...  post   100 FIL
    > control-1  t02...  f3defg...  post   100 FIL
   ```

6. Add the newly created addresses into the miner config under the `[Addresses]` section:

   ```yaml
   [Addresses]
       PreCommitControl = ["f3rht..."]
       CommitControl = ["f3sxs..."]
   ```

7. Restart `venus-miner`.

## Managing balances

Get the balances associated with a miner wallet by calling `info`:

```bash
venus-miner info

> Miner: t01000
> Sector Size: 2 KiB
> Byte Power:   100 KiB / 100 KiB (100.0000%)
> Actual Power: 1e+03 Ki / 1e+03 Ki (100.0000%)
>   Committed: 100 KiB
>   Proving: 100 KiB
> Below minimum power threshold, no blocks will be won
> Deals: 0, 0 B
>   Active: 0, 0 B (Verified: 0, 0 B)
>
> Miner Balance: 10582.321501530685596531 FIL
>   PreCommit:   0.000000286878768791 FIL
>   Pledge:      0.00002980232192 FIL
>   Locked:      10582.321420164834231291 FIL
>   Available:   0.000051276650676449 FIL
> Worker Balance: 49999999.999834359275302423 FIL
> Market (Escrow):  0 FIL
> Market (Locked):  0 FIL
```

In this example, the miner ID is `t01000`, it has a total balance of `10582.321501530685596531 FIL`, and an available balance of `0.000051276650676449 FIL` that can be used as collateral or to pay for the pledge. The worker balance is `49999999.999834359275302423 FIL`.

## Withdrawing funds from the Miner actor

Transfer funds from the Miner actor address to the owner address by calling `actor withdraw`:

```bash
venus-miner actor withdraw <amount>
```

::: tip
The owner's address will need to be available in the Venus node and have enough funds to pay for the gas for this transaction. Cold addresses will need to be temporally imported for the operation to succeed.
:::