(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{421:function(e,t,a){"use strict";a.r(t);var v=a(17),r=Object(v.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"venus-stack-nv22-upgrade-guide"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-stack-nv22-upgrade-guide"}},[e._v("#")]),e._v(" Venus Stack nv22 Upgrade Guide")]),e._v(" "),a("h2",{attrs:{id:"precautions"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#precautions"}},[e._v("#")]),e._v(" Precautions")]),e._v(" "),a("ol",[a("li",[e._v("Upgrade all Venus products / components")]),e._v(" "),a("li",[e._v("Use the "),a("code",[e._v("curl")]),e._v(" command to call the "),a("code",[e._v("Version")]),e._v(" interface to check the version number after upgrading. Refer to the guide "),a("a",{attrs:{href:"https://github.com/filecoin-project/venus/issues/5132",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),a("OutboundLink")],1),e._v(" for details.")]),e._v(" "),a("li",[e._v("Check if pre/pro messages are on-chained")]),e._v(" "),a("li",[e._v("Check if windowPost messages are on-chained")]),e._v(" "),a("li",[e._v("Check if block producing is working correctly")]),e._v(" "),a("li",[e._v("Check if the gas fee related settings are in effect")])]),e._v(" "),a("h2",{attrs:{id:"products-components-to-be-upgraded"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#products-components-to-be-upgraded"}},[e._v("#")]),e._v(" Products / Components to be Upgraded")]),e._v(" "),a("table",[a("thead",[a("tr",[a("th",[e._v("Component name")]),e._v(" "),a("th",[e._v("tag")]),e._v(" "),a("th",[e._v("commit")])])]),e._v(" "),a("tbody",[a("tr",[a("td",[e._v("sophon-auth")]),e._v(" "),a("td",[e._v("v1.15.0")]),e._v(" "),a("td",[e._v("a1e964b")])]),e._v(" "),a("tr",[a("td",[e._v("venus")]),e._v(" "),a("td",[e._v("v1.15.1")]),e._v(" "),a("td",[e._v("81c99f3")])]),e._v(" "),a("tr",[a("td",[e._v("sophon-co")]),e._v(" "),a("td",[e._v("v0.8.0")]),e._v(" "),a("td",[e._v("0e48712")])]),e._v(" "),a("tr",[a("td",[e._v("sophon-messager")]),e._v(" "),a("td",[e._v("v1.15.0")]),e._v(" "),a("td",[e._v("1e4f0d5")])]),e._v(" "),a("tr",[a("td",[e._v("soohon-gateway")]),e._v(" "),a("td",[e._v("v1.15.0")]),e._v(" "),a("td",[e._v("541891a")])]),e._v(" "),a("tr",[a("td",[e._v("venus-wallet")]),e._v(" "),a("td",[e._v("v1.15.0")]),e._v(" "),a("td",[e._v("6b3de34")])]),e._v(" "),a("tr",[a("td",[e._v("sophon-miner")]),e._v(" "),a("td",[e._v("v1.15.0")]),e._v(" "),a("td",[e._v("8dd6c68")])]),e._v(" "),a("tr",[a("td",[e._v("droplet")]),e._v(" "),a("td",[e._v("v2.11.0")]),e._v(" "),a("td",[e._v("44481dd")])]),e._v(" "),a("tr",[a("td",[e._v("damocles-manager")]),e._v(" "),a("td",[e._v("v0.10.0-rc1")]),e._v(" "),a("td",[e._v("2f6c5f9")])]),e._v(" "),a("tr",[a("td",[e._v("damocles-worker")]),e._v(" "),a("td",[e._v("v0.10.0-rc1")]),e._v(" "),a("td",[e._v("2f6c5f9")])])])]),e._v(" "),a("h3",{attrs:{id:"upgrade-sequence"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#upgrade-sequence"}},[e._v("#")]),e._v(" Upgrade Sequence")]),e._v(" "),a("ol",[a("li",[e._v("sophon-auth")]),e._v(" "),a("li",[e._v("venus")]),e._v(" "),a("li",[e._v("soohon-co")]),e._v(" "),a("li",[e._v("soohon-gateway")]),e._v(" "),a("li",[e._v("sophon-messager")]),e._v(" "),a("li",[e._v("sophon-miner")]),e._v(" "),a("li",[e._v("droplet")]),e._v(" "),a("li",[e._v("venus-wallet")]),e._v(" "),a("li",[e._v("damocles-manager")]),e._v(" "),a("li",[e._v("damocles-worker")])]),e._v(" "),a("h3",{attrs:{id:"sophon-auth"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sophon-auth"}},[e._v("#")]),e._v(" sophon-auth")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("Aquiring auth services from other components")])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("None")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("ul",[a("li",[e._v("Check if authentication working normally after startup.")])]),e._v(" "),a("h3",{attrs:{id:"venus"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus"}},[e._v("#")]),e._v(" Venus")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("None")])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("sophon-auth")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("p",[e._v("Compile: First "),a("code",[e._v("make dist-clean")]),e._v(" and then "),a("code",[e._v("make")]),e._v(", this can prevent problems caused by failure to upgrade "),a("code",[e._v("filecoin-ffi")]),e._v(" properly.")]),e._v(" "),a("ol",[a("li",[a("p",[e._v("Check if the vk file is complete after upgrading")])]),e._v(" "),a("li",[a("p",[e._v("After the upgrade, execute the command "),a("code",[e._v("./venus state network-info")]),e._v(", and then check whether the UpgradeDragonHeight is normal through the log:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("#cali\nUpgradeDragonHeight: 1427974\n#mainnet\nUpgradeDragonHeight: 3855360\n")])])])]),e._v(" "),a("li",[a("p",[e._v("After the upgrade, you need to check if the blocks are synchronized normally.")])]),e._v(" "),a("li",[a("p",[e._v("Check the mainnet v13 actors code and make sure it is the same as the output below")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("./venus state actor-cids --network-version 22\n\n# The order may be different\nNetwork Version: 22\nActor Version: 13\nManifest CID: bafy2bzacecdhvfmtirtojwhw2tyciu4jkbpsbk5g53oe24br27oy62sn4dc4e\nActor CID\naccount bafk2bzacedxnbtlsqdk76fsfmnhyvsblwyfducerwwtp3mqtx2wbrvs5idl52\ncron bafk2bzacebbopddyn5csb3fsuhh2an4ttd23x6qnwixgohlirj5ahtcudphyc\ndatacap bafk2bzaceah42tfnhd7xnztawgf46gbvc3m2gudoxshlba2ucmmo2vy67t7ci\neam bafk2bzaceb23bhvvcjsth7cn7vp3gbaphrutsaz7v6hkls3ogotzs4bnhm4mk\nethaccount bafk2bzaceautge6zhuy6jbj3uldwoxwhpywuon6z3xfvmdbzpbdribc6zzmei\nevm bafk2bzacedq6v2lyuhgywhlllwmudfj2zufzcauxcsvvd34m2ek5xr55mvh2q\ninit bafk2bzacedr4xacm3fts4vilyeiacjr2hpmwzclyzulbdo24lrfxbtau2wbai\nmultisig bafk2bzacecr5zqarfqak42xqcfeulsxlavcltawsx2fvc7zsjtby6ti4b3wqc\npaymentchannel bafk2bzacebntdhfmyc24e7tm52ggx5tnw4i3hrr3jmllsepv3mibez4hywsa2\nplaceholder bafk2bzacedfvut2myeleyq67fljcrw4kkmn5pb5dpyozovj7jpoez5irnc3ro\nreward bafk2bzacedq4q2kwkruu4xm7rkyygumlbw2yt4nimna2ivea4qarvtkohnuwu\nstoragemarket bafk2bzacebjtoltdviyznpj34hh5qp6u257jnnbjole5rhqfixm7ug3epvrfu\nstorageminer bafk2bzacebf4rrqyk7gcfggggul6nfpzay7f2ordnkwm7z2wcf4mq6r7i77t2\nstoragepower bafk2bzacecjy4dkulvxppg3ocbmeixe2wgg6yxoyjxrm4ko2fm3uhpvfvam6e\nsystem bafk2bzacecyf523quuq2kdjfdvyty446z2ounmamtgtgeqnr3ynlu5cqrlt6e\nverifiedregistry bafk2bzacedkxehp7y7iyukbcje3wbpqcvufisos6exatkanyrbotoecdkrbta\n")])])])]),e._v(" "),a("li",[a("p",[e._v("If you are not troubleshooting the system, it is not recommended to set the rust log level to "),a("code",[e._v("trace")]),e._v(" because more logs will be printed.")])]),e._v(" "),a("li",[a("p",[e._v("After the upgrade, you can use the command "),a("code",[e._v("./venus state get-actor t01000")]),e._v(" to confirm whether the upgrade is successful.")])]),e._v(" "),a("li",[a("p",[e._v("actor migration")]),e._v(" "),a("p",[a("strong",[e._v("After testing, the pre-migration time is about 30 minutes, and the main migration time is about 100 seconds")])]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("The pre-migration height is 120 heights before the upgrade height:\npre-migration start: STARTING pre-migration end: COMPLETED pre-migration\nmigration starts: STARTING migration ends: COMPLETED migration\n")])])])]),e._v(" "),a("li",[a("p",[e._v("If "),a("code",[e._v("~/.venus")]),e._v(" exists and you need to import a snapshot, you need to delete the "),a("code",[e._v("~/.venus/version")]),e._v(" file first and then import the snapshot.")]),e._v(" "),a("ul",[a("li",[e._v("Mainnet: "),a("code",[e._v("./venus daemon --import-snapshot snapshot.car")])]),e._v(" "),a("li",[e._v("calibnet: "),a("code",[e._v("./venus daemon --import-snapshot snapshot.car --network calibrationnet")])])])])]),e._v(" "),a("h3",{attrs:{id:"sophon-gateway"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sophon-gateway"}},[e._v("#")]),e._v(" sophon-gateway")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("None")])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("sophon-auth")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("ul",[a("li",[e._v("When compiling, you need to first "),a("code",[e._v("make dist-clean")]),e._v(" and then "),a("code",[e._v("make")])])]),e._v(" "),a("h3",{attrs:{id:"sophon-messager"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sophon-messager"}},[e._v("#")]),e._v(" sophon-messager")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("None")])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("venus")]),e._v(" "),a("li",[e._v("sophon-auth")]),e._v(" "),a("li",[e._v("sophon-gateway")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("ul",[a("li",[e._v("After the upgrade, you need to observe whether the messages can be received normally and whether the messages can be on-chained normally.")])]),e._v(" "),a("h3",{attrs:{id:"sophon-miner"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#sophon-miner"}},[e._v("#")]),e._v(" sophon-miner")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("None")])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("auth")]),e._v(" "),a("li",[e._v("venus")]),e._v(" "),a("li",[e._v("gateway")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("h3",{attrs:{id:"droplet"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#droplet"}},[e._v("#")]),e._v(" droplet")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("Direct data onboarding support; Documentation "),a("a",{attrs:{href:"https://github.com/ipfs-force-community/droplet/blob/master/docs/zh/direct-on-boarding.md",target:"_blank",rel:"noopener noreferrer"}},[e._v("here"),a("OutboundLink")],1)])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("auth")]),e._v(" "),a("li",[e._v("venus")]),e._v(" "),a("li",[e._v("gateway")]),e._v(" "),a("li",[e._v("messager")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("ul",[a("li",[e._v("Check if deals and retrieval can be issued normally after the upgrade?")])]),e._v(" "),a("h3",{attrs:{id:"venus-wallet"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-wallet"}},[e._v("#")]),e._v(" venus-wallet")]),e._v(" "),a("p",[e._v("Affected functions:")]),e._v(" "),a("ul",[a("li",[e._v("None")])]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("gateway")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("ul",[a("li",[e._v("After the upgrade, observe whether the signing is normal and whether the message can be on-chained normally.")])]),e._v(" "),a("h3",{attrs:{id:"damocles-manager"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#damocles-manager"}},[e._v("#")]),e._v(" damocles-manager")]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("Sophon service")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("ul",[a("li",[e._v("When compiling, you need to first "),a("code",[e._v("make dist-clean")]),e._v(" and then "),a("code",[e._v("make")])])]),e._v(" "),a("h3",{attrs:{id:"damocles-worker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#damocles-worker"}},[e._v("#")]),e._v(" damocles-worker")]),e._v(" "),a("p",[e._v("Upgrade Dependency:")]),e._v(" "),a("ul",[a("li",[e._v("damocles-manager")])]),e._v(" "),a("p",[e._v("Precautions:")]),e._v(" "),a("p",[e._v("Upgrade result verification steps:")]),e._v(" "),a("ol",[a("li",[e._v("Check if the program starts normally")]),e._v(" "),a("li",[e._v("Check if pre / pro messages are uploaded normally")]),e._v(" "),a("li",[e._v("Check if block producing is normal")]),e._v(" "),a("li",[e._v("Check if windowPost is normal")]),e._v(" "),a("li",[e._v("Check if storage power grows normally")]),e._v(" "),a("li",[e._v("Check if verified deal retrieval is normal")]),e._v(" "),a("li",[e._v("Check if various gas, sector life cycle, and aggregation settings in the database are normal.")])]),e._v(" "),a("h3",{attrs:{id:"database-changes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#database-changes"}},[e._v("#")]),e._v(" Database changes")]),e._v(" "),a("ol",[a("li",[e._v("The droplet adds the "),a("code",[e._v("direct_deals")]),e._v(" table to store DDO deals.")])])])}),[],!1,null,null,null);t.default=r.exports}}]);