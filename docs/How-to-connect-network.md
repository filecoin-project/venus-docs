# How to connect to different 

in venus, it is easy to decide whether to connect to different networks by setting the startup parameters.


## Mainnet

```sh

./venus daemon #connect to mainnet by default

```

## Calibration Network

parameters must be configured to connect to the calibration network.

```sh

./venus daemon --network cali

```

## Nerpa Network

parameters must be configured to connect to the nerpa network.

```sh

./venus daemon --network cali

```

## 2k Local Network

in addition to the corresponding network parameters, a network boot file (.car) is required to connect the 2k network.

```sh

./venus daemon --network 2k --genesisfile  *.car

```

[Edit this page](https://github.com/filecoin-project/venus-docs/blob/master/docs/How-to-connect-network.md) on GitHub or [open an issue](https://github.com/filecoin-project/venus-docs/issues)