# nv27升级文档

## 更新背景

NV27 网络升级

Calibnet：北京时间 2025-09-11 07:00:00  升级高度：3007294

主网：北京时间 2025-09-25 07:00:00  升级高度：5348280

## 注意事项

1. 所有组件全部更换

2. 升级前一周内，做一次节点链服务瘦身

3. 更新完通过 curl 命令调用 Version 接口检查版本号，各组件接口调用方式：[https://github.com/filecoin-project/venus/issues/5132](https://github.com/filecoin-project/venus/issues/5132)

4. pre/pro消息上链的情况

5. WD消息上链的情况

6. 出块情况是否正常

7. gas fee 相关设置是否生效

8. 升级前不封新的sector

## 需要升级的组件

**sophon-auth、sophon-gateway 此次不需要升级**

|  组件名  |  tag  |  commit  |
| --- | --- | --- |
|  sophon-auth  | v1.16.0 | e2340d5 |
|  venus  | v1.19.0 | 0c446c0 |
|  sophon-co  | v0.13.0  | 366a025 |
|  sophon-gateway  | v1.18.0 | a09e86b |
|  sophon-messager  | v1.19.0   | 047a555 |
|  sophon-miner  | v1.19.0   | 5cc9dbb |
|  droplet  | v2.15.0 | 60534be |
|  damocles-sector-manager  | v0.13.0  | f3756a2 |
|  damocles-worker  | v0.13.0 | f3756a2 |

### 升级顺序

1. sophon-auth

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

1. 更新版本后能否正常验证权限

### venus 

影响功能：

依赖升级组件: auth

注意事项：

编译：先 **make dist-clean** 再 make，这样可以防止未能正常升级 filecoin-ffi 而带来的问题

1. 升级后检查vk文件是否完整

2. 升级后执行命令 **./venus state network-info**，然后检查通过日志检查 **UpgradeGoldenWeekHeight** 是否正常 :

```
# cali

UpgradeTeepHeight: 3007294

# 主网

UpgradeTeepHeight: 5348280
```

4. 升级后需检查是否正常同步区块

5. 检查主网 v17 actors code，确保与下面输出一样

```
./venus state actor-cids --network-version 27

# 顺序可能会不一样

Network Version: 27
Actor Version: 17
Manifest CID: bafy2bzaceai74ppsvuxs3nvpzzeuptdr3wl7vmdpbphvtz4qt5hfq2qdfvz3e
Actor             CID                                                             
account           bafk2bzaceb4as5yyhjfkvxgooum37uvm5gbjr4dtbpxmqnpvvbjfpu5qouii4  
cron              bafk2bzacea74gcozu357t22lm6t7n7jxsv7buz2quurhtjzz6s7tkxyyfrve6  
datacap           bafk2bzaceakb5v267o4y6jq3vao4b5c63sjjk3sr2jgjoabtze7ygcvbpvc6i  
eam               bafk2bzacecp2lpiqfjeiulrgor7g6zx4boo2oobjuyuxvtoqya46ljm6gkgci  
ethaccount        bafk2bzacedgl6zt7d2ointmeyqrdwkehpi5w5rk3smsemrwbf3v5gc2wx7qfy  
evm               bafk2bzaced5i2jt5t4f5gplsfb5gogjl5tknvhvsssgyj75on3g6ds36yy45y  
init              bafk2bzacecp5go2numz52kerspigi2e3rygesaqeqhn4gegmfgr5xoon73sde  
multisig          bafk2bzaceblf5vqw4dwjueoetgawhg7t6he7qhdnfy3shf7ufnfv4mkwchgbm  
paymentchannel    bafk2bzaceavlvljdoww4v3bp225p6lurcxtdsub4rg33ee6xhvhkyyysnenac  
placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro  
reward            bafk2bzacebezdh75otifygspbfymgeipv34v6feti5xylrxt7xetu77pisnym  
storagemarket     bafk2bzacebsnn4nk5crrlrvhg5vdpaxsrs4r72etaofxdi7tucr72om22z6a4  
storageminer      bafk2bzaceautzxqsrstcxerpxtykn4syogslbiwpsfoh562jex262vxeluc4w  
storagepower      bafk2bzacedyhaec4jvpdmaas6pgtoj7zkdlmdpljz7yjwjqtkfmwv7yb5invw  
system            bafk2bzacebf4et7elmttbioggwlpmsjhplcnzfxtmi4lnbtqr3f6tzuwsoj2a  
verifiedregistry  bafk2bzaceak2iqpfy4hw6xyyrf7c4yfh7pl4copzm7t63mokecsxfcnybxnd2

```

6. 若不排查问题，rust日志级别不建议设置为 trace，因为会打印较多日志

7. 升级后可以通过命令来 **./venus state get-actor t01000** 来确认是否升级成功

8. actor 迁移

  **经测试本次预迁移时间在 1 分钟左右，正式迁移时间在 120 秒左右**

```
预迁移高度是升级高度前 120 个高度：5348280 - 120 = 5348160

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

1. 编译时,需要先 make dist-clean 再 make
2. 升级后检查钱包和miner有没有注册上来

### sophon-messager

影响功能：

依赖升级组件: auth、venus、gateway

注意事项：

1.  升级之后需要观察能否正常接收消息, 消息能否正常上链
    

### sophon-miner

影响功能：

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
