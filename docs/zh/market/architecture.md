## 背景

随着由[FIP0018](https://github.com/filecoin-project/FIPs/blob/master/FIPS/fip-0018.md) 牵头的针对`filecoin`术语的重新命名，社区（开发者、存储提供商、生态系统合作伙伴等）将进一步推动进行更多的存储交易，以提高公众对大多数网络存储仍然是承诺容量（CC）这一事实的看法。鉴于上述情绪，`venus-market` 模块的设计和实施已成为焦点。`Venus`社区应该讨论和迭代一个明确的长期路线图，这也是与`Filecoin`生态系统进行更好沟通的一种手段。`Venus`团队正重试[Filecoin 组件架构](https://docs.google.com/document/d/1ukPD8j6plLEbbzUjxfo7eCauIrOeC_tqxqYK_ls9xbc/edit#)，`venus-market`如何促进存储提供商和存储之间的互动，将不断融入到`Venus filecoin`的长期愿景当中。

## 架构

`Venus`最显着的特点之一是，通过使用`Venus`链服务减轻与`Filecoin`主链交互的各类运维问题，从而使存储提供商轻松进入`Filecoin`网络。 链交互，包括但不限于链同步、消息发送和合并/查询出块权等等，都可以由一群存储提供者共享一套链服务。基于`Venus`链服务架构更进一步，可以将`venus-market`作为链服务的一个组件部署。存储提供商可以通过配置和设定控制其订单流程。 通过和`venus-cluster`和`venus-sealer`的深度集成，`Venus`存储提供商可以享受到接近封装CC扇区的订单流程。

![venus-cluster](../../.vuepress/public/vm_arc.jpg)

上图展示了`venus-market`架构的概述。在左边，有一列不同类型的存储客户端，像`Lotus`客户端，`venus-market`自带的轻量级客户端，甚至是像`Estuary`或者`Filswan`这样的平台客户。在中间，是`Venus`链服务，`venus-market v2`和其他`Venus`链服务组件。在右边，是使用链服务的不同存储提供者。

### 订单流程

一个常规的订单流程是，存储客户向存储提供者发起订单请求，`venus-market`按照存储提供者的配置，同意或不同意接收订单。订单数据从客户端传送到链服务端`venus-market`的`pieceStore`子模块中，再通过`venus-market`支持的各种数据传输协议分发给下面的存储提供者，并由他们封装订单数据。

## 路线图

更多关于`venus-market`的路线图可以在[这里](https://github.com/filecoin-project/venus/blob/master/documentation/en/venus-market-design-roadmap.md)被找到。在本篇文档发布时，`venus-market`的实施进度为第二阶段。
