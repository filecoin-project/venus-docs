## Venus: 发送和接收FIL

为了更好地使用钱包，请阅读 [如何使用钱包](How-to-use-wallet.md)。

本指南将向您展示如何创建和管理Venus钱包，以及如何使用它将一些FIL发送到其它地址。每个节点可以有多个地址。

要使用Venus接收和发送FIL，您将需要 [安装并运行Venus节点](Getting-Started.md)。

[[TOC]]

## 创建一个钱包

### 创建一个bls钱包

```
venus wallet new bls
```

### 创建一个secp256k1钱包

```
venus wallet new --type=secp256k1
```

### 创建一个多重签名钱包

```
venus msig create address1 address2..
```

这将创建一个新地址。您可以将mainnet与testnet地址区分开，因为mainnet以 `f` 开头，testnet以 `t` 开头。

::: 有关您钱包中地址的信息存储在 ~/.venus/wallet 中。
删除这些文件夹也将删除密钥，您将失去对这些钱包中所有资金的控制权。 :::

### 列表地址

您可以根据需要创建任意多个地址。其中之一将是 *默认地址*.

您可以看到当前节点的所有地址的列表：

```
venus wallet ls
```

您可以通过以下方式查看默认地址：

```
venus wallet default
```

如果需要，可以将默认地址更改为其他地址：

```
venus wallet set-default <address>
```

### 获取FIL

对于非主网络，`FIL` 可以从 faucet 获得。[网络仪表板](https://network.filecoin.io/) 提供了 faucets 列表。
对于主网，最简单的方法是 `FIL` 从交易所购买。并非所有交易所都支持 `FIL`，所以在注册之前进行研究。

收到 `FIL`后，请使用电子钱包检查您的余额：

```
venus wallet balance <address>
```

记住，只有当daemon完全同步后，您才会看到最新的余额。

### 发送FIL

使用send命令，后面跟接收地址和您要发送的  `FIL`  数额。

```
venus send <target-address> --value=<FIL amount>

If you want to specify the sending address:
venus send <target-address> --value=<FIL amount> --from=<address>
```

对于高级发送选项：

````
venus send --help
````

### 交易费用

发送的每笔交易都要根据其使用Gas usage支付额外的 `FIL`。默认情况下，Venus自动设置所有必要的值。但是，您可能希望在send命令中使用--gas-feecap标志，以避免在网络拥塞很高时出现意外情况。

### 导出和导入地址

::: 确保您地址的私钥安全！不要与任何人分享！将它们存放在安全的位置！:::

您可以导出和重新导入钱包，包括不同的Venus节点。从节点导出私钥需要两个步骤：


````
first step:
venus wallet export <address>

second step:
enter wallet password
````

使用钱包导入将地址导入节点：

```
venus wallet import <private_key>
```

### 离线节点

每个节点将其钱包存储在 `~/.venus/wallet`:

```
    |--- 000000.vlog
    |--- 000001.sst
    |--- KEYREGISTRY
    |--- LOCK
    |--- MANIFEST
```

当节点离线时导出钱包，请将这些文件从 `~/.venus/wallet` 复制到其他位置。要导入此钱包，请将这些文件复制到 `~/.venus/wallet`。下一次启动时，Venus节点将自动使用这些密钥。

在Github上[编辑此页]() 或 [创建一个问题](https://github.com/filecoin-project/venus-docs/issues)。
