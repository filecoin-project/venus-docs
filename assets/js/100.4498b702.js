(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{478:function(s,t,a){"use strict";a.r(t);var e=a(17),r=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h2",{attrs:{id:"准备"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#准备"}},[s._v("#")]),s._v(" 准备")]),s._v(" "),a("p",[s._v("所需组件构建完成,可参考 "),a("RouterLink",{attrs:{to:"/zh/modules/build.html"}},[s._v("组件构建")])],1),s._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[s._v("注意")]),s._v(" "),a("p",[s._v("建议您在部署到主网上之前在"),a("code",[s._v("calibration")]),s._v("网络中测试您的配置。")])]),s._v(" "),a("h3",{attrs:{id:"软件依赖"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#软件依赖"}},[s._v("#")]),s._v(" 软件依赖")]),s._v(" "),a("p",[s._v("在运行"),a("code",[s._v("Venus")]),s._v("之前，您需要安装"),a("a",{attrs:{href:"https://lotus.filecoin.io/lotus/install/linux/#software-dependencies",target:"_blank",rel:"noopener noreferrer"}},[s._v("这些"),a("OutboundLink")],1),s._v("软件。（注：和lotus的软件依赖相同）")]),s._v(" "),a("h2",{attrs:{id:"安装venus-auth"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装venus-auth"}},[s._v("#")]),s._v(" 安装venus-auth")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("nohup")]),s._v(" ./venus-auth run "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" auth.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("&1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[a("code",[s._v("venus-auth")]),s._v(" 的默认配置文件位于"),a("code",[s._v("~/.venus-auth/config.toml")])])]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("Logs")]),s._v(" "),a("p",[s._v("日志默认打印到控制台。 通过配置可以支持InfluxDB。")])]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("port")]),s._v(" "),a("p",[a("code",[s._v("venus-auth")]),s._v("默认端口为8989，下面其他组件使用参数--auth-url，填写的相关参数就是这个端口号与相应ip。")])]),s._v(" "),a("h3",{attrs:{id:"查看配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#查看配置"}},[s._v("#")]),s._v(" 查看配置")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("head")]),s._v("  ~/.venus-auth/config.toml\nPort "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"8989"')]),s._v("\n")])])]),a("h3",{attrs:{id:"使用mysql-可选"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#使用mysql-可选"}},[s._v("#")]),s._v(" 使用MySQL (可选)")]),s._v(" "),a("p",[s._v("支持MySQL 5.7及以上版本，可替代默认的"),a("code",[s._v("Badger")]),s._v("键值数据库。要使用 MySQL 数据库，请修改配置中的 "),a("code",[s._v("db")]),s._v("部分。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("vim")]),s._v(" ~/.venus-auth/config.toml\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Data source configuration item")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("db"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# support: badger (default), mysql ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# the mysql DDL is in the script package ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"mysql"')]),s._v(" \n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# The following parameters apply to MySQL")]),s._v("\nDSN "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_auth?parseTime=true&loc=Local&charset=utf8mb4&collation=utf8mb4_unicode_ci&readTimeout=10s&writeTimeout=10s"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# conns 1500 concurrent")]),s._v("\nmaxOpenConns "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("64")]),s._v("\nmaxIdleConns "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("128")]),s._v("\nmaxLifeTime "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"120s"')]),s._v("\nmaxIdleTime "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"30s"')]),s._v("\n")])])]),a("p",[s._v("重启"),a("code",[s._v("venus-auth")]),s._v("使配置生效。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v(" -ef "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" auth\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("kill")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_AUTH_PID"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("nohup")]),s._v(" ./venus-auth run "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" auth.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("&1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("\n")])])]),a("h3",{attrs:{id:"user及token生成"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#user及token生成"}},[s._v("#")]),s._v(" user及token生成")]),s._v(" "),a("p",[a("code",[s._v("venus-auth")]),s._v("管理着其他venus模块使用的"),a("a",{attrs:{href:"https://jwt.io/",target:"_blank",rel:"noopener noreferrer"}},[s._v("jwt"),a("OutboundLink")],1),s._v("令牌，以便它们在网络上安全地相互通信。")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[a("code",[s._v("venus")]),s._v("集群中"),a("code",[s._v("token")]),s._v("的理论知识可参考"),a("code",[s._v("venus")]),s._v("集群"),a("code",[s._v("token")]),a("a",{attrs:{href:"https://github.com/filecoin-project/venus/discussions/4880",target:"_blank",rel:"noopener noreferrer"}},[s._v("认证体系"),a("OutboundLink")],1)])]),s._v(" "),a("p",[s._v("为链服务组件生成token。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-auth token gen --perm admin "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED_ADMIN_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("p",[s._v("为独立模块生成令牌。 token可以通过"),a("code",[s._v("<USER>")]),s._v(" 逻辑分组，作为加入矿池的单个矿工。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-auth user "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("USER")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n$ ./venus-auth token gen --perm sign "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("USER")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("USER_WRITE_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n$ ./venus-auth user "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" --name"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),a("span",{pre:!0,attrs:{class:"token environment constant"}},[s._v("USER")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("p",[s._v("给 "),a("code",[s._v("user")]),s._v(" 绑定矿工("),a("code",[s._v("miner")]),s._v("),一个 "),a("code",[s._v("user")]),s._v(" 可以有多个矿工.")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ ./venus-auth user miner add <USER> <MINER_ID>\n\n# 查看user列表\n$ ./venus-auth user list\n")])])]),a("p",[s._v("设置 "),a("code",[s._v("user")]),s._v(" 可用,否则在其他组件请求 "),a("code",[s._v("user")]),s._v(" 列表时请求不到.")]),s._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v("$ ./venus-auth user update --name=<USER> --state=1\n update user success\n")])])]),a("h2",{attrs:{id:"安装venus-gateway"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装venus-gateway"}},[s._v("#")]),s._v(" 安装venus-gateway")]),s._v(" "),a("p",[s._v("下载并编译"),a("code",[s._v("venus-gateway")]),s._v("的源代码。")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone https://github.com/ipfs-force-community/venus-gateway.git\n$ "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" venus-gateway\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" checkout "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("RELEASE_TAG"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v(" deps\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("如果遇到以下编译错误,先执行"),a("code",[s._v("go get github.com/google/flatbuffers@v1.12.1")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("github.com/dgraph-io/badger/v3@v3.2011.1/fb/BlockOffset.go:6:2: missing go.sum entry "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" module providing package github.com/google/flatbuffers/go "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("imported by github.com/dgraph-io/badger/v3/table"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" to add:\n        go get github.com/dgraph-io/badger/v3/table@v3.2011.1\n")])])])]),s._v(" "),a("p",[s._v("启动"),a("code",[s._v("venus-gateway")])]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ ./venus-gateway --listen /ip4/0.0.0.0/tcp/45132 run "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Use either a http or https url")]),s._v("\n--auth-url "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" venus-gateway.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("&1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("\n")])])]),a("h2",{attrs:{id:"安装venus-daemon"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装venus-daemon"}},[s._v("#")]),s._v(" 安装venus daemon")]),s._v(" "),a("p",[s._v("启动"),a("code",[s._v("venus")]),s._v("进程进行链同步。 使用 "),a("code",[s._v("--network")]),s._v(" 来指定"),a("code",[s._v("venus")]),s._v("连接的网络。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("nohup")]),s._v(" ./venus daemon --network"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("cali --auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" venus.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("&1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v(" \n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("使用"),a("code",[s._v("tail -f venus.log")]),s._v(" 或 "),a("code",[s._v("./venus sync status")]),s._v(" 检查同步过程中是否有任何错误。")])]),s._v(" "),a("h3",{attrs:{id:"venus监听远程访问"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus监听远程访问"}},[s._v("#")]),s._v(" venus监听远程访问")]),s._v(" "),a("p",[s._v("默认情况下，"),a("code",[s._v("venus")]),s._v("进程只响应本地访问。更改以下配置以允许从其他地址访问。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token function"}},[s._v("vim")]),s._v(" ~/.venus/config.json\n")])])]),a("p",[s._v("将"),a("code",[s._v("apiAddress")]),s._v("从"),a("code",[s._v("/ip4/127.0.0.1/tcp/3453")]),s._v("更改为"),a("code",[s._v("/ip4/0.0.0.0/tcp/3453")]),s._v("。此修改重启后生效")]),s._v(" "),a("div",{staticClass:"language-json extra-class"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n\t"),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"api"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"apiAddress"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/ip4/0.0.0.0/tcp/3453"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])])]),a("p",[s._v("重启"),a("code",[s._v("Venus daemon")]),s._v("。")]),s._v(" "),a("div",{staticClass:"language-bash extra-class"},[a("pre",{pre:!0,attrs:{class:"language-bash"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("ps")]),s._v(" -ef "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("grep")]),s._v(" venus\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("kill")]),s._v(" -9 "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_PID"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("nohup")]),s._v(" ./venus daemon --network"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("cali --auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" venus.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("&1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("\n")])])]),a("p",[s._v("在其他机器上执行"),a("code",[s._v("telnet")]),s._v(" 验证配置生效:")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("telnet "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("为了链服务能够与链进行交互，"),a("code",[s._v("daemon")]),s._v("需要与网络其他节点同步最新的链。具体如何导入一个链的"),a("code",[s._v("snapshot")]),s._v("进行链同步可参见"),a("RouterLink",{attrs:{to:"/zh/cs/Chain.html"}},[s._v("这个文档")]),s._v("。")],1)]),s._v(" "),a("h2",{attrs:{id:"安装venus-messager"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装venus-messager"}},[s._v("#")]),s._v(" 安装venus-messager")]),s._v(" "),a("p",[s._v("启动"),a("code",[s._v("venus-messager")]),s._v("。请注意，"),a("code",[s._v("--auth-url")]),s._v("、"),a("code",[s._v("--node-url")]),s._v(" 和"),a("code",[s._v("--auth-token")]),s._v(" 是为了让 venus-messager 了解其他"),a("code",[s._v("venus")]),s._v("模块的存在并进行自身的身份验证。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("nohup")]),s._v(" ./venus-messager run "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--node-url /ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_DAEMON_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/3453 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--gateway-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("IP_ADDRESS_OF_VENUS_GATEWAY"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/45132 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-token "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED_ADMIN_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--db-type mysql "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--mysql-dsn "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"<USER>:<PASSWORD>@(127.0.0.1:3306)/venus_messager?parseTime=true&loc=Local&readTimeout=10s&writeTimeout=10s"')]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" msg.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">")]),a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("&1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("如果没有指定与数据库相关的参数，"),a("code",[s._v("venus-messager")]),s._v("将默认使用 "),a("code",[s._v("sqlite3")]),s._v(" 数据库。")])]),s._v(" "),a("h2",{attrs:{id:"安装venus-miner"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装venus-miner"}},[s._v("#")]),s._v(" 安装venus-miner")]),s._v(" "),a("p",[s._v("初始化"),a("code",[s._v("venus-miner")]),s._v("。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-miner init\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# For nettype, choose from mainnet, debug, 2k, calibnet")]),s._v("\n--nettype calibnet "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-api "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--token "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED_ADMIN_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--gateway-api /ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_GATEWAY_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/45132 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--api /ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_DAEMON_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/3453 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--slash-filter "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("local")]),s._v("\n")])])]),a("p",[s._v("启动"),a("code",[s._v("venus-miner")]),s._v("。")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("nohup")]),s._v(" ./venus-miner run "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" miner.log "),a("span",{pre:!0,attrs:{class:"token operator"}},[a("span",{pre:!0,attrs:{class:"token file-descriptor important"}},[s._v("2")]),s._v(">&")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("\n")])])]),a("p",[a("code",[s._v("venus-miner")]),s._v("启动后会从"),a("code",[s._v("venus-auth")]),s._v("请求矿工列表,并对每个矿工执行出块的必要检查,如:钱包服务,WinningPoSt服务是否正常等.检查矿工列表:")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-miner address list \n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n                "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Addr"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"f031429"')]),s._v(",\n                "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Id"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"1f06d7b9-9fb2-497e-80f5-68f06b0a4b5f"')]),s._v(",\n                "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Name"')]),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"200-21"')]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),a("p",[s._v("如果列表中没有在"),a("code",[s._v("venus-auth")]),s._v("中配置的矿工,则需要从"),a("code",[s._v("venus-auth")]),s._v("检查配置是否正确")]),s._v(" "),a("ul",[a("li",[a("code",[s._v("检查venus-miner")]),s._v("初始化配置的"),a("code",[s._v("auth-token")]),s._v("对应的"),a("code",[s._v("user")]),s._v("是激活状态,即"),a("code",[s._v("state=enabled")])])]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-auth user list\nname: ***\nstate: enabled\n")])])]),a("ul",[a("li",[s._v("检查"),a("code",[s._v("venus-miner")]),s._v("初始化配置的"),a("code",[s._v("auth-token")]),s._v("对应的"),a("code",[s._v("user")]),s._v("下成功添加了此矿工.")])]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("./venus-auth user list\nname: ***\nminers: "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("***,***,"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[a("code",[s._v("miners")]),s._v("列表有此矿工为正确.")])]),s._v(" "),a("p",[s._v("修改成功后执行下列命令重新拉取:")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-miner address update\n")])])]),a("p",[s._v("如果想要暂时终止或开始列表中某个矿工的出块,可通过下列命令执行.通常用于某个矿工出问题或集群迁移时使用.")]),s._v(" "),a("div",{staticClass:"language-shell script extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("$ ./venus-miner address start "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("MINER_ID"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n$ ./venus-miner address stop "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("MINER_ID"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("h2",{attrs:{id:"安装venus-market-可选"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#安装venus-market-可选"}},[s._v("#")]),s._v(" 安装venus-market（可选）")]),s._v(" "),a("p",[a("code",[s._v("venus-market")]),s._v("可以作为链服务组件之一来进行部署，具体部署文档请参考"),a("a",{attrs:{href:"/zh/market/using-venus-market-for-master"}},[s._v("文档")])]),s._v(" "),a("h2",{attrs:{id:"下一步"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#下一步"}},[s._v("#")]),s._v(" 下一步")]),s._v(" "),a("p",[s._v("接下来请按照这个"),a("RouterLink",{attrs:{to:"/zh/cs/Using-venus-Shared-Modules.html"}},[s._v("文档")]),s._v("加入到你刚刚部署的链服务吧！")],1),s._v(" "),a("h2",{attrs:{id:"问题"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#问题"}},[s._v("#")]),s._v(" 问题?")]),s._v(" "),a("p",[s._v("来"),a("a",{attrs:{href:"https://filecoinproject.slack.com/archives/C028PCH8L31",target:"_blank",rel:"noopener noreferrer"}},[s._v("Slack"),a("OutboundLink")],1),s._v("上找我们吧！")])])}),[],!1,null,null,null);t.default=r.exports}}]);