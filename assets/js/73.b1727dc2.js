(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{447:function(a,e,t){"use strict";t.r(e);var s=t(17),r=Object(s.a)({},(function(){var a=this,e=a.$createElement,t=a._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[t("h2",{attrs:{id:"nv18-各组件升级文档"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#nv18-各组件升级文档"}},[a._v("#")]),a._v(" nv18 各组件升级文档")]),a._v(" "),t("p",[a._v("如果 venus 各组件的版本从 "),t("code",[a._v("v1.8.x")]),a._v(" 升级到 "),t("code",[a._v("v1.10.0")]),a._v("，请先阅读 "),t("a",{attrs:{href:"https://github.com/filecoin-project/venus/discussions/5531",target:"_blank",rel:"noopener noreferrer"}},[a._v("venus chain-service v1.9.* & venus-market v2.5.* upgrade list / 链服务 v1.9.*和订单服务 v2.5.*升级清单"),t("OutboundLink")],1),a._v("，尤其注意 "),t("code",[a._v("venus-auth")]),a._v(" 和 "),t("code",[a._v("venus-market")]),a._v(" 的升级，"),t("code",[a._v("venus-auth")]),a._v(" 升级前需要为每一个矿工都创建一个用户，"),t("code",[a._v("venus-market")]),a._v(" 的启动方式和配置有较大变动。")]),a._v(" "),t("h3",{attrs:{id:"时间线"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#时间线"}},[a._v("#")]),a._v(" 时间线")]),a._v(" "),t("p",[a._v("升级时间：2023-03-14T15:14:00Z，北京时间是 2023-03-14 23:14:00")]),a._v(" "),t("h3",{attrs:{id:"各组件版本"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#各组件版本"}},[a._v("#")]),a._v(" 各组件版本")]),a._v(" "),t("ul",[t("li",[t("a",{attrs:{href:"https://github.com/filecoin-project/venus/discussions/5649#discussioncomment-4652920",target:"_blank",rel:"noopener noreferrer"}},[a._v("calibrationnet"),t("OutboundLink")],1)]),a._v(" "),t("li",[t("a",{attrs:{href:"https://github.com/filecoin-project/venus/discussions/5649#discussioncomment-4652933",target:"_blank",rel:"noopener noreferrer"}},[a._v("mainnet"),t("OutboundLink")],1)])]),a._v(" "),t("h3",{attrs:{id:"venus"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus"}},[a._v("#")]),a._v(" venus")]),a._v(" "),t("p",[a._v("影响功能：支持 nv18 网络")]),a._v(" "),t("p",[a._v("依赖升级组件：无")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("ol",[t("li",[t("p",[a._v("编译：先 "),t("code",[a._v("make dist-clean")]),a._v(" 再 "),t("code",[a._v("make")]),a._v("，这样可以防止未能正常升级 "),t("code",[a._v("filecoin-ffi")]),a._v(" 而带来的问题")])]),a._v(" "),t("li",[t("p",[a._v("升级后检查 vk 文件是否完整")])]),a._v(" "),t("li",[t("p",[a._v("升级后检查配置文件，通过日志检查 "),t("code",[a._v("AllowableClockDriftSecs")]),a._v(" "),t("code",[a._v("UpgradeHyggeHeight")]),a._v(" 和 "),t("code",[a._v("UpgradeHyggeHeight")]),a._v(" 是否正常 :")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("# cali\nAllowableClockDriftSecs:1\nEip155ChainID:314159\nUpgradeHyggeHeight:322354\n# mainnet\nAllowableClockDriftSecs:1\nEip155ChainID:314\nUpgradeHyggeHeight:2683348\n")])])])]),a._v(" "),t("li",[t("p",[a._v("升级后需检查是否正常同步区块")])]),a._v(" "),t("li",[t("p",[a._v("检查主网 v10 actors code，确保与下面输出一样")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("./venus state actor-cids --network-version 18\n\n# 顺序可能会不一样\nNetwork Version: 18\nActor Version: 10\nActor             CID                                                             \ndatacap           bafk2bzacealj5uk7wixhvk7l5tnredtelralwnceafqq34nb2lbylhtuyo64u  \nevm               bafk2bzaceahmzdxhqsm7cu2mexusjp6frm7r4kdesvti3etv5evfqboos2j4g  \ninit              bafk2bzaced2f5rhir3hbpqbz5ght7ohv2kgj42g5ykxrypuo2opxsup3ykwl6  \naccount           bafk2bzaceampw4romta75hyz5p4cqriypmpbgnkxncgxgqn6zptv5lsp2w2bo  \nethaccount        bafk2bzaceaqoc5zakbhjxn3jljc4lxnthllzunhdor7sxhwgmskvc6drqc3fa  \nmultisig          bafk2bzaceduf3hayh63jnl4z2knxv7cnrdenoubni22fxersc4octlwpxpmy4  \npaymentchannel    bafk2bzaceartlg4mrbwgzcwric6mtvyawpbgx2xclo2vj27nna57nxynf3pgc  \nreward            bafk2bzacebnhtaejfjtzymyfmbdrfmo7vgj3zsof6zlucbmkhrvcuotw5dxpq  \nstoragemarket     bafk2bzaceclejwjtpu2dhw3qbx6ow7b4pmhwa7ocrbbiqwp36sq5yeg6jz2bc  \nstorageminer      bafk2bzaced4h7noksockro7glnssz2jnmo2rpzd7dvnmfs4p24zx3h6gtx47s  \nverifiedregistry  bafk2bzacedfel6edzqpe5oujno7fog4i526go4dtcs6vwrdtbpy2xq6htvcg6  \neam               bafk2bzacedrpm5gbleh4xkyo2jvs7p5g6f34soa6dpv7ashcdgy676snsum6g  \nplaceholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro  \nstoragepower      bafk2bzacec4ay4crzo73ypmh7o3fjendhbqrxake46bprabw67fvwjz5q6ixq  \nsystem            bafk2bzacedakk5nofebyup4m7nvx6djksfwhnxzrfuq4oyemhpl4lllaikr64  \ncron              bafk2bzacedcbtsifegiu432m5tysjzkxkmoczxscb6hqpmrr6img7xzdbbs2g\n")])])])]),a._v(" "),t("li",[t("p",[a._v("若不排查问题，rust 日志级别"),t("strong",[a._v("不建议")]),a._v("设置为 "),t("code",[a._v("trace")]),a._v("，因为会打印较多日志")])]),a._v(" "),t("li",[t("p",[a._v("升级后可以通过命令来 "),t("code",[a._v("./venus state get-actor t01000")]),a._v(" 来确认是否升级成功")])]),a._v(" "),t("li",[t("p",[a._v("actor 迁移")]),a._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[a._v("预迁移高度是升级高度前 60 个高度：2683288\npre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration\nmigration      开始：STARTING migration      结束：COMPLETED migration\n")])])])]),a._v(" "),t("li",[t("p",[a._v("配置变更")]),a._v(" "),t("div",{staticClass:"language-json extra-class"},[t("pre",{pre:!0,attrs:{class:"language-json"}},[t("code",[a._v("# 增加 fevm 相关配置，其中 enableEthRPC 字段用来控制是否启用 ETH RPC，默认是 "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"fevm"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"enableEthRPC"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"ethTxHashMappingLifetimeDays"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"event"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"enableRealTimeFilterAPI"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"enableHistoricFilterAPI"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[a._v("false")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"filterTTL"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('"24h0m0s"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"maxFilters"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("100")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"maxFilterResults"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("10000")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"maxFilterHeightRange"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("2880")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n            "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"databasePath"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[a._v('""')]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),a._v("\n\n# 增加 allowableClockDriftSecs 字段，默认是 "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"parameters"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),t("span",{pre:!0,attrs:{class:"token property"}},[a._v('"allowableClockDriftSecs"')]),t("span",{pre:!0,attrs:{class:"token operator"}},[a._v(":")]),a._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[a._v("1")]),a._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n")])])])])]),a._v(" "),t("h3",{attrs:{id:"venus-auth"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-auth"}},[a._v("#")]),a._v(" venus-auth")]),a._v(" "),t("p",[a._v("影响功能：")]),a._v(" "),t("p",[a._v("依赖升级组件：无")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("ol",[t("li",[a._v("命令行能否正常使用")])]),a._v(" "),t("h3",{attrs:{id:"venus-messager"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-messager"}},[a._v("#")]),a._v(" venus-messager")]),a._v(" "),t("p",[a._v("功能：")]),a._v(" "),t("ol",[t("li",[a._v("补充对接口权限的验证")])]),a._v(" "),t("p",[a._v("依赖升级组件：")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("ol",[t("li",[t("p",[a._v("升级后观察能够正常收消息")])]),a._v(" "),t("li",[t("p",[a._v("升级后观察消息能否正常上链")])]),a._v(" "),t("li",[t("p",[t("code",[a._v("ReplacedMsg")]),a._v(" 更名为 "),t("code",[a._v("NonceConflictMsg")])])])]),a._v(" "),t("h3",{attrs:{id:"venus-miner"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-miner"}},[a._v("#")]),a._v(" venus-miner")]),a._v(" "),t("p",[a._v("影响功能：")]),a._v(" "),t("p",[a._v("依赖升级组件：")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("ol",[t("li",[a._v("升级后能否正常出块")])]),a._v(" "),t("h3",{attrs:{id:"venus-gateway"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-gateway"}},[a._v("#")]),a._v(" venus-gateway")]),a._v(" "),t("p",[a._v("影响功能：")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("p",[a._v("编译：先 "),t("code",[a._v("make dist-clean")]),a._v(" 再 "),t("code",[a._v("make")])]),a._v(" "),t("ol",[t("li",[a._v("升级后检查钱包："),t("code",[a._v("./venus-gateway wallet list")])]),a._v(" "),t("li",[a._v("升级后检查矿工："),t("code",[a._v("./venus-gateway miner list")])])]),a._v(" "),t("h3",{attrs:{id:"venus-market"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-market"}},[a._v("#")]),a._v(" venus-market")]),a._v(" "),t("p",[a._v("影响功能：")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("p",[a._v("编译：先 "),t("code",[a._v("make dist-clean")]),a._v(" 再 "),t("code",[a._v("make")])]),a._v(" "),t("h3",{attrs:{id:"venus-wallet"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-wallet"}},[a._v("#")]),a._v(" venus-wallet")]),a._v(" "),t("p",[a._v("影响功能：")]),a._v(" "),t("p",[a._v("注意事项：")]),a._v(" "),t("ol",[t("li",[a._v("启动后需要解锁钱包")]),a._v(" "),t("li",[a._v("是否注册到 gateway")])]),a._v(" "),t("h3",{attrs:{id:"venus-sector-manager"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-sector-manager"}},[a._v("#")]),a._v(" venus-sector-manager")]),a._v(" "),t("p",[a._v("编译：先 "),t("code",[a._v("make dist-clean")]),a._v(" 再 "),t("code",[a._v("make")])])])}),[],!1,null,null,null);e.default=r.exports}}]);