# Venus: Payment channels

这里将会介绍Payment channels是如何在Venus中工作的，同时也提供了一些案例来帮助理解它的运行流程。如果需要理解详细概念，可以跳转至[Filecoin Spec Payment Channel](https://spec.filecoin.io/#section-systems.filecoin_token.payment_channels)

Payment channels 的作用是在2个actor之间转移filecoin。

例如：客户端创建了一个payment channel以从服务端抓取数据。客户端通过在payment channel中发送vouchers 给服务端，然后服务端会发送响应数据。 payment channel 和 voucher 的概念适用于任何客户端与服务端链下周期性多次交易的场景。

## 运行用例

- payment channel 在链上创建并需要初始化一个Fil量（量的大小自行定夺）
- voucher 可以使客户端和服务端在链下陆续的交易资金，服务端在任何阶段都可以提交voucher到链上。
- 关于两端之间的payment channel其中任意一端都可以settle到链上。
- payment channel在settle到链上之后的一个时间段内（目前为12小时），任何一端都可以在链上执行collect。
- collect之后，payment channel中的多个voucher中提交的Fil会被发送到payment channel的接受者（服务端），创建payment channel中的Fil除去voucher中的Fil之后剩余的Fil将会被退还到payment channel的创建者（客户端）。
- voucher下有lane的概念，lane有nonce（递增）和value（Fil）的概念，在同一个lane中，高nonce的voucher为最终有效voucher。
(每个deal依赖于一个新创建的lane)


## CLI 范例


>为了快速的理解，我们通过使用Venus的CLI来介绍payment channel是如何工作的。Venus CLI是一个基于Venus守护进程的客户端，同时也可以通过对应的JSON-RPC API调用。

创建一个初始额度为10FIL的payment channel:

```
$ venus paych add-funds <form_addr> <to_addr> 10
<channel addr>
```

客户端在指定的\<channel addr\>中穿件一个nonce默认为1，额度为2FIL，lane为0的voucher:

```
$ venus paych voucher create <channel addr> 2 0
<voucher>
```

客户端将生成的voucher发送给服务端，服务端将其添加到本地存储中:

```
$ venus paych voucher add <channel addr> <voucher>

```

服务端发送一些数据给客户端。
客户端创建一个lane为0，nonce为2（默认在之前的1的基础上自增后），额度为4Fil的voucher:

```
$ venus paych voucher create <channel addr> 4 0
<voucher>
```

客户端将生成的voucher发送给服务端，服务端添加voucher后发送更多的数据给客户端。

客户端可以通过“paych add-funds”给已经创建好的payment channel添加FIL额度：

```
$ venus paych add-funds <client addr> <provider addr> 5
<channel addr> #和之前的的地址一样，现在这个channel的额度已经是15了
```

一旦客户端收到了所有的数据，他们需要settle掉这个通道，这个settle的动作不需要马上执行，例如客户端可以继续保持这个通道，只要他想继续与服务端进行交易。

```
$ venus paych settle <channel addr>
```

服务端可以提交voucher到链上（venus检测到链上的settle后会自动执行提交）。服务端可能收到许多FIL额度递增的voucher,它需要提交最优的voucher,需要注意的是每个lane中只有一个最佳voucher:

```
$ venus paych voucher best-spendable <channel addr>
<voucher>
<voucher>
<voucher>

$ venus paych voucher submit <channel addr> <voucher>
```

一旦settle后的保护周期结束，客户端或者服务端都可以提交collect将资金归属结算。

```
$ venus paych collect <channel addr>
```
