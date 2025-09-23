# NV25 Upgrade Document

## Upgrade Background

NV25 network upgrade

**Calibnet**: 2025-03-26 07:00:00 (Beijing Time), Upgrade Height: 2520574

**Mainnet**: 2025-04-15 07:00:00 (Beijing Time), Upgrade Height: 4878840

## Notes

1. All components must be replaced.
2. Perform a node chain service cleanup within one week before the upgrade.
3. After updating, verify the version number using the `curl` command with the Version API. See API usage: [https://github.com/filecoin-project/venus/issues/5132](https://github.com/filecoin-project/venus/issues/5132).
4. Check the status of pre/pro messages on-chain.
5. Check the status of WD messages on-chain.
6. Verify that block production is normal.
7. Ensure gas fee-related configurations are effective.
8. Do not seal new sectors before the upgrade.

## Components to Upgrade (sophon-auth is not upgraded this time)

| Component               | Tag     | Commit |
| ----------------------- | ------- | ------ |
| venus                   | v1.18.1 |        |
| sophon-co               | v0.12.0 |        |
| sophon-gateway          | v1.18.0 |        |
| sophon-messager         | v1.18.0 |        |
| sophon-miner            | v1.18.0 |        |
| droplet                 | v2.14.0 |        |
| damocles-sector-manager | v0.12.3 |        |
| damocles-worker         | v0.12.3 |        |

### Upgrade Order

1. sophon-auth (not upgraded)
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
* **Notes**: Not upgraded in this network upgrade.

---

### venus

* **Impact**:

  1. **Supports f3**:
     Currently, Filecoin block finality requires 900 epochs. f3 aims to make blocks final much faster, ideally within just a few epochs. f3 requires miners to connect to a node for voting, and miners must sign votes. Since production nodes do not store private keys, nodes must connect to sophon-gateway for signing.

     venus supports two ways to connect to sophon-gateway:

     1. Add `--wallet-gateway=<token:url>` at startup.
     2. Configure `config.json`:

        ```json
        "walletModule": {
            "gatewayBacked": "<token:url>"
        }
        ```

* **Dependencies**: auth

* **Notes**:

  * Build: run `make dist-clean` before `make` to avoid issues caused by incomplete `filecoin-ffi` upgrades.

  * After upgrade, check that vk files are complete.

  * Run `./venus state network-info` and verify `UpgradeTuktukHeight` matches expected values:

    ```
    # cali
    UpgradeTeepHeight: 2520574

    # mainnet
    UpgradeTeepHeight: 4878840
    ```

  * Confirm block synchronization works properly.

  * Verify mainnet v16 actor code matches expected output:

    ```
    ./venus state actor-cids --network-version 25
    ...
    Network Version: 25
    Actor Version: 16
    Manifest CID: bafy2bzacecnepvsh4lw6pwljobvwm6zwu6mbwveatp7llhpuguvjhjiqz7o46
    ...
    ```

  * Avoid setting Rust log level to `trace` unless debugging issues.

  * Run `./venus state get-actor t01000` to confirm upgrade success.

  * **Actor migration**:

    * Pre-migration starts 120 epochs before upgrade height.
    * Pre-migration duration \~1 min; final migration \~30s.

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
* **Notes**: After starting, check logs (debug level) to ensure node selection works properly.

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
* **Notes**: After upgrade, confirm messages are received and can land on-chain.

---

### sophon-miner

* **Impact**:
  f3 requires miners to vote via nodes. However, production miners connect through sophon-co, which may route requests to different nodes, potentially causing vote failures.
  To resolve this, a new **f3 node configuration** is added:

  ```
  [F3Node]
    Addr  = "/ip4/127.0.0.1/tcp/3453"
    Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  ```

  > The F3Node config uses the venus token and URL. This venus must already be connected to sophon-gateway.

* **Dependencies**: auth, venus, gateway.

* **Notes**:

  1. Verify miner count matches pre-upgrade.
  2. Confirm block production works, and check orphan block count.

---

### droplet

* **Impact**: Market service.
* **Dependencies**: auth, venus, gateway, messager.
* **Notes**: Verify deals can be published successfully.

---

### venus-wallet

* **Impact**: Wallet signing.
* **Dependencies**: None.
* **Notes**: Confirm signing works and messages land on-chain after upgrade.

---

### damocles-sector-manager

* **Impact**: Sector management.
* **Dependencies**: chain service components.
* **Notes**: Run `make dist-clean` before `make`.

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
