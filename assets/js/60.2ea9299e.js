(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{452:function(v,a,t){"use strict";t.r(a);var e=t(17),_=Object(e.a)({},(function(){var v=this,a=v.$createElement,t=v._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":v.$parent.slotKey}},[t("h1",{attrs:{id:"venus-各组件升级文档-持续更新中"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-各组件升级文档-持续更新中"}},[v._v("#")]),v._v(" Venus 各组件升级文档 (持续更新中)")]),v._v(" "),t("h2",{attrs:{id:"注意事项"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#注意事项"}},[v._v("#")]),v._v(" 注意事项")]),v._v(" "),t("ol",[t("li",[v._v("所有组件全部更换")]),v._v(" "),t("li",[v._v("更新完通过 curl 命令调用 "),t("code",[v._v("Version")]),v._v(" 接口检查版本号，各组件接口调用方式：https://github.com/filecoin-project/venus/issues/5132")]),v._v(" "),t("li",[v._v("pre/pro消息上链的情况")]),v._v(" "),t("li",[v._v("WD消息上链的情况")]),v._v(" "),t("li",[v._v("出块情况是否正常")]),v._v(" "),t("li",[v._v("gas fee 相关设置是否生效")])]),v._v(" "),t("h4",{attrs:{id:"建议升级之前不要做算力-如果升级前-p2-消息上链但-c2-消息没上链-升级后-c2-消息上链会报错"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#建议升级之前不要做算力-如果升级前-p2-消息上链但-c2-消息没上链-升级后-c2-消息上链会报错"}},[v._v("#")]),v._v(" 建议升级之前不要做算力，如果升级前 p2 消息上链但 c2 消息没上链，升级后 c2 消息上链会报错")]),v._v(" "),t("h2",{attrs:{id:"需要升级的组件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#需要升级的组件"}},[v._v("#")]),v._v(" 需要升级的组件")]),v._v(" "),t("table",[t("thead",[t("tr",[t("th",[v._v("组件名")]),v._v(" "),t("th",[v._v("tag")]),v._v(" "),t("th",[v._v("commit")])])]),v._v(" "),t("tbody",[t("tr",[t("td",[v._v("sophon-auth")]),v._v(" "),t("td",[v._v("v1.16.0")]),v._v(" "),t("td",[v._v("e2340d5")])]),v._v(" "),t("tr",[t("td",[v._v("venus")]),v._v(" "),t("td",[v._v("v1.16.0")]),v._v(" "),t("td",[v._v("3fdb199")])]),v._v(" "),t("tr",[t("td",[v._v("sophon-co")]),v._v(" "),t("td",[v._v("v0.9.0")]),v._v(" "),t("td",[v._v("0f344ed")])]),v._v(" "),t("tr",[t("td",[v._v("sophon-messager")]),v._v(" "),t("td",[v._v("v1.16.0")]),v._v(" "),t("td",[v._v("f695806")])]),v._v(" "),t("tr",[t("td",[v._v("soohon-gateway")]),v._v(" "),t("td",[v._v("v1.16.0")]),v._v(" "),t("td",[v._v("2d32b8e")])]),v._v(" "),t("tr",[t("td",[v._v("venus-wallet")]),v._v(" "),t("td",[v._v("v1.16.0")]),v._v(" "),t("td",[v._v("48b1e02")])]),v._v(" "),t("tr",[t("td",[v._v("sophon-miner")]),v._v(" "),t("td",[v._v("v1.16.0")]),v._v(" "),t("td",[v._v("500c186")])]),v._v(" "),t("tr",[t("td",[v._v("droplet")]),v._v(" "),t("td",[v._v("v2.12.0")]),v._v(" "),t("td",[v._v("deec963")])]),v._v(" "),t("tr",[t("td",[v._v("damocles-manager")]),v._v(" "),t("td",[v._v("v0.11.0")]),v._v(" "),t("td",[v._v("7d06bd4")])]),v._v(" "),t("tr",[t("td",[v._v("damocles-worker")]),v._v(" "),t("td",[v._v("v0.11.0")]),v._v(" "),t("td",[v._v("7d06bd4")])])])]),v._v(" "),t("h3",{attrs:{id:"升级顺序"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#升级顺序"}},[v._v("#")]),v._v(" 升级顺序")]),v._v(" "),t("ol",[t("li",[v._v("sophon-auth")]),v._v(" "),t("li",[v._v("venus")]),v._v(" "),t("li",[v._v("soohon-co")]),v._v(" "),t("li",[v._v("soohon-gateway")]),v._v(" "),t("li",[v._v("sophon-messager")]),v._v(" "),t("li",[v._v("sophon-miner")]),v._v(" "),t("li",[v._v("droplet")]),v._v(" "),t("li",[v._v("venus-wallet")]),v._v(" "),t("li",[v._v("damocles-manager")]),v._v(" "),t("li",[v._v("damocles-worker")])]),v._v(" "),t("h3",{attrs:{id:"sophon-auth"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sophon-auth"}},[v._v("#")]),v._v(" sophon-auth")]),v._v(" "),t("p",[v._v("影响功能：")]),v._v(" "),t("ul",[t("li",[v._v("其他组件对获取 auth 的服务")])]),v._v(" "),t("p",[v._v("依赖升级组件:  无")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("ul",[t("li",[v._v("启动后能否正常鉴权")])]),v._v(" "),t("h3",{attrs:{id:"venus"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus"}},[v._v("#")]),v._v(" venus")]),v._v(" "),t("p",[v._v("影响功能：无")]),v._v(" "),t("p",[v._v("依赖升级组件:  sophon-auth")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("p",[v._v("编译：先 "),t("code",[v._v("make dist-clean")]),v._v(" 再 "),t("code",[v._v("make")]),v._v("，这样可以防止未能正常升级 "),t("code",[v._v("filecoin-ffi")]),v._v(" 而带来的问题")]),v._v(" "),t("ol",[t("li",[t("p",[v._v("升级后检查vk文件是否完整")])]),v._v(" "),t("li",[t("p",[v._v("升级后执行命令 "),t("code",[v._v("./venus state network-info")]),v._v("，然后检查通过日志检查 UpgradeDragonHeight 是否正常:")]),v._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[v._v("# cali\nUpgradeDragonHeight: 1779094\n# mainnet\nUpgradeDragonHeight: 4154640\n")])])])]),v._v(" "),t("li",[t("p",[v._v("升级后需检查是否正常同步区块")])]),v._v(" "),t("li",[t("p",[v._v("检查主网 v14 actors code，确保与下面输出一样")]),v._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[v._v(" ./venus state actor-cids --network-version 23\n\n # 顺序可能会不一样\n Network Version: 23\n Actor Version: 14\n Manifest CID: bafy2bzacecbueuzsropvqawsri27owo7isa5gp2qtluhrfsto2qg7wpgxnkba\n Actor             CID\n account           bafk2bzacebr7ik7lng7vysm754mu5x7sakphwm4soqi6zwbox4ukpd6ndwvqy\n cron              bafk2bzacecwn6eiwa7ysimmk6i57i5whj4cqzwijx3xdlxwb5canmweaez6xc\n datacap           bafk2bzacecidw7ajvtjhmygqs2yxhmuybyvtwp25dxpblvdxxo7u4gqfzirjg\n eam               bafk2bzaced2cxnfwngpcubg63h7zk4y5hjwwuhfjxrh43xozax2u6u2woweju\n ethaccount        bafk2bzacechu4u7asol5mpcsr6fo6jeaeltvayj5bllupyiux7tcynsxby7ko\n evm               bafk2bzacedupohbgwrcw5ztbbsvrpqyybnokr4ylegmk7hrbt3ueeykua6zxw\n init              bafk2bzacecbbcshenkb6z2v4irsudv7tyklfgphhizhghix6ke5gpl4r5f2b6\n multisig          bafk2bzaceajcmsngu3f2chk2y7nanlen5xlftzatytzm6hxwiiw5i5nz36bfc\n paymentchannel    bafk2bzaceavslp27u3f4zwjq45rlg6assj6cqod7r5f6wfwkptlpi6j4qkmne\n placeholder       bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro\n reward            bafk2bzacedvfnjittwrkhoar6n5xrykowg2e6rpur4poh2m572f7m7evyx4lc\n storagemarket     bafk2bzaceaju5wobednmornvdqcyi6khkvdttkru4dqduqicrdmohlwfddwhg\n storageminer      bafk2bzacea3f43rxzemmakjpktq2ukayngean3oo2de5cdxlg2wsyn53wmepc\n storagepower      bafk2bzacedo6scxizooytn53wjwg2ooiawnj4fsoylcadnp7mhgzluuckjl42\n system            bafk2bzacecak4ow7tmauku42s3u2yydonk4hx6ov6ov542hy7lcbji3nhrrhs\n verifiedregistry  bafk2bzacebvyzjzmvmjvpypphqsumpy6rzxuugnehgum7grc6sv3yqxzrshb4\n")])])])]),v._v(" "),t("li",[t("p",[v._v("若不排查问题，rust日志级别"),t("strong",[v._v("不建议")]),v._v("设置为 "),t("code",[v._v("trace")]),v._v("，因为会打印较多日志")])]),v._v(" "),t("li",[t("p",[v._v("升级后可以通过命令来 "),t("code",[v._v("./venus state get-actor t01000")]),v._v(" 来确认是否升级成功")])]),v._v(" "),t("li",[t("p",[v._v("actor 迁移")]),v._v(" "),t("p",[t("strong",[v._v("经测试本次预迁移时间在1分钟左右，正式迁移时间在50秒左右")])]),v._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[v._v("预迁移高度是升级高度前 120 个高度：\npre-migration  开始：STARTING pre-migration  结束：COMPLETED pre-migration\nmigration      开始：STARTING migration      结束：COMPLETED migration\n")])])])]),v._v(" "),t("li",[t("p",[v._v("如果 "),t("code",[v._v("~/.venus")]),v._v(" 存在且需要导入快照，需要先删除 "),t("code",[v._v("~/.venus/version")]),v._v(" 文件再导入快照")]),v._v(" "),t("ul",[t("li",[v._v("主网: "),t("code",[v._v("./venus daemon --import-snapshot snapshot.car")])]),v._v(" "),t("li",[v._v("calibnet: "),t("code",[v._v("./venus daemon --import-snapshot snapshot.car --network calibrationnet")])])])])]),v._v(" "),t("h3",{attrs:{id:"sophon-gateway"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sophon-gateway"}},[v._v("#")]),v._v(" sophon-gateway")]),v._v(" "),t("p",[v._v("影响功能：无")]),v._v(" "),t("p",[v._v("依赖升级组件: sophon-auth")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("ul",[t("li",[v._v("编译时,需要先 "),t("code",[v._v("make dist-clean")]),v._v(" 再 "),t("code",[v._v("make")])])]),v._v(" "),t("h3",{attrs:{id:"sophon-messager"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sophon-messager"}},[v._v("#")]),v._v(" sophon-messager")]),v._v(" "),t("p",[v._v("影响功能：")]),v._v(" "),t("p",[v._v("依赖升级组件: venus, sophon-auth, soohon-gateway")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("ul",[t("li",[v._v("升级之后需要观察能否正常接收消息, 消息能否正常上链")])]),v._v(" "),t("h3",{attrs:{id:"sophon-miner"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#sophon-miner"}},[v._v("#")]),v._v(" sophon-miner")]),v._v(" "),t("p",[v._v("影响功能：")]),v._v(" "),t("p",[v._v("依赖升级组件：auth, venus, gateway")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("h3",{attrs:{id:"droplet"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#droplet"}},[v._v("#")]),v._v(" droplet")]),v._v(" "),t("p",[v._v("影响功能：")]),v._v(" "),t("ul",[t("li",[v._v("支持 direct data onboarding，使用文档：https://github.com/ipfs-force-community/droplet/blob/master/docs/zh/direct-on-boarding.md")])]),v._v(" "),t("p",[v._v("依赖升级组件: auth, venus, gateway, messager")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("ul",[t("li",[v._v("升级后能否正常发单和检索")])]),v._v(" "),t("h3",{attrs:{id:"venus-wallet"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-wallet"}},[v._v("#")]),v._v(" venus-wallet")]),v._v(" "),t("p",[v._v("影响功能： 无")]),v._v(" "),t("p",[v._v("依赖升级组件: gateway")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("ul",[t("li",[v._v("升级后观察是否正常签名，消息能否正常上链")])]),v._v(" "),t("h3",{attrs:{id:"damocles-manager"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#damocles-manager"}},[v._v("#")]),v._v(" damocles-manager")]),v._v(" "),t("p",[v._v("依赖升级组件: 链服务组件")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("ul",[t("li",[v._v("编译时,需要先 "),t("code",[v._v("make dist-clean")]),v._v(" 再 "),t("code",[v._v("make")])])]),v._v(" "),t("h3",{attrs:{id:"damocles-worker"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#damocles-worker"}},[v._v("#")]),v._v(" damocles-worker")]),v._v(" "),t("p",[v._v("依赖升级组件: damocles-manager")]),v._v(" "),t("p",[v._v("注意事项：")]),v._v(" "),t("hr"),v._v(" "),t("p",[v._v("更新结果验证步骤:")]),v._v(" "),t("ol",[t("li",[v._v("程序启动正常")]),v._v(" "),t("li",[v._v("pre/pro消息正常上链")]),v._v(" "),t("li",[v._v("出块正常")]),v._v(" "),t("li",[v._v("WD上链正常")]),v._v(" "),t("li",[v._v("算力增长正常")]),v._v(" "),t("li",[v._v("真实订单检索正常")]),v._v(" "),t("li",[v._v("数据库各种gas，生命周期，聚合设置正常")])]),v._v(" "),t("h3",{attrs:{id:"数据库变更"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#数据库变更"}},[v._v("#")]),v._v(" 数据库变更")]),v._v(" "),t("p",[v._v("无")])])}),[],!1,null,null,null);a.default=_.exports}}]);