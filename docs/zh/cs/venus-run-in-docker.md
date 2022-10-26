# Venus Docker 使用文档

## 快速部署

### docker-compose
可以通过 docker-compose 启动会在当前主机上，部署venus的一套云组件。

#### 直接通过命令启动 Venus 服务

```shell
# 下载配置文件
wget https://raw.githubusercontent.com/filecoin-project/venus-docs/master/script/docker-compose.yaml

# 启动docker集群
snapshot=/path/to/your/snapshot.car \
nettype=<nettype> \
proxy=<socks5|https>://<PROXY_IP>:<PROXY_PORT> \
piecestorage=/path/to/your/PieceStorage \
docker-compose up -d

# 关闭集群
docker-compose down
```
:::tip
配置文件的首行指定了组件镜像版本的要求，当使用组件镜像版本较低时，建议下载配置文件的历史版本
:::



#### 直接通过变量文件启动 Venus 服务

```shell
# 下载配置文件(同上)


# 编写环境变量文件 ./env 
# 
nettype=<nettype>    # (default:butterflynet)
piecestorage=/path/to/your/PieceStorage   # (defaul:./.venus/storage/)
proofparameters=/path/to/your/proof-parameters-files/ # (default:/var/tmp/filecoin-proof-parameters/)
genesisfile=/path/to/your/genesisfile  # (optional) 
snapshot=/path/to/your/snapshot.car   # (optional)
TZ=<TimeZone> # (optional) your local time zone
proxy=<socks5|https>://<PROXY_IP>:<PROXY_PORT>   # (optional) proxy for venus node

 

# 启动和关闭集群
docker-compose --env-file ./env up -d
docker-compose --env-file ./env down
```

云环境启动后会需要一定的时间进行初始化，初始化完成后，就可以使用auth 组件签发token （详细见 使用 章节），并将下游组件的连接到本主机即可。（另：集群中使用统一的admin token 会导出在 `./.venus/env/` 中）
为了方便修改配置，默认会将容器中的 repo 映射到本地的 `./.venus/root/`中，修改完配置之后直接重启容器即可

:::tip
venus 和 market 组件默认监听本地IP，如有需要，请注意修改相应文件
:::

