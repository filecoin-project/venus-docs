# Venus 各组件升级文档（持续更新中）

## 注意事项

1. 所有组件全部更换
2. 更新完通过 curl 命令调用 `Version` 接口检查版本号，各组件接口调用方式：https://github.com/filecoin-project/venus/issues/5132
3. pre/pro消息上链的情况
4. WD消息上链的情况
5. 出块情况是否正常
6. gas fee 相关设置是否生效


## 需要升级的组件

组件名|tag|commit
---|---|---
sophon-auth | - | 
venus | - | 
sophon-messager | - |  
soohon-gateway | - | 
venus-wallet | - |  
sophon-miner | - |  
droplet | - | 
damocles-manager | - | 
damocles-worker | - | 


### 升级顺序

1. sophon-auth
2. venus
3. soohon-gateway
4. sophon-messager
5. sophon-miner
6. droplet
7. venus-wallet
8. damocles-manager
9. damocles-worker


### sophon-auth

影响功能：

- 其他组件对获取 auth 的服务

依赖升级组件:  无

注意事项：

* 启动后能否正常鉴权


### venus 

影响功能：无

依赖升级组件:  sophon-auth

注意事项：

编译：先 `make dist-clean` 再 `make`，这样可以防止未能正常升级 `filecoin-ffi` 而带来的问题
**如果 `~/.venus` 存在且需要导入快照，需要先删除 `~/.venus/version` 文件再导入快照**

1. 升级后检查vk文件是否完整

2. 升级后执行命令 `./venus state network-info`，然后检查通过日志检查 UpgradeWatermelonHeight 是否正常:

    ```
    # cali
    UpgradeWatermelonHeight: 1013134
    # mainnet
    UpgradeWatermelonHeight:
    ```

3. 升级后需检查是否正常同步区块

4. 检查主网 v12 actors code，确保与下面输出一样

    ```
    ./venus state actor-cids --network-version 21

    # 顺序可能会不一样

    ```

5. 若不排查问题，rust日志级别**不建议**设置为 `trace`，因为会打印较多日志

6. 升级后可以通过命令来 `./venus state get-actor t01000` 来确认是否升级成功

7. actor 迁移
	
	**经测试本次预迁移时间在  秒左右，正式迁移时间在  秒左右**

    ```
    预迁移高度是升级高度前 120 个高度：
    pre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration
    migration      开始：STARTING migration      结束：COMPLETED migration
    ```



### soohon-gateway

影响功能：无

依赖升级组件: sophon-auth

注意事项：

- 编译时,需要先 `make dist-clean` 再 `make`


### sophon-messager

影响功能：

依赖升级组件: venus, sophon-auth, soohon-gateway

注意事项：

- 升级之后需要观察能否正常接收消息, 消息能否正常上链


### sophon-miner

影响功能：

依赖升级组件：auth, venus, gateway

注意事项：

- 配置文件中 [Auth].[Token] 必须配置，且在sophon-auth中具有admin权限，不要使用`defaultLocalToken`对应的token，应手动创建一个.


### droplet

影响功能：

- 支持 v2 版本发单协议
- 支持离线计算 commP


依赖升级组件: auth, venus, gateway, messager

注意事项：

- 升级后能否正常发单和检索

### venus-wallet

影响功能： 无

依赖升级组件: gateway

注意事项：

- 升级后观察是否正常签名，消息能否正常上链


### damocles-manager
依赖升级组件: 链服务组件

注意事项：
- 编译时,需要先 `make dist-clean` 再 `make`

### damocles-worker
依赖升级组件: damocles-manager

注意事项：
- 新的证明类型 SyntheticPoRep 会使用新的证明参数文件。 如果启用 SyntheticPoRep 最好提前准备好新的证明参数，**证明参数有问题可能会导致 SyntheticPoRep 死锁**。

---

更新结果验证步骤: 
1. 程序启动正常
2. pre/pro消息正常上链
3. 出块正常
4. WD上链正常
5. 算力增长正常
7. 真实订单检索正常
8. 数据库各种gas，生命周期，聚合设置正常


### 数据库变更

1. droplet `storage_deals` 表增加 `id` 字段
