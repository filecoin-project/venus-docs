# 独立运行的 PoSter 节点
在早期版本中，虽然 `venus-sector-manager` 已经支持通过 `daemon run` 命令的 `--poster`、`--miner` 参数来选择是否启用相应的模块，但由于 `post` 证明过程与扇区定位信息的强关联，使得真正使用时，局限性比较大，且难以扩展。

从 v0.2.0 版本起，我们提供了一系列的功能组合，使得易用、可扩展的独立 PoSter 节点成为大体量 `SP` 的一种可选方案。

以下，我们会介绍这些新的功能点，并提供一种通过这些功能完成独立 PoSter 节点部署的实践。后续文档都以开启 `--poster` 的节点作为示例，独立的 `--miner` 节点运作方式与之类似，不再单独阐述。

## 代理节点模式
我们知道，对于 PoSter 节点来说，最重要的能力是获取实时、准确的扇区定位信息。在当前 `venus-sector-manager` 版本中，我们暂时仅提供基于本地内嵌式 kv 数据库的元数据管理方式。

这使得数据仅能被一个进程管理，无法进行跨进程的直接数据共享。

因此，我们设计了代理节点模式，将部分元数据通过网络接口提供给其他需要的节点，以此实现数据共享。

### 代理节点的使用方式
我们在 `daemon run` 命令中增加了 `--proxy` 参数。它的格式是 `{ip}:{port}` 这样的地址格式。当启动命令包含有效的 `--proxy` 参数时，节点将会以其指向的另一个 `venus-sector-manager` 节点作为数据源，并构造出必要的元数据（只读）管理模块。

除了 `--proxy` 外，我们还提供了控制具体数据管理模块是否启用代理模式的开关。

目前，我们暂时仅提供 `--proxy-sector-indexer-off` 这一个开关。当启用 `--proxy-sector-indexer-off` 时，节点会使用自己的数据目录下的 `SectorIndexer` 数据库。

举例来说，如果按 `venus-sector-manager daemon run --miner` 命令启动，那么将会存在一个使用 `~/.venus-sector-manager` 作为数据目录，监听 `1789` 端口的 `venus-sector-manager` 实例，且启用挖矿模块。

这时，我们可以通过以下命令，在同一台机器上初始化并启动一个以上述实例作为数据源的代理节点，这个代理节点将会使用 `~/.venus-sector-manager2` 作为数据目录，并监听 `2789` 端口。
```
venus-sector-manager --home ~/.venus-sector-manager2 daemon init
// 维护配置文件
venus-sector-manager --home ~/.venus-sector-manager2 daemon run --proxy="127.0.0.1:1789" --listen=":2789" --poster
```

代理节点能够提供与源节点完全一致且实时的扇区定位信息。

### 代理节点使用已有配置文件
按照上一节所述的方法，我们已经可以启动一个代理节点，但这种启动方式还存在一个问题：代理节点的配置文件需要再次编写一遍，或从源节点的数据目录中拷贝过来。这会带来额外的维护工作，尤其是在配置文件可能频繁发生变化的时候。

为此，我们还提供了一个 `--conf-dir` 参数，它的格式是一个可用的目录路径。当启动命令包含有效的 `--conf-dir` 参数时，节点将会使用指定目录中已存在的配置文件作为自己的配置文件。

这样，就可以省去编写、维护在同一台机器上的、为同一组集群提供服务的、不同源节点和代理节点的配置文件的工作。

基于这个功能，上一节中所提到的代理节点启动方式可以变成：
```
venus-sector-manager --home ~/.venus-sector-manager2 daemon run --proxy="127.0.0.1:1789" --listen=":2789" --conf-dir="~/.venus-sector-manager" --poster
```

此时，源节点和代理节点将会使用同一批配置文件。


## ext-prover 执行器
除了共享扇区信息之外，独立的 PoSter 节点面临的另一个挑战则是硬件资源的利用。

受限于底层算法库，计算节点对于 GPU 的使用只能以进程为单位。这使得 PoSter 节点难以有效发挥多块 GPU 的计算能力，也难以在多个 `SP` 存在 `WindostPoSt` 证明窗口期冲突的情况下，安全地避免证明超时。

