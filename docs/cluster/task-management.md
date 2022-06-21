# venus-worker task management

In the previous document, we mentioned that in the venus-cluster system, the process management of the sector is placed in the worker.

Therefore, the management of sector tasks, especially exception handling, is also performed by the worker instance where the sector is located.

However, if all status viewing and exception handling need to be logged in to the corresponding machine to operate, it must be very inconvenient.

Therefore, in v0.2.0 and later versions, workers report status to sector-manager, and sector-manager manages workers remotely.

Below, we will explain how worker self-management and sector-manager manage workers separately.



## venus-worker self-management

The self-management of venus-worker is mainly through

````bash
./dist/bin/venus-worker worker
````

A set of tools provided to call the management interface to operate, and the subcommands included are

- list
- pause
- resume



### list

`list` is used to list the current state of all `sealing_thread`s in the currently running venus-worker instance. The way he uses it is

````bash
venus-worker worker -c <config file path> list
````



Let's take the mock configuration in the codebase as an example:

````bash
$ ./dist/bin/venus-worker worker -c ./venus-worker/assets/venus-worker.mock.toml list

#0: "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store1"; sector_id=Some(s-t010000-2), paused=true, paused_elapsed=Some (17s), state=C1Done, last_err=Some("permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793/cointmpail/var finding [f3793/cointmpail/var] -proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]")
#1: "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store2"; sector_id=Some(s-t010000-3), paused=true, paused_elapsed=Some (17s), state=C1Done, last_err=Some("permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793/cointmpail/var finding [f3793/cointmpail/var] -proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]")
#2: "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store3"; sector_id=Some(s-t010000-1), paused=true, paused_elapsed=Some (17s), state=C1Done, last_err=Some("permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793/cointmpail/var finding [f3793/cointmpail/var] -proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]")
````

As you can see, for each `sealing_thread` , it will list

- Serial number

- Local storage location information
- Sector ID (if there is a sector task being processed)
- is it paused
- Paused time (if there are paused sector tasks)
- current status
- The last exception information (if there is a sector task suspended due to exception)



### pause

`pause` is used to pause the `sealing_thread` for the specified sequence number. The way it is used is

````
$ venus-worker worker -c <config file path> pause --index <index>
````

in:

- `index` needs to match the ordinal number in `list`.



### resume

`resume` is used to resume a suspended `sealing_thread`. The way it is used is

````bash
venus-worker worker -c <config file path> resume [--state <state>] --index <index>
````

in:

- `index` needs to match the ordinal number in `list`.

- `state` is optional.

  If not filled, the sector will try to restart with the current state; if the correct `state` value is filled in, it will restart with the specified state

  For different `sealing_thread` task types, the optional status values ​​can be found in [11. Task status flow](./11.Taskstatusflow.md)



## venus-sector-manager manages venus-worker

The management of venus-worker by venus-sector-manager is mainly in two aspects:

1. Receive the periodic report information of the worker instance
2. Call the management interface on the specified venus-worker instance

user through

````bash
./dist/bin/venus-sector-manager util worker
````

Provides a set of tools to call the management interface of venus-sector-manager, or the proxy to call the management interface of the specified venus-worker to complete the operation.

The subcommands included are:

- list
- info
- pause
- resume



### list

The `list` here is used to list the worker profiles that have reported information to this venus-secotr-manager instance, for example:

````bash
$ ./dist/bin/venus-sector-manager util worker list
Name Dest Threads Empty Paused Errors LastPing(with ! if expired)
127.0.0.1 127.0.0.1:17890 3 0 3 3 2.756922465s
````

As you can see, for each instance, it will list:

- instance name (if no instance name is specified, it will be the ip used to connect to venus-sector-manager)
- instance connection information
- `sealing_thread` number
- the number of `sealing_thread` empty
- The number of `sealing_thread` suspended
- The number of `sealing_thread` errors reported
- The interval from the last report to the current time



### info / pause / resume

This set of commands is executed against the specified venus-worker instance.

Their effects are equivalent to venus-worker's own `list` / `pause` / `resume`, which are used in the following ways.

- `venus-sector-manager util worker info <worker instance name or address>`
- `venus-sector-manager util worker pause <worker instance name or address> <thread index>`
- `venus-sector-manager util worker resume <worker instance name or address> <thread index> [<next state>]`

Specific information can be viewed through `help`, and the definition and effect of parameters are consistent with the venus-worker management tool.

for example:

```bash
$ ./dist/bin/venus-sector-manager util worker info 127.0.0.1

Index  Loc                                                                             SectorID     Paused  PausedElapsed  State   LastErr
0      /home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store1  s-t010000-2  true    13m42s         C1Done  permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]
1      /home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store2  s-t010000-3  true    13m42s         C1Done  permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]
2      /home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/store3  s-t010000-1  true    13m42s         C1Done  permanent: No cached parameters found for stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f [failure finding /var/tmp/filecoin-proof-parameters/v28-stacked-proof-of-replication-merkletree-poseidon_hasher-8-0-0-sha256_hasher-032d3138d22506ec0082ed72b2dcba18df18477904e35bafee82b3793b06832f.params]
```