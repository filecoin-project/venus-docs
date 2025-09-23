# NV27 Upgrade Document

## Update Background

NV27 network upgrade

**Calibnet**: 2025-09-11 07:00:00 (Beijing Time), Upgrade Height: 3007294

**Mainnet**: 2025-09-25 07:00:00 (Beijing Time), Upgrade Height: 5348280

## Notes

1. All components must be replaced.
2. Perform a node chain service cleanup within one week before the upgrade.
3. After updating, verify the version number using the `curl` command with the Version API. See API usage: [https://github.com/filecoin-project/venus/issues/5132](https://github.com/filecoin-project/venus/issues/5132).
4. Check the status of pre/pro messages on-chain.
5. Check the status of WD messages on-chain.
6. Verify that block production is normal.
7. Ensure gas fee-related configurations are effective.
8. Do not seal new sectors before the upgrade.

## Components to Upgrade

**sophon-auth, sophon-gateway do not require upgrades this time.**

| Component               | Tag     | Commit  |
| ----------------------- | ------- | ------- |
| sophon-auth             | v1.16.0 | e2340d5 |
| venus                   | v1.19.0 | 0c446c0 |
| sophon-co               | v0.13.0 | 366a025 |
| sophon-gateway          | v1.18.0 | a09e86b |
| sophon-messager         | v1.19.0 | 047a555 |
| sophon-miner            | v1.19.0 | 5cc9dbb |
| droplet                 | v2.15.0 | 60534be |
| damocles-sector-manager | v0.13.0 | f3756a2 |
| damocles-worker         | v0.13.0 | f3756a2 |

### Upgrade Order

1. sophon-auth
2. venus
3. lotus compatible version
4. sophon-co
5. sophon-gateway
6. sophon-messager
7. sophon-miner
8. droplet
9. damocles-manager
10. damocles-worker

---

### sophon-auth

* **Impact**: Provides authentication service for other components.
* **Dependencies**: None.
* **Notes**:

  1. Verify permissions are working correctly after upgrading.

---

### venus

* **Impact**: Chain service.
* **Dependencies**: auth.
* **Notes**:

  * Build: run `make dist-clean` before `make` to avoid issues caused by incomplete `filecoin-ffi` upgrades.

  * After upgrade, check that vk files are complete.

  * Run `./venus state network-info` and verify that `UpgradeGoldenWeekHeight` logs match expected values:

    ```
    # cali
    UpgradeTeepHeight: 3007294

    # mainnet
    UpgradeTeepHeight: 5348280
    ```

  * Confirm block synchronization works properly.

  * Verify mainnet v17 actor code matches expected output:

    ```
    ./venus state actor-cids --network-version 27
     
     Network Version: 27
     Actor Version: 17
     Manifest CID: bafy2bzaceai74ppsvuxs3nvpzzeuptdr3wl7vmdpbphvtz4qt5hfq2qdfvz3e
     Actor             CID                                                             
     account           bafk2bzaceb4as5yyhjfkvxgooum37uvm5gbjr4dtbpxmqnpvvbjfpu5qouii4  
     cron              bafk2bzacea74gcozu357t22lm6t7n7jxsv7buz2quurhtjzz6s7tkxyyfrve6  
     datacap           bafk2bzaceakb5v267o4y6jq3vao4b5c63sjjk3sr2jgjoabtze7ygcvbpvc6i  
     eam               bafk2bzacecp2lpiqfjeiulrgor7g6zx4boo2oobjuyuxvtoqya46ljm6gkgci  
     ethaccount        bafk2bzacedgl6zt7d2ointmeyqrdwkehpi5w5rk3smsemrwbf3v5gc2wx7qfy  
     evm               bafk2bzaced5i2jt5t4f5gplsfb5gogjl5tknvhvsssgyj75on3g6ds36yy45y  
     init              bafk2bzacecp5go2numz52kerspigi2e3rygesaqeqhn4gegmfgr5xoon73sde  
     multisig          bafk2bzaceblf5vqw4dwjueoetgawhg7t6he7qhdnfy3shf7ufnfv4mkwchgbm  
     paymentchannel    bafk2bzaceavlvljdoww4v3bp225p6lurcxtdsub4rg33ee6xhvhkyyysnenac  
     placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro  
     reward            bafk2bzacebezdh75otifygspbfymgeipv34v6feti5xylrxt7xetu77pisnym  
     storagemarket     bafk2bzacebsnn4nk5crrlrvhg5vdpaxsrs4r72etaofxdi7tucr72om22z6a4  
     storageminer      bafk2bzaceautzxqsrstcxerpxtykn4syogslbiwpsfoh562jex262vxeluc4w  
     storagepower      bafk2bzacedyhaec4jvpdmaas6pgtoj7zkdlmdpljz7yjwjqtkfmwv7yb5invw  
     system            bafk2bzacebf4et7elmttbioggwlpmsjhplcnzfxtmi4lnbtqr3f6tzuwsoj2a  
     verifiedregistry  bafk2bzaceak2iqpfy4hw6xyyrf7c4yfh7pl4copzm7t63mokecsxfcnybxnd2
    ```

  * Avoid setting Rust log level to `trace` unless debugging issues, as it generates excessive logs.

  * Run `./venus state get-actor t01000` to confirm upgrade success.

  * **Actor migration**:

    * Pre-migration starts 120 epochs before upgrade height.
    * Pre-migration duration \~1 min; final migration \~120s.

    ```
    Pre-migration start: STARTING pre-migration  
    Pre-migration end: COMPLETED pre-migration  

    Migration start: STARTING migration  
    Migration end: COMPLETED migration
    ```

  * If importing a snapshot and `~/.venus` exists, delete `~/.venus/version` first.

    * Mainnet: `./venus daemon --import-snapshot snapshot.car`
    * Calibnet: `./venus daemon --import-snapshot snapshot.car --network calibrationnet`

---

### sophon-co

* **Impact**: None.
* **Dependencies**: auth, venus, lotus compatible version.
* **Notes**:

  * After starting, check logs (debug level) to ensure node selection works properly.

---

### sophon-gateway

* **Impact**: Gateway service.
* **Dependencies**: auth, wallet.
* **Notes**:

  1. Run `make dist-clean` before `make`.
  2. Verify wallets and miners are registered after upgrade.

---

### sophon-messager

* **Impact**: Message handling.
* **Dependencies**: auth, venus, gateway.
* **Notes**:

  1. After upgrade, confirm messages are received and can land on-chain.

---

### sophon-miner

* **Impact**: Mining service.
* **Dependencies**: auth, venus, gateway.
* **Notes**:

  1. Verify miner count matches pre-upgrade.
  2. Confirm block production works, and check orphan block count.

---

### droplet

* **Impact**: Market service.
* **Dependencies**: auth, venus, gateway, messager.
* **Notes**:

  1. Verify deals can be published successfully.

---

### venus-wallet

* **Impact**: Wallet signing.
* **Dependencies**: None.
* **Notes**:

  1. Confirm signing works and messages land on-chain after upgrade.

---

### damocles-sector-manager

* **Impact**: Sector management.
* **Dependencies**: chain service components.
* **Notes**:

  * Run `make dist-clean` before `make`.

---

### damocles-worker

* **Impact**: Sector worker tasks.
* **Dependencies**: damocles-manager.
* **Notes**: None.

---

### Post-upgrade Validation Steps

1. All programs start normally.
2. Pre/Pro messages land on-chain.
3. Block production is normal.
4. WD messages land on-chain.
5. CC cluster power grows normally.
6. Real data cluster power grows normally.
7. Retrieval works properly for real storage clusters.
8. Database settings for gas, lifecycle, aggregation are correct.

---

### Database Changes

None.
