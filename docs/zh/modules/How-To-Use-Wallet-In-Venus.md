# 如何使用钱包

钱包用来管理和保存私钥，私钥加密后存储在本地数据库中，在使用钱包前需要设置钱包密码，
一个钱包只有一个密码，所有私钥都用同一个密码加密。不设置密码只会影响与钱包相关的功能（比如签名），
其它功能能正常使用。加密的私钥在使用之前需要解密，因此提供unlock命令来实现此功能，**每次重启程序且会使用到钱包都要解锁钱包**。

钱包有两种类型的地址 secp256k1 和 bls，secp256k1地址以f1开头，bls地址以f3开头，在程序中通过结构体[KeyInfo](https://github.com/filecoin-project/venus/blob/master/pkg/crypto/keyinfo.go#L22)中SigType字段来区分。

钱包提供了创建钱包私钥、导入和导出私钥、解锁和锁定钱包与查看和设置默认钱包地址等功能。

## 相关功能

1. 设置钱包密码

```shell script
./venus wallet set-password <password>
Password set successfully
```

2. 执行创建钱包地址、导入或导出私钥操作都需要提前设置密码，不然会执行失败

```shell script
# 创建钱包地址，默认创建的是 BLS 地址
./venus wallet new
# 导入私钥
./venus wallet import
# 导出私钥，需输入密码
./venus wallet export <password>
```

3. 解锁钱包

```shell script
./venus wallet unlock <password>
unlocked success
```

4. 锁定钱包

```shell script
./venus wallet lock <password>
locked success
```

## 注意事项

1. **程序第一次启动需要为其设置密码**

2. **在执行导入或者创建私钥之前要先设置密码，不然执行会失败**

3. **程序重启后需要解锁钱包，不然会因为拿不到私钥导致签名失败，获取私钥失败也会报错**：\<address> is locked

## [更多钱包命令](./Commands.md)
