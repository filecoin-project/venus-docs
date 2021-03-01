# 如何启动测试网络

本文以建立2k专用网络为例。

## 本文以建立2k专用网络为例。

基于 CentOS 7.* :
```
yum install epel-release -y
yum install ocl-icd-devel -y
yum install opencl-headers -y
yum install hwloc
yum install jq -y 
```
在此过程中，系统会提示您安装所有组件。

## 生成节点

1. 生成预密封文件和数据
   
    ```sh
        ./venus seed pre-seal --sector-size 2048 --num-sectors 2
        ./venus seed genesis new localnet.json
        ./venus seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json
    ```

2. 启动 daemon
   
   ```sh
        ./venus daemon --make-genesis=devgen.car --genesis-template=localnet.json --network=2k
        # 设置钱包密码
        ./venus wallet set-password <password>
        ./venus wallet import ~/.genesis-sectors/pre-seal-t01000.key
        # 重新启动daemon后，您需要解锁钱包
        ./venus wallet unlock [--] [<password>]
   ```
   
3. 初始化矿工
   
    ```sh
        # 初始化 sealer
        ./venus-sealer init --genesis-miner --actor=t01000 --sector-size=2048 --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync --network=2k
        # 初始化 miner
        ./venus-miner init --actor=[miner] --listen-api=[$ cat ~/.venussealer/api] --token=[$ cat ~/.venussealer/token] --sector-size=2048
   ```
4. 开始创世矿工的服务

    ```sh
        # 启动seal服务
        ./venus-sealer run --nosync
        # 启动挖矿服务
        ./venus-miner run --nosync
    ```

## 启动Venus普通节点

   ```sh
        # 首先，devgen.car由创世节点生成
        ./venus daemon --genesisfile=devgen.car --network=2k --offline=true

        # 其他
        ./venus daemon --network=2k --offline=true
   ```

## 生成普通矿工

    ```sh
        # 矿建一个钱包
        ./venus wallet new --type=bls
        # 转账，在创世节点执行
        ./venus send $WALLET_T3_ADDR --value=[value]
        # 查询
        ./venus wallet balance $WALLET_T3_ADDR
        # 生成普通矿工
        ./venus-miner init --owner=$WALLET_T3_ADDR --worker=$WALLET_T3_ADDR --sector-size=2048 --nosync
    ```

## 启动普通节点的服务

   ```sh
        # 启动sealing服务
        ./venus-sealer run --nosync
        # seal一次
        ./venus-sealer sectors pledge
        # 启动挖矿服务
        ./venus-miner init --actor=[miner] --listen-api=[$ cat ~/.venussealer/api] --token=[$ cat ~/.venussealer/token] --sector-size=2048
        ./venus-miner run --nosync
   ```
   