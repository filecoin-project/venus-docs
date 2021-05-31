# Usage of venus-worker

venus-worker and venus-sealer are used to deploy on multiple machines. The sealing process is divided into four processes: AddPiece, PreCommit1, PreCommit2 and Commit2. Through the setting of venus-worker, different stages of sealing can be run on different machines, which can make the deployment process more flexible and take advantage of different machines. Here is a test network venus-worker construction process.

## Get ready

### Machine
- 192.168.1.151 for file mount
- 192.168.1.134 running worker
- 192.168.1.19  running venus, venus-sealing, venus-miner

### Module
The following module are required to run this venus-worker test process. List the required project address. Please refer to the readme.md of the project for the specific compilation method.

1. venus-sealer [https://github.com/filecoin-project/venus-sealer](https://github.com/filecoin-project/venus-sealer)
2. venus-worker [https://github.com/filecoin-project/venus-worker](https://github.com/filecoin-project/venus-worker)

## Storage

Running multiple machines requires shared storage. Here, we use NFS as shared storage. The shared storage is deployed in 192.168.1.151. Refer to the document to [install nfs](https://docs.platform9.com/v5.0/openstack/tutorials-setup-nfs-server)

```sh
yum -y install rpcbind nfs-utils
mkdir /nfs && chmod 666 /nfs
echo "/nfs *(rw,sync,no_root_squash,no_subtree_check,insecure)" > /etc/exports
exportfs  -rv
systemctl start rpcbind
systemctl start nfs
cat /var/lib/nfs/etab  #检查nfs是否挂载成功
```


## Environment
By default, venus, venus-wallet and venus-messenger have been deployed

## Start-up venus-sealer

Initialize and run venus-sealer on machine 192.168.1.19. After running, get API and token for configuring venus-worker and venus-miner

### Mount storage

```sh
mkdir /nfs
mount -t nfs 192.168.1.151:/nfs /nfs
```

### Running venus-sealer
```sh
#Initialize venus-sealer. Local storage is not used here
venus-sealer init --actor=t01000 --sector-size=512M --network nerpa --no-local-storage --node-url {venus-api} --node-token {venus-token} --messager-url http://{venus-message api}/rpc/v0

venus-sealer run
```

### Attach the storage
```sh
./venus-sealer storage attach --init --seal --store /nfs
```

### Get API address and token

```sh
cat ~/.venussealer/api
cat ~/.venussealer/token
```

## Configure venus-worker

Initialize and run venus-worker in 192.168.1.134

### Mount storage

```sh
mkdir /nfs
mount -t nfs 192.168.1.151:/nfs /nfs
```

### Running venus-worker

```sh
# Use the venus-sealer API and token obtained above
./venus-worker run --no-local-storage --miner-addr /ip4/127.0.0.1/tcp/2345/http --miner-token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.gcqF6Pkm4bwGXzEx83NR7h8WPliEihJ3GyUKvhKryAQ
```

### Attach the storage
```sh
./venus-worker storage attach  /nfs
```

### Check whether it is normal

Running ```./venus-sealer sealing workers```, the result is similar to the following

```sh
Worker 8c814d19-ec36-4090-a03b-d4bc9314b39a, host lijunlongdeMacBook-Pro.local
        CPU:  [                                                                ] 0/12 core(s) in use
        RAM:  [||||||||||||||||||||||||||||||||||||||||||||                    ] 69% 11.13 GiB/16 GiB
        VMEM: [|||||||||||||||||||||||||||||||||||||||                         ] 61% 11.13 GiB/18 GiB
Worker a89d4156-d23e-44e6-b74b-8405e9496db0, host lijunlongdeMacBook-Pro.local
        CPU:  [                                                                ] 0/12 core(s) in use
        RAM:  [||||||||||||||||||||||||||||||||||||||||                        ] 63% 10.12 GiB/16 GiB
        VMEM: [|||||||||||||||||||||||||||||||||||                             ] 56% 10.12 GiB/18 GiB

```

Running `./venus-sealer storage list`, the result is similar to the following

```sh
7c046ce2-051f-4531-aa4d-76c1cd728acb:
        [######                                            ] 257.7 GiB/1.998 TiB 12%
        Unsealed: 0; Sealed: 17; Caches: 17; Reserved: 0 B
        Weight: 10; Use: Seal Store
        Local: /nfs
        URL: http://127.0.0.1:2345/remote
        URL: http://127.0.0.1:3456/remote

1dcfda12-fb3d-413c-b626-caf8b87e3b97:
        [#############################                     ] 136.4 GiB/233.5 GiB 58%
        Unsealed: 0; Sealed: 2; Caches: 2; Reserved: 0 B
        Use: ReadOnly   Local: /Users/lijunlong/.genesis-sectors
        URL: http://127.0.0.1:2345/remote

```

## Pledge power

In venus-sealer, run the command ```venus-sealer sectors pledge``` to accumulate power. Run the command ```venus-sealer sectors list``` to check the status of sealing.

***Note: if the Rust code prompts permission error, you can add /var/tmp/filecoin-parents，/tmp/bellman.gpu.lock/bellman.priority.lock and 777 permissions***
