# 快速启用

## 准备工作

1. 安装必要的第三方库。

   这一部分可以参考 `lotus` 文档中的相应部分 [building-from-source](https://lotus.filecoin.io/docs/set-up/install/#building-from-source)。

2. 下载代码库

   ```
   git clone https://github.com/ipfs-force-community/venus-cluster.git
   ```

3. 编译 `venus-cluster` 的组件

   ```
   cd venus-cluster
   make all
   ```

   完成后，在 `./dist/bin` 目录下会有 `venus-worker` 和 `venus-sector-manager` 两个可执行文件。

4. 分发可执行文件到需要的机器上。

5. 将 `./venus-worker/create-cgroup.sh` 分发到 `venus-worker` 所在的机器上，并以准备运行 `venus-worker` 的系统用户身份执行。

   这会为这样的用户生成相应的 `cgroup` 组，以便`venus-worker` 为其外部执行器进程分配硬件资源。



## Mock 模式

默认情况下，可以通过一系列命令在单机上启动一组 `mock` 实例。

### venus-sector-manager

通过

```
./dist/bin/venus-sector-manager mock --miner=10000 --sector-size=2KiB
```

命令启动一个模拟为 Actor 为 `t010000`   的 `SP` 分配 2KiB 扇区的 `venus-sector-manager` 服务。

这一步骤也可以通过代码目录中的 `./mock/start_smgr.sh` 脚本完成。



### venus-worker

1. 创建并初始化本地存储，初始化远程存储

   ```
   ./dist/bin/venus-worker store sealing-init -l ./mock-tmp/store1 ./mock-tmp/store2 ./mock-tmp/store3
   ./dist/bin/venus-worker store file-init -l ./mock-tmp/remote
   ```

   这一步骤也可以通过代码目录中的 `./mock/cleanup_store.sh` 脚本完成。

2. 以 `mock` 配置启动 `venus-worker`

   ```
   ./dist/bin/venus-worker daemon -c ./venus-worker/assets/venus-worker.mock.toml
   ```

   这一步骤也可以通过代码目录中的 `./mock/start_worker.sh` 脚本完成。



## 生产模式

### venus-sector-manager

1. 初始化工作目录

   ```
   ./dist/bin/venus-sector-manager daemon init
   ```

2. 按需配置默认配置文件 `~/.venus-sector-manager/sector-manager.cfg`

   配置项、作用、配置方法可以参考文档 `04.venus-sector-manager的配置解析`。

3. 启动 `venus-sector-manager`

   ```
   ./dist/bin/venus-sector-manager --net="cali" daemon run
   ```

   注意，在主网使用时，`--net` 参数可以不设置，或设置为 `mainnet`



### venus-worker

1. 规划用于封装过程中数据的本地存储，并使用

   ```
   ./dist/bin/venus-worker store sealing-init -l <dir1> <dir2> <dir3> <...>
   ```

   命令创建并初始化数据目录。

2. 挂载持久化数据目录，并使用

   ```
   ./dist/bin/venus-worker store file-init -l <dir1>
   ```

   命令初始化数据目录。

3. 规划用于各阶段的CPU核、numa 区域等配置。

   按需完成配置文件。

   配置项、作用、配置方法可以参考文档 `03.venus-worker的配置解析`。

4. 使用

   ```
   /path/to/venus-worker daemon -c /path/to/venus-worker.toml
   ```

   启动 `venus-worker`。
