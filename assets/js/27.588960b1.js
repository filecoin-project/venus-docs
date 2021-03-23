(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{385:function(s,t,a){"use strict";a.r(t);var e=a(45),n=Object(e.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"如何运行文档项目"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#如何运行文档项目"}},[s._v("#")]),s._v(" 如何运行文档项目")]),s._v(" "),a("h2",{attrs:{id:"依赖"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#依赖"}},[s._v("#")]),s._v(" 依赖")]),s._v(" "),a("p",[s._v("运行docs项目需要安装 "),a("em",[a("strong",[s._v("node")])]),s._v(" 和 "),a("em",[a("strong",[s._v("yarn")])])]),s._v(" "),a("p",[s._v("安装node:"),a("a",{attrs:{href:""}},[s._v("https://nodejs.org/en/download/")])]),s._v(" "),a("p",[s._v("安装yarn:"),a("a",{attrs:{href:""}},[s._v("https://yarn.bootcss.com/docs/install/#mac-stable")])]),s._v(" "),a("h2",{attrs:{id:"拉取项目"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#拉取项目"}},[s._v("#")]),s._v(" 拉取项目")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("git")]),s._v(" clone git@github.com:filecoin-project/venus-docs.git\n    "),a("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" venus-docs\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v("   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#安装依赖")]),s._v("\n")])])]),a("h2",{attrs:{id:"本地运行"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#本地运行"}},[s._v("#")]),s._v(" 本地运行")]),s._v(" "),a("p",[s._v("运行命令：")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" docs:dev \n")])])]),a("p",[s._v("英文文档直接在master下更改，中文在zh文件夹下面更改，请确保文件夹结构完全相同。在文档上做的修改能够实时的反映在网站上，不需要重新运行命令。\n增加文档需要修改 "),a("em",[a("strong",[s._v("./docs/.vuepress/config.js")])]),s._v(" 文件，并在sidebar下的children增加一行新的记录。")]),s._v(" "),a("h2",{attrs:{id:"编译与部署"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#编译与部署"}},[s._v("#")]),s._v(" 编译与部署")]),s._v(" "),a("div",{staticClass:"language-sh extra-class"},[a("pre",{pre:!0,attrs:{class:"language-sh"}},[a("code",[s._v("    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" docs:links   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# verify all links are well-formed")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("yarn")]),s._v(" docs:build   "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# generate html pages")]),s._v("\n")])])]),a("p",[s._v("build完成后结果输入到 "),a("em",[a("strong",[s._v("./docs/.vuepress/dist")])]),s._v(" 目录里面，将本目录覆盖 "),a("em",[a("strong",[s._v("gh-page")])]),s._v(" 分支即可部署项目文档。")])])}),[],!1,null,null,null);t.default=n.exports}}]);