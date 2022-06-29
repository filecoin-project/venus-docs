## Upgrading to network version 15

Please upgrade each venus component in the order as it is presented in this document. We recommend that you go through the document before upgrading. When in doubt, please do not hesitate to reach out to us [here](https://github.com/filecoin-project/venus/discussions/4688).

:::warning

Please make sure that your storage system is not doing any windowPost when you upgrade and leave ample time before the next upcoming windowPost

:::

:::tip

If you have partitions in all deadlines, it is recommended that you build another transition environment for the upgrade.

:::

:::tip

It is recommended that you backup your old binary and critical data as you go through the upgrade process.

:::

:::tip

For large scale storage systems, it is recommended that running chain-co with both venus daemon and venus wrapped daemon.

:::

1. venus-auth: `optional` upgrade; branch/tag `v1.3.2`;

2. venus-wallet: `optional` upgrade; branch/tag `v1.4.0`;

3. venus daemon: `mandatory` upgrade; branch/tag `v1.2.1`;

:::tip

Checkups after upgrading:

- integrity of vk files
- see if upgrade epochs are properly set in config files

```toml
 # cali
 "upgradeOhSnapHeight": 682006
 # mainnet
 "upgradeOhSnapHeight": 1594680
```

- see if `maxfee` under `mpool` section is now in the format of `[x] Fil`
 
```
"mpool": {
	"maxNonceGap": 100,
   	"maxFee": "10 FIL"
},
```

- see if chain synchronization is working properly

:::

:::warning

As a result of a mandatory network upgrade with API changes, sealer connection maybe lost during the this step of the upgrade.

:::

4. venus wrapped deamon: `mandatory` upgrade (if you are using `chain-co`); branch/tag `venus/v1.14.0`;

:::tip

Checkups after upgrading:

- see if chain synchronization is working properly
- see if connection to venus-auth is okay

```
curl http://127.0.0.1:3453/rpc/v0 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer <YOUR_TOKEN>" -d '{"method": "Filecoin.ChainHead","params":[], "id": 0}'
```

:::

5. chain-co: `mandatory` upgrade (if you deployed chain-co for your HA solution); branch/tag `v0.1.0`;

:::tip

Checkups after upgrading:

- see if two new API MpoolPending and MpoolGetNonce are working properly

:::

6. venus-messager: `mandatory` upgrade; branch/tag `v1.4.0`;

7. venus-gateway: `mandatory` upgrade; branch/tag `v1.2.0`;

:::tip

- support for both old and new API due to changes in ComputeProof's params
- see if both v0 and v1 APIs are working properly

:::

8. venus-miner: `mandatory` upgrade; branch/tag `v1.4.0`;

:::tip

Parameter changes for ComputeProof.

:::

9. venus-market: `optional` upgrade; branch/tag `v2.0.0`;

10. venus-sealer: `mandatory` upgrade; branch/tag `v1.4.0`;

For more question regarding nv15 upgrade, please refer to this discussion [thread](https://github.com/filecoin-project/venus/discussions/4688).
