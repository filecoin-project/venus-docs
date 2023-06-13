(window.webpackJsonp=window.webpackJsonp||[]).push([[76],{450:function(t,s,a){"use strict";a.r(s);var n=a(17),e=Object(n.a)({},(function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[a("h2",{attrs:{id:"venus-tipset-execution-trace-比较工具使用说明"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-tipset-execution-trace-比较工具使用说明"}},[t._v("#")]),t._v(" Venus Tipset Execution trace 比较工具使用说明")]),t._v(" "),a("p",[t._v("execution-trace 比较工具是用于当 venus 链同步发生共识错误导致同步异常时，\n用于快速定位不一致的消息及其执行细节，帮助精准定位问题。")]),t._v(" "),a("h3",{attrs:{id:"原理"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),a("p",[t._v("此工具通过 API 接口在 lotus 和 venus 上执行整个 tipset 中的消息，并获取所有的 execution-trace 进行比较，\n通常共识错误发生时，execution-traced 的细节也是不一致的。")]),t._v(" "),a("h3",{attrs:{id:"操作步骤"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#操作步骤"}},[t._v("#")]),t._v(" 操作步骤：")]),t._v(" "),a("h4",{attrs:{id:"编译-lotus-并启动"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#编译-lotus-并启动"}},[t._v("#")]),t._v(" 编译 lotus，并启动")]),t._v(" "),a("p",[t._v("在原力区维护的 lotus, v1.12.0/incubation 分支上，支持了相关接口，\n编译时添加"),a("code",[t._v("ENABLE_GAS_TARCE=1")])]),t._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/ipfs-force-community/lotus.git \n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" checkout -b v1.12.0/incubation oriign/v1.12.0/incubation\n"),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("make")]),t._v(" lotus "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[t._v("ENABLE_GAS_TRACE")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v("\n")])])]),a("h4",{attrs:{id:"获取-execution-trace-分析工具"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#获取-execution-trace-分析工具"}},[t._v("#")]),t._v(" 获取 execution-trace 分析工具")]),t._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[t._v("git")]),t._v(" clone https://github.com/zl03jsj/filecoin-head-comparer.git\n")])])]),a("h4",{attrs:{id:"配置-execution-trace-分析工具"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#配置-execution-trace-分析工具"}},[t._v("#")]),t._v(" 配置 execution-trace 分析工具")]),t._v(" "),a("p",[t._v("在项目的跟目录下打开配置文件"),a("code",[t._v("./cfg_exec_trace.json")]),t._v("\n编辑配置 venus 和 lotus 的节点信息：")]),t._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"lotus"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"url"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"http://192.168.200.21:1234/rpc/v0"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"token"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('""')]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"venus"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"url"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"http://192.168.1.125:3453/rpc/v0"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token property"}},[t._v('"token"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.oLkKAMWEiUA6oK-stwd3Spiwrx9TlGOuVFgrgn7JPwU"')]),t._v("\n  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),a("h4",{attrs:{id:"启动-execution-trace-工具开始问题检测"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#启动-execution-trace-工具开始问题检测"}},[t._v("#")]),t._v(" 启动 execution-trace 工具开始问题检测")]),t._v(" "),a("p",[t._v("由于共识问题，导致链同步时问题时，通过日志，很容易就可以定位有问题的 tipset epoch,\n在根目录执行命令，在参数中指定高度，就可以对指定的 tipset 进行分析比较了。")]),t._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[t._v("python3 ./exec_trace_cmp.py "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1288233")]),t._v("\nvenus url:http://192.168.1.125:3453/rpc/v0\nlotus url:http://192.168.200.21:1234/rpc/v0\n\n    Venus and lotus got the same state root"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacebhpihnow4fwuebtxenpl27kvl4k7aeozlsruwcdj3berrposkfgs"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" after apply tipset"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1288233")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n\n    start compile tipset"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1288233")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" traces\n    venus total message count"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("contain implicit"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("481")]),t._v("\n    lotus total message count"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("contain implicit"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("481")]),t._v("\n    \nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacebo67zpnnaqb4jzz3peflh6mu3hczu7isd4yxkymvlao5li6lrqwi"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceaijdjyg263zawvczt3alkciu2ptrzv3pftu434gvxjujqmam2nxe execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceavrkj7coojud5amhn2ukrhrkntaxk6r7esnilldbjocia7ut7jzw"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacedus5agquqptf3o3yy3cylg7j2jb2sil24clvtyff4vcoedzxdaha execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceaadqo5lv75q7qvsbgx3prm5oh7nqfz6volerwleyt65jizhcyxqa"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacebkdqv25av4bjabifpe2vye74j73ou62le3hztyx33pxy254cul5u execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("3")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacebrmjo2ahojpjj5rvdd6fxqvtgntoovvb722o25dmwmlub4u6icdw"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacebzez4rvo4yteqjtsdmwmaqpz7vadepdoikbaqcvnzqnhkuhkzt5y execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("4")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceapwk7p5c7gy35buhy6mqs42rv36kxvczca3siwl6h2evufsld5b6"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceahpmfeq46nagmbzpvjnabrsem2zjrvcy77cxldaf43aniclduqik execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("5")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacecdl2zt4bd4nwhxnehlqejtlikvqwztnk3leil54dsmnx6koz42zu"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacec7uk7o6rbnxdwyluvlm3fsposlvangkqdaj5fargbwlbwws4ezuo execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("6")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceakhot2tzgn4zt3nr6aokq2brcity2eh2d67gc2iqrpswlgch5ng6"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacea3n7ku4epbmqq2ecebmgifpb26etb2hrww4ryqmhiumzwpsvf7es execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("7")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacecc5zqh2fm55hno66f56pqji5245huk45xqpxzt7b5hz63o7nh622"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceb223qjyqk53zic5th7npzik3redyvy723egt47dsgwlshmaksqr6 execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("8")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacedoohork3gnnzfvv5kme3gqfxrygw4otcwh5lklfbdz3mxy2evinq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacea6ks7weiqy65m6m426dvihljvapmbts6cdlu6ytirrpveupvoj2y execution-traces: ok\nidx:  "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("9")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacecivu4pfhvvdiwfk23ntidy2aein2y646uzrt4hotve46mejtgjsa"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceaqjbks2bjmdal6tu7yoxrecygrcn2s2pmwxwkukzj23p5lsjms2s execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("10")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacecn6mfxfspglrrwu26uvj3fcirbz2femaeyv7f63vh7ochrwt76ay"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacec5rnu4a6xunucqpvks5eujn5t3cywpqwieoirex25mgycucbesky execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("11")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacebvxwcnorwmplriluvus6jjvqvfcknkn44lzf37ptbe5oeiwpt3vu"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceaobqsuortebd4nujtqinnwnc7dgs44majmnnkdtt4dqow3wyxah2 execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("12")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacear7yqpsjwvz5cofocunlyesh3q43ppvqgcs5pcnbsjmxqd4gbmtm"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacecxjuehhuu2hadecr4avab4qwyy5nenyilbftuuppdoxmohj7emjs execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("13")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacedqliipes5nh74aeyy3wbn4md6t33kkgqx7m2ukke7qvajp2lrbkw"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceb37mvzapylc67d3vtz5fcbusziz2bofdicwny6zehonlkd3zwhus execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("14")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceas2brzrd3qhto26hfdi7diouff3yzemsvje5yyv66st3vgqzbjcg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacec27fdotcosdnj423naofdqczrykexqblhvu3iey4eptaublp4aeq execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("15")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacebuyl637qzpqzw46jossgq4tef6j7bh62ec237mghrx4yj4ltu6h6"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacec3hijr5nvasludlrpa37muy4o64326tofzii7hop4zxynao3oquc execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("16")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceagr3ucrm3exnpnm62sq6qrpnyjb74u257by2i52axnqjtvsy5t5m"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacecbhtzedpwlpdr7imuv7j47rsbj3vsilibcp5j6ocrtqr4qiekp7s execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("17")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacedqpta5vr5ha4wvezsenbu7qczhctnwndu2yiclgp52ienbk6oljk"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacedblssnkunnlr2zl3rji5457mlgtc2oxunc6q37swqygtopu47eck execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("18")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceduw75wrsj6fdokywn4mm72hzvsfk74i2bu7zjmvmvntmupztsa62"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceapkogzfoym2n4q6mwnjfvkiqp2ff5ueampjxa2o3htjy2sknq4hm execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("19")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzacea4eoihdgbaui4rchhz66pk5ybeeyyv63qtnb3zbednp5p6m7prtq"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacebqhutaiusljv4cgwh235cyvd3mrwbruypz7utk7tmwjf5esxekjq execution-traces: ok\nidx: "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("20")]),t._v(", Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceatyz5v6cxbnb7lw4zrw574aogec4aaeaxy2rwzs3fvr2qnvvoc6g"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceczfrg57g4fhmxugaf53s3h7a3hgqyziv5h6ztq7jdsinuaickr6c execution-traces: ok\n          "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),t._v(".\n")])])]),a("p",[t._v("当执行一致时，会看到下面的输出。")]),t._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[t._v("Venus and lotus got the same state root(bafy2bzacebhpihnow4fwuebtxenpl27kvl4k7aeozlsruwcdj3berrposkfgs) after apply tipset(1288233)\n")])])]),a("p",[t._v("当执行不一致是，会看到如下的输出")]),t._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("..")]),t._v("\nidx:477, Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceclyunwu6ig3pvwurm34vxengjc33igcax3rxmmazo4ypevkcc4xg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacebmfzfvdp7x6fg7yk7i7p7gbvu56afosgbxyju6236b4ytpllv2tg execution-traces: ok\nidx:478, Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("bafy2bzaceaftdrisbrnb2yppgx37dahsp4ko23l47wsfg7g6gczx6czmtdvoa"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzaceaj3jyduelozrbaggwu2v5mokmbds67ouh5s6gdajneqrp6pdbxem execution-traces: ok\n-"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" this is a "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("cron")]),t._v(" message: "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("-\nimplicit message"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("f00 -"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" f03, method "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(", nonce:1288233"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nidx:479, Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bafy2bzacedqbx4tfp7qwpe7oylrwueiye4ipfx6ii7f2p4r5w55thwayci44q'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacea2o5ylrpovsg6f3bvufgolcd6z46kxgfohzp3c27gendhpirug5i execution-traces: ok\n-"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" this is a "),a("span",{pre:!0,attrs:{class:"token function"}},[t._v("cron")]),t._v(" message: "),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v("<")]),t._v("-\n\n    message trace"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("283")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" not equals:\n    message details "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" cid:"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bafy2bzacebka5xwpzelt4cl5pa452k3oi45mbcy7pyrlc3om7sfnul4cz7dcu'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(", from:f00, to:f03, nonce:1288233\n-----"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" lotus_trace:---------------\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Name"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"OnMethodInvocation"')]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"loc"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/theduan/lotus-src/chain/vm/vm.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("333")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/lotus/chain/vm.(*VM).send.func3"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/theduan/lotus-src/chain/vm/vm.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("354")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/lotus/chain/vm.(*VM).send"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/theduan/lotus-src/chain/vm/runtime.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("445")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/lotus/chain/vm.(*Runtime).internalSend"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/theduan/lotus-src/chain/vm/runtime.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("402")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/lotus/chain/vm.(*Runtime).Send"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/go/pkg/mod/github.com/filecoin-project/specs-actors/v6@v6.0.0/actors/builtin/power/power_actor.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("450")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/specs-actors/v6/actors/builtin/power.Actor.processBatchProofVerifies"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/go/pkg/mod/github.com/filecoin-project/specs-actors/v6@v6.0.0/actors/builtin/power/power_actor.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("222")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/specs-actors/v6/actors/builtin/power.Actor.OnEpochTickEnd"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/usr/lib/go/src/reflect/value.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("543")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"reflect.Value.call"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/usr/lib/go/src/reflect/value.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("339")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"reflect.Value.Call"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/theduan/lotus-src/chain/vm/invoker.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("247")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/lotus/chain/vm.(*ActorRegistry).transform.func2.1"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/theduan/lotus-src/chain/vm/runtime.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("171")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/lotus/chain/vm.(*Runtime).shimCall"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"tg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("23856")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"cg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("23856")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"sg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vtg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("23856")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vcg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("23856")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vsg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"tt"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2830")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"ex"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"i"')]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("  \n-----"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" venus_trace:---------------\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Name"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"OnVerifySeal"')]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"loc"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/home/zl/venus-src/pkg/vm/vmcontext/syscalls.go"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("106")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"github.com/filecoin-project/venus/pkg/vm/vmcontext.syscalls.BatchVerifySeals.func1"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v(",\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"File"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"/root/go/src/runtime/asm_amd64.s"')]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Line"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("1371")]),t._v(",\n            "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"Function"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"runtime.goexit"')]),t._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"tg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2000")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"cg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2000")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"sg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vtg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vcg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2000")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"vsg"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v(",\n    "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v('"tt"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),t._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\nimplicit message"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("f00 -"),a("span",{pre:!0,attrs:{class:"token operator"}},[t._v(">")]),t._v(" f03, method "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[t._v("2")]),t._v(", nonce:1288233"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\nidx:480, Compare msg"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'/'")]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[t._v(":")]),t._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[t._v("'bafy2bzacebka5xwpzelt4cl5pa452k3oi45mbcy7pyrlc3om7sfnul4cz7dcu'")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" stateAfterApply: bafy2bzacebhpihnow4fwuebtxenpl27kvl4k7aeozlsruwcdj3berrposkfgs execution-traces: failed\n")])])]),a("p",[t._v("程序会打印出不同的 execution-trace 的消息，以及不匹配的调用堆栈，可以方便快速定位问题。")])])}),[],!1,null,null,null);s.default=e.exports}}]);