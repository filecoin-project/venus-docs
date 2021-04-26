(window.webpackJsonp=window.webpackJsonp||[]).push([[17],{380:function(s,a,e){"use strict";e.r(a);var t=e(25),r=Object(t.a)({},(function(){var s=this,a=s.$createElement,e=s._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("h1",{attrs:{id:"how-to-use-venus-messager"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#how-to-use-venus-messager"}},[s._v("#")]),s._v(" How to use venus messager")]),s._v(" "),e("p",[s._v("messager is a component used to manage local messages, with the purpose of saving address messages, managing message status, and controlling the frequency of push messages.")]),s._v(" "),e("p",[s._v("[TOC]")]),s._v(" "),e("h2",{attrs:{id:"getting-start"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#getting-start"}},[s._v("#")]),s._v(" Getting start")]),s._v(" "),e("h3",{attrs:{id:"clone-this-git-repository-to-your-machine"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#clone-this-git-repository-to-your-machine"}},[s._v("#")]),s._v(" Clone this git repository to your machine")]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git clone git@github.com:ipfs-force-community/venus-messager.git\n")])])]),e("h3",{attrs:{id:"install-dependencies"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#install-dependencies"}},[s._v("#")]),s._v(" Install Dependencies")]),s._v(" "),e("ol",[e("li",[s._v("First, load all the Git submodules.")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("git submodule update --init --recursive\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("Initialize build dependencies.")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("make deps\n")])])]),e("h3",{attrs:{id:"build-and-run-tests"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#build-and-run-tests"}},[s._v("#")]),s._v(" Build and run tests")]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("# First, build the binary\nmake\n\n# Then, run the tests.\nmake test\n")])])]),e("h3",{attrs:{id:"start-messager"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#start-messager"}},[s._v("#")]),s._v(" Start messager")]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('# --config | -c        specify config file (default: "./messager.toml")\n# --auth-url           url for auth server (default: "http://127.0.0.1:8989")\n# --node-url           url for connection lotus/venus\n# --node-token         token auth for lotus/venus\n# --db-type            which db to use. sqlite/mysql (default: "sqlite")\n# --sqlite-path        sqlite db path (default: "./message.db")\n# --mysql-dsn          mysql connection string\n\n# use sqlite db\n./venus-messager run --config <config path> --auth-url <auth url> --node-url <node url> --node-token <node token> --db-type sqlite --sqlite-path <sqlite path>\n# use mysql db\n./venus-messager run --config <config path> --auth-url <auth url> --node-url <node url> --node-token <node token> --db-type mysql --mysql-dsn <mysql dsn>\n')])])]),e("h2",{attrs:{id:"commands"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#commands"}},[s._v("#")]),s._v(" Commands")]),s._v(" "),e("h3",{attrs:{id:"message-commands"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#message-commands"}},[s._v("#")]),s._v(" Message commands")]),s._v(" "),e("ol",[e("li",[s._v("search message")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg search --id=<message id>\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("list message")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg list\n# list messages with the same address\n./venus-messager msg list --from <address>\n")])])]),e("ol",{attrs:{start:"3"}},[e("li",[s._v("manual update one filled message state")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg update_filled_msg --id=<message id>\n")])])]),e("ol",{attrs:{start:"4"}},[e("li",[s._v("manual update all filled message state")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg update_all_filled_msg\n")])])]),e("ol",{attrs:{start:"5"}},[e("li",[s._v("wait a messager msg id for result")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg wait <message id>\n")])])]),e("ol",{attrs:{start:"6"}},[e("li",[s._v("republish a message by id")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg republish <message id>\n")])])]),e("ol",{attrs:{start:"7"}},[e("li",[s._v("replace a message")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <message-id>\n# or\n./venus-messager msg replace --gas-feecap=[gas-feecap] --gas-premium=[gas-premium] --gas-limit=[gas-limit] --auto=[auto] --max-fee=[max-fee] <from> <nonce>\n")])])]),e("ol",{attrs:{start:"8"}},[e("li",[s._v("list failed messages, maybe signed message failed or gas estimate failed")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg list-fail\n")])])]),e("ol",{attrs:{start:"9"}},[e("li",[s._v("lists message that have not been chained for a period of time")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg list-blocked\n")])])]),e("ol",{attrs:{start:"10"}},[e("li",[s._v("manual mark error messages")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager msg mark-bad <message id>\n")])])]),e("h3",{attrs:{id:"address-commands"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#address-commands"}},[s._v("#")]),s._v(" Address commands")]),s._v(" "),e("ol",[e("li",[s._v("search address")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager address search <address>\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("list address")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager address list\n")])])]),e("ol",{attrs:{start:"3"}},[e("li",[s._v("update address nonce")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager address update_nonce --nonce=5 <address>\n")])])]),e("ol",{attrs:{start:"4"}},[e("li",[s._v("forbidden address")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager address forbidden <address>\n")])])]),e("ol",{attrs:{start:"5"}},[e("li",[s._v("activate a frozen address")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager address active <address>\n")])])]),e("ol",{attrs:{start:"6"}},[e("li",[s._v("set the number of address selection messages")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager address set_sel_msg_num --num=5 <address>\n")])])]),e("h3",{attrs:{id:"wallet-commands"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#wallet-commands"}},[s._v("#")]),s._v(" Wallet commands")]),s._v(" "),e("ol",[e("li",[s._v("search wallet by name")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager wallet search <wallet-name>\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("add wallet")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager wallet add --name=<wallet-name> --url=<wallet-url> --token=<wallet-token>\n")])])]),e("ol",{attrs:{start:"3"}},[e("li",[s._v("list wallet")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager wallet list\n")])])]),e("ol",{attrs:{start:"4"}},[e("li",[s._v("list remote wallet address")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager wallet list-addr --uuid=<wallet-id>\n# or\n./venus-messager wallet list-addr --name=<wallet-name>\n")])])]),e("ol",{attrs:{start:"5"}},[e("li",[s._v("delete wallet by name")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager wallet del <name>\n")])])]),e("h3",{attrs:{id:"shared-params-commands"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#shared-params-commands"}},[s._v("#")]),s._v(" shared params commands")]),s._v(" "),e("ol",[e("li",[s._v("get shared params")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager share-params get\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("set shared params")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v('# expireEpoch is the expiration height of the message, 0 means it will not expire\n# selMsgNum is the maximum number of messages pushed to mpool by a single address at a time\n# scanInterval is the interval to scan the remote wallet\n# maxEstFailNumOfMsg is the number of failures allowed to estimate gas consumption\n\n./venus-messager share-params set "{\\"expireEpoch\\": 0, \\"gasOverEstimation\\": 1.25, \\"maxFee\\": 7000000000000000, \\"maxFeeCap\\": 0, \\"selMsgNum\\": 20, \\"scanInterval\\": 10, \\"maxEstFailNumOfMsg\\": 50}"\n')])])]),e("ol",{attrs:{start:"3"}},[e("li",[s._v("manual refresh shared params from DB")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager share-params refresh\n")])])]),e("h3",{attrs:{id:"node-commands"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#node-commands"}},[s._v("#")]),s._v(" node commands")]),s._v(" "),e("ol",[e("li",[s._v("search node info by name")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager node search <name>\n")])])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("add node info")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager node add --name=<node-name> --url=<node-url> --token=<node-token>\n")])])]),e("ol",{attrs:{start:"3"}},[e("li",[s._v("list node info")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager node list\n")])])]),e("ol",{attrs:{start:"4"}},[e("li",[s._v("del node info by name")])]),s._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[s._v("./venus-messager node del <name>\n")])])])])}),[],!1,null,null,null);a.default=r.exports}}]);