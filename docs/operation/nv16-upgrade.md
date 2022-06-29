## nv16 upgrade

### timeline

Mainnet upgrade time: 2022-07-06T14:00:00Z

### venus-auth

- tag: v1.6.0
- New features: shared token access support for multi SPs 
- Dependency on other components: none

Things to look out for:

1. Add a `miners` table to save the correspondence between `user` and `miner`

2. Write the values ​​of the `name` and `miner` fields of each row of data in the `users` table to the `user` and `miner` fields in the `miners` table, check whether there is any problem with the writing, the success log: `migrate from:0, to:1 success;` failure log: `migrate from store version:0 failed`

3. Use `./venus-auth user miner list <user>` to list all miners binded to `user`

4. Use the command `./venus-auth user list` to list all users. **Note: make sure that the status of the user being used is enabled**


### venus

- tag: v1.6.0
- New features: Support for nv16 networks
- Dependency on other components: none

Things to look out for:
1. Check whether the vk file is complete after the upgrade

2. Check the configuration file after the upgrade to see if the upgrade height is properly set. The default configuration file is in `~/.venus/config.json` :
    ````
    # cali
    "upgradeSkyrHeight": 1044660
    #mainnet
    "upgradeSkyrHeight": 1960320
    ````

3. After the upgrade, check whether the blocks are properly synchronized

4. The api version has changed, affecting the miner connection

    ````
    # Use the curl command to test the interfaces StateGetBeaconEntry, BeaconGetEntry, the following three curl commands should return the same results
    curl http://127.0.0.1:3453/rpc/v0 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"method": "Filecoin.BeaconGetEntry", "params":[1933610], "id": 0}'
    curl http://127.0.0.1:3453/rpc/v1 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"method": "Filecoin.BeaconGetEntry", "params":[1933610], "id": 0}'
    curl http://127.0.0.1:3453/rpc/v1 -X POST -H "Content-Type: application/json" -H "Authorization: Bearer token" -d '{"method": "Filecoin.StateGetBeaconEntry", "params":[1933610], "id": 0}'
    ````

5. Check the mainnet v8 actors cid and make sure it is the same as the output below

    ````
    ./venus state actor-cids

    # The order may vary
    _manifest bafy2bzacebogjbpiemi7npzxchgcjjki3tfxon4ims55obfyfleqntteljsea
    account bafk2bzacedudbf7fc5va57t3tmo63snmt3en4iaidv4vo3qlyacbxaa6hlx6y
    storagemarket bafk2bzacediohrxkp2fbsl4yj4jlupjdkgsiwqb4zuezvinhdo2j5hrxco62q
    storageminer bafk2bzacecgnynvd3tene3bvqoknuspit56canij5bpra6wl4mrq2mxxwriyu
    multisig bafk2bzacebhldfjuy4o5v7amrhp5p2gzv2qo5275jut4adnbyp56fxkwy5fag
    paymentchannel bafk2bzacebalad3f72wyk7qyilvfjijcwubdspytnyzlrhvn73254gqis44rq
    reward bafk2bzacecwzzxlgjiavnc3545cqqil3cmq4hgpvfp2crguxy2pl5ybusfsbe
    system bafk2bzacedwq5uppsw7vp55zpj7jdieizirmldceehu6wvombw3ixq2tcq57w
    cron bafk2bzacecqb3eolfurehny6yp7tgmapib4ocazo5ilkopjce2c7wc2bcec62
    init bafk2bzaceaipvjhoxmtofsnv3aj6gj5ida4afdrxa4ewku2hfipdlxpaektlw
    storagepower bafk2bzacebjvqva6ppvysn5xpmiqcdfelwbbcxmghx5ww6hr37cgred6dyrpm
    verifiedregistry bafk2bzaceb3zbkjz3auizmoln2unmxep7dyfcmsre64vnqfhdyh7rkqfoxlw4
    ````

6. Mainnet can use fvm on nv15 network by setting environment variable `export VENUS_USE_FVM_TO_SYNC_MAINNET_V15=1`

7. If you do not troubleshoot the problem, the rust log level is **not recommended** to be set to `trace`, because more logs will be printed

8. After the upgrade, you can use the command `./venus state get-actor t01000` to confirm whether the upgrade is successful


### venus-messager

- tag:v1.6.0
- Affected function: Support new network version, add home directory, default in `~/.venus-messager`
- Dependency on other components: none

Things to look out for:
1. Whether to generate the main directory `~/.venus-messager` after the upgrade

2. After the upgrade, the main directory should contain `config.toml` and `tipset.json`, `config.toml` should be consistent with the configuration file used to start `messager`, `~/.venus-messager/tipset.json` is copied from `tipset.json` in the current directory

3. After the upgrade is successful, restarting again is to read the configuration is `~/.venus-messager/config.toml`

4. Whether the message can be received and pushed to the node normally


### venus-miner

- tag: v1.6.0
- New features: Get the interface name of beacon Change from `BeaconGetEntry` to `StateGetBeaconEntry`
- Dependency on other components: venus, venus-auth, venus-gateway

Things to look out for:
1. After the upgrade, use the commonly used command address state/list/update to verify it.
2. If you use a mysql database, check that the parent_key field in the miner_blocks table is varchar(1000)


### venus-gateway

- tag: v1.6.0
- New Feature: Fix requests without auto cleanup timeouts

Things to look out for:

1. Is `wallet` re-registered after the upgrade


### venus-market

- tag: v2.2.0
- New features:

Things to look out for::


### venus-wallet

#### Community

- tag: v1.6.0
- New features:

Things to look out for::

1. Need to unlock wallet
2. if wallet is properly registered on the gateway