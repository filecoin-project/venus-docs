# Standalone PoSter node
In earlier versions, although `venus-sector-manager` already supports the `--poster`, `--miner` parameters of the `daemon run` command to select whether to enable the corresponding module, because the `post` attestation process is different from The strong correlation of sector positioning information makes it more limited and difficult to expand when it is actually used.

From v0.2.0 onwards, we have provided a series of functional combinations that make easy-to-use, scalable standalone PoSter nodes an option for large-scale `SP`.

Below, we will introduce these new feature points, and provide a practice to complete the deployment of independent PoSter nodes through these features. Subsequent documents use the node with `--poster` enabled as an example, and the independent `--miner` node operates in a similar manner, and will not be described separately.

## Proxy node mode
We know that for PoSter nodes, the most important capability is to obtain real-time and accurate sector positioning information. In the current `venus-sector-manager` version, we temporarily only provide metadata management based on the local embedded kv database.

This allows data to be managed by only one process, and direct data sharing across processes is not possible.

Therefore, we designed the proxy node mode to provide some metadata to other required nodes through the network interface, so as to realize data sharing.

### How to use the proxy node
We have added the `--proxy` parameter to the `daemon run` command. Its format is an address format like `{ip}:{port}`. When the startup command contains a valid `--proxy` parameter, the node will use another `venus-sector-manager` node pointed to by it as a data source and construct the necessary metadata (read-only) management module.

In addition to `--proxy`, we also provide switches that control whether proxy mode is enabled for specific data management modules.

Currently, we only provide the switch `--proxy-sector-indexer-off` for the time being. When `--proxy-sector-indexer-off` is enabled, nodes use the `SectorIndexer` database in their own data directory.

For example, if started with the `venus-sector-manager daemon run --miner` command, there will be a `venus-sector-manager` listening on port `1789` using `~/.venus-sector-manager` as the data directory `sector-manager` instance with mining module enabled.

At this time, we can use the following command to initialize and start a proxy node with the above instance as the data source on the same machine. This proxy node will use `~/.venus-sector-manager2` as the data directory and listen to `2789` port.
````bash
venus-sector-manager --home ~/.venus-sector-manager2 daemon init
// maintain configuration files
venus-sector-manager --home ~/.venus-sector-manager2 daemon run --proxy="127.0.0.1:1789" --listen=":2789" --poster
````

The proxy node can provide the exact same and real-time sector location information as the source node.

### The agent node uses the existing configuration file
According to the method described in the previous section, we can start an agent node, but there is still a problem with this startup method: the configuration file of the agent node needs to be written again, or copied from the data directory of the source node. This introduces additional maintenance work, especially when configuration files may change frequently.

For this, we also provide a `--conf-dir` parameter, which is in the form of a usable directory path. When the startup command includes a valid `--conf-dir` parameter, the node will use the configuration file that already exists in the specified directory as its own configuration file.

This saves the work of writing and maintaining configuration files for different source and agent nodes on the same machine and serving the same set of clusters.

Based on this function, the agent node startup method mentioned in the previous section can become:
````bash
venus-sector-manager --home ~/.venus-sector-manager2 daemon run --proxy="127.0.0.1:1789" --listen=":2789" --conf-dir="~/.venus-sector -manager" --poster
````

At this point, the source node and the agent node will use the same batch of configuration files.


## ext-prover executor
In addition to sharing sector information, another challenge faced by independent PoSter nodes is the utilization of hardware resources.

Limited by the underlying algorithm library, computing nodes can only use GPUs in process units. This makes it difficult for PoSter nodes to effectively utilize the computing power of multiple GPUs, and it is also difficult to safely avoid proof timeouts when multiple `SPs` have conflicting `WindostPoSt` proof windows.

For this, we provide an `ext-prover` mechanism similar to the `ext processor` in `venus-worker`.

The `ext-prover` mechanism consists of two components:
1. The `--ext-prover` parameter of the `daemon run` command
2. The `ext-prover.cfg` configuration file in the node data directory

A default `ext-prover.cfg` file looks like:
````toml
# Default config:
[[WdPost]]
#Bin = "venus-sector-manger"
#Args = ["wdpost"]
#Concurrent = 1
#Weight = 1
[WdPost.Envs]
#KEY = "VAL"
#
````

In recent versions, `daemon init` initializes the `ext-prover.cfg` file.

Users can write their own, or copy the corresponding files from a data directory initialized by the latest version to an existing data directory.

The functions of the configuration items in `ext-prover.cfg` are very similar to the configuration blocks in `venus-worker`, and users can refer to the corresponding documents for reference.

When the `--ext-prover` parameter is included in the start command of `venus-sector-manager`, the node will use the `ext-prover.cfg` configuration file in the configuration directory as the basis for starting child processes. For this configuration file, setting the `--conf-dir` parameter will also have an effect.

When users see logs like this, `ext-prover` is ready.
````
2022-04-27T19:15:00.441+0800 INFO porver-ext ext/prover.go:122 response loop start {"pid": 24764, "ppid": 24732, "loop": "resp"}
2022-04-27T19:15:00.441+0800 INFO porver-ext ext/prover.go:155 request loop start {"pid": 24764, "ppid": 24732, "loop": "req"}
2022-04-27T19:15:00.468+0800 INFO processor-cmd processor/processor.go:35 ready {"pid": 24764, "ppid": 24732, "proc": "wdpost"}
````


## Deployment Practice
Suppose we have a node machine configured with 8 GPUs, then we can provide stronger proof-of-time processing capabilities through the following configuration.

1. Configure and start the source node
   ````
   venus-sector-manager daemon run --miner
   ````
   At this time, the source node only provides functions and capabilities related to encapsulation;

2. Configure the `ext-prover.cfg` file:
   ````toml
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

   ````

3. Initialize and start a standalone `PoSter` node
   ````bash
   venus-sector-manager --home=~/.venus-individual-poster daemon init
   venus-sector-manager --home=~/.venus-individual-poster daemon run --proxy="127.0.0.1:1789" --poster --listen=":2789" --conf-dir="~/ .venus-sector-manager" --ext-prover
   ````

In this way of deployment,
- The source node provides both packaging and mining support
- Proxy nodes provide WindowPoSt support
  - The agent node enables ext-prover, and each child process independently uses a GPU and a computing lock directory

There is no conflict between winning post and window post due to device usage

## Limitations
So far, we have explained the functions, principles and simple usage examples that stand-alone `PoSter` nodes rely on.

However, this mode still has some limitations for very large `SP` clusters, which are embodied in:
- Unless the configuration is split so that each `PoSter` node only provides proof-of-time support for some miners, it is difficult to provide horizontal scalability across machines;
- The scheduling of the time-space proof and the serious conflict in the proof window period still need to rely on the deployment at the operation and maintenance level to a certain extent;

In general, the above limitations rely on a fully de-stateful, distributed venus-sector-manager implementation, which is one of the directions we will focus on in the future.