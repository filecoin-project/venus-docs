
## 为什么要这样做

&ensp;&ensp; Venus分布式矿池中, `venus-wallet`属于独立组件，每个集群部署一个，这样做的目的是保证客户完全掌控集群的钱包密钥,不对外界公开,这也和`venus`的设计初衷一致,提高系统安全性，保障用户资金安全.

&ensp;&ensp; 在`venus`矿池中,我们屏蔽了`Send`消息的处理，避免模拟发送转账消息攻击系统的手段，但这也给客户转账带来一定的困扰，故此文档对如何提取矿工账户可用余额和转账方式进行说明。

## 余额管理

### 查看可用余额

在venus-sealer端执行命令
```sh
$  ./venus-sealer info
  Chain: [sync behind! (1h26m35s behind)] [basefee 100 aFIL]
  ...
  
  Sealer Balance:    253.94 FIL
        PreCommit:  23.045 FIL
        Pledge:     3 FIL
        Vesting:    102.474 FIL
        Available:  125.421 FIL
 ...
```
- Available 即可用余额,会随着出块或抵押释放等方式更新

### 提取可用余额

在venus-sealer端执行命令
```sh
$  ./venus-sealer actor withdraw [amount (FIL)]

```
这个命令会将指定数额的fil提取到该矿工对应的owner地址，查看owner可以通过多种方式,这里介绍在venus-sealer端查询方式:

```sh
$ ./venus-sealer actor control list
name    ID      key           use    balance                    
owner   t01763  t3qsek22y...         *** FIL  
worker  t01762  t3rcktwpg...  other  *** FIL  
```

### 转账

用户将fil提取到owner地址后，利用协议实验室推荐的[钱包APP](https://fivetoken.io/download)可以转出到其他账户.

用户也可以选择其他可行方式:比如同步一个venus/lotus节点,导入钱包私钥后执行转账(Send)命令等.
