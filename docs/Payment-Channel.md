## Venus: Payment channels

This guide explains how payment channels work in Venus and provides some examples about how to operate with them. Go to [Filecoin Spec Payment Channel](https://spec.filecoin.io/#section-systems.filecoin_token.payment_channels) for more details on how this works.

Payment channels are used to transfer funds between two actors.

For example, in Venus a payment channel is created when a client wants to fetch data from a provider.
Then client sends vouchers for teh payment channel,and the provider sends data in response.
Payment channels and vouchers can be used for any situation in which two parties need to incrementally transfer value between each other off-chain.

### Working principles

---

- The payment channel is create on-chain with an initial amount.
- Vouchers allow the client and the provider to exchange funds incrementally off-chain. The Provider can submit vouchers to chain at any stage.
- Either party to the payment channel can settle the payment channel on chain.
- After a settlement period (currently 12 hours) either party to the payment channel can call collect on chain.
- Collect sends the value of submitted vouchers to the channel recipient (the provider), and refunds the remaining channel balance to the channel creator (the client).
- Vouchers have a lane, a nonce and a value, where vouchers with a higher nonce supersede vouchers with a lower nonce in the same lane.
(Each deal is created on a different lane.)

### CLI example
---
For quick understanding, we can use the Venus CLI to Show how payment channels work. The Venus CLI is a client to the Venus daemon, and therefore each command run here corresponds to an API call to Venus.

A client creates a payment channel to a provider with value 10 FIL:
```
$ venus paych add-funds <from-addr> <to_addr> 10
<channel addr>
```

The client creates a voucher in lane 0 with nonce 1(implied) and value 2:
```
$ venus paych voucher create <channel addr> 2 0
<voucher>
```

The client sends the voucher to the provider and the provider adds the voucher to their local store:
```
$ venus paych voucher  add <channel addr> <voucher>

```

The provider sends some data to the client.

The client creates a voucher in lane 0 with nonce 2 (implied) and value 4:
```
$ venus paych voucher create <channel addr> 4 0
<voucher>
```

The client sends the voucher to the provider and the provider adds the voucher and sends back more data.
etc.

The client can add value to teh channel after it has been created by calling "paych add-funds" with the same client and provider addresses:
```
$ venus paych add-funds <client addr> <provider addr> 5
<channel addr> # Same address as above. Channel now has 15
```

Once the client has received all their data,they may settle the channel. Note that settlement doesn't have to be done immediately. For example the client may keep the channel open as long as it wants to continue making deals with the provider.
```
$ venus paych settle <channel addr>
```
The provider can submit vouchers to chain (note that Venus does this automatically when it sees a settle message appear on chain). The provider may have received many vouchers with incrementally higher values. The provider should submit the best vouchers. Note that there will be one best voucher for each lane:
```
$ venus paych voucher best-spendable <channel addr>
<voucher>
<voucher>
<voucher>

$ venus paych voucher submit <channel addr> <voucher>
```
Once the settlement period is over, either the client or provider can call collect to disburse funds.
```

$ venus paych collect <channel addr>
```
