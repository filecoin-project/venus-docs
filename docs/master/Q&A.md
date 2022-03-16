### Q&A

For more questions SP encounters when using Venus, please refer to [#fil-venus](https://filecoinproject.slack.com/archives/CEHHJNJS3) and [#fil-venus-cn](https://filecoinproject.slack.com/archives/C028PCH8L31) for more.

### chain services (venus shared modules)

**1)、**From venus node, `ERROR: must set url or token`, or

```bash
2021-09-08T11:05:33.796+0800 WARN cliutil apiinfo/apiinfo.go:125 parse libp2p address error , plz confirm this error failed to parse multiaddr "": empty multiaddr
```

Please check if urls/tokens are configured properly. Urls are requried to follow formats defined in [multiaddr](https://github.com/multiformats/go-multiaddr). Example: `--node-url=/ip4/127.0.0.1/tcp/3453`, don't do: `--node-url= /ip4/127.0.0.1/tcp/3453`.

**2)、**When connecting to venus from some shared modules, `connect to node failed cannot dialer to addr ws://192.168.10.73:3453/rpc/v0 due to unexpected EOF`

venus probably hasn't been configured to allow connection from other IP address. Example: `0.0.0.0:3453`, don't do: `198.172.0.3：3453`.

**3)、**From venus, `too many files open`[*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631578830055000?thread_ts=1631506523.042700&cid=CEHHJNJS3)

Set the limit for number of open files to a larger number. `$ ulimit -n 1048576`

**4)、**From venus-messager or venus [*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631597560068400?thread_ts=1631506523.042700&cid=CEHHJNJS3)

```bash
ERROR[2021-09-14T01:30:03-04:00] listen head changes errored: process new head error: process apply failed got parent receipt failed amt load: failed to root: blockstore: block not found: amt load: failed to root: blockstore: block not found
```

Synchronization issues. Check if venus is properly synced to latest height.

**5)、**From venus-messager, `WARN[2021-09-14T01:54:21-04:00] no broadcast node config` [*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631599790073100?thread_ts=1631506523.042700&cid=CEHHJNJS3)
This warning can be ignored.

**6)、**From venus-miner, `ERROR miner miner/baseinfo.go:355 [t01011] failed to compute winning post proof: no connections for this miner t01011` 

The `venus-sealer` for the miner id mentioned in the error is not properly connected to `venus-gateway`.

**7)、**From venus-miner, `ERROR miner miner/multiminer.go:168 create WinningPoStProver failed for [<empty>], err: getting sector size: not found resolve address` [*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631621284077800?thread_ts=1631506523.042700&cid=CEHHJNJS3)

Nertowrk doesn't support the sector size user specified during init. Check [network.filecoin.io](https://network.filecoin.io/) for latest network configurations.

**8)、**From venus-messager, `ERROR[2021-09-14T08:54:29-04:00] listen head changes errored: RPC error (-32601): method 'Filecoin.ChainNotify' not supported in this mode (no out channel support)` [*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631624179079100?thread_ts=1631506523.042700&cid=CEHHJNJS3)

Choose either ws or wss as network protocol in url for use between shared modules. Urls are requried to follow formats defined in [multiaddr](https://github.com/multiformats/go-multiaddr).

**9)、**From venus or venus-messager, `bad handshake` [*](https://filecoinproject.slack.com/archives/CEHHJNJS3/p1631626576083200?thread_ts=1631506523.042700&cid=CEHHJNJS3)

Check IP, ports, and token in venus-messager config file are properly configured. Urls are requried to follow formats defined in [multiaddr](https://github.com/multiformats/go-multiaddr).

**10)、**From venus, `Proof type 7 not allowed for new miner actors` [*](https://filecoinproject.slack.com/archives/C02E95ZU5PG/p1631758710080500)

During sealer init, user chose wrong sector size for the network. Check [network.filecoin.io](https://network.filecoin.io/) for latest network configurations.

**11)、**When sending a message, `Address txxxxxxx not exit` [*](https://filecoinproject.slack.com/archives/C02E95ZU5PG/p1631762887093700)

Check if there is wallet addresses registered on gateway. Also see if connection between venus-messager and Venus-gateway is okay.

### Venus local modules

TBC

