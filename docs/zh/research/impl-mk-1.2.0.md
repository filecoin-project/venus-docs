
# Simple Summary (概述)

和官方boost开发人员共同，大家确定在未来的存储和检索协议层次上达成一致。 本期工作期望能够在支持boost制定的存储订单协议[mk/1.2.0](https://github.com/filecoin-project/FIPs/blob/master/FRCs/frc-0040.md)

# Abstract (功能简介)

1. 网络层增加mk/1.2.0协议的handler，处理订单结合现有的存储订单的功能来实现。
2. 类似原来的piece resource下载功能，实现一个基于http的文件查询接口， 协议上可以参考boost实现，尽量保持一致。
3. market-client上增加一个http文件服务器， 文件来源和现有的local data存储打通，尽量的结合系统现有的功能来实现。

# Motivation (来源/背景)

新版本存储协议（mk/1.2.0）制定新的存储和存储订单查询协议，其中最大的特点是制定一个更加宽松的数据传输方式。在协议层次上并没有固定某种传输方式，在实际实现中该协议支持了http的传输方式，基于这种方式未来一些基于http的传输手段都可以应用在该协议的实际应用当中，比如（ftp/oss/s3/网盘等). 另外这种模式相对与原来的graphsync协议更加的轻量化，增加了传输效率，减少了实现的复杂度。

适应http的传输方式，boost也提供了基于http的文件检索方式，此方式和我们目前的实现和应用方式具有相似之处。统一之后有助于在应用上支持这种数据协议的应用和推广。

# Specification (Spec)

 
 
## 协议层支持 
网络层支持/fil/storage/mk/1.2.0协议及处理函数,参考
https://github.com/filecoin-project/boost/blob/main/storagemarket/lp2pimpl/net.go

## 数据层需要改动存储表结构

协议中数据对应到订单数据
```
IsOffline           TransferType为true,则TransferType为TTManual
ClientDealProposal 按原来的
DealDataRoot       dataroot
Transfer.Type      增加http
Transfer.ClientID  数据类型不变，重新封装一个ClientID, 新老共用，需要转成PeerId时按需转换。
Transfer.Params    需增加
Transfer.Size      PayloadSize
```

存储订单增加字段
```
DealUUID           改变主键为字符串形式使用uuid类型
Version            增加版本字段，用于区分新老协议， 待定，可能会有用
```

## 服务端支持
增加一个新包用于实现新协议功能是这个可能可以复用现有的storageprovider中已经实现的组件

现有可能用到的功能
1. deal handler 可能可以直接复用此handler来处理订单信息
2. deal publisher 订单发布

确保可以正常运行的功能：
1. deal_assign, 确保deal assigner需要的字段信息和字段状态没有问题
2. deal_track   确保订单状态追踪可用

改造现有的piece的piece文件下载功能, 希望能够和boost的http下载方式能够结合起来。


## 客户端
1. 增加新协议的存储订单推送命令，支持设置http url
2. 增加新的http检索方式支持，通过http的方式从market服务上下载数据。
3. market client支持一个http本地文件服务，协议具体实现方式可以参考boost，文件数据来源想办法和data打通。
4. data list的时候可以显示一个文件的http地址， 发起新版本存储订单命令可以使用此url。


## 对于查询订单状态的协议接口

在返回的信息当中NBytesReceived信息的获取可能会存在困难，如果存在负载均衡的情况可能会不太好统计处理，落库更新压力会有些大，而且是这个字段的意义不是很大，第一版实现可以先忽略该字段。

# Design Rationale (设计思路)

未来go-fil-market协议会被替换，但是预计会是一个比较长的过程。因而当前的做法是在具体的订单工作上尽量复用，在协议交互部分尽量隔离。既保持功能的紧凑又保证未来能够安全方便的删除go-fil-market。

# Backwards Compatibility (兼容性)

1. 数据兼容，需要迁移数据。 老数据生成随机uuid， proposalcid设置成可空且唯一索引类型。 为了保证各个表风格一致， 考虑所有表都改成uuid主键。
2. http文件下载功能中，boost的默认行为和现在的默认行为不一致，直接改动会导致cluster出现问题， 因此可能需要两个版本的协议共存一段时间
3. 新的协议保存的字段数据很少很多，可能会造成现有的功能出现损坏或者这些新版本的订单无法正常工作

# Test Cases (测试用例)

# Security Considerations (安全考量)