# venus-worker 任务管理

之前的文档中，我们提到，在 venus-cluster 体系中，将扇区的流程管理放到了 worker 中。

因此，扇区任务的管理，尤其是异常处理，也就要通过扇区所处的 worker 实例来执行。

但是如果全部的状态查看、异常处理都需要登录到对应机器去操作，那么肯定非常不方便。

因此在 v0.2.0 及之后的版本中，增加了 worker 向 sector-manager 上报状态，sector-manager 远程管理 worker 的机制。

下面，我们会就 worker 自管理和 sector-manager 管理 worker 的方式分别进行说明。



## venus-worker 自管理

venus-worker 的自管理主要通过

```
./dist/bin/venus-worker worker
```

提供的一组工具，调用管理接口进行操作，其中包含的子命令是

- list
- pause
- resume



### list

`list` 用于列出当前运行的 venus-worker 实例中的所有 `sealing_thread` 的当前状态。他的使用方式是

```
venus-worker worker -c <config file path> list
```



我们以代码库中的 mock 配置为例：

```
$ ./dist/bin/venus-worker worker -c ./venus-worker/assets/venus-worker.mock.toml list

#0: "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store1"; sector_id=Some(s-t010000-2), paused=true, paused_elapsed=Some(17s), state=C1Done, last_err=Some("permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]")
#1: "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store2"; sector_id=Some(s-t010000-3), paused=true, paused_elapsed=Some(17s), state=C1Done, last_err=Some("permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]")
#2: "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store3"; sector_id=Some(s-t010000-1), paused=true, paused_elapsed=Some(17s), state=C1Done, last_err=Some("permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]")
```

可以看到，针对每一个 `sealing_thread` ，会列出

- 序号

- 本地存储位置信息
- 扇区标识（如果有正在处理的扇区任务）
- 是否已暂停
- 已暂停的时间（如果有已暂停的扇区任务）
- 当前状态
- 最近一次异常信息（如果有因异常而暂停的扇区任务）



### pause

`pause` 用于暂停指定序号的 `sealing_thread`。它的使用方式是

```
$ venus-worker worker -c <config file path> pause --index <index>
```

其中：

- `index` 需要和 `list` 中的序号匹配。



### resume

`resume` 用于恢复处于暂停状态的 `sealing_thread`。它的使用方式是

```
venus-worker worker -c <config file path> resume [--state <state>] --index <index>
```

其中：

- `index` 需要和 `list` 中的序号匹配。

- `state` 是选填项。

  不填写时，扇区会尝试以当前状态重启；如果填写了正确的 `state` 值，将会以指定状态重启

  对于不同的 `sealing_thread` 任务类型，可选的状态值在 [11.任务状态流转](./11.任务状态流转.md)



## venus-sector-manager 管理 venus-worker

venus-sector-manager 对 venus-worker 的管理主要是两方面：

1. 接收 worker 实例的定时上报信息
2. 调用指定 venus-worker 实例上的管理接口

使用者通过

```
./dist/bin/venus-sector-manager util worker
```

提供的一组工具，调用 venus-sector-manager 的管理接口，或代理调用指定 venus-worker 的管理接口，完成操作。

包含的子命令是：

- list
- info
- pause
- resume



### list

这里的 `list` 用于列出所向本 venus-secotr-manager 实例上报过信息的 worker 概况，例如：

```
$ ./dist/bin/venus-sector-manager util worker list
Name       Dest             Threads  Empty  Paused  Errors  LastPing(with ! if expired)
127.0.0.1  127.0.0.1:17890  3        0      3       3       2.756922465s
```

可以看到，针对每一个实例，会列出：

- 实例名（如果没有指定实例名，则会以连接 venus-sector-manager 使用的 ip）
- 实例连接信息
- `sealing_thread` 数量
- 空载的 `sealing_thread` 数量
- 暂停的 `sealing_thread` 数量
- 报错的 `sealing_thread` 数量
- 上一次上报距离当前时间的间隔



### info / pause / resume

这一组命令都是针对指定的 venus-worker 实例执行的。

他们的效果等效于 venus-worker 自己的 `list` / `pause` / `resume`，使用方式分别为

- `venus-sector-manager util worker info <worker instance name or address>`
- `venus-sector-manager util worker pause <worker instance name or address> <thread index>`
- `venus-sector-manager util worker resume <worker instance name or address> <thread index> [<next state>]`

具体信息可以通过 `help` 来查看，而参数的定义和效果则和 venus-worker 管理工具保持一致。

举例来说：

```
$ ./dist/bin/venus-sector-manager util worker info 127.0.0.1

Index  Loc                                                                             SectorID     Paused  PausedElapsed  State   LastErr
0      /home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store1  s-t010000-2  true    13m42s         C1Done  permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]
1      /home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store2  s-t010000-3  true    13m42s         C1Done  permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]
2      /home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store3  s-t010000-1  true    13m42s         C1Done  permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]
```
