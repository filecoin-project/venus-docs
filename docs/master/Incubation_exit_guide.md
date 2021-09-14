## Incubation Exit Guide

&ensp;&ensp; After each phase of the incubator is over, miners face the problem of withdrawing. Currently there are lotus and venus implementations of Filecoin mainnet. Therefore, the exit options available to miners are：

- Access to venus chain services built by other operators or participate in the second phase of the incubator;
- Access the venus chain service built by yourself;
- Switch back to lotus.

&ensp;&ensp; The above is the optional exit plan for miners at the current stage. Here we explain how to access the venus chain service built by yourself and switch back to the lotus plan one by one.

### Switch back to your own venus

- Build the chain service layer, refer to the document [Chain service construction](./Chain_service_construction.md)

- Modify the `venus-wallet` configuration (`~/.venus_wallet/config.toml`) to point to the local chain service.

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

- Modify the configuration of `venus-sealer` (`~/.venussealer/config.toml`) to point to the local chain service.

```toml
[Node]
  Url = "/ip4/<IP_ADDRESS_OF_VENUS>/tcp/3453"
  Token = <AUTH_TOKEN_FOR_ACCOUNT_NAME>

[JWT]
  Secret = "8e5e90ad4c6ce64e16f4bd20622ad60b9b236caefb97081f09b53acfa75e6a44"

[Messager]
  Url = /ip4/<IP_ADDRESS_OF_VENUS_MESSAGER>/tcp/<PORT_OF_VENUS_MESSAGER>
  Token = <AUTH_TOKEN_FOR_ACCOUNT_NAME>

[RegisterProof]
  Urls = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/<PORT_OF_VENUS_GATEWAY>"]
  Token = <AUTH_TOKEN_FOR_ACCOUNT_NAME>
```

- Restart `venus-walle` --> `venus-sealer`.

[Reference documents](../guide/Using-venus-Shared-Modules.md)


### Switch back to lotus

- To build a lotus synchronization node, the current chain data is already very large, it is recommended to import the data from the snapshot.
```bash
nohup ./lotus daemon --import-snapshot=https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car > lotus.log 2>&1 &
```
You can also download the snapshot to the local first, and then `--import-snapshot` points to the local path.

- Import the wallet address related to miner_id (eg.Owner, Worker, Controller, etc.) into lotus;
```bash
# Export private key from venus-wallet
$ ./venus-wallet export <WALLET_ADDRESS>
Password:

# import to lotus
$  ./lotus wallet import
Enter private key: 
```

- Wait for the sector currently being sealed to be completed (ProveCommitSector message on the chain);

- Stop venus-sealer and initialize a new repo with lotus-miner. The directory should not be the same as the repo of venus-sealer.

```bash
TRUST_PARAMS=1 ./lotus-miner init --no-local-storage --actor=<minerID> --sector-size=32G --nosync
```

- Create the `store path` of lotus-miner, which is the same as the store path of venus-sealer, so there is no need to move the permanent storage file.
```bash
# Do not add the `--init` flag, because venus-sealer has been created
./lotus-miner storage attach --store <VENUS_SEALER_STORE_PATH>
```

- Modify the key=/storage/nextid in the metadata to ensure that the new sectorID does not start from 1.
```bash
# Compile lotus-fix in the venus-sealer directory
$ make lotus-fix

# Modify the nextid of lotus-miner
./lotus-fix -lotus-miner-repo=<~/.lotusminer> -sid=<max sector id>
```

- Import the Sector data completed by venus-sealer, this is not necessary, because these can also be found on the chain.
```bash
./lotus-fix -task=import-sector  -lotus-miner-repo=/home/litao/.lotusminer -venus-sealer-repo=~/.venussealer
import sectors success.
```
> These two steps need to temporarily stop lotus-miner operation, so it is recommended to operate after init. In addition, if the operation is performed by the root user and lotus-miner is performed by a sub-user (eg. test), file authorization is required.
```bash
chown test:test /home/test/ -R
```

- Make a new sector

```bash
$ ./lotus-miner storage attach --init --seal <PATH>

$ nohup ./lotus-miner run > miner.log 2>&1 &
$ ./lotus-miner sectors pledge
```
At this point, your cluster has been switched to lotus operation. For follow-up operations, please refer to lotus related documents. The previously created venus-sealer repo can also be deleted.
