# nv15升级指南

## 版本信息


1. venus-wallet
2. venus
3. lotus兼容版本
4. chain-co
5. messager
6. venus-gateway
7. venus-miner
8. venus-market
9. venus-sealer


## 升级细节
1. venus-auth: 非必要升级
    分支： v1.3.2
    影响功能: 无
2. venus： 升级
    分支：v1.2.0
    影响功能：支持新网络版本
    注意事项：    
      1. 如果已经存在repo，升级前需要将`~/.venus/version`内容改为7
      2. 升级后检查vk文件是否完整
      3. 升级后检查配置文件，升级高度是否正常设置: 
      ```
      # cali
      "upgradeOhSnapHeight": 682006
      # mail
      "upgradeOhSnapHeight": 1594680
      ```
      4. 升级后检查mpool下maxfee配置是否由数字转换成xxFil形式
      ```
      "mpool": {
                "maxNonceGap": 100,
                "maxFee": "10 FIL"
      },
      ```
      6. 升级后需检查是否正常同步区块
      7. api版本发生变化，影响sealer的连接，升级方式需要按照大升级的方式来处理

3. lotus兼容版本： 升级
    分支: venus/v1.14.0
    影响功能： 支持新网络版本
    注意事项:
      1. 检查是否正常同步
      2. 检查和venus-auth的连接是否完好（curl 命令验证）

4. chain-co： 升级
    分支：v0.1.0
    注意事项：
    影响功能：
      1. 暴露新的接口MpoolPending/MpoolGetNonce
      2. 升级后检查两个接口是否存在，且能正常工作

5. venus-messager： 升级
    分支:v1.4.0
    影响功能： 仅支持新的网络版本
    注意事项： 无

6. venus-miner： 升级
    Tag： v1.4.0
    影响功能:
       1. 计算证明的接口(ComputeProof)参数发生变化
    注意事项:无

7. venus-gateway： 升级
    分支：v1.2.0
    影响功能：
       1. ComputeProof接口参数发生变化，
       2. 需同时支持新老两组接口
    注意事项：
       1. 升级后需检查是否v0/v1两组接口都在正常工作

8. venus-wallet： 可选择升级
    Tag：v1.4.0
    影响功能：无

9. venus-market： 非必要升级
    分支： v2.0.0
    影响功能  新版本
## 升级顺序

1. venus-wallet Tag:v1.4.0
2. venus v1.2.0
3. lotus for venuspool venus/v1.14.0
4. chain-co v0.1.0
5. venus-messager v1.4.0
6. venus-gateway v1.2.0
7. venus-miner Tag:v1.4.0
8. venus-market v2.0.0
9. venus-sealer v1.4.0

## 升级建议

1. 对于还有证明空窗期的用户， 选择一个安全的时间来升级。
2. 对于已经不具备空窗期的用户，最好的办法是在建立一个环境来进行过度。
3. 建议运行一个备用的兼容版本lotus用于备份。



有任何关于升级的问题可以到disscusion讨论: https://github.com/filecoin-project/venus/discussions/4688
