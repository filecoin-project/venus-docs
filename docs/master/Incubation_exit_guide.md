## Incubation Exit Guide

There are couple options for storage providers to exit incubation program either voluntarily or after each phase ends.

- Join a hosted chain service (venus shared modules) by third party.
- Deploy a chain service (venus shared modules) by yourself.
- Switch back to Lotus.

We will go through option 2 and 3 in this documentation.

:::warning

Make sure you go through the documentation carefully before carry out the exit. Find us on Slack if you have questions.

:::

### Deploy a chain service

Refer to this [document](https://venus.filecoin.io/guide/How-To-Deploy-MingPool.html) to first deploy your own venus chain service. Modify configuration file (`~/.venus_wallet/config.toml`) of `venus-wallet` to point to the newly deployed chain service.

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

Modify the configuration file of  `venus-sealer` (`~/.venussealer/config.toml`) to point to the newly deployed chain service.

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

Restart `venus-walle` and `venus-sealer`.


### Switch back to lotus

Refer to Lotus [documentation](https://docs.filecoin.io/mine/lotus/#protocol-labs-example-architecture) to build and deploy a Lotus node. Sync the node from a snapshot.

```bash
$ nohup ./lotus daemon --import-snapshot=https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car > lotus.log 2>&1 &
```
Import addresses under your miner_id (eg. owner, worker, controller addresses and etc.) into lotus;

```bash
# export private key from venus-wallet
$ ./venus-wallet export <WALLET_ADDRESS>
Password:

# import them to lotus
$  ./lotus wallet import
Enter private key: 
```

Make sure you have no sealing tasks running, messages properly sent on-chain and enough time before your next windowPost deadline. Then stop venus-sealer and initialize a new repo using lotus-miner. 

```bash
TRUST_PARAMS=1 ./lotus-miner init --no-local-storage --actor=<minerID> --sector-size=32G --nosync
```

:::warning

Note that lotus-miner repo must not have the same path as the repo of venus-sealer.

:::

Build lotus-fix utility tool, set nextid and import sectors from venus-sealer.

```bash
# Skip if you already compiled ffi
$ git submodule update --init --recursive
$ make deps

# Compile lotus-fix
$ make lotus-fix

# fix nextid and import sectors from venus-sealer
# change repo path accordingly
$ ./lotus-fix -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=2
```

:::tip

lotus-fix is a utility tool for migrating from venus to lotus.

```bash
# taskType=0; manually change nextid
# set nextid to 300 with -sid flag
$ ./lotus-fix -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=0 -sid=300

# taskType=1; import sectors from venus-sealer to lotus-miner
$ ./lotus-fix -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=1

# taskType=2; atuo change nextid and import sectors from venus-sealer to lotus-miner 
$ ./lotus-fix -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=2
```

:::

:::warning

Make sure lotus-miner is not running while using lotus-fix. 

:::

:::tip

If executing lotus-fix from root user while lotus-miner is run by a user account, you may need set the following. 

```bash
# For example, if your user account name is `test`
chown test:test /home/test/ -R
```

:::

Attach `store path` to lotus-miner, which should be the same as the store path of venus-sealer.

```bash
# do not add the `--init` flag
./lotus-miner storage attach --store <VENUS_SEALER_STORE_PATH>
```

Pledge a new sector

```bash
# attach seal path for lotus-miner
$ ./lotus-miner storage attach --init --seal <PATH>

$ nohup ./lotus-miner run > miner.log 2>&1 &
$ ./lotus-miner sectors pledge
```
At this point, your storage system has been switched to lotus. For follow-up operations, please refer to lotus related documents.
