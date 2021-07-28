# How to use wallet

The wallet is used to manage and save the private key, which is stored in the local database after encryption.
Before using the wallet, you need to set the password of the wallet. A wallet has only one password, and all the private keys are encrypted with the same password.
No password will only affect the functions related to the wallet (such as signature). Other functions can be used normally.
The encrypted private key needs to be decrypted before use, so the unlock command is provided to realize this function. **Every time the program is restarted and the wallet is used, the wallet must be unlocked**.

There are two types of wallet addresses, secp256k1 and BLS. The address of secp256k1 starts with f1 and the address of BLS starts with f3.
In the program, it is distinguished by the SigType field in the structure [keyinfo](https://github.com/filecoin-project/venus/blob/master/pkg/crypto/keyinfo.go#L22).

Wallet provides functions such as creating private key, importing and exporting private key, unlocking and locking wallet, viewing and setting default wallet address.

## Related functions

1. set password

```shell script
./venus wallet set-password <password>
Password set successfully
```

2. to create a wallet address, import or export a private key, you need to set the password in advance, otherwise it will fail

```shell script
# To create a wallet address, the BLS address is created by default
./venus wallet new
# import private key
./venus wallet import
# export private key
./venus wallet export <password>
```

3. unlock wallet

```shell script
./venus wallet unlock <password>
unlocked success
```

4. locked wallet

```shell script
./venus wallet lock <password>
locked success
```

## Matters needing attention

1. **The first time a program starts, you need to set a password for it**.

2. **Set the password before importing or creating the private key，Otherwise, the execution will fail**

3. **The wallet needs to be unlocked after the program is restarted, Otherwise, the signature will fail because the private key cannot be obtained, 
If you fail to obtain the private key, you will also report an error**: \<address\> is locked.
