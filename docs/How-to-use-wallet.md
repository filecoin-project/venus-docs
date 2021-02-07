# 如何使用钱包

1. 首先需要设置钱包密码，然后就可以创建钱包地址，导入和导出私钥
2. 每次重启程序都需要解锁钱包地址

## 简单描述

1. 设置钱包密码

    ```sh
        ./venus wallet set-password <password>
    ```

2. 执行创建钱包地址、导入或导出私钥操作都需要提前设置正确的密码，不然会执行失败

    ```sh
        # 创建钱包地址，默认创建的是 BLS 地址
        ./venus wallet new
        # 导入私钥
        ./venus wallet import
        # 导出私钥，导出时需要输入密码
        ./venus wallet export <password>
    ```

3. 重启时需使用命令 `./venus wallet unlock <password>` 解锁钱包地址，不然会获取不到私钥，进而导致签名失败

4. 锁定钱包地址

    ```sh
        ./venus wallet lock <password>
    ```

## [更多命令](Commands)