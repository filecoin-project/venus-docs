# 如何连接到不同到网络

在Venus中，通过设置启动参数来决定是否连接到不同的网络，目前支持主网，calibration，2k。网络详情https://network.filecoin.io/

## 主网

```sh
./venus daemon #connect to mainnet by default
```

## Calibration网络

必须配置为连接到Calibration网络的参数。

```sh
./venus daemon --network cali
```

## 2k 本地网络

除了相应的网络参数外，连接2k网络还需要一个网络启动导文件（.car）。

```sh
./venus daemon --network 2k --genesisfile  *.car
```
