# Venus 组件构建

本文档各组件以 `TAG:v1.0.0` 为例说明,实际场景中按需检出.

> 每个组件的构建相互独立,无顺序之分.

## 环境准备

系统需要安装 `Go`,`Rust`等必要软件,可以参考 `lotus` 文档中的相应部分 [building-from-source](https://lotus.filecoin.io/lotus/install/linux/#building-from-source)。

`Venus` 组件均在 `github` 开源,通常用 `git` 管理, `git` 命令使用可参考 [Branching-Remote-Branches](https://git-scm.com/book/en/v2/Git-Branching-Remote-Branches)

部分组件依赖`filecoin-ffi`, `Filecoin`官方提供了编译好的静态库文件.如果需要源码编译此静态库,可参考 [native-filecoin-ffi](https://lotus.filecoin.io/lotus/install/linux/#native-filecoin-ffi),通常`venus-cluster`或`venus-sealer`源码编译此库以提升扇区封装效率.

## venus-auth

```shell script
$ git clone https://github.com/filecoin-project/venus-auth.git
$ cd venus-auth
$ git checkout -b v1.0.0 v1.0.0
$ make 
```

## venus

```shell script
$ git clone https://github.com/filecoin-project/venus.git
$ cd venus
$ git checkout -b v1.0.0 v1.0.0
$ git submodule update --init --recursive
$ make deps
$ make
```

## venus-gateway

```shell script
$ git clone https://github.com/ipfs-force-community/venus-gateway.git
$ cd venus-gateway
$ git checkout -b v1.0.0 v1.0.0
$ git submodule update --init --recursive
$ make
```

如果遇到编译错误: `github.com/dgraph-io/badger/v3@v3.2011.1/fb/BlockOffset.go:6:2: missing go.sum entry for module providing package github.com/google/flatbuffers/go (imported by github.com/dgraph-io/badger/v3/table); to add:
                     go get github.com/dgraph-io/badger/v3/table@v3.2011.1` ,先执行:
 
```shell script
$ go get github.com/google/flatbuffers@v1.12.1
```

## venus-messager

```shell script
$ git clone https://github.com/filecoin-project/venus-messager.git
$ cd venus-messager
$ git checkout -b v1.0.0 v1.0.0
$ make 
```

## venus-miner

```shell script
$ git clone https://github.com/filecoin-project/venus-miner.git
$ cd venus-miner
$ git checkout -b v1.0.0 v1.0.0
$ git submodule update --init --recursive
$ make
```

## venus-market

参考 `venus-market` 项目的 `readme` 文档中 [Build](https://github.com/filecoin-project/venus-market#readme)

## venus-wallet

参考 `venus-wallet` 项目的 `readme` 文档中 [Build](https://github.com/filecoin-project/venus-wallet#readme)

## venus-cluster

参考 `venus-cluster` 项目的文档 `05.快速启用.md` 中 [准备工作](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/05.%E5%BF%AB%E9%80%9F%E5%90%AF%E7%94%A8.md)

## venus-sealer(将弃用)

```shell script
$ git clone https://github.com/filecoin-project/venus-sealer.git
$ cd venus-sealer
$ git checkout -b v1.0.0 v1.0.0
$ git submodule update --init --recursive
$ make deps
$ make
```
