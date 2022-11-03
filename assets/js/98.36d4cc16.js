(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{475:function(e,s,t){"use strict";t.r(s);var a=t(17),r=Object(a.a)({},(function(){var e=this,s=e.$createElement,t=e._self._c||s;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"快速启用"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#快速启用"}},[e._v("#")]),e._v(" 快速启用")]),e._v(" "),t("h2",{attrs:{id:"准备工作"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#准备工作"}},[e._v("#")]),e._v(" 准备工作")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("安装必要的第三方库。")]),e._v(" "),t("p",[e._v("这一部分可以参考 "),t("code",[e._v("lotus")]),e._v(" 文档中的相应部分 "),t("a",{attrs:{href:"https://lotus.filecoin.io/docs/set-up/install/#building-from-source",target:"_blank",rel:"noopener noreferrer"}},[e._v("building-from-source"),t("OutboundLink")],1),e._v("。")])]),e._v(" "),t("li",[t("p",[e._v("下载代码库")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("git clone https://github.com/ipfs-force-community/venus-cluster.git\n")])])])]),e._v(" "),t("li",[t("p",[e._v("编译 "),t("code",[e._v("venus-cluster")]),e._v(" 的组件")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("cd venus-cluster\nmake all\n")])])]),t("p",[e._v("完成后，在 "),t("code",[e._v("./dist/bin")]),e._v(" 目录下会有 "),t("code",[e._v("venus-worker")]),e._v(" 和 "),t("code",[e._v("venus-sector-manager")]),e._v(" 两个可执行文件。")])]),e._v(" "),t("li",[t("p",[e._v("分发可执行文件到需要的机器上。")])]),e._v(" "),t("li",[t("p",[e._v("将 "),t("code",[e._v("./venus-worker/create-cgroup.sh")]),e._v(" 分发到 "),t("code",[e._v("venus-worker")]),e._v(" 所在的机器上，并以准备运行 "),t("code",[e._v("venus-worker")]),e._v(" 的系统用户身份执行。")]),e._v(" "),t("p",[e._v("这会为这样的用户生成相应的 "),t("code",[e._v("cgroup")]),e._v(" 组，以便"),t("code",[e._v("venus-worker")]),e._v(" 为其外部执行器进程分配硬件资源。")])])]),e._v(" "),t("h2",{attrs:{id:"mock-模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#mock-模式"}},[e._v("#")]),e._v(" Mock 模式")]),e._v(" "),t("p",[e._v("默认情况下，可以通过一系列命令在单机上启动一组 "),t("code",[e._v("mock")]),e._v(" 实例。")]),e._v(" "),t("h3",{attrs:{id:"venus-sector-manager"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-sector-manager"}},[e._v("#")]),e._v(" venus-sector-manager")]),e._v(" "),t("p",[e._v("通过")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("./dist/bin/venus-sector-manager mock --miner=10000 --sector-size=2KiB\n")])])]),t("p",[e._v("命令启动一个模拟为 Actor 为 "),t("code",[e._v("t010000")]),e._v("   的 "),t("code",[e._v("SP")]),e._v(" 分配 2KiB 扇区的 "),t("code",[e._v("venus-sector-manager")]),e._v(" 服务。")]),e._v(" "),t("p",[e._v("这一步骤也可以通过代码目录中的 "),t("code",[e._v("./mock/start_smgr.sh")]),e._v(" 脚本完成。")]),e._v(" "),t("h3",{attrs:{id:"venus-worker"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-worker"}},[e._v("#")]),e._v(" venus-worker")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("创建并初始化本地存储，初始化远程存储")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("./dist/bin/venus-worker store sealing-init -l ./mock-tmp/store1 ./mock-tmp/store2 ./mock-tmp/store3\n./dist/bin/venus-worker store file-init -l ./mock-tmp/remote\n")])])]),t("p",[e._v("这一步骤也可以通过代码目录中的 "),t("code",[e._v("./mock/cleanup_store.sh")]),e._v(" 脚本完成。")])]),e._v(" "),t("li",[t("p",[e._v("以 "),t("code",[e._v("mock")]),e._v(" 配置启动 "),t("code",[e._v("venus-worker")])]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("./dist/bin/venus-worker daemon -c ./venus-worker/assets/venus-worker.mock.toml\n")])])]),t("p",[e._v("这一步骤也可以通过代码目录中的 "),t("code",[e._v("./mock/start_worker.sh")]),e._v(" 脚本完成。")])])]),e._v(" "),t("h2",{attrs:{id:"生产模式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#生产模式"}},[e._v("#")]),e._v(" 生产模式")]),e._v(" "),t("h3",{attrs:{id:"venus-sector-manager-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-sector-manager-2"}},[e._v("#")]),e._v(" venus-sector-manager")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("初始化工作目录")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("./dist/bin/venus-sector-manager daemon init\n")])])])]),e._v(" "),t("li",[t("p",[e._v("按需配置默认配置文件 "),t("code",[e._v("~/.venus-sector-manager/sector-manager.cfg")])]),e._v(" "),t("p",[e._v("配置项、作用、配置方法可以参考文档 "),t("code",[e._v("04.venus-sector-manager的配置解析")]),e._v("。")])]),e._v(" "),t("li",[t("p",[e._v("启动 "),t("code",[e._v("venus-sector-manager")])]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v('./dist/bin/venus-sector-manager --net="cali" daemon run\n')])])]),t("p",[e._v("注意，在主网使用时，"),t("code",[e._v("--net")]),e._v(" 参数可以不设置，或设置为 "),t("code",[e._v("mainnet")])])])]),e._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[e._v("注意")]),e._v(" "),t("p",[e._v("建议参看"),t("RouterLink",{attrs:{to:"/zh/cluster/poster.html"}},[e._v("Poster分离文档")]),e._v("分别将计算"),t("code",[e._v("windowPost")]),e._v("和"),t("code",[e._v("winningPost")]),e._v("的进程启动在各自进程专用的机器上。如果想让"),t("code",[e._v("secotr-manager")]),e._v("运行所有"),t("code",[e._v("Post")]),e._v("计算，可以这样启动"),t("code",[e._v("sector-manager")]),e._v(":")],1),e._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[e._v("$ ./dist/bin/venus-sector-manager daemon run --miner --poster\n")])])])]),e._v(" "),t("h3",{attrs:{id:"venus-worker-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-worker-2"}},[e._v("#")]),e._v(" venus-worker")]),e._v(" "),t("ol",[t("li",[t("p",[e._v("规划用于封装过程中数据的本地存储，并使用")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("./dist/bin/venus-worker store sealing-init -l <dir1> <dir2> <dir3> <...>\n")])])]),t("p",[e._v("命令创建并初始化数据目录。")])]),e._v(" "),t("li",[t("p",[e._v("挂载持久化数据目录，并使用")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("./dist/bin/venus-worker store file-init -l <dir1>\n")])])]),t("p",[e._v("命令初始化数据目录。")])]),e._v(" "),t("li",[t("p",[e._v("规划用于各阶段的CPU核、numa 区域等配置。")]),e._v(" "),t("p",[e._v("按需完成配置文件。")]),e._v(" "),t("p",[e._v("配置项、作用、配置方法可以参考文档 "),t("code",[e._v("03.venus-worker的配置解析")]),e._v("。")])]),e._v(" "),t("li",[t("p",[e._v("使用")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("/path/to/venus-worker daemon -c /path/to/venus-worker.toml\n")])])]),t("p",[e._v("启动 "),t("code",[e._v("venus-worker")]),e._v("。")])])])])}),[],!1,null,null,null);s.default=r.exports}}]);