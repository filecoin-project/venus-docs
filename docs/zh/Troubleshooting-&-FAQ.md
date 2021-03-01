# 故障排除和常见问题解答

_对于 `venus` 有问题吗? 以下是一些常见错误（及其修复），以及常见问题的解答。_

_注意: 此Wiki专注于 `venus` 。有关整个Filecoin项目的问题，请参阅[Filecoin项目常见问题解答](https://filecoin.io/faqs/)._

## 目录

- [故障排除和常见问题解答](#故障排除和常见问题解答)
  - [目录](#目录)
    - [已知问题](#已知问题)
    - [更改端口](#更改端口)
    - [二进制安装](#二进制安装)
    - [下载并构建](#下载并构建)
    - [挖矿和交易](#挖矿和交易)
    - [Daemon无法启动](#daemon无法启动)
    - [链同步不完全导致的问题](#链同步不完全导致的问题)
    - [连接到网络的问题](#连接到网络的问题)
    - [升级](#升级)

### 已知问题
已知问题已 [在此处分类](https://github.com/filecoin-project/venus/issues?q=is%3Aissue+is%3Aopen+label%3AC-bug).

### 更改端口
venus默认使用静态端口 6000。如果要更改为其他端口以解决NAT或其它问题，请按以下方法操作。

1. 初始化节点后，导航至配置文件 `config.json` 。默认情况下，它位于 `~/.venus/config.json`。

2. 找到配置的swarm部分。替换 `6000` 为您要使用的端口。
```json
"swarm": {                                                                                                                                           
                "address": "/ip4/0.0.0.0/tcp/6000"                                                                                                           
        }, 
```

1. 重新启动程序。 `venus swarm id` 应该显示给您使用新的swarm地址。

### 二进制安装

* **错误: “venus is damaged and can’t be opened. You should move it to the Trash." (MacOS) <br />**
这是由于Mac的默认保护设置。在Sierra之前的MacOS上，转到 `System Preferences > Security & Privacy > General`。选择 `Allow apps downloaded from: Anywhere`. (不允许单个应用程序的运行)

### 下载并构建

* **cloning时出现错误: host无法建立真实性<br />**
确定您的Github账号已 [添加SSH密钥](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)。

* **错误: 开发路径无效 (/Library/Developer/CommandLineTools), 缺少 xcrun<br />**
确保已安装 [XCode](https://developer.apple.com/xcode/) 。

* **pulling时发生错误: 找不到SharedFrameworks或无法找到xcodebuild<br />**
这是由于Xcode /命令行工具安装不同步造成的(参考 [golang/go/issues/26073](https://github.com/golang/go/issues/26073))。您可以尝试更新Xcode（如果运行的是老版本），然后启动它以安装最新的命令行工具。

* **$GOPATH 或 $PATH 错误，例如 "panic: exec: gx-go executable file is not found in $PATH"<br />**
确保已经正确运行deps的步骤。例如如果您在Mac上安装了go和rust，那么未为您明确设置GOPATH，二进制文件将安装在 `/usr/local/opt/go/libexec/bin` 中, 检查您的路径并确保所有的存放路径都在其中，如果没有，请添加它们：
    ```sh
    export PATH=${PATH}:/usr/local/opt/go/libexec/bin:~/go/bin
    ```
   然后重试 `go run ./build/*.go deps` ，再重试构建。

    如果仍然卡住，或者看到带有 `$GOPATH` 或 `$PATH` 的错误消息, 则可能是Go工作区设置存在问题。本[教程](https://www.ardanlabs.com/blog/2016/05/installing-go-and-your-workspace.html)可能有所帮助。

* **错误: “venus”软件包至少需要go 1.11.1版。**
...但是，您的gx-go二进制文件是使用go1.10.3编译的。请更新gx-go（或使用当前的go编译器重新编译）如果 `ipfs` 是从自制软件安装的, 则路径中的 `gx` 和 `gx-go` 版本可能错误。与前述一样，检查您的 `$PATH` 并确认所有存放路径是否存在，如果没有，请在自定义路径之前添加它们。

* **运行build或deps时出现Rust错误<br />**
如果遇到rust编译器错误，即 ` cargo build --release --all --manifest-path proofs/rust-proofs/Cargo.toml' failed:` 尝试将rust更新到最新版本 `rustup update`.

* **运行安装时出错<br />**
如果在运行安装时遇到错误，即 `/System/Library/Frameworks//Security.framework/Security are out of sync. Falling back to library file for linking` 这可能是由于安装了旧的。通过安装程序 [installer](https://golang.org/doc/install) 重新安装Go，然后删除filecoin (`rm -rf ./venus`) 并 [重新安装](Getting-Started).

* **无法构建 OS X Mojave `fatal error: 'stdio.h' file not found`**
例如，当您构建go-secp256k1时，如果从源代码构建所有内容并且未使用自制软件安装任何内容，则可能会看到此错误：
    ```sh
    go get -u github.com/ipsn/go-secp256k1
    #github.com/ipsen/go-secp256k1
    In file included from ../../ipsn/go-secp256k1/secp256.go:17
    In file included from ././libsecp256k1/src/secp256k1.c:9:
    ../../ipsn/go-secp256k1/libsecp256k1/src/util.h:14:10: fatal error: 'stdlib.h' file not found
    #include <stdlib.h>
             ^~~~~~~~~~
    ```

    OS X Mojave 将`stdlib.h` 的位置移出了`/usr/include`。该问题在其他软件包中也存在，并且在此线程中针对 [neovim issue #9050](https://github.com/neovim/neovim/issues/9050) 建议了几种解决方案。感谢Filecoin社区成员 *A_jinbin_filecoin.cn* 的链接。

* **安装依赖项时出错 `'go mod download' failed`**<br />
如果您要从以前的版本更新venus，则可能还需要更新git子模块。尝试 `git submodule update --init --recursive` 更新它们。

### 挖矿和交易

* **矿工创建失败**
    * 确保您的节点具有有效的钱包，并且钱包的余额为非零。
    * 确保您的节点已连接到群集/网络。如果守护程序已重新启动，请运行 `swarm connect`.

* **交易终止（消息从未被挖掘）**
    * 如果在同一台计算机上运行两个节点，并且看到类似的信息 `ERROR consensus.: Nonce too high: 5 0 <UnknownActor (0xc0137edda0); balance: 1000000; nonce: 0>`，则您可能至少尝试创建一个矿工一次。即使创建可能失败，此操作也会更新本地随机数。您的nonce过高，无法进行有效的挖矿。*除了重新初始化节点外，没有其他解决方法。*
    * 如果仅运行单个节点，则此问题目前对您来说是看不到的（日志消息仅出现在其他节点上）。如果您怀疑这一点，请重新初始化您的节点。

* **提议的处理失败：发送提议时出错：超过截止日期**
    * 交易被直接提议给相关矿工（链下），因此您的节点需要直接与矿工建立连接，例如创建支付渠道。该矿工离线或您无法访问，请尝试另一个矿工。
    * 最大分片（即文件）大小必须小于矿工扇区大小，当前为256 MiB。

* **提议处理失败：创建支付时出错：超出了截止日期**
    * 最好的推断是先前的消息未能被挖掘，但是增加了actor的nonce。跟踪 [#1936](https://github.com/filecoin-project/venus/issues/1936)，您可能需要重新初始化节点。

* **为什么我的交易被搁置了 `Staged`?**

    * **我的文件分片太大了吗?**
      如果存储客户C建议与矿工M达成交易D，并且D引用了一块数据片段P，其大小小于或等于M的暂存扇区的大小，则P将从C转移到M，并且M将P写入其分段的扇区。D的状态将`Staged` 在此时。

     如果状态不是 `Staged`，则在C提议处理M并传输字节之后，P就不是“等待被密封”。如果P的大小大于扇区的大小，则会发生这种情况。在devnet /用户集群中，所指的大小是`266338304` 字节。

    * **在什么情况下，交易的状态会从`Staged` 到 `Posted` ？**
        如果交易D的状态为 `Staged`, 则矿工已接受数据片P并将其写入暂存扇区S。如果M不使用自动密封，则P将存在S中，直到M收到新的交易D2提议，其数据片P2足够大，以至于大小（P） + 大小（P2） >= 可用空间（S）。发生这种情况时，M将开始密封S。完成密封后，D的状态将变为 `Posted`。

* **为什么我的交易状态没有变为  `Posted`?**

    * 在交易状态变为 `Posted` 之前, 矿工必须接受该数据碎片并将其写入分段扇区（有关详细信息，请参见上面的问题）。一些矿工，包括由Filecoin项目运行的引导节点，被配置为在短时间内自动执行此操作（这称为自动密封）。但是，选定的矿工完全有可能（1）不使用自动密封，并且（2）在密封之前仍等待新的交易以充分填充扇区。在这种情况下，交易达成之前会有延迟 `Posted`。

### Daemon无法启动

* 如果你看到了 `Error: failed to load config file: failed to read config file at "~/.venus/config.json": invalid checksum` 尝试启动Daemon时，请检查config.json中的defaultAddress和miner.address是否正确。

### 链同步不完全导致的问题

* **我向Faucet获取资金，并且收到消息CID，但我的钱包里没有资金。**

    这很可能是因为您的节点尚未完成整个区块链的同步。当您使用faucet接收资金时，Faucet从另一个节点发送节点资金。资金将作为消息发布，并将被上链到新的区块中。在您的节点可以确定您的钱包中有余额之前，必须将新区块同步到您的链中。message wait命令用于确保消息，1）挖掘到区块 2）您已将该区块同步到链中。由于您的faucet要求已放置在最新的块中，因此如果您的链中尚无该块，则FIL不会出现在您的钱包中。

    目前，链同步可能会有点慢。下载所有块的过程非常快，但是当您的节点重播块中的所有消息以确保所有内容都有效时，速度就会变慢。目前，此过程需要相当长的时间。有关如何检查节点的同步进度，请参阅 [从Filecoin Faucet获取FIL](https://github.com/filecoin-project/venus/wiki/Getting-Started#get-fil-from-the-filecoin-faucet) 。

* **消息长时间处于等待状态，Venus message似乎出问题了**

    与上述类似，您可以在完成同步链之前将任何新消息发布到网络。链完成同步后，您才能看到消息。有关如何检查节点的同步进度，请参阅 [从Filecoin Faucet获取FIL](https://github.com/filecoin-project/venus/wiki/Getting-Started#get-fil-from-the-filecoin-faucet) 。

### 连接到网络的问题
* **如何连接到网络？**

    请参阅 `venus swarm --help`。为了连接到指定的网络，您必须具有正确的二进制文件（或源代码），并且需要使用该网络的正确的genesis.car文件初始化Filecoin存储库。
* **当我连接到user-devnet或test-devnet时，我收到很多错误**

    看到错误例如
    ```text
    code not at same version: GIT_SHA does not match DIFFERENT_GIT_SHA, disconnecting from peer:
    ```
    或在链同步期间在块验证期间看到很多错误，这意味着您的二进制或源代码的版本与您要加入的devnet的版本不正确。要加入devnet，请在存储库的 [Releases](https://github.com/filecoin-project/venus/releases) 部分中下载该devnet的最新版本，然后按照Wiki [入门](Getting-Started) 部分中的说明进行操作。

### 升级

* **如何升级我的Venus版本？<br />**
要进行升级 `venus`，您需要在 [README.md](https://github.com/filecoin-project/venus/blob/master/README.md) 重新运行完整的下载和构建过程。将来，我们计划添加自动更新 ([#8](https://github.com/filecoin-project/venus/issues/8))。
