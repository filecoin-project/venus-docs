# 命令行界面的常用命令

运行 `go-filecoin --help` 可以查看`go-filecoin`详细的命令列表。

本章节是一些`go-filecoin`常用操作的快速索引。

注意所有命令行界面输入中指定的价格都是以FIL为单位解释。

## Table of Contents

- [设置和配置](#设置和配置)
- [网络](#网络)
- [数据结构](#数据结构)
- [挖矿](#挖矿)
- [存储：下单](#存储下单)
- [检索挖矿](#检索挖矿)
- [一些有帮助的环境变量](#一些有帮助的环境变量)


### 设置和配置
```sh
rm -fr ~/.filecoin      # <== 可选，如果已经安装过go-filecoin
go-filecoin init        # 在 ~/.filecoin 下创建配置文件config.json,请通过`go-filecoin init --help`查看`go-filecoin`的帮助选项
go-filecoin daemon      # 启动`go-filecoin`的后台进程，你现在可以在另外一个终端中使用，你可以在另外一个终端中使用`go-filecoin`的命令
```

#
### 网络
```sh
### 列出所有peer节点和ping一个peer节点 
go-filecoin swarm peers
go-filecoin ping <peerID>
```

#
### 数据结构
```sh
###  查看最新挖出的区块 
go-filecoin chain head
go-filecoin show block <blockID> | jq
```

#
### 挖矿

```sh
# 在所在节点创建一个矿工
# 需要该节点加入到一个已经存在矿工的devnet
# 并且这个节点是上还没有创建矿工
go-filecoin miner create 10 --gas-price 0 --gas-limit 300

# 等待创建矿工的消息已经上链，更新节点配置文件中的矿工地址, 正确地设置peerid
# 得到所在节点的矿工地址
go-filecoin config mining.minerAddress

# 得到owner地址:
go-filecoin miner owner <minerAddress>

# 作为矿工，强制立即挖出一个区块，如果成功，`go-filecoin`守护进程的输出应该显示挖矿的指示
go-filecoin mining once

# 作为一个矿工，可以设置存储价格
# 首先需要确保节点正在挖矿
go-filecoin mining start

# 然后设置存储价格
go-filecoin miner set-price <size> <price> --gas-price 0 --gas-limit 300

# 等待区块被挖出(~30s),查看订单请求:
go-filecoin client list-asks | jq

```
#
### 存储: 下单
```sh
# 创建一个要存储的文件，并import到filecoin存储中
echo <"Hi my name is $USER"> hello.txt
go-filecoin client import ./hello.txt

# 校验文件是否import成功:
go-filecoin client cat <data CID>

# 查看文件大小:
go-filecoin client cat <data CID> | wc -c

# 查看存储矿工地址:
go-filecoin client list-asks | jq

# 发起一个存储订单，使用上一步命令得到的 <矿工地址>
# 首先需要确保节点正在挖矿
go-filecoin mining start

# 发起一个订单
go-filecoin client propose-storage-deal <miner address> <data CID> <price> <durationBlocks> 

# TODO 我们希望可以通过以下命令查看订单状态，但是上面的命令没有返回一个订单id 
go-filecoin client query-storage-deal <上一步返回的订单id>

# 如果你想立即检索一个数据片，你可以绕过检索市场
# 注意这里的实现是一种欺骗行为，但目前有效
go-filecoin client cat <data CID>
```
#
### 检索挖矿
如果你想从矿工封印的扇区中取得一个数据片，通过上面的query-storage-deal 状态等待订单被封印完成，
然后使用检索矿工取得一个数据片。警告：这个操作需要扇区解除封印，这将需要一分钟左右的时间（如果还没有缓存的情况下）。

```sh
go-filecoin retrieval-client retrieve-piece <miner peer id> <data CID>
### 从矿工节点的终端上得到peer id :
go-filecoin id 

### 检索一个数据片
go-filecoin retrieval-client \
   retrieve-piece QmXtaLS9N3URQ2uCkqpLP6KZv7rVbT5KyjU5MQAgQM6yCq \
   QmNqefRonNc2Rn5VwEB5wqJLE9arURmBUSay3kbjJoLJG9
```
#
### 一些有帮助的环境变量
| 变量                    | 描述                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------|
| `FIL_API`               | 这是守护进程的默认主机和端口。   |
| `FIL_PATH`              | 提供一个默认值，使用这个变量可以避免设置'——repodir'标志。             |
| `GO_FILECOIN_LOG_LEVEL` | 设置标准输出的日志级别。                                                          |
| `GO_FILECOIN_LOG_JSON`  | 当这个值设置为1时，将日志格式设置为json。|