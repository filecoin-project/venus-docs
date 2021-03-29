# Venus: tips when running in China

This guide provides a few tips for users in China to get around some of the bandwidth issues or slowness they can suffer when building and running Venus.

## Speed up proof parameter download for first boot

Running Venus requires the download of chain's proof parameters which are large files which by default are hosted outside of China and very slow to download there. To get around that, users should set the following environment variable when running Venus:

```
export IPFS_GATEWAY=https://proof-parameters.s3.cn-south-1.jdcloud-oss.com/ipfs/
```

## Speed up Go module download during builds

Building Venus requires downloading a few Go modules. These are usually hosted on Github, which has very low bandwidth from China. To fix this use a local proxy by setting the following variable before running Venus:

```
export GOPROXY=https://goproxy.cn
```

[Edit this page](https://github.com/filecoin-project/venus-docs/blob/master/docs/Tips-Running-In-China.md) on GitHub or [open an issue](https://github.com/filecoin-project/venus-docs/issues)
