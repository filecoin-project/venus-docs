## Getting started with venus-cluster

This guide will walk you through how to qiuckly get started with venus-cluster

## Preparation

1. Install 3rd party dependencies. Please refer to instrcutions [here](https://lotus.filecoin.io/docs/set-up/install/#building-from-source).

2. Download source code.

```bash
$ git clone https://github.com/ipfs-force-community/venus-cluster.git
```

3. Compile `venus-cluster` component.

```bash
$ cd venus-cluster
$ make all
```

:::tip

After completion, you should be able to find binaries for both `venus-worker` and `venus-sector-manager`.

:::

4. Copy the binaries to your machine(s).

5. Copy `./venus-worker/create-cgroup.sh` to all `venus-worker` machine and execute the script under same user which you are going to run `venus-worker`.

:::tip

The script will generate `cgroup` for the user, which allows `venus-worker` to allocate hardware resources accordingly.

:::

## Mock mode

By default, starting a set of `mock` instance can be done by a series of commands. 

### venus-sector-manager

For example, start `venus-sector-manager` with a dummy miner actor `t010000` and schedule sealing jobs with sector size of 2KiB.

```bash
$ ./dist/bin/venus-sector-manager mock --miner=10000 --sector-size=2KiB
```

:::tip

`./mock/start_smgr.sh` could also be used to do this.

:::

### venus-worker

1. Init both sealing and permanent storage. 

```bash
$ ./dist/bin/venus-worker store sealing-init -l ./mock-tmp/store1 ./mock-tmp/store2 ./mock-tmp/store3

$ ./dist/bin/venus-worker store file-init -l ./mock-tmp/remote
```

:::tip

`./mock/cleanup_store.sh` could also be used to do this.

:::

2. Start `venus-worker` in `mock` mode.

```bash
$ ./dist/bin/venus-worker daemon -c ./venus-worker/assets/venus-worker.mock.toml
```

:::tip

`./mock/start_worker.sh` could also be used to do this.

:::

## Production mode

### venus-sector-manager

1. Init working directories.

```bash
$ ./dist/bin/venus-sector-manager daemon init
```

2. Configure `~/.venus-sector-manager/sector-manager.cfg` per your use case.

:::tip

For more details on what each configuration does, please refer to [this document](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/en/04.venus-sector-manager-config.md).

:::

3. Start `venus-sector-manager`.

```bash
$ ./dist/bin/venus-sector-manager --net="cali" daemon run
```

:::tip

`--net` defaults to `mainnet`.

:::

### venus-worker

1. Init sealing path for unsealed sector(s).

```bash
$ ./dist/bin/venus-worker store sealing-init -l <dir1> <dir2> <dir3> <...>
```

2. Init permanent storage path for sealed sector(s).

```bash
$ ./dist/bin/venus-worker store file-init -l <dir1>
```

3. Configure your `venus-worker` according to your planning of CPU cores, numa, zone and etc for each sealing phases.

:::tip

For more details on what each configuration does, please refer to [this document](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/en/03.venus-worker-config.md).

:::

4. Start `venus-worker`.

```bash
$ /path/to/venus-worker daemon -c /path/to/venus-worker.toml
```
