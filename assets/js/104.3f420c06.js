(window.webpackJsonp=window.webpackJsonp||[]).push([[104],{488:function(v,e,a){"use strict";a.r(e);var t=a(17),_=Object(t.a)({},(function(){var v=this,e=v.$createElement,a=v._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[a("h1",{attrs:{id:"venus-各组件升级文档"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-各组件升级文档"}},[v._v("#")]),v._v(" Venus 各组件升级文档")]),v._v(" "),a("h2",{attrs:{id:"注意事项"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#注意事项"}},[v._v("#")]),v._v(" 注意事项")]),v._v(" "),a("ol",[a("li",[v._v("所有组件全部更换")]),v._v(" "),a("li",[v._v("更新完通过 curl 命令调用 "),a("code",[v._v("Version")]),v._v(" 接口检查版本号，各组件接口调用方式：https://github.com/filecoin-project/venus/issues/5132")]),v._v(" "),a("li",[v._v("pre/pro消息上链的情况")]),v._v(" "),a("li",[v._v("WD消息上链的情况")]),v._v(" "),a("li",[v._v("出块情况是否正常")]),v._v(" "),a("li",[v._v("gas fee 相关设置是否生效")])]),v._v(" "),a("h2",{attrs:{id:"需要升级的组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#需要升级的组件"}},[v._v("#")]),v._v(" 需要升级的组件")]),v._v(" "),a("table",[a("thead",[a("tr",[a("th",[v._v("组件名")]),v._v(" "),a("th",[v._v("tag")]),v._v(" "),a("th",[v._v("commit")])])]),v._v(" "),a("tbody",[a("tr",[a("td",[v._v("venus-auth")]),v._v(" "),a("td",[v._v("v1.11.0")]),v._v(" "),a("td",[v._v("0c30588")])]),v._v(" "),a("tr",[a("td",[v._v("venus")]),v._v(" "),a("td",[v._v("v1.11.0")]),v._v(" "),a("td",[v._v("afd3d47")])]),v._v(" "),a("tr",[a("td",[v._v("venus-messager")]),v._v(" "),a("td",[v._v("v1.11.0")]),v._v(" "),a("td",[v._v("e4c4ab4")])]),v._v(" "),a("tr",[a("td",[v._v("venus-gateway")]),v._v(" "),a("td",[v._v("v1.11.0")]),v._v(" "),a("td",[v._v("877a851")])]),v._v(" "),a("tr",[a("td",[v._v("venus-wallet")]),v._v(" "),a("td",[v._v("v1.11.0")]),v._v(" "),a("td",[v._v("7afa1eb")])]),v._v(" "),a("tr",[a("td",[v._v("venus-miner")]),v._v(" "),a("td",[v._v("v1.11.0")]),v._v(" "),a("td",[v._v("a30f342")])]),v._v(" "),a("tr",[a("td",[v._v("venus-market")]),v._v(" "),a("td",[v._v("v2.7.0")]),v._v(" "),a("td",[v._v("61f2cb5")])]),v._v(" "),a("tr",[a("td",[v._v("venus-sector-manager")]),v._v(" "),a("td",[v._v("v0.6.0-rc3")]),v._v(" "),a("td",[v._v("134b502")])]),v._v(" "),a("tr",[a("td",[v._v("venus-worker")]),v._v(" "),a("td",[v._v("无需升级")]),v._v(" "),a("td",[v._v("-")])])])]),v._v(" "),a("h3",{attrs:{id:"升级顺序"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#升级顺序"}},[v._v("#")]),v._v(" 升级顺序")]),v._v(" "),a("ol",[a("li",[v._v("venus-auth")]),v._v(" "),a("li",[v._v("venus")]),v._v(" "),a("li",[v._v("venus-gateway")]),v._v(" "),a("li",[v._v("venus-messager")]),v._v(" "),a("li",[v._v("venus-miner")]),v._v(" "),a("li",[v._v("venus-market")]),v._v(" "),a("li",[v._v("venus-wallet-pro")]),v._v(" "),a("li",[v._v("venus-sector-manager")])]),v._v(" "),a("h3",{attrs:{id:"venus-auth"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-auth"}},[v._v("#")]),v._v(" venus-auth")]),v._v(" "),a("p",[v._v("影响功能：")]),v._v(" "),a("ul",[a("li",[v._v("其他组件对获取 auth 的服务")])]),v._v(" "),a("p",[v._v("依赖升级组件:  无")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v('启动时使用 "--disable-perm-check" ,暂时关闭 auth 接口保护的特性')]),v._v(" "),a("li",[v._v("创建 token 之前需要先创建对应的用户")])]),v._v(" "),a("p",[v._v("备注：")]),v._v(" "),a("ul",[a("li",[v._v('新版本的 auth 在启动的时候会自动生成一个名为 "defaultLocalToken" 的token, 该 token 用于 auth-cli 执行命令时的鉴权')])]),v._v(" "),a("h3",{attrs:{id:"venus"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus"}},[v._v("#")]),v._v(" venus")]),v._v(" "),a("p",[v._v("影响功能：无")]),v._v(" "),a("p",[v._v("依赖升级组件:  venus-auth")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("p",[v._v("编译：先 "),a("code",[v._v("make dist-clean")]),v._v(" 再 "),a("code",[v._v("make")]),v._v("，这样可以防止未能正常升级 "),a("code",[v._v("filecoin-ffi")]),v._v(" 而带来的问题")]),v._v(" "),a("p",[a("strong",[v._v("启动时应带上 flag --auth-token ,或者修改配置文件 api.venusAuthToken 配置项")])]),v._v(" "),a("ol",[a("li",[a("p",[v._v("升级后检查vk文件是否完整")])]),v._v(" "),a("li",[a("p",[v._v("升级后检查配置文件，通过日志检查 "),a("code",[v._v("UpgradeLightningHeight")]),v._v(" 和 "),a("code",[v._v("UpgradeThunderHeight")]),v._v(" 是否正常 :")]),v._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[v._v("# cali\nUpgradeLightningHeight:489094\nUpgradeThunderHeight:489094+3120\n# mainnet\nUpgradeLightningHeight:2809800\nUpgradeThunderHeight:  2809800 + 2880*21 = 2870280\n")])])])]),v._v(" "),a("li",[a("p",[v._v("升级后需检查是否正常同步区块")])]),v._v(" "),a("li",[a("p",[v._v("检查主网 v11 actors code，确保与下面输出一样")]),v._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[v._v("./venus state actor-cids --network-version 19\n\n# 顺序可能会不一样\nNetwork Version: 19\nActor Version: 11\nActor             CID\nreward            bafk2bzacebwjw2vxkobs7r2kwjdqqb42h2kucyuk6flbnyzw4odg5s4mogamo\nsystem            bafk2bzaced7npe5mt5nh72jxr2igi2sofoa7gedt4w6kueeke7i3xxugqpjfm\neam               bafk2bzaceaelwt4yfsfvsu3pa3miwalsvy3cfkcjvmt4sqoeopsppnrmj2mf2\ncron              bafk2bzacebpewdvvgt6tk2o2u4rcovdgym67tadiis5usemlbejg7k3kt567o\ndatacap           bafk2bzacebslykoyrb2hm7aacjngqgd5n2wmeii2goadrs5zaya3pvdf6pdnq\nethaccount        bafk2bzaceclkmc4yidxc6lgcjpfypbde2eddnevcveo4j5kmh4ek6inqysz2k\nevm               bafk2bzacediwh6etwzwmb5pivtclpdplewdjzphouwqpppce6opisjv2fjqfe\ninit              bafk2bzaceckwf3w6n2nw6eh77ktmsxqgsvshonvgnyk5q5syyngtetxvasfxg\nmultisig          bafk2bzaceafajceqwg5ybiz7xw6rxammuirkgtuv625gzaehsqfprm4bazjmk\npaymentchannel    bafk2bzaceb4e6cnsnviegmqvsmoxzncruvhra54piq7bwiqfqevle6oob2gvo\naccount           bafk2bzacealnlr7st6lkwoh6wxpf2hnrlex5sknaopgmkr2tuhg7vmbfy45so\nstorageminer      bafk2bzacec24okjqrp7c7rj3hbrs5ez5apvwah2ruka6haesgfngf37mhk6us\nstoragepower      bafk2bzaceaxgloxuzg35vu7l7tohdgaq2frsfp4ejmuo7tkoxjp5zqrze6sf4\nplaceholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro\nverifiedregistry  bafk2bzacedej3dnr62g2je2abmyjg3xqv4otvh6e26du5fcrhvw7zgcaaez3a\nstoragemarket     bafk2bzaceazu2j2zu4p24tr22btnqzkhzjvyjltlvsagaj6w3syevikeb5d7m\n")])])])]),v._v(" "),a("li",[a("p",[v._v("若不排查问题，rust日志级别"),a("strong",[v._v("不建议")]),v._v("设置为 "),a("code",[v._v("trace")]),v._v("，因为会打印较多日志")])]),v._v(" "),a("li",[a("p",[v._v("升级后可以通过命令来 "),a("code",[v._v("./venus state get-actor t01000")]),v._v(" 来确认是否升级成功")])]),v._v(" "),a("li",[a("p",[v._v("actor 迁移")]),v._v(" "),a("p",[a("strong",[v._v("经测试本次预迁移时间在 80 秒左右，正式迁移时间再 60 秒左右")])]),v._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[v._v("预迁移高度是升级高度前120个高度：2809800 - 120 = 2809680\npre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration\nmigration      开始：STARTING migration      结束：COMPLETED migration\n")])])])])]),v._v(" "),a("h3",{attrs:{id:"venus-gateway"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-gateway"}},[v._v("#")]),v._v(" venus-gateway")]),v._v(" "),a("p",[v._v("影响功能：无")]),v._v(" "),a("p",[v._v("依赖升级组件: venus-auth")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v("编译时,需要先 "),a("code",[v._v("make dist-clean")]),v._v(" 再 "),a("code",[v._v("make")])]),v._v(" "),a("li",[v._v("启动时,应带上 flag --auth-token ,或者直接在配置中设置配置项: AuthConfig.Token")]),v._v(" "),a("li",[v._v("移除 flag："),a("code",[v._v("--disable-address-verify")]),v._v("，"),a("strong",[v._v("升级时检查启动命令是否还在使用该flag")])])]),v._v(" "),a("h3",{attrs:{id:"venus-messager"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-messager"}},[v._v("#")]),v._v(" venus-messager")]),v._v(" "),a("p",[v._v("影响功能：")]),v._v(" "),a("ul",[a("li",[v._v("消息 replace")]),v._v(" "),a("li",[v._v("list --block 命令")])]),v._v(" "),a("p",[v._v("依赖升级组件: venus, venus-auth, venus-gateway")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v("升级第一次启动时, 带上 auth-token flag, 或者先修改配置文件 JWTConfig.Token 配置项")]),v._v(" "),a("li",[v._v("升级之后需要观察能否正常接收消息, 消息能否正常上链")])]),v._v(" "),a("p",[v._v("备注:")]),v._v(" "),a("ul",[a("li",[v._v("replace fee 系数的最小值 由 1.25 下调 到 1.11")]),v._v(" "),a("li",[v._v("list blocked 消息的时候, unfill 状态的消息也会作为 blocked 消息被列出来")])]),v._v(" "),a("h3",{attrs:{id:"venus-miner"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-miner"}},[v._v("#")]),v._v(" venus-miner")]),v._v(" "),a("p",[v._v("影响功能：")]),v._v(" "),a("ul",[a("li",[v._v("选消息增加超时机制")])]),v._v(" "),a("p",[v._v("依赖升级组件：auth, venus, gateway")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v("配置文件中 [Auth].[Token] 必须配置，且在venus-auth中具有admin权限，不要使用"),a("code",[v._v("defaultLocalToken")]),v._v("对应的token，应手动创建一个.")])]),v._v(" "),a("h3",{attrs:{id:"venus-market"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-market"}},[v._v("#")]),v._v(" venus-market")]),v._v(" "),a("p",[v._v("影响功能：")]),v._v(" "),a("ul",[a("li",[v._v("新增和调整部分命令\n依赖升级组件: auth, venus, gateway, messager")])]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v("启动时必须带上 cs-token, 或者修改 配置项 AuthNode.Token")])]),v._v(" "),a("h3",{attrs:{id:"venus-wallet-pro"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-wallet-pro"}},[v._v("#")]),v._v(" venus-wallet-pro")]),v._v(" "),a("p",[v._v("影响功能： 无")]),v._v(" "),a("p",[v._v("依赖升级组件: gateway")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v("升级后观察是否正常签名，消息能否正常上链")]),v._v(" "),a("li",[v._v("删除wallet new,import,export命令,这三个命令本身就没有用,删除是为了避免误操作.")])]),v._v(" "),a("h3",{attrs:{id:"venus-sector-manger"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-sector-manger"}},[v._v("#")]),v._v(" venus-sector-manger")]),v._v(" "),a("p",[v._v("影响功能：fip-0061 wdpost 算法改动")]),v._v(" "),a("p",[v._v("依赖升级组件: 链服务组件")]),v._v(" "),a("p",[v._v("注意事项：")]),v._v(" "),a("ul",[a("li",[v._v("编译时,需要先 "),a("code",[v._v("make dist-clean")]),v._v(" 再 "),a("code",[v._v("make")])]),v._v(" "),a("li",[v._v("wdpost 算法回滚步骤\n"),a("ol",[a("li",[v._v("vsm 切换到 [fip-0061-fallback] https://github.com/ipfs-force-community/venus-cluster/tree/fip-0061-fallback 分支")]),v._v(" "),a("li",[v._v("使用原来的多机wdpost二进制程序，注意备份原来的 wdpost-master 配置文件")])])])]),v._v(" "),a("hr"),v._v(" "),a("p",[v._v("更新结果验证步骤:")]),v._v(" "),a("ol",[a("li",[v._v("程序启动正常")]),v._v(" "),a("li",[v._v("pre/pro消息正常上链")]),v._v(" "),a("li",[v._v("出块正常")]),v._v(" "),a("li",[v._v("WD上链正常")]),v._v(" "),a("li",[v._v("算力增长正常")]),v._v(" "),a("li",[v._v("真实订单检索正常")]),v._v(" "),a("li",[v._v("数据库各种gas，生命周期，聚合设置正常")])]),v._v(" "),a("h3",{attrs:{id:"数据库变更"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#数据库变更"}},[v._v("#")]),v._v(" 数据库变更")]),v._v(" "),a("ol",[a("li",[a("p",[a("a",{attrs:{href:"https://github.com/filecoin-project/venus/issues/5558",target:"_blank",rel:"noopener noreferrer"}},[v._v("venus-messager 增加对 actor 的配置及相关命令，新增 "),a("code",[v._v("actor_cfg")]),v._v(" 表"),a("OutboundLink")],1)])]),v._v(" "),a("li",[a("p",[v._v("venus-market "),a("code",[v._v("storage_deals")]),v._v(" 表增加索引："),a("code",[v._v("CREATE INDEX idx_cdpprovider_state ON storage_deals(cdp_provider,state)")])])])])])}),[],!1,null,null,null);e.default=_.exports}}]);