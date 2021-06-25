# Venus: 在中国部署运行的小贴士

本贴士为中国用户提供了一些技巧，以解决在构建和运行Venus时可能遇到的一些带宽问题或速度缓慢。

## 加快首次启动时的证明参数下载

运行Venus需要下载链的证明参数，这些参数是大文件，默认情况下托管在国外，在国内下载速度缓慢。为了解决这个问题，用户应该在运行Venus时设置以下环境变量：

```
export IPFS_GATEWAY=https://proof-parameters.s3.cn-south-1.jdcloud-oss.com/ipfs/
```

## 在构建过程中加快Go模块的下载

构建Venus需要下载一些Go模块。这些通常托管在Github上，而Github来自中国的带宽较低。要解决此问题，请在运行Venus之前通过设置以下变量来使用本地代理：

```
export GOPROXY=https://goproxy.cn
```