:::warning
在miner初始化完成之后要记得通过auth 绑定到相应的用户，参见[添加矿工](https://github.com/filecoin-project/venus-auth/blob/master/docs/zh/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B.md#miner-%E7%9B%B8%E5%85%B3)
:::

:::warning
在miner初始化完成之后,需要将miner关联到merket，参见[将miner的Multiaddrs和PeerID设置为market的对应地址](https://venus.filecoin.io/zh/market/using-venus-market-for-miner.html#%E4%BD%BF%E7%94%A8%E8%87%AA%E5%B7%B1%E7%9A%84venus%E8%8A%82%E7%82%B9)部分
:::


### 单组件

适用于在不同主机上进行 venus 组件 docker 的部署，

#### Venus Auth

```shell
docker run -d --name venus-auth --net=host filvenus/venus-auth run
```

#### Venus

```shell
docker run -d --name venus --net=host -v /path/to/snapshot.car:/snapshot.car \
--env HTTPS_PROXY=<PROXY_IF_NEED> \
filvenus/venus daemon \
--network=<NETTYPE> \
--auth-url=<VENUS_AUTH_URL> \
--import-snapshot /snapshot.car 
```

#### Venus Gateway

```shell
docker run -d --name venus-gateway --net=host filvenus/venus-gateway \
--listen /ip4/0.0.0.0/tcp/45132 \
run --auth-url <http://VENUS_AUTH_IP_ADDRESS:PORT>
```


#### Venus Messager

```shell
docker run -d  --name venus-messager  --net=host filvenus/venus-messager run \
--auth-url=<http://VENUS_AUTH_IP_ADDRESS:PORT> \
--node-url /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--gateway-url=/ip4/<IP_ADDRESS_OF_VENUS_GATEWAY>/tcp/45132 \
--auth-token <SHARED_ADMIN_AUTH_TOKEN> 
```

#### Venus Miner

```shell
docker run -d  --name venus-miner --net=host filvenus/venus-miner init \
--nettype <NETTYPE> \
--auth-api <http://VENUS_AUTH_IP_ADDRESS:PORT> \
--token <SHARED_ADMIN_AUTH_TOKEN> \
--gateway-api /ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132 \
--api /ip4/<VENUS_DAEMON_IP_ADDRESS>/tcp/3453 \
--slash-filter local
```


#### Venus Market

```shell
docker run -d --name venus-market --net=host \
-v </path/to/your/PieceStorage>:/PieceStorage
filvenus/venus-market  pool-run \
--node-url=/ip4/<VENUS_NODE_IP_ADDRESS>/tcp/3453  \
--auth-url=http://<VENUS_AUTH_IP_ADDRESS:PORT> \
--gateway-url=/ip4/<VENUS_GATEWAY_IP_ADDRESS>/tcp/45132 \
--messager-url=/ip4/<VENUS_MESSAGER_IP_ADDRESS>/tcp/39812/ \
--auth-token=<SHARED_ADMIN_AUTH_TOKEN>

```



## Docker容器的使用

#### 基本使用
所有组件都可以使用以下通用的命令格式进行调用，组件详细的子命令参见 组件详细文档，以及 --help flag

```shell
docker run -it <DOCKKER_NAME> /<VENUS_COMPONENT_NAME> [global options] command [command options] [arguments...]
```

#### 举例
```shell
# Auth
docker exec -it filvenus/venus-auth ./venus-auth [global options] command [command options] [arguments...]

# Venus
docker exec -it filvenus/venus ./venus [global options] command [command options] [arguments...]

# Gateway
docker exec -it filvenus/venus-gateway ./venus-gateway [global options] command [command options] [arguments...]

# Messager
docker exec -it filvenus/venus-messager ./venus-messager [global options] command [command options] [arguments...]

# miner
docker run -it filvenus/venus-miner [global options] command [command options] [arguments...]
```
:::tip
启动容器的方式不同，容器的名字也不一样，可以使用  `docker container ls` 来查看容器的名字，也可以在容器启动的时候自己指定容器的名字。
:::

#### 环境调整和配置文件

建议将配置文件映射到本地进行配置文件相关的配置,需要在启动容器的时候建立映射。

```shell
# venus 举例
docker run -d --name filvenus/venus --net=host \
-v /path/to/snapshot.car:/snapshot.car \
-v /path/to/config.json:/root/.venus/config.json  #配置文件映射
--env HTTPS_PROXY=<PROXY_IF_NEED> \
tanlang/venus \
--network=<NETTYPE> \
--auth-url=<VENUS_AUTH_URL> \
--import-snapshot /snapshot.car 
```

如果需要进入容器修改配置文件或者调整组件运行环境的话：

```shell
docker exec -it filvenus/venus /bin/bash
```

## 自己开发构建镜像

### 基础镜像的构建

基础环境镜像是构建venus组件容器时，需要用到的前置镜像，如果对于venus组件的构建环境和运行环境没有定制化的要求，建议直接使用官方的基础环境镜像。
如果需要定制制化构建基础环境镜像，比如添加运维工具之类的，可以从[venus-docs仓库](https://github.com/filecoin-project/venus-docs/tree/master/script)下载基础镜像的dockerfile文件。然后运行 `dockers build` 命令构建相应的基础镜像

#### 编译环境的构建

```shell
# 下载dockerfile
curl -O https://raw.githubusercontent.com/filecoin-project/venus-docs/master/script/venus-buildenv.dockerfile
# 构建 运行环境
docker build -t filvenus/venus-buildenv -f ./venus-buildenv.dockerfile .
```

#### 运行环境的构建

```shell
# 下载dockerfile
curl -O https://raw.githubusercontent.com/filecoin-project/venus-docs/master/script/venus-runtime.dockerfile
# 构建 运行环境
docker build -t filvenus/venus-runtime -f ./venus-runtime.dockerfile .
```

### 组件的构建

#### 任意组件的构建

在构建完基础镜像后，所有组件都可以到相应根目录下，用一个命令来构建

```shell
# 到对应组件根目录
make docker
# 网络受限需要使用代理时
make docker BUILD_DOCKER_PROXY=<socks5 | https >://<IP>:<PORT> 
```
