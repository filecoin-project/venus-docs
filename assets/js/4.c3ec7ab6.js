(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{329:function(s,t,e){s.exports=e.p+"assets/img/venus-all.aa94540b.jpg"},330:function(s,t,e){s.exports=e.p+"assets/img/venus.478ff1b5.jpg"},331:function(s,t,e){s.exports=e.p+"assets/img/venus-messager.cbcb90bb.jpg"},332:function(s,t,e){s.exports=e.p+"assets/img/venus-gateway.8079b123.jpg"},333:function(s,t,e){s.exports=e.p+"assets/img/filecoin-interface.34d89a97.jpg"},334:function(s,t,e){s.exports=e.p+"assets/img/venus-mesager-gateway-interface.dbe02918.jpg"},503:function(s,t,e){"use strict";e.r(t);var a=e(17),n=Object(a.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"节点日常运维"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#节点日常运维"}},[s._v("#")]),s._v(" 节点日常运维")]),s._v(" "),a("h2",{attrs:{id:"独立组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#独立组件"}},[s._v("#")]),s._v(" 独立组件")]),s._v(" "),a("p",[s._v("Venus系统的独立组件是指venus-sealer & venus-cluster & venus-wallet。venus-sealer是旧版本的算力积累与维持组件，预计在11月之后将不再维护。"),a("strong",[s._v("venus-cluster是新版本的算力积累与维持组件，相比venus-sealer在任务调度和系统资源使用上有很大的提升，将是Venus社区长期维护并推荐使用的组件。")])]),s._v(" "),a("h3",{attrs:{id:"venus-wallet"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-wallet"}},[s._v("#")]),s._v(" venus-wallet")]),s._v(" "),a("ul",[a("li",[s._v("是否成功启动？")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("INFO\tmain\tcmd/rpc.go:73\tstart rpc server at "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("/ip4/0.0.0.0/tcp/5678/http"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(".\nERROR\twallet_event\twallet_event/listenevent.go:236\tWalletSign error password not "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v("\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"api hub"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/dns/gateway.filincubator.com/tcp/83/wss"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\nWARN\twallet_event\twallet_event/listenevent.go:164\tlistenWalletRequestOnce quit\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"api hub"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/dns/gateway.filincubator.com/tcp/83/wss"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\nINFO\twallet_event\twallet_event/listenevent.go:173\trestarting listenWalletRequestOnce\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"api hub"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/dns/gateway.filincubator.com/tcp/83/wss"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\nINFO\twallet_event\twallet_event/listenevent.go:184\t\t"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rand sign byte"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"TCzGneQnvI2N6LqBVf0AHwaEr+NueDnk1aCSo+1G3SA="')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("p",[s._v("日志中显示 "),a("strong",[s._v("WalletSign error password not set")]),s._v("，需要执行"),a("strong",[s._v("venus-wallet setpwd")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# venus-wallet setpwd")]),s._v("\nPassword:********\nEnter Password again:********\nPassword "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("set")]),s._v(" successfully\n")])])]),a("ul",[a("li",[s._v("私钥导入与导出")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# venus-wallet import")]),s._v("\nEnter private key: 7b2254797065223a22626c73222c22626c73222c22507269766174654b6579223a227135\nimported key t3w42mmqem7wfhmqf2ovrssz6qe24ymkfdsafdnkjnjknkjndafsadafn25ztb6e7a successfully"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("!")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# venus-wallet export t3w42mmqem7wfhmqf2ovrssz6qe24ymkfdsafdnkjnjknkjndafsadafn25ztb6e7a")]),s._v("\nPassword:********\n7b2254797065223a22626c73222c22626c73222c22507269766174654b6579223a227135\n")])])]),a("h3",{attrs:{id:"venus-sealer"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-sealer"}},[s._v("#")]),s._v(" venus-sealer")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看存储提供者的proving相关信息")]),s._v("\nvenus-sealer proving info\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看第0个deadline的信息")]),s._v("\nvenus-sealer proving deadline "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看所有deadline的信息")]),s._v("\nvenus-sealer proving deadlines\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 查看所有deadline的信息")]),s._v("\nvenus-sealer proving deadlines\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 检查第0个deadline的扇区证明文件是否存在")]),s._v("\nvenus-sealer  proving check "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),s._v(" \n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 检查证明失败的sector列表")]),s._v("\nvenus-sealer  proving faults\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 只检查第7个deadlines证明失败的sector列表")]),s._v("\nvenus-sealer proving check --only-bad "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("7")]),s._v("\n")])])]),a("h3",{attrs:{id:"venus-cluster"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-cluster"}},[s._v("#")]),s._v(" venus-cluster")]),s._v(" "),a("blockquote",[a("p",[s._v("目前正在测试中，预计在一个月后发布源码以及使用文档。")])]),s._v(" "),a("br"),s._v(" "),a("h2",{attrs:{id:"链服务性能监控"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#链服务性能监控"}},[s._v("#")]),s._v(" 链服务性能监控")]),s._v(" "),a("h3",{attrs:{id:"组件接口调用统计"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#组件接口调用统计"}},[s._v("#")]),s._v(" 组件接口调用统计")]),s._v(" "),a("ul",[a("li",[s._v("全组件")])]),s._v(" "),a("p",[a("img",{attrs:{src:e(329),alt:"venus-all"}})]),s._v(" "),a("p",[s._v("统计特定存储提供者的独立组件请求链服务所有组件所提供接口的次数，起始点后和结束点前的半个小时数据可以忽略。")]),s._v(" "),a("ul",[a("li",[s._v("venus")])]),s._v(" "),a("p",[a("img",{attrs:{src:e(330),alt:"venus"}})]),s._v(" "),a("p",[s._v("独立组件对venus接口的请求占比很大，大部分事件的触发机制都是通过请求venus接口来判断的。")]),s._v(" "),a("ul",[a("li",[s._v("venus-messager")])]),s._v(" "),a("p",[a("img",{attrs:{src:e(331),alt:"venus-messager"}})]),s._v(" "),a("p",[s._v("存储提供者在做算力时需要发送PreCommitSector和ProveCommitSector消息，在完成一个窗口期的windowPoSt时需要发送SubmitWindowedPoSt消息，消息发送需要请求venus-messager接口。因此，当存储提供者正常封装扇区时其请求次数应该维持在一个比较固定的范围内，起始点后和结束点前的半个小时数据可以忽略；")]),s._v(" "),a("ul",[a("li",[s._v("venus-gateway")])]),s._v(" "),a("p",[a("img",{attrs:{src:e(332),alt:"venus-gateway"}})]),s._v(" "),a("p",[s._v("在Venus系统中，venus-cluster/venus-sealer通过venus-gateway提供winningPoSt的证明计算服务，venus-wallet通过venus-gateway提供签名服务。")]),s._v(" "),a("h3",{attrs:{id:"venus-sealer调用接口详细列表"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-sealer调用接口详细列表"}},[s._v("#")]),s._v(" venus-sealer调用接口详细列表")]),s._v(" "),a("p",[a("img",{attrs:{src:e(333),alt:"filecoin-interface"}})]),s._v(" "),a("h3",{attrs:{id:"消息相关接口"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#消息相关接口"}},[s._v("#")]),s._v(" 消息相关接口")]),s._v(" "),a("p",[a("img",{attrs:{src:e(334),alt:"venus-mesager-gateway-interface"}})]),s._v(" "),a("p",[s._v("venus-sealer向链上发送消息和签名消息用到的一些接口，对不同接口的统计可以看到消息发送到链上的频率。")])])}),[],!1,null,null,null);t.default=n.exports}}]);