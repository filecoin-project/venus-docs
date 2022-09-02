(window.webpackJsonp=window.webpackJsonp||[]).push([[108],{483:function(s,t,a){"use strict";a.r(t);var e=a(17),n=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"venus-docker-使用文档"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-docker-使用文档"}},[s._v("#")]),s._v(" Venus Docker 使用文档")]),s._v(" "),a("h2",{attrs:{id:"快速部署"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#快速部署"}},[s._v("#")]),s._v(" 快速部署")]),s._v(" "),a("h3",{attrs:{id:"docker-compose"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#docker-compose"}},[s._v("#")]),s._v(" docker-compose")]),s._v(" "),a("p",[s._v("可以通过 docker-compose 启动会在当前主机上，部署venus的一套云组件。")]),s._v(" "),a("h4",{attrs:{id:"直接通过命令启动-venus-服务"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#直接通过命令启动-venus-服务"}},[s._v("#")]),s._v(" 直接通过命令启动 Venus 服务")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 下载配置文件")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("wget")]),s._v(" https://raw.githubusercontent.com/filecoin-project/venus-docs/master/script/docker-compose.yaml\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 启动docker集群")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("snapshot")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/path/to/your/snapshot.car "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("nettype")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("nettype"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("proxy")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("socks5"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("https"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("://"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PROXY_IP"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(":"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PROXY_PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("piecestorage")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/path/to/your/PieceStorage "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\ndocker-compose up -d\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 关闭集群")]),s._v("\ndocker-compose down\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("配置文件的首行指定了组件镜像版本的要求，当使用组件镜像版本较低时，建议下载配置文件的历史版本")])]),s._v(" "),a("h4",{attrs:{id:"直接通过变量文件启动-venus-服务"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#直接通过变量文件启动-venus-服务"}},[s._v("#")]),s._v(" 直接通过变量文件启动 Venus 服务")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 下载配置文件(同上)")]),s._v("\n\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 编写环境变量文件 ./env ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("nettype")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("nettype"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("    "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (default:butterfly)")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("piecestorage")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/path/to/your/PieceStorage   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (defaul:./.venus/storage/)")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("proofparameters")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/path/to/your/proof-parameters-files/ "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (default:/var/tmp/filecoin-proof-parameters/)")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("genesisfile")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/path/to/your/genesisfile  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (optional) ")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("snapshot")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/path/to/your/snapshot.car   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (optional)")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("TZ")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("TimeZone"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (optional) your local time zone")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("proxy")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("socks5"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v("https"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("://"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PROXY_IP"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(":"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PROXY_PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# (optional) proxy for venus node")]),s._v("\n\n \n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 启动和关闭集群")]),s._v("\ndocker-compose --env-file ./env up -d\ndocker-compose --env-file ./env down\n")])])]),a("p",[s._v("云环境启动后会需要一定的时间进行初始化，初始化完成后，就可以使用auth 组件签发token （详细见 使用 章节），并将下游组件的连接到本主机即可。（另：集群中使用统一的admin token 会导出在 "),a("code",[s._v("./.venus/env/")]),s._v(" 中）\n为了方便修改配置，默认会将容器中的 repo 映射到本地的 "),a("code",[s._v("./.venus/root/")]),s._v("中，修改完配置之后直接重启容器即可")]),s._v(" "),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("venus 和 market 组件默认监听本地IP，如有需要，请注意修改相应文件")])]),s._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[s._v("注意")]),s._v(" "),a("p",[s._v("在miner初始化完成之后要记得通过auth 绑定到相应的用户，参见"),a("a",{attrs:{href:"https://github.com/filecoin-project/venus-auth/blob/master/docs/zh/%E5%BF%AB%E9%80%9F%E4%B8%8A%E6%89%8B.md#miner-%E7%9B%B8%E5%85%B3",target:"_blank",rel:"noopener noreferrer"}},[s._v("添加矿工"),a("OutboundLink")],1)])]),s._v(" "),a("div",{staticClass:"custom-block warning"},[a("p",{staticClass:"custom-block-title"},[s._v("注意")]),s._v(" "),a("p",[s._v("在miner初始化完成之后,需要将miner关联到merket，参见"),a("a",{attrs:{href:"https://venus.filecoin.io/zh/market/using-venus-market-for-miner.html#%E4%BD%BF%E7%94%A8%E8%87%AA%E5%B7%B1%E7%9A%84venus%E8%8A%82%E7%82%B9",target:"_blank",rel:"noopener noreferrer"}},[s._v("将miner的Multiaddrs和PeerID设置为market的对应地址"),a("OutboundLink")],1),s._v("部分")])]),s._v(" "),a("h3",{attrs:{id:"单组件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#单组件"}},[s._v("#")]),s._v(" 单组件")]),s._v(" "),a("p",[s._v("适用于在不同主机上进行 venus 组件 docker 的部署，")]),s._v(" "),a("h4",{attrs:{id:"venus-auth"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-auth"}},[s._v("#")]),s._v(" Venus Auth")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -d --name venus-auth --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host filvenus/venus-auth run\n")])])]),a("h4",{attrs:{id:"venus"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus"}},[s._v("#")]),s._v(" Venus")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -d --name venus --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host -v /path/to/snapshot.car:/snapshot.car "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--env "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("HTTPS_PROXY")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PROXY_IF_NEED"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\nfilvenus/venus daemon "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--network"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("NETTYPE"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_AUTH_URL"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--import-snapshot /snapshot.car \n")])])]),a("h4",{attrs:{id:"venus-gateway"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-gateway"}},[s._v("#")]),s._v(" Venus Gateway")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -d --name venus-gateway --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host filvenus/venus-gateway "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--listen /ip4/0.0.0.0/tcp/45132 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\nrun --auth-url "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n")])])]),a("h4",{attrs:{id:"venus-messager"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-messager"}},[s._v("#")]),s._v(" Venus Messager")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -d  --name venus-messager  --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host filvenus/venus-messager run "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--node-url /ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_DAEMON_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/3453 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--gateway-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("IP_ADDRESS_OF_VENUS_GATEWAY"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/45132 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-token "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED_ADMIN_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" \n")])])]),a("h4",{attrs:{id:"venus-miner"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-miner"}},[s._v("#")]),s._v(" Venus Miner")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -d  --name venus-miner --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host filvenus/venus-miner init "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--nettype "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("NETTYPE"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-api "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("http://VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--token "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED_ADMIN_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--gateway-api /ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_GATEWAY_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/45132 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--api /ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_DAEMON_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/3453 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--slash-filter "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("local")]),s._v("\n")])])]),a("h4",{attrs:{id:"venus-market"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#venus-market"}},[s._v("#")]),s._v(" Venus Market")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -d --name venus-market --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n-v "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("/path/to/your/PieceStorage"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(":/PieceStorage\nfilvenus/venus-market  pool-run "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--node-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_NODE_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/3453  "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("http://"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_AUTH_IP_ADDRESS:PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--gateway-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_GATEWAY_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/45132 "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--messager-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("/ip4/"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_MESSAGER_IP_ADDRESS"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("/tcp/39812/ "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-token"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("SHARED_ADMIN_AUTH_TOKEN"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\n\n")])])]),a("h2",{attrs:{id:"docker容器的使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#docker容器的使用"}},[s._v("#")]),s._v(" Docker容器的使用")]),s._v(" "),a("h4",{attrs:{id:"基本使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基本使用"}},[s._v("#")]),s._v(" 基本使用")]),s._v(" "),a("p",[s._v("所有组件都可以使用以下通用的命令格式进行调用，组件详细的子命令参见 组件详细文档，以及 --help flag")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker run -it "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("DOCKKER_NAME"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" /"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_COMPONENT_NAME"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("global options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("command")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("command options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),a("h4",{attrs:{id:"举例"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#举例"}},[s._v("#")]),s._v(" 举例")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Auth")]),s._v("\ndocker "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it filvenus/venus-auth ./venus-auth "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("global options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("command")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("command options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Venus")]),s._v("\ndocker "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it filvenus/venus ./venus "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("global options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("command")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("command options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Gateway")]),s._v("\ndocker "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it filvenus/venus-gateway ./venus-gateway "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("global options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("command")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("command options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Messager")]),s._v("\ndocker "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it filvenus/venus-messager ./venus-messager "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("global options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("command")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("command options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# miner")]),s._v("\ndocker run -it filvenus/venus-miner "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("global options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("command")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("command options"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("arguments"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v("."),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n")])])]),a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[s._v("提示")]),s._v(" "),a("p",[s._v("启动容器的方式不同，容器的名字也不一样，可以使用  "),a("code",[s._v("docker container ls")]),s._v(" 来查看容器的名字，也可以在容器启动的时候自己指定容器的名字。")])]),s._v(" "),a("h4",{attrs:{id:"环境调整和配置文件"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#环境调整和配置文件"}},[s._v("#")]),s._v(" 环境调整和配置文件")]),s._v(" "),a("p",[s._v("建议将配置文件映射到本地进行配置文件相关的配置,需要在启动容器的时候建立映射。")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# venus 举例")]),s._v("\ndocker run -d --name filvenus/venus --net"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("host "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n-v /path/to/snapshot.car:/snapshot.car "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n-v /path/to/config.json:/root/.venus/config.json  "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#配置文件映射")]),s._v("\n--env "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("HTTPS_PROXY")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PROXY_IF_NEED"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\ntanlang/venus "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--network"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("NETTYPE"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--auth-url"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("VENUS_AUTH_URL"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("\\")]),s._v("\n--import-snapshot /snapshot.car \n")])])]),a("p",[s._v("如果需要进入容器修改配置文件或者调整组件运行环境的话：")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[s._v("docker "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("exec")]),s._v(" -it filvenus/venus /bin/bash\n")])])]),a("h2",{attrs:{id:"自己开发构建镜像"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#自己开发构建镜像"}},[s._v("#")]),s._v(" 自己开发构建镜像")]),s._v(" "),a("h3",{attrs:{id:"基础镜像的构建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#基础镜像的构建"}},[s._v("#")]),s._v(" 基础镜像的构建")]),s._v(" "),a("p",[s._v("基础环境镜像是构建venus组件容器时，需要用到的前置镜像，如果对于venus组件的构建环境和运行环境没有定制化的要求，建议直接使用官方的基础环境镜像。\n如果需要定制制化构建基础环境镜像，比如添加运维工具之类的，可以从"),a("a",{attrs:{href:"https://github.com/filecoin-project/venus-docs/tree/master/script",target:"_blank",rel:"noopener noreferrer"}},[s._v("venus-docs仓库"),a("OutboundLink")],1),s._v("下载基础镜像的dockerfile文件。然后运行 "),a("code",[s._v("dockers build")]),s._v(" 命令构建相应的基础镜像")]),s._v(" "),a("h4",{attrs:{id:"编译环境的构建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#编译环境的构建"}},[s._v("#")]),s._v(" 编译环境的构建")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 下载dockerfile")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" -O https://raw.githubusercontent.com/filecoin-project/venus-docs/master/script/venus-buildenv.dockerfile\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 构建 运行环境")]),s._v("\ndocker build -t filvenus/venus-buildenv -f ./venus-buildenv.dockerfile "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v("\n")])])]),a("h4",{attrs:{id:"运行环境的构建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#运行环境的构建"}},[s._v("#")]),s._v(" 运行环境的构建")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 下载dockerfile")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("curl")]),s._v(" -O https://raw.githubusercontent.com/filecoin-project/venus-docs/master/script/venus-runtime.dockerfile\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 构建 运行环境")]),s._v("\ndocker build -t filvenus/venus-runtime -f ./venus-runtime.dockerfile "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(".")]),s._v("\n")])])]),a("h3",{attrs:{id:"组件的构建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#组件的构建"}},[s._v("#")]),s._v(" 组件的构建")]),s._v(" "),a("h4",{attrs:{id:"任意组件的构建"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#任意组件的构建"}},[s._v("#")]),s._v(" 任意组件的构建")]),s._v(" "),a("p",[s._v("在构建完基础镜像后，所有组件都可以到相应根目录下，用一个命令来构建")]),s._v(" "),a("div",{staticClass:"language-shell extra-class"},[a("pre",{pre:!0,attrs:{class:"language-shell"}},[a("code",[a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 到对应组件根目录")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v(" docker\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 网络受限需要使用代理时")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("make")]),s._v(" docker "),a("span",{pre:!0,attrs:{class:"token assign-left variable"}},[s._v("BUILD_DOCKER_PROXY")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("socks5 "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" https "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("://"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("IP"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(":"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("PORT"),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v(" \n")])])])])}),[],!1,null,null,null);t.default=n.exports}}]);