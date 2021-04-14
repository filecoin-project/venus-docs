(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{406:function(s,e,a){"use strict";a.r(e);var t=a(25),r=Object(t.a)({},(function(){var s=this,e=s.$createElement,a=s._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"venus-multisig-wallet"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-multisig-wallet"}},[s._v("#")]),s._v(" Venus: Multisig wallet")]),s._v(" "),a("p",[s._v("多签（multi-signature）钱包是指需要多个密钥来授权一个FIL交易的钱包。它适用于多方共管一笔FIL，设置一定的赞成比阙值完成message的签发。")]),s._v(" "),a("h2",{attrs:{id:"cli范例"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#cli范例"}},[s._v("#")]),s._v(" CLI范例")]),s._v(" "),a("ul",[a("li",[s._v("以下示范为了方便阅读都将使用“t0”地址，实际上也支持“t3”地址操作。")]),s._v(" "),a("li",[s._v("范例中包含了多签钱包所有的CLI操作方式，并以流程性的方式介绍如何使用多签钱包，同时概念性描述也会随着逻辑的下沉而变少，相同业务逻辑的介绍只会被详细描述一次。")]),s._v(" "),a("li",[s._v("指令标签\n"),a("ul",[a("li",[s._v('"[]"：选填')]),s._v(" "),a("li",[s._v('"[--phrase]" ：带描述符参数，需要"--phrase"指定才能使用')]),s._v(" "),a("li",[s._v('"<phrase>"：占位参数，不需要指明含义，需要严格按照顺位填写')]),s._v(" "),a("li",[s._v("\"[--]\"： '带描述符参数' 和 '占位参数' 的边界")])])])]),s._v(" "),a("blockquote",[a("p",[s._v("指令标签示例：venus msig create [--phrase1=<phrase1>] [--] <phrase2> [<phrase3>]")]),s._v(" "),a("ol",[a("li",[s._v('phrase1: 带描述符参数，选填，如需使用，必须"--phrase1=xxx"指定')]),s._v(" "),a("li",[s._v("phrase2: 占位参数，必填")]),s._v(" "),a("li",[s._v("phrase3: 占位参数，选填")])])]),s._v(" "),a("h3",{attrs:{id:"创建一个多签钱包"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#创建一个多签钱包"}},[s._v("#")]),s._v(" 创建一个多签钱包")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig create [--required=<required>] [--value=<value>] [--duration=<duration>] [--from=<from>] [--] <addresses>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ ./venus msig create --from=t01001 --required=2 --value=1000 --duration=20000 "t01001,t01002,t01003"\n\n"Created new multisig: t01004 <multiAddress>"\n')])])]),a("ul",[a("li",[s._v("from: 发起钱包地址，生成create msg用，需要花费gas。创建多签钱包时，发起的钱包地址默认不加入到多签密钥之中，如需添加，需要额外指定（如以下指令中t01001出现了2次，第2次为指定该地址包含在多签钱包之中）")]),s._v(" "),a("li",[s._v("required: 多签钱包签名通过的阙值。以上钱包设置为2/3，即当多签钱包包含的3个地址中，有2个钱包地址通过决议即生效。")]),s._v(" "),a("li",[s._v("value: 创建钱包后直接转账的FIL数额，由from提供。")]),s._v(" "),a("li",[s._v("duration: 资金解锁的时间长度，即创建后的钱包中所带的金额锁定的时间长度。")])]),s._v(" "),a("h3",{attrs:{id:"查询创建的多签钱包状态"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查询创建的多签钱包状态"}},[s._v("#")]),s._v(" 查询创建的多签钱包状态")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig inspect [--vesting] [--decode-params] [--] <address>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ ./venus msig inspect t01004 --vesting=true --decode-params=true\n\n# 状态信息\nBalance: 1000 FIL\nSpendable: 3.15 FIL\nInitialBalance: 1000 FIL\nStartEpoch: 0\nUnlockDuration: 20000\nThreshold: 2 / 3\nSigners:\nID      Address\nt01001  <t3Address1>\nt01002  <t3Address2>\nt01003  <t3Address3>\nTransactions:  0\n")])])]),a("ul",[a("li",[s._v("vesting： 默认false,为true将呈现更多信息")]),s._v(" "),a("li",[s._v("decode-params：将状态中Transactions的params字段以json格式显示，默认为hex格式")])]),s._v(" "),a("h3",{attrs:{id:"往多签钱包转账fil"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#往多签钱包转账fil"}},[s._v("#")]),s._v(" 往多签钱包转账FIL")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ ./venus send t01004 2000\n")])])]),a("blockquote",[a("p",[s._v("msg打包成功后，多签钱包将会增加2000FIL")])]),s._v(" "),a("h3",{attrs:{id:"提议往多签钱包添加新的钱包地址"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提议往多签钱包添加新的钱包地址"}},[s._v("#")]),s._v(" 提议往多签钱包添加新的钱包地址")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig add-propose [--increase-threshold] [--from=<from>] [--] <multisigAddress> <signer>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ ./venus msig add-propose --increase-threshold=false --from=t01001 t01004 t01005\n\n# reponse\nsent add singer proposal in message: <msgCId>\nTxnID: 0\n\n# 状态变化\nTransactions:  1\nID      State    Approvals  To             Value   Method        Params\n0       pending  1          t01004 (self)  0 FIL   AddSigner(5)  {"Signer":"t01005","Increase":false}\n')])])]),a("blockquote",[a("p",[s._v("往t01004多签钱包中提议新增t01005地址，且投票阙值不增加")])]),s._v(" "),a("ul",[a("li",[s._v("increase-threshold： 是否添加新地址成功后，自动增加投票阙值，默认为false")]),s._v(" "),a("li",[s._v("signer：待添加的钱包地址，未包含与多签钱包中")])]),s._v(" "),a("h3",{attrs:{id:"同意添加新地址提议"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#同意添加新地址提议"}},[s._v("#")]),s._v(" 同意添加新地址提议")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig add-approve [--from=<from>] [--] <multisigAddress> <proposerAddress> <txId> <newAddress> <increaseThreshold>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ ./venus msig add-approve --from=t01002 t01004 t01001 0 t01005 false\n\n# reponse\n"sent add approval in message: <msgCId>"\n\n# 状态变化\nThreshold: 2 / 4\nSigners:\nID      Address\nt01001  <t3Address1>\nt01002  <t3Address2>\nt01003  <t3Address3>\nt01005  <t3Address5>\n\n')])])]),a("blockquote",[a("p",[s._v("因为之前的投票比是2/3，所以一个地址通过后，该提议将会执行，投票阙值会因为新成员的加入变为2/4")])]),s._v(" "),a("ul",[a("li",[s._v("proposerAddress: 发起者的地址")]),s._v(" "),a("li",[s._v("txId: 多签地址状态中Transcations下对应的ID")]),s._v(" "),a("li",[s._v("newAddress: 指定添加的新地址，必须和状态数据中的Params下对应的地址一样")]),s._v(" "),a("li",[s._v("increaseThreshold: 是否影响投票阙值分母，必须与状态数据中Params下对应的Increase相同")])]),s._v(" "),a("h3",{attrs:{id:"提议修改投票阙值"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提议修改投票阙值"}},[s._v("#")]),s._v(" 提议修改投票阙值")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig propose-threshold [<multisigAddress>] <newM>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('.$ /venus msig propose-threshold --from=t01001 t01004 3\n\n# reponse\nsent change threshold proposal in message: <msgCId>\nTxnID: 1\n\n# 状态变化\nTransactions:  1\nID      State    Approvals  To             Value   Method                          Params\n1       pending  1          t01004 (self)  0 FIL   ChangeNumApprovalsThreshold(8)  {"NewThreshold":3}\n')])])]),a("ul",[a("li",[s._v("newM： 目标阙值分母")])]),s._v(" "),a("h3",{attrs:{id:"同意修改投票阙值提议-approve指令为万用同意指令"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#同意修改投票阙值提议-approve指令为万用同意指令"}},[s._v("#")]),s._v(" 同意修改投票阙值提议(approve指令为万用同意指令)")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig approve [--from=<from>] [--] <multisigAddress> <messageId> [<proposerAddress>] [<destination>] [<value>] [<methodId>] [<methodParams>]")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ ./venus msig approve --from=t01002 t01004 1\n\n# reponse\n"sent approval in message: <msgCId>"\n\n# 状态变化\nThreshold: 3 / 4\n')])])]),a("blockquote",[a("p",[s._v("普通情况下，同意一个提议只需要使用approve指令并指定多签地址和多签地址Transactions状态中的ID即可")])]),s._v(" "),a("ul",[a("li",[s._v("multisigAddress： 操作多签地址")]),s._v(" "),a("li",[s._v("messageId： propose操作返回的TxID,在inspect指令中可以查寻")]),s._v(" "),a("li",[s._v("proposerAddress：提议发起者钱包地址")]),s._v(" "),a("li",[s._v("destination：目标地址（如：多签地址转账给第3方地址时，该字段就是第三方地址）")]),s._v(" "),a("li",[s._v("value： 转账FIL数额")]),s._v(" "),a("li",[s._v("methodId：propose对应的methodNum,在inspect指令中可以查寻\n"),a("ul",[a("li",[s._v("Propose: 2")]),s._v(" "),a("li",[s._v("Approve: 3")]),s._v(" "),a("li",[s._v("Cancel: 4")]),s._v(" "),a("li",[s._v("AddSigner: 5")]),s._v(" "),a("li",[s._v("RemoveSigner: 6")]),s._v(" "),a("li",[s._v("SwapSinger: 7")]),s._v(" "),a("li",[s._v("ChangeNumApprovalsThreshold: 8")]),s._v(" "),a("li",[s._v("LockBalance: 9")])])]),s._v(" "),a("li",[s._v("methodParams: 发起propose的操作参数，在inspect指令中可以查寻")])]),s._v(" "),a("h3",{attrs:{id:"提议移除多签成员"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提议移除多签成员"}},[s._v("#")]),s._v(" 提议移除多签成员")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig propose-remove [--decrease-threshold] [--from=<from>] [--] <multisigAddress> <signer>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$  ./venus msig propose-remove --from=t01001 t01004 t01005 \n\n# response\nsent remove singer in message: <msgCId>\nTxnID: 2\n\n# 状态变化\nThreshold: 3 / 4\nSigners:\nID      Address\nt01001  <t3Address1>\nt01002  <t3Address2>\nt01003  <t3Address3>\nt01005  <t3Address5>\nTransactions:  1\nID      State    Approvals  To             Value   Method           Params\n2       pending  1          t01004 (self)  0 FIL   RemoveSigner(6)  {"Signer":"t01005","Decrease":false}\n\n\n# propose-remove 在 approve 之后\nThreshold: 3 / 3\nSigners:\nID      Address\nt01001  <t3Address1>\nt01002  <t3Address2>\nt01003  <t3Address3>\n\n')])])]),a("h3",{attrs:{id:"提议替换多签成员"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提议替换多签成员"}},[s._v("#")]),s._v(" 提议替换多签成员")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig swap-propose [--from=<from>] [--] <multisigAddress> <oldAddress> <newAddress>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ ./venus msig swap-propose --from=t01001 t01004 t01003 t01005\n\n# response\nsent swap singer in message: <msgCId>\nTxID: 3\n\n# 状态变化\nThreshold: 3 / 3\nSigners:\nID      Address\nt01001  <t3Address1>\nt01002  <t3Address2>\nt01003  <t3Address3>\nTransactions:  1\nID      State    Approvals  To             Value   Method         Params\n3       pending  1          t01004 (self)  0 FIL   SwapSigner(7)  {"From":"t01003","To":"t01005"}\n\n\n# approve之后\nThreshold: 3 / 3\nSigners:\nID      Address\nt01001  <t3Address1>\nt01002  <t3Address2>\nt01005  <t3Address5>\nTransactions:  0\n\n')])])]),a("h3",{attrs:{id:"取消多签成员地址替换提议"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#取消多签成员地址替换提议"}},[s._v("#")]),s._v(" 取消多签成员地址替换提议")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig swap-cancel [<multisigAddress>] <txId> <oldAddress> <newAddress>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('# 发起新的替换提议\n$ ./venus msig swap-propose --from=t01001 t01004 t01005 t01003\n\n# 状态变化\nTransactions:  1\nID      State    Approvals  To             Value   Method         Params\n4       pending  1          t01004 (self)  0 FIL   SwapSigner(7)  {"From":"t01005","To":"t01003"}\n$ ./venus msig swap-cancel --from=t01001 t01004 4 t01005 t01003\n"sent swap cancellation in message: <msgCId>"\n')])])]),a("h3",{attrs:{id:"查询多签地址在指定间隔区块被授予的fil数"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查询多签地址在指定间隔区块被授予的fil数"}},[s._v("#")]),s._v(" 查询多签地址在指定间隔区块被授予的FIL数")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig vested [--start-epoch=<start-epoch>] [--end-epoch=<end-epoch>] [--] <multisigAddress>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$  ./venus msig vested --from=t01001 --start-epoch=10 --end-epoch=200 t01004\n\n# reponse\n"Vested: 9.5 FIL between 10 and 200"\n')])])]),a("h3",{attrs:{id:"提议冻结多签地址中的定量fil"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#提议冻结多签地址中的定量fil"}},[s._v("#")]),s._v(" 提议冻结多签地址中的定量FIL")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig lock-propose [--from=<from>] [--] <multisigAddress> <startEpoch> <unlockDuration> <amount>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('$ ./venus msig lock-propose --from=t01001 t01004 500 100 50\n\n# response\nsent lock balance in message: <msgCId>\nTxnID: 1\n\n# 状态变化\nTransactions:  1\nID      State    Approvals  To             Value   Method          Params\n5       pending  1          t01004 (self)  0 FIL   LockBalance(9)  {"StartEpoch":1600,"UnlockDuration":100,"Amount":"50000000000000000000"}\n\n')])])]),a("ul",[a("li",[s._v("startEpoch：开始生效的块高")]),s._v(" "),a("li",[s._v("unlockDuration：balance锁定区块跨度，startEpoch+unlockDuration后，锁定的balance将会自动解锁")]),s._v(" "),a("li",[s._v("amount：目标锁定的FIL数额")])]),s._v(" "),a("h3",{attrs:{id:"取消冻结提议"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#取消冻结提议"}},[s._v("#")]),s._v(" 取消冻结提议")]),s._v(" "),a("blockquote",[a("p",[s._v("./venus msig lock-cancel [--from=<from>] [--] <multisigAddress> <txId> <startEpoch> <unlockDuration> <amount>")])]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ ./venus msig lock-cancel --from=t01001 t01004 5 500 100 50\n\n### 同意冻结\n$ ./venus msig lock-approve --from=t01001 t01004 t01001 5 100 50 50\n\n# 同意后状态变化\nInitialBalance: 50 FIL\n")])])]),a("ul",[a("li",[s._v("startEpoch，unlockDuration，amount需要和lock-propose的参数一样")]),s._v(" "),a("li",[s._v("提议通过后，多签账户下的balance中将会把指定量的balance冻结锁定，显示为InitialBalance")])])])}),[],!1,null,null,null);e.default=r.exports}}]);