为此，我们提供了类似 `venus-worker` 中 `ext processor` 的 `ext-prover` 机制。

`ext-prover` 机制包含两个组成部分：
1. `daemon run` 命令的 `--ext-prover` 参数
2. 节点数据目录中的 `ext-prover.cfg` 配置文件

一个默认的 `ext-prover.cfg` 文件形如：
```
# Default config:
[[WdPost]]
#Bin = "venus-sector-manger"
#Args = ["wdpost"]
#Concurrent = 1
#Weight = 1
[WdPost.Envs]
#KEY = "VAL"
#
```

在最新版本中，`daemon init` 会初始化 `ext-prover.cfg` 文件。

使用者可以自行编写，或从一个由最新版本初始化的数据目录中拷贝相应文件到已存在的数据目中。

`ext-prover.cfg` 中各配置项的作用方式与 `venus-worker` 中的配置块极为类似，使用者可以查阅相应文档进行参考。

当 `venus-sector-manager` 的启动命令中包含 `--ext-prover` 参数时，节点将使用配置目录中的 `ext-prover.cfg` 配置文件作为启动子进程的依据。对于这个配置文件，设置 `--conf-dir` 参数也会带来效果。

使用者看到类似这样的日志时，就表明 `ext-prover` 已就绪。
```
2022-04-27T19:15:00.441+0800    INFO    porver-ext      ext/prover.go:122       response loop start     {"pid": 24764, "ppid": 24732, "loop": "resp"}
2022-04-27T19:15:00.441+0800    INFO    porver-ext      ext/prover.go:155       request loop start      {"pid": 24764, "ppid": 24732, "loop": "req"}
2022-04-27T19:15:00.468+0800    INFO    processor-cmd   processor/processor.go:35       ready   {"pid": 24764, "ppid": 24732, "proc": "wdpost"}
```


## 部署实践
假设我们存在一台配置了 8 GPU 的节点机器，那么我们可以通过以下配置方式来提供更强的时空证明处理能力。

1. 配置并启动源节点
   ```
   venus-sector-manager daemon run --miner
   ```
   此时，源节点只提供封装相关的功能和能力；

2. 配置 `ext-prover.cfg` 文件：
   ```
   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "0"
   TMPDIR = "/tmp/ext-prover0/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "1"
   TMPDIR = "/tmp/ext-prover1/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "2"
   TMPDIR = "/tmp/ext-prover2/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "3"
   TMPDIR = "/tmp/ext-prover3/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "4"
   TMPDIR = "/tmp/ext-prover4/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "5"
   TMPDIR = "/tmp/ext-prover5/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "6"
   TMPDIR = "/tmp/ext-prover6/"

   [[WdPost]]
   [WdPost.Envs]
   CUDA_VISIBLE_DEVICES = "7"
   TMPDIR = "/tmp/ext-prover7/"

   ```

3. 初始化并启动独立 `PoSter` 节点
   ```
   venus-sector-manager --home=~/.venus-individual-poster daemon init
   venus-sector-manager --home=~/.venus-individual-poster daemon run --proxy="127.0.0.1:1789" --poster --listen=":2789" --conf-dir="~/.venus-sector-manager" --ext-prover
   ```

这种部署方式下，
- 源节点同时提供封装和挖矿的支持
- 代理节点提供 WindowPoSt 的支持
  - 代理节点启用 ext-prover，且每个子进程独立使用一块 GPU、一个计算锁目录

winning post 和 window post 之间不会因设备使用而形成冲突

## 局限性
当目前为止，我们已经讲解了独立 `PoSter` 节点依托的功能、原理和简单的使用范例。

但是，这种模式对于超大规模的 `SP` 集群仍然有一些局限性，具体体现在：
- 除非将配置拆分，让每个 `PoSter` 节点仅针对部分矿工提供时空证明支持，否则难以跨机器提供横向扩展能力；
- 时空证明的调度、证明窗口期的严重冲突，仍然需要在一定程度依赖运维层面的调配；

总体来说，上面这些局限性依赖于完全去状态化、分布式的 `venus-sector-manager` 实现，这也是我们未来会关注的方向之一。