---
title: 'Venus Miner: configuration reference'
description: 'This guide covers the Venus Miner configuration files, detailing the meaning of the options contained in them.'
breadcrumb: 'Configuration reference'
---

# {{ $frontmatter.title }}

{{ $frontmatter.description }}

The Venus Miner configutation is created after the [initialization step](miner-setup.md) during setup and placed in `~/.venussealer/config.toml` when defined.

The _default configuration_ has all the items commented, so in order to customize one of the items the leading `# ` need to be removed.

::: tip
For any configuration changes to take effect, the miner must be [restarted](miner-lifecycle.md).
:::

[[TOC]]

## API section

```toml
[API]
  # Binding address for the miner API
  ListenAddress = "/ip4/127.0.0.1/tcp/2345/http"
  # This should be set to the miner API address as seen externally
  RemoteListenAddress = "127.0.0.1:2345"
  # General network timeout value
  Timeout = "30s"
```

Configure `RemoteListenAddress` to the value that a different node would have to use to reach this API. Usually it is the miner's IP address and API port, but depending on your setup (proxies, public IPs etc.), it might be a different IP.
