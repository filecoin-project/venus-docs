# 孵化中心节点迁出指南

[孵化中心](https://venus.filecoin.io/zh/incubation/Rules.html)的存储提供者在其参与的阶段结束后，节点面临迁出的问题。目前主网运行中的Filecoin实现有Lotus和Venus，所以相关节点可选择的方案有：

- 加入第三方搭建的Venus链服务；
- 自行搭建Venus链服务；
- 切换为Lotus；

以上是当前阶段存储提供者可选的方案，这里我们对”如何接入自己搭建的Venus链服务“以及“如何切换为Lotus“的方案进行说明。

</br>

## 自行搭建Venus链服务

- 搭建链服务层，可参考文档 [Chain service construction](./Chain_service_construction.md)

- 修改 venus-wallet 的配置 ` ~/.venus_wallet/config.toml`，指向本地链服务。

```toml
[APIRegisterHub]
RegisterAPI = ["/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132"]
Token = "<AUTH_TOKEN_FOR_ACCOUNT_NAME>"
SupportAccounts = ["<ACCOUNT_NAME>"]
```

- 修改venus-sealer的配置 ` ~/.venussealer/config.toml`，指向本地链服务。

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

- 重启venus-wallet-->venus-sealer即可，可[参考文档](../guide/Using-venus-Shared-Modules.md)。

</br>

## 切换为Lotus

- 搭建lotus作为同步节点，目前链数据已经非常庞大，建议从snapshot导入数据。
```bash
nohup ./lotus daemon --import-snapshot=https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car > lotus.log 2>&1 &
```
也可以先将snapshot下载到本地,然后用`--import-snapshot`指向本地路径.

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

- 等待目前正在密封的扇区完成(ProveCommitSector类型的消息上链);

- 停止venus-sealer,用lotus-miner初始化一个新的repo,目录不要和venus-sealer的repo相同.

```bash
TRUST_PARAMS=1 ./lotus-miner init --no-local-storage --actor=<minerID> --sector-size=32G --nosync
```

- 设置扇区nextid,导入venus-sealer做的扇区.
```bash
# 编译ffi,如果已经编译则跳过
$ git submodule update --init --recursive
$ make deps
# 编译lotus-fix
$ make lotus-fix

# 修改nextid或导入扇区列表
$ ./lotus-fix -lotus-miner-repo=/root/.lotusminer/ -venus-sealer-repo=/root/.venussealer -taskType=0 -sid=10
```
> `taskType`: 0-只修改nextid,1-只导入扇区,2-都做; `sid`: 默认是0,这时会从源仓库中查找最大扇区的ID写入nextid,其他值-以指定的值修改nextid.

> 这一步需要暂时停止lotus-miner的运行，所以建议在init后进行操作。另外，如果是root用户执行的操作，且lotus-miner是子用户（eg. test）执行，则需要授权。
```bash
chown test:test /home/test/ -R
```

- 创建lotus-miner的store路径,和venus-sealer的store路径相同,这样就不需要挪动永久存储文件了。
```bash
# 不加`--init`标志，因为venus-sealer已经创建
./lotus-miner storage attach --store <VENUS_SEALER_STORE_PATH>
```

- 封装新的Sector

```bash
# 指定lotus-miner的seal目录,这个可以指定和之前venus-sealer相同的目录,也可以不同
$ ./lotus-miner storage attach --init --seal <PATH>

# 启动lotus-miner，发送新的任务
$ nohup ./lotus-miner run > miner.log 2>&1 &
$ ./lotus-miner sectors pledge
```
至此集群已经切换为Lotus运行，后续操作请参考Lotus集群的相关文档。之前创建的venus-sealer repo也可以删除了。
