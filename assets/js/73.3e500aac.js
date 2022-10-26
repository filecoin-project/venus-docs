(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{445:function(e,t,n){"use strict";n.r(t);var s=n(17),a=Object(s.a)({},(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[n("h1",{attrs:{id:"deployment-highly-available-daemon"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#deployment-highly-available-daemon"}},[e._v("#")]),e._v(" Deployment highly available daemon")]),e._v(" "),n("p",[e._v("The main purpose of this solution is to prevent the overall failure of service due to a single node failure. Since the node program may be able to be running, but there is a situation of out of synchronization(daemon still running), it is impossible to automatically select a good node using the nginx service simply. In this solution, a new proxy program is used between nginx and the node program to solve the problem. The proxy program will automatically monitor the height and weight changes in multiple nodes, and only the best node will be selected for each request. Another security feature is that nodes can choose different implementations, so that if something goes wrong with one implementation, nodes with other implementations can also work.")]),e._v(" "),n("p",[n("img",{attrs:{src:"https://raw.githubusercontent.com/hunjixin/imgpool/master/chain-co.png",alt:""}})]),e._v(" "),n("h2",{attrs:{id:"daemon"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#daemon"}},[e._v("#")]),e._v(" daemon")]),e._v(" "),n("p",[e._v("api auth suggest to use venus-auth but not local.  in local mode, when reimport snapshot, token will change.")]),e._v(" "),n("p",[e._v("venus:")]),e._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("#build")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/filecoin-project/venus.git\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("#run")]),e._v("\n./venus daemon --network "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("network-type"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" --auth-url "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("venus-auth url"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n")])])]),n("p",[e._v("lotus:")]),e._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("#build")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/ipfs-force-community/lotus.git\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" checkout v1.11.2_incubation\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("network-type"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("#run")]),e._v("\n./lotus daemon --auth-url "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("venus-auth url"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n")])])]),n("h2",{attrs:{id:"chain-co-agent"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#chain-co-agent"}},[e._v("#")]),e._v(" chain-co agent")]),e._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("#build")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("git")]),e._v(" clone https://github.com/ipfs-force-community/chain-co.git\n"),n("span",{pre:!0,attrs:{class:"token function"}},[e._v("make")]),e._v("\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[e._v("#run")]),e._v("\n./chain-co run -listen "),n("span",{pre:!0,attrs:{class:"token number"}},[e._v("0.0")]),e._v(".0.0:"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("port"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" --auth-url "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("venus-auth url"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" --node "),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("token:libp2p"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v(" --node"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v("<")]),e._v("token:libp2p"),n("span",{pre:!0,attrs:{class:"token operator"}},[e._v(">")]),e._v("\n")])])]),n("h2",{attrs:{id:"proxy-optional"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#proxy-optional"}},[e._v("#")]),e._v(" proxy(optional)")]),e._v(" "),n("p",[e._v("There are many options for the proxy, including load balancing such as nginx, slb, etc., but note that it needs to support websocket and custom http headers. Take nginx as an example here\ninstall nginx： https://www.nginx.com/resources/wiki/start/topics/tutorials/install")]),e._v(" "),n("p",[e._v("nginx config：")]),e._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[e._v("user nginx;\nworker_processes auto;\nerror_log /var/log/nginx/error.log;\npid /run/nginx.pid;\n\nworker_rlimit_nofile 655350;\n# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.\ninclude /usr/share/nginx/modules/*.conf;\n\nevents {\n    worker_connections 655350;\n}\n\nhttp {\n    map $http_upgrade $connection_upgrade {\n        default upgrade;\n        '' close;\n    }\n \n    upstream websocket {\n        server <endpoint>;\n    }\n \n    server {\n        listen 34530;\n      #  listen 34531 ssl; #https\n\n      #  server_name <server name>;       \n\n      #  access_log  /root/proxy.access.log;\n      #  error_log   /root/proxy.error.log;\n\n      #  ssl_certificate  <ssl>;\n      #  ssl_certificate_key <key>;\n         ssl_protocols TLSv1 TLSv1.1 TLSv1.2;\n\n        location / {\n            proxy_pass http://websocket;\n            proxy_set_header Upgrade $http_upgrade;\n            proxy_set_header Connection $connection_upgrade;\n            proxy_set_header Authorization $http_authorization;    #import\n            proxy_set_header X-Real-IP $remote_addr;\n            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \n        }\n   }\n}\n")])])]),n("div",{staticClass:"custom-block warning"},[n("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),n("ol",[n("li",[e._v("Because the data between nodes is still separated, it is impossible to provide completely consistent api, especially in the processing of the top header block. Therefore, when writing a program, it is necessary to take into condisider the possible inconsistencies of different nodes.")]),e._v(" "),n("li",[e._v("If you deploy lotus, you need to use a customized version, because venus has some unique api.")]),e._v(" "),n("li",[e._v("If there is a problem, please make an issue on venus.")])])])])}),[],!1,null,null,null);t.default=a.exports}}]);