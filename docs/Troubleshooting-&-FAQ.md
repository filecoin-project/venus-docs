# Troubleshooting and FAQ

_Having trouble with `go-filecoin`? Here are some common errors (and their fixes), as well as answers to frequently asked questions._

_Note: This wiki focuses on `go-filecoin`. For questions about the Filecoin Project at large, see the [Filecoin Project FAQ](https://filecoin.io/faqs/)._

## Table of contents

- [Troubleshooting and FAQ](#troubleshooting-and-faq)
  - [Table of contents](#table-of-contents)
    - [Known issues](#known-issues)
    - [Changing ports](#changing-ports)
    - [Installing from binary](#installing-from-binary)
    - [Downloading and building from source](#downloading-and-building-from-source)
    - [Mining and deals](#mining-and-deals)
    - [Storage](#storage)
    - [Daemon will not start](#daemon-will-not-start)
    - [Problems caused by incomplete chain sync](#problems-caused-by-incomplete-chain-sync)
    - [Issues connecting to a network](#issues-connecting-to-a-network)
    - [Upgrading](#upgrading)

### Known issues
Known bugs are [catalogued here](https://github.com/filecoin-project/go-filecoin/issues?q=is%3Aissue+is%3Aopen+label%3AC-bug).

### Changing ports
go-filecoin uses static port 6000 by default. If you want to change to another port to troubleshoot NAT or other issues, here's how.

1. After initializing the node, navigate to configuration file `config.json`. By default this lives at `~/.filecoin/config.json`.

2. Find the swarm section of the config. Replace `6000` with the port you wish to use.
```json
"swarm": {                                                                                                                                           
                "address": "/ip4/0.0.0.0/tcp/6000"                                                                                                           
        }, 
```

3. Restart the daemon. `go-filecoin id` should show you using the new swarm address.

### Installing from binary

* **Error: “go-filecoin” is damaged and can’t be opened. You should move it to the Trash." (MacOS) <br />**
This is due to Mac's default protection settings. On MacOS before Sierra, go to `System Preferences > Security & Privacy > General`. Select `Allow apps downloaded from: Anywhere`. (Allowing the individual application doesn't work.)

### Downloading and building from source

* **Error when cloning: authenticity of host can’t be established<br />**
Make sure your Github account has [SSH keys added](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/).

* **Error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun<br />**
Make sure you have [XCode](https://developer.apple.com/xcode/) installed.

* **Error when pulling: SharedFrameworks not found or unable to locate xcodebuild<br />**
This is due to an out-of-sync Xcode/command line tools installation (see [golang/go/issues/26073](https://github.com/golang/go/issues/26073)). You can try updating Xcode (if you’re running an outdated version) and then launch it to install the latest command-line tools.

* **$GOPATH or $PATH errors such as "panic: exec: gx-go executable file is not found in $PATH"<br />**
Make sure that the deps step ran successfully. If for example you are on a Mac and you installed go and rust with brew, GOPATH isn't explicitly set for you, the binaries will be installed in `/usr/local/opt/go/libexec/bin`, and also your default GOPATH is `~/go/`. Check your path and make sure all the go bin paths are there, and if not, add them:
    ```sh
    export PATH=${PATH}:/usr/local/opt/go/libexec/bin:~/go/bin
    ```
    Then retry `go run ./build/*.go deps` before retrying the build.

    If you are still stuck, or you see an error message with `$GOPATH` or `$PATH`, it could be an issue with your Go workspace setup. This [tutorial](https://www.ardanlabs.com/blog/2016/05/installing-go-and-your-workspace.html) may help.

* **Error: package 'go-filecoin' requires at least go version 1.11.1.**
...however, your gx-go binary was compiled with go1.10.3. Please update gx-go (or recompile with your current go compiler)
If you installed `ipfs` from homebrew, you may have the wrong version of `gx` and `gx-go` on your path. As with the previous point, check your `$PATH` and make sure all the go bin paths are there, and if not, add them, before your homebrew path.

* **Rust error while running build or deps<br />**
If you encounter a rust compiler error, i.e. ` cargo build --release --all --manifest-path proofs/rust-proofs/Cargo.toml' failed:` try updating rust to the latest version with `rustup update`.

* **Error while running install<br />**
If you encounter an error while running install, i.e. `/System/Library/Frameworks//Security.framework/Security are out of sync. Falling back to library file for linking`, this may be due to outdated installs. Reinstall Go via the [installer](https://golang.org/doc/install). Then remove filecoin (`rm -rf ./go-filecoin`) and [reinstall it](Getting-Started).

* **Can't build OS X Mojave `fatal error: 'stdio.h' file not found`**
You may see this error if you are building everything from source and not installing anything with homebrew, for example, when building go-secp256k1:
    ```sh
    go get -u github.com/ipsn/go-secp256k1
    #github.com/ipsen/go-secp256k1
    In file included from ../../ipsn/go-secp256k1/secp256.go:17
    In file included from ././libsecp256k1/src/secp256k1.c:9:
    ../../ipsn/go-secp256k1/libsecp256k1/src/util.h:14:10: fatal error: 'stdlib.h' file not found
    #include <stdlib.h>
             ^~~~~~~~~~
    ```

    OS X Mojave moved the location of `stdlib.h` out of `/usr/include`.  This issue exists for other packages and there are several possible solutions suggested in this thread for [neovim issue #9050](https://github.com/neovim/neovim/issues/9050). Thanks to Filecoin community member *A_jinbin_filecoin.cn* for the link.

* **Error when installing dependencies `'go mod download' failed`**<br />
If you're updating go-filecoin from a previous version the git submodules may also need to be updated. Try `git submodule update --init --recursive` to update them.

### Mining and deals

* **Miner create fails**
    * Make sure that your node has a valid wallet and the wallet has a nonzero balance.
    * Make sure that your node is connected to the swarm/network. If the daemon has been restarted, run `swarm connect`.

* **Transaction hangs (message never mined)**
    * If running two nodes on the same machine and you see something like `ERROR consensus.: Nonce too high: 5 0 <UnknownActor (0xc0137edda0); balance: 1000000; nonce: 0>`, you probably tried to create a miner at least once before. This updated the local nonce, even though the creation may have failed. Your nonce is too high for valid mining. *There is no known way around this except re-initing the node.*
    * If only running a single node, this problem is unobservable to you at present (the log message only appears in other nodes). If you suspect this, re-init your node.

* **Proposing deal fails: error sending proposal: context deadline exceeded**
    * Deals are proposed directly to the miner in question (off-chain), so your node needs a direct connection to the miner, e.g. to create a payment channel. The miner is offline or otherwise inaccessible to you. Try another miner.
    * The maximum piece (i.e. file) size must be less than the miner sector size, currently 256Mib.

* **Proposing deal fails: error creating payment: context deadline exceeded**
    * Our best guess is that a prior message failed to be mined, but increased your actor's nonce. Tracking in [#1936](https://github.com/filecoin-project/go-filecoin/issues/1936). You probably need to re-init your node.

* **Proposing deal fails: error sending proposal: context deadline exceeded**
    * Deals are proposed directly to the miner in question (off-chain), so your node needs a direct connection to the miner, e.g. to create a payment channel. The miner is offline or otherwise inaccessible to you. Try another miner.
    * The maximum piece (i.e. file) size must be less than the miner sector size, currently 256Mib.

* **Proposing deal fails: error creating payment: context deadline exceeded**

    * Our best guess is that a prior message failed to be mined, but increased your actor's nonce. Tracking in [#1936](https://github.com/filecoin-project/go-filecoin/issues/1936). You probably need to re-init your node.

* **Why is my deal stuck in the `Staged` state?**

    * **Was my piece too big?**
      If a storage client C proposes a deal D with a miner M and that D references a piece P whose size is less than or equal to the size of M's staged sector, P will be transferred from C to M and M will write P to its staged sector. The state of D will be `Staged` at this point.

      If the state does not equal `Staged` immediately after C proposes a deal with M and transfers the bytes, then P isn't "waiting to be sealed." This can happen if the size of P is larger than size of the sector. In the devnet/user cluster, that size I speak of is `266338304` bytes.

    * **At which point will the state of a deal move from `Staged` to `Posted`?**
        If the state of deal D is `Staged`, then the miner has accepted piece P and written it to a staged sector S. **If M isn't using auto-sealing**, P will sit in S until M receives a new deal D2 proposal whose piece P2 is large enough such that size(P) + size(P2) >= free-space(S). When this happens, M will start sealing S. When sealing completes, the state of D will become `Posted`.

* **Why hasn't my deal transitioned to `Posted`?**

    * Before a deal can be `Posted`, the miner must accept the piece and write it to a staged sector (see above question for details). Some miners, including bootstrap nodes run by the Filecoin project, are configured to automatically do this at short intervals (this is called auto-sealing). However, it's entirely possible that the selected miner is (1) not using auto-sealing and (2) still waiting for new deals to fill the staged sector sufficient before sealing. In that case, there will be a delay before the deal becomes `Posted`.

### Storage

* **How can I make sure my piece is sealed immediately?**

  * To ensure that your piece is sealed into a miner's staged sector immediately, the size of your piece should equal the sector size (in bytes). In the devnet/user cluster, this number is configured to be `266338304`.

    To create such a piece and store its CID in `PIECE_1_CID`, a storage client can run the following commands:

    ```sh
    PIECE_1_PATH=$(mktemp)
    dd if=/dev/urandom of="${PIECE_1_PATH}" bs=$((1024*1024)) count=254
    PIECE_1_CID=$(./go-filecoin client import < ${PIECE_1_PATH})
    ```

### Daemon will not start

* If you see `Error: failed to load config file: failed to read config file at "~/.filecoin/config.json": invalid checksum` when trying to start a daemon, check that the defaultAddress and miner.address are correct in config.json.

### Problems caused by incomplete chain sync

* **I requested funds from the faucet and I have a message CID , but there are no funds in my wallet.**

    This is most likely because your node hasn't finished syncing the entire blockchain yet. When you use the faucet to receive funds, the faucet sends your node funds from another node. The funds are issued as a message which will be mined into a new block. The new block must be synced to your chain before your node can determine that you wallet has the balance. The message wait command is used to ensure that the message is 1) mined into a block 2) that you have that block synced to your chain. Since your faucet request is put on the latest block, if you don't have that block yet in your chain, the FIL won't appear in your wallet.

    Currently chain syncing can be a little slow. The process of downloading all of the blocks is pretty quick, but the slowness comes when your node replays all messages in the block to ensure everything is valid. This process currently takes quite a long time. See [Get FIL from the Filecoin Faucet](https://github.com/filecoin-project/go-filecoin/wiki/Getting-Started#get-fil-from-the-filecoin-faucet) for how to check your node's sync progress.

* **Message stays in wait state for a long time, go-filecoin message wait seems to hang**

    Similarly to above, you can post any new message to the network before you have finished syncing the chain. You won't see the message until the chain is done syncing. See [Get FIL from the Filecoin Faucet](https://github.com/filecoin-project/go-filecoin/wiki/Getting-Started#get-fil-from-the-filecoin-faucet) for how to check your node's sync progress.

### Issues connecting to a network
* **How do I connect to the network?**

    See `go-filecoin swarm --help`.  In order to connect to a particular network, you must have the correct binary (or source code) and you need to have initialized your filecoin repodir with the right genesis.car file for that network.

* **I'm receiving a lot of errors when I connect to user-devnet or test-devnet**

    Seeing an error such as
    ```text
    code not at same version: GIT_SHA does not match DIFFERENT_GIT_SHA, disconnecting from peer:
    ```
    or seeing a lot of errors during validation of blocks during chain syncing means that your binary or source code is not at the correct version for the devnet you'd like to join. To join a devnet, download the latest release for that devnet in the [Releases](https://github.com/filecoin-project/venus/releases) section of the repository and follow the directions in [Getting Started](Getting-Started) sections of the wiki.

### Upgrading

* **How do I upgrade my version of go-filecoin?<br />**
To upgrade `go-filecoin`, you will need to re-run the full download and build process in [README.md](https://github.com/filecoin-project/go-filecoin/blob/master/README.md). In the future, we plan to add automatic updating ([#8](https://github.com/filecoin-project/go-filecoin/issues/8)).
