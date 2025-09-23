# nv25升级文档

## 更新背景

NV25 网络升级

Calibnet：北京时间 2025-03-26 07:00:00  升级高度：2520574

主网：北京时间 2025-04-15 07:00:00  升级高度：4878840

## 注意事项

1. 所有组件全部更换

2. 升级前一周内，做一次节点链服务瘦身

3. 更新完通过 curl 命令调用 Version 接口检查版本号，各组件接口调用方式：[https://github.com/filecoin-project/venus/issues/5132](https://github.com/filecoin-project/venus/issues/5132)

4. pre/pro消息上链的情况

5. WD消息上链的情况

6. 出块情况是否正常

7. gas fee 相关设置是否生效

8. 升级前不封新的sector

## 需要升级的组件（sophon-auth 此次不需要升级）

|  组件名  |  tag  |  commit  |
| --- | --- | --- |
|  venus  | v1.18.1 |  |
|  sophon-co  | v0.12.0  |  |
|  sophon-gateway  | v1.18.0 |  |
|  sophon-messager  | v1.18.0   |  |
|  sophon-miner  | v1.18.0   |  |
|  droplet  | v2.14.0 |  |
|  damocles-sector-manager  | v0.12.3  |  |
|  damocles-worker  |  v0.12.3 |  |

### 升级顺序

1. sophon-auth（不升级）

2. venus

3. lotus兼容版本

4. sophon-co

5. sophon-gateway

6. sophon-messager

7. sophon-miner

8. doplet

11. damocles-manager

12. damocles-worker

### sophon-auth

影响功能：

其他组件对获取 auth 的服务

依赖升级组件:  无

注意事项：

此次网络升级不升级

### venus 

影响功能：

1. 支持 f3:

目前 Filecoin 区块最终确认需要 900 个高度，f3 简单来说就是让区块更快最终确定不可回滚，理想情况是几个高度后区块就能最终确定，f3 需要 miner 连接节点投票，投票 miner 需要签名，因此需要节点要能访问 miner 地址并签名，但生产节点不保存私钥，就需要节点连接 sophon-gateway 进行签名。

venus 有两种方式连接 sophon-gateway：

1. 启动时加 `--wallet-gateway=<token:url>` 连接 sophon-gateway 

2. 调整配置文件 config.json  
```
 "walletModule": {

                "gatewayBacked": "<token:url>"

        },
```
依赖升级组件: auth

注意事项：

编译：先 **make dist-clean** 再 make，这样可以防止未能正常升级 filecoin-ffi 而带来的问题

1. 升级后检查vk文件是否完整

2. 升级后执行命令 **./venus state network-info**，然后检查通过日志检查 **UpgradeTuktukHeight** 是否正常 :

```
# cali

UpgradeTeepHeight: 2520574

# 主网

UpgradeTeepHeight: 4878840
```

4. 升级后需检查是否正常同步区块

5. 检查主网 v16 actors code，确保与下面输出一样

```
./venus state actor-cids --network-version 25

# 顺序可能会不一样

Network Version: 25
Actor Version: 16
Manifest CID: bafy2bzacecnepvsh4lw6pwljobvwm6zwu6mbwveatp7llhpuguvjhjiqz7o46
Actor             CID                                                             
account           bafk2bzacedef4sqdsfebspu7dqnk7naj27ac4lyho4zmvjrei5qnf2wn6v64u  
cron              bafk2bzacedjpipmkmlmgcsmvxijivmeo62t7zul7565wy7ubfmwdlwzbl2zsg  
datacap           bafk2bzaceblfbzlkvtwxucr3wno7tilbri2kyagdlcsu2snntkii26gye2cmo  
eam               bafk2bzacec3wpa2sr5w6vfh7d2wbzt3cphoglsd6fvem7cq3h52lg357hfovu  
ethaccount        bafk2bzacealmhbhzgo4kkyy32qlumxirnc75nyfkpd757dbxtgwktqu2zztjy  
evm               bafk2bzacecrriac4r2pbxkh5wu67sgwgce2qysfl7thmg7smgmwwqjff5kq74  
init              bafk2bzacecfk7a3ns32wrbyoxvv4jfdoesl7cqpc34rqdsiehxvr4kz6jzc7u  
multisig          bafk2bzaceastb65il5j3v2q2pfxgk7brmzh6djzisjo3mfybbiplgy3w7iscm  
paymentchannel    bafk2bzaceanasifggzenhwl5cchnv3rro63mcodpveix6glfkzuwl3qknqn6k  
placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro  
reward            bafk2bzacebm6enbbihclumyi2pfkpdganx3hhjuzdnlow5q3tazsflmgi32hq  
storagemarket     bafk2bzaceaqmav32yzxh4suviytyeqszvrdsvl7emf6a7vtlfwsebrvwlg7p2  
storageminer      bafk2bzacectp5rumce4kekelolp6abrtfbbdjwl3ydjvurmfd6nbk3tott4ks  
storagepower      bafk2bzaced6jncjckyzoswbbrwokiq35avufm2tlkertvoqkh76qkd2ccddls  
system            bafk2bzaceaar6jzusbxv5ekouldqatgiblyrcldlxuoahyypdaeozm57rmjk6  
verifiedregistry  bafk2bzacedxvui4lmogudblf7ir2rkglsfnjqlrzqv7hzcoa4t3dr2ni2vv26 

```

6. 若不排查问题，rust日志级别不建议设置为 trace，因为会打印较多日志

7. 升级后可以通过命令来 **./venus state get-actor t01000** 来确认是否升级成功

8. actor 迁移

  **经测试本次预迁移时间在 1 分钟左右，正式迁移时间 30 秒左右**

```
预迁移高度是升级高度前 120 个高度：

pre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration

migration      开始：STARTING migration      结束：COMPLETED migration
```

9. 如果 ~/.venus 存在且需要导入快照，需要先删除 ~/.venus/version 文件再导入快照，参考以下导入命令

1.  主网: `./venus daemon --import-snapshot snapshot.car`
    
2.  calibnet: `./venus daemon --import-snapshot snapshot.car --network calibrationnet`
 
### sophon-co

影响功能： 无

依赖升级组件：auth、venus、兼容版lotus

注意事项：

1.  启动之后 应检查能否正常选择节点 (选中具体节点的日志为debug级别)
    

### sophon-gateway

影响功能：

依赖升级组件: auth、wallet

注意事项：

1.  编译时,需要先 make dist-clean 再 make
    
2.  升级后检查钱包和miner有没有注册上来
    

### sophon-messager

影响功能：

依赖升级组件: auth、venus、gateway

注意事项：

1.  升级之后需要观察能否正常接收消息, 消息能否正常上链
    

### sophon-miner

影响功能：

f3 需要 miner 通过节点投票，但生产的 miner 连接 sophon-co，就导致请求发给不同的节点，进而可能导致投票失败，所以新增加 f3 节点配置，格式如下：

```
[F3Node]

  Addr = "/ip4/127.0.0.1/tcp/3453"

  Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiYWRtaW4iLCJwZXJtIjoiYWRtaW4iLCJleHQiOiIifQ.pyGfVy8cmwWTPhSvVYGJhU3tB5BpYB\_abfF88ABhArE"
```

> F3Node 配置的是 venus token和URL，此 venus 需要已连接 sophon-gateway

依赖升级组件：auth, venus, gateway

注意事项：

1.  升级后检查 miner 数量和升级前是否一致
    
2.  能否正常出块，观察孤块数量
    

### droplet

影响功能：

依赖升级组件: auth、venus、gateway、messager

注意事项：

1.  升级后能否正常发单
    

### venus-wallet

影响功能： 无

依赖升级组件:

注意事项：

1.  升级后观察是否正常签名，消息能否正常上链
    

### damocles-sector-manger

影响功能：

依赖升级组件: 链服务组件

注意事项：

1.  编译时,需要先 make dist-clean 再 make
    

### damocles-worker

影响功能：

依赖升级组件: damocles-manager

注意事项：

### 更新结果验证步骤: 

1. 程序启动正常

2. pre/pro消息正常上链

3. 出块正常

4. WD上链正常

5. cc集群算力增长正常

7. 真实数据集群算力增长正常

8. 真实算力集群检索正常

9. 数据库各种gas，生命周期，聚合设置正常

### 数据库变更

无
