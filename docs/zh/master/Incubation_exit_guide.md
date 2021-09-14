## 孵化器退出指南

&ensp;&ensp; 孵化器每一期结束后，矿工面临退出的问题。目前 Filecoin 主网上线的实现有 lotus 和 venus。故矿工可选的退出方案有：

- 接入其它运营商搭建的venus链服务或参加孵化器第二期；
- 接入自己搭建的venus链服务；
- 切回lotus。

&ensp;&ensp; 以上是当前阶段矿工可选的退出方案，这里我们对如何接入自己搭建的venus链服务和切回lotus方案逐一进行说明。

### 自己搭建venus链服务

- 搭建链服务层，可参考文档 [Chain service construction](./Chain_service_construction.md)

- 修改 venus-wallet 的配置 ` ~/.venus_wallet/config.toml` 指向本地链服务。

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

- 修改venus-sealer的配置 ` ~/.venussealer/config.toml` 指向本地链服务。

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

- 重启venus-wallet-->venus-sealer即可.

[参考文档](../guide/Using-venus-Shared-Modules.md)


### 切回lotus

- 搭建lotus同步节点，目前链数据已经非常庞大，建议从snapshot导入数据。
```bash
nohup ./lotus daemon --import-snapshot=https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car > lotus.log 2>&1 &
```
也可以先将snapshot下载到本地,然后`--import-snapshot`指向本地路径.

- 将miner_id相关的钱包地址(eg.Owner,Worker,Controller等)导入lotus;
```bash
# 从venus-wallet导出私钥
$ ./venus-wallet export <WALLET_ADDRESS>
# 输入密码
Password:

# 导入lotus
$  ./lotus wallet import
# 输入密钥
Enter private key: 
```

- 等待目前正在密封的扇区完成(ProveCommitSector消息上链);

- 停止venus-sealer,用lotus-miner初始化一个新的repo,目录不要和venus-sealer的repo相同.

```bash
TRUST_PARAMS=1 ./lotus-miner init --no-local-storage --actor=<minerID> --sector-size=32G --nosync
```

- 创建lotus-miner的store路径,和venus-sealer的store路径相同,这样就不需要挪动永久存储文件了
```bash
# 不加`--init`标志，因为venus-sealer已经创建
./lotus-miner storage attach --store <VENUS_SEALER_STORE_PATH>
```

- 修改metadata中的key=/storage/nextid,保证新的sectorID不从1开始。
```bash
# 在venus-sealer目录编译lotus-fix
$ make lotus-fix

# 修改lotus-miner的nextid
./lotus-fix -lotus-miner-repo=<~/.lotusminer> -sid=<max sector id>
```

- 导入venus-sealer完成的Sector数据，这些数据在链上也可以查找到，故不是必须的。
```bash
./lotus-fix -task=import-sector  -lotus-miner-repo=/home/litao/.lotusminer -venus-sealer-repo=~/.venussealer
import sectors success.
```
> 这两步操作需要暂时停止lotus-miner运行，故建议在init后进行操作。另外，如果是root用户执行的操作，且lotus-miner是子用户（eg. test）执行，则需要文件授权.
```bash
chown test:test /home/test/ -R
```

- 做新的Sector

```bash
# 指定lotus-miner的seal目录,这个可以指定和之前venus-sealer相同的目录，也可以不同
$ ./lotus-miner storage attach --init --seal <PATH>

# 启动lotus-miner，发送新的任务
$ nohup ./lotus-miner run > miner.log 2>&1 &
$ ./lotus-miner sectors pledge
```
至此你的集群已经切换为lotus运行，后续操作请参考lotus的相关文档。之前创建的venus-sealer repo也可以删除了。
