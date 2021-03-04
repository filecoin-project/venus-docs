---
title: 'venus: chain management'
description: 'The Venus blockchain carries the information necessary to compute the current state of the network, is stored on disk and grows every 30 seconds with new blocks. This guide explains how to manage several aspects of th chain.'
breadcrumb: 'Chain management'
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}.

[[TOC]]

## Syncing

Venus will automatically sync to the latest _chain head_ by:

- Fetching the block headers from the current _head_ down to the last synced epoch.
- Retrieving and verifying all the blocks from the last synced epoch to the current head.

Once Venus is synced, it will learn about new blocks as they are mined for every epoch via Pubsub, and verify them accordingly. Note that in Venus, every epoch might see a variable number of mined blocks.

Filecoin's blockchain grows relatively fast, so a full sync will take long time. For this reason, Venus offers a faster way to sync via trusted state snapshots.

### Syncing from a trusted state snapshot (mainnet)

We recommend most users to perform the initial node sync from a minimal, lightweight snapshot. Trusted state snapshots do not contain the full chain and might not be suitable for nodes that need to perform queries against historical state information, like block explorers, but otherwise work for most users.

A recent minimal trusted state chain snapshot is available [here](https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car). We can instruct venus to start the daemon and directly import from the URL:

```sh
# The snapshot size is about 7GiB. This works for mainnet.
venus daemon --import-snapshot https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car

# An alternative is to download first and use the file
venus daemon --import-snapshot <filename.car>

# The sha256sum is stored alongside the interim snapshot and can be obtained via
curl -sI https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car \
| perl -ne '/^x-amz-website-redirect-location:(.+)\.car\s*$/ && print "$1.sha256sum"' \
| xargs curl -s
```

::: warning
If you do not trust the source of the snapshot or simply want Venus to validate the chain, you need to follow the steps in the next section. Complete validation of the chain is an order of magnitude slower, and is expected to take multiple days.
:::

### Checking sync status

There are two ways to track whether the Venus daemon is correctly syncing the chain and how far it has yet to go to complete the syncing:

```sh
# Inspect the current sync status, sync workers etc:
venus sync status
# View the Timestamp of the chain head compared with the current time:
venus chain head
```

## Compacting the chain data

It is possible to _prune_ the current chain data used by Venus to reduce the disk footprint of a Venus node by resyncing from a minimal snapshot.

1. Stop the Venus daemon:

  ```bash
  venus daemon stop
  ```

1. Remove the contents of the `badger/` folder in the Venus path:

  ```bash
  rm -rf ~/.venus/badger/*
  ```
  
1. Start the daemon using a minimal snapshot, as explained above:

  ```bash
  venus daemon --import-snapshot https://fil-chain-snapshots-fallback.s3.amazonaws.com/mainnet/minimal_finality_stateroots_latest.car
  ```

[Edit this page](https://github.com/filecoin-project/venus-docs/blob/master/docs/Chain.md) on GitHub or [open an issue](https://github.com/filecoin-project/venus-docs/issues)