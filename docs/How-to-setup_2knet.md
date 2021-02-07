# 如何启动一个本地测试网络

使用venus启动本地测试网络，目前工具链尚不完整，需要一些lotus组件，lotus-miner

## 环境准备

```
yum install epel-release -y
yum install ocl-icd-devel -y
yum install opencl-headers -y
yum install hwloc
```

## 生成创世节点

1. 生成pre-seal文件及数据
   
    ```sh
        ./venus seed pre-seal --sector-size 2048 --num-sectors 2
        ./venus seed genesis new localnet.json
        ./venus seed genesis add-miner localnet.json ~/.genesis-sectors/pre-seal-t01000.json
    ```

2. 启动daemon
   
   ```sh
        ./venus daemon --make-genesis=devgen.car --genesis-template=localnet.json --bootstrap=false
        # 设置钱包密码
        ./venus wallet set-password <password>
        ./venus wallet import ~/.genesis-sectors/pre-seal-t01000.key
   ```
   
3. 初始化矿工
   
    ```sh
        ./lotus-miner init --genesis-miner --actor=t01000 --sector-size=2048 --pre-sealed-sectors=~/.genesis-sectors --pre-sealed-metadata=~/.genesis-sectors/pre-seal-t01000.json --nosync
   ```
4. 启动创世矿工

    ```sh
        ./lotus-miner run
    ```

## 启动venus普通节点

1. 启动venus节点
   ```sh
        # first start, dev.car是创世节点生成
        ./venus daemon --genesisfile=devgen.car --network=2k --offline=true

        # other
        ./venus daemon --offline=true
   ```

## 生成普通miner

   ```sh
        # 创建钱包
        ./venus wallet new --type=bls
        # 转账,在genesis执行
        ./venus send $WALLET_T3_ADDR --value=[value]
        # 查询
        ./venus wallet balance $WALLET_T3_ADDR
        # 生成miner
        ./lotus-miner init --owner=$WALLET_T3_ADDR --worker=$WALLET_T3_ADDR --sector-size=2048 --nosync
   ```

## 启动miner

   ```sh
        # 启动
        ./lotus-miner run
        # 做一个 Sector
        ./lotus-miner sectors pledge
   ```


   	{"base": "{bafy2bzacebbxwyicp4zjavswpeixe2pkaw6vc54ahrqd6dc7vucm7mwcgulru,bafy2bzacebv2awifkmvdgrk2gpnk7qj5pca57bc54pfsurmkekxiu5uwvublw,bafy2bzacedjtnpprzlmk5vhukc4wboxgtwvxh6kdjsskmhtopqs5gt2yh5lha,bafy2bzacedemqsqgpmqktieayjj4a3cxyedh6nak7vito22k25lro37ioqpqy,bafy2bzacebgpggug242sexq7luvn5armividdbksww6gh47df4cg3dkzjrkz6,bafy2bzaceb2jruetan7pjgn7c5ea2tv6nfibqmmtp7pl2s2aww6gxlc6hbsnw,bafy2bzacecrx3fnuoukr5z3lxwyixxdn4lhm5iwlyfxxnksvrli5l6crnk3ly,bafy2bzacearmqayjayn742kbgve7z57a2q36spnxnmntgy7mi27swkwm34urq,bafy2bzaceb27bs5kv7gl2sarv7m2qpgkyn7hvy2nh4n5my73tlivuu7vz4rpe,bafy2bzaced4wvfvdhmhsqkdqngz4boolhwavi7p6du3mnuczmhmzjwqy3r2ti,bafy2bzacecisgkx5utbvzl67uiteg6mifytt7lkkjld72jiigpswcfxaejpga}", "nullRounds": "0", "took": 4.072557004}