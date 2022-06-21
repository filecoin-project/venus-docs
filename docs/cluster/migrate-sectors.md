# Import existing sector data
When we want to migrate the sector storage directory that has been completed by other computing power component solutions to `venus-cluster`, we only need to use `venus-sector-manager` to import and update the corresponding configuration file.

## Import and verify
**Note**: Both import and validation need to be done without the `venus-sector-manager daemon` started.

### import
`venus-sector-manager` provides an import tool called `storage attach`, which is used as follows:
````
venus-sector-manager util storage attach --verbose --name={storage name} <path>
````

in:
- `name` is an optional parameter;
- `<path>` is the storage path, which is converted to an absolute path during import.

For the meaning of `name` and `<path>`, please refer to [Common.PersistStores](https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/04.venus-sector-manager%E7%9A%84%E9%85%8D%E7%BD%AE%E8%A7%A3%E6%9E%90.md#commonpersiststores).

For example, we use
````
venus-sector-manager util storage attach --verbose --name=a -v ./mock-tmp/remote
````

Usually a log similar to the following is produced:
````
2022-03-11T16:03:52.492+0800 DEBUG policy policy/const.go:18 NETWORK SETUP {"name": "mainnet"}
2022-03-11T16:03:52.493+0800 INFO cmd internal/util_storage.go:104 use match pattern "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/remote /sealed/*" {"name": "a", "strict": false, "read-only": false}
2022-03-11T16:03:52.493+0800 INFO cmd internal/util_storage.go:121 path "s-t010000-16" matched=true {"name": "a", "strict": false, "read-only ": false}
2022-03-11T16:03:52.494+0800 INFO cmd internal/util_storage.go:121 path "s-t010000-17" matched=true {"name": "a", "strict": false, "read-only ": false}
2022-03-11T16:03:52.494+0800 INFO cmd internal/util_storage.go:121 path "s-t010000-18" matched=true {"name": "a", "strict": false, "read-only ": false}
2022-03-11T16:03:52.508+0800 INFO cmd internal/util_storage.go:148 sector indexer updated for s-t010000-16 {"name": "a", "strict": false, "read-only": false}
2022-03-11T16:03:52.509+0800 INFO cmd internal/util_storage.go:148 sector indexer updated for s-t010000-17 {"name": "a", "strict": false, "read-only": false}
2022-03-11T16:03:52.509+0800 INFO cmd internal/util_storage.go:148 sector indexer updated for s-t010000-18 {"name": "a", "strict": false, "read-only": false}
2022-03-11T16:03:52.509+0800 INFO cmd internal/util_storage.go:152 3 sectors out of 3 files have been updated {"name": "a", "strict": false, "read-only": false}
2022-03-11T16:03:52.509+0800 WARN cmd internal/util_storage.go:153 add the section below into the config file: {"name": "a", "strict": false, "read-only": false}

[[Common.PersistStores]]
Name = "a"
Path = "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/mock-tmp/remote"
Strict = false
ReadOnly = false
````

At this time, the directory import has been completed, and the location information of all sectors has also been recorded.
We can complete the import by copying and filling the final output example configuration into the configuration file of `venus-sector-manager`.

#### reimport
If we find that the information filled in when importing is wrong, such as `--name` is misspelled, then we only need to re-use the correct information to complete the import process once.
The location information of the sector will be overwritten and updated.

#### sealed_file separated from cache_dir
Some computing components allow `sealed_file` and `cache_dir` to be on different storage instances, in which case regular import may fail to locate sector files properly.
In this case, you can enable the split scan mode by adding the command line parameter `--allow-splitted`. In this mode, the `sealed` folder and the `cache` folder are scanned separately for sectors that meet the naming rules path, and record the positioning information respectively.

At this point, the log will look similar to:
````
2022-04-19T19:11:55.137+0800 DEBUG policy policy/const.go:18 NETWORK SETUP {"name": "mainnet"}
2022-04-19T19:11:55.154+0800 INFO cmd internal/util_storage.go:120 scan for sectors(upgrade=false) {"name": "p3", "strict": false, "read-only": false , "splitted": true}
2022-04-19T19:11:55.154+0800 INFO cmd internal/util_storage.go:211 0 sectors out of 0 files have been found {"name": "p3", "strict": false, "read-only": false, "splitted": true}
2022-04-19T19:11:55.154+0800 INFO cmd internal/util_storage.go:145 scan for splitted cache dirs(upgrade=false) {"name": "p3", "strict": false, "read-only" : false, "splitted": true}
2022-04-19T19:11:55.155+0800 INFO cmd internal/util_storage.go:211 3 sectors out of 3 files have been found {"name": "p3", "strict": false, "read-only": false, "splitted": true}
2022-04-19T19:11:55.156+0800 INFO cmd internal/util_storage.go:120 scan for sectors(upgrade=true) {"name": "p3", "strict": false, "read-only": false , "splitted": true}
2022-04-19T19:11:55.156+0800 INFO cmd internal/util_storage.go:211 0 sectors out of 0 files have been found {"name": "p3", "strict": false, "read-only": false, "splitted": true}
2022-04-19T19:11:55.156+0800 INFO cmd internal/util_storage.go:145 scan for splitted cache dirs(upgrade=true) {"name": "p3", "strict": false, "read-only" : false, "splitted": true}
2022-04-19T19:11:55.156+0800 INFO cmd internal/util_storage.go:211 0 sectors out of 0 files have been found {"name": "p3", "strict": false, "read-only": false, "splitted": true}
2022-04-19T19:11:55.156+0800 WARN cmd internal/util_storage.go:166 add the section below into the config file: {"name": "p3", "strict": false, "read-only": false, "splitted": true}

[[Common.PersistStores]]
Name = "p3"
Path = "/home/dtynn/proj/github.com/ipfs-force-community/venus-cluster/