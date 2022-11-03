(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{473:function(e,r,t){"use strict";t.r(r);var v=t(17),s=Object(v.a)({},(function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h2",{attrs:{id:"venus-cluster-是什么"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#venus-cluster-是什么"}},[e._v("#")]),e._v(" venus-cluster 是什么?")]),e._v(" "),t("p",[t("code",[e._v("venus-cluster")]),e._v("是"),t("code",[e._v("Venus")]),e._v("研发团队基于大量的运维实践经验，经过不懈的技术攻坚与设计迭代，针对当前Fielcoin参考实现的算力服务进行大幅优化的，次世代集群算力服务方案。其三大特点为配置化，集群化，定制化。"),t("code",[e._v("venus-cluster")]),e._v("的整体介绍，欢迎参见这个"),t("code",[e._v("Venus meetup")]),e._v("的"),t("a",{attrs:{href:"https://youtu.be/Tin9Y0Bk_AE?t=1506",target:"_blank",rel:"noopener noreferrer"}},[e._v("视频"),t("OutboundLink")],1),e._v("来了解更多。")]),e._v(" "),t("h2",{attrs:{id:"功能特性"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#功能特性"}},[e._v("#")]),e._v(" 功能特性")]),e._v(" "),t("h3",{attrs:{id:"重新设计的任务调度"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#重新设计的任务调度"}},[e._v("#")]),e._v(" 重新设计的任务调度")]),e._v(" "),t("p",[t("code",[e._v("venus-cluster")]),e._v("不是简单地对现有Filecoin参考实现的任务调度进行优化，而是打破了所有现有任务调度的格局，从零开始，重新设想了当前理想的任务调度方式。能够做到这样颠覆性的改变，得益于"),t("code",[e._v("venus-cluster")]),e._v("把状态机(state machine)的修改能力从中心化的任务调度"),t("code",[e._v("lotus-miner")]),e._v("/"),t("code",[e._v("venus-sealer")]),e._v("手中下放到了"),t("code",[e._v("venus-worker")]),e._v("上。这样使得"),t("code",[e._v("worker")]),e._v("不是被动的等待被分配任务而是主动去领取封装任务。")]),e._v(" "),t("h3",{attrs:{id:"集群横向扩容"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#集群横向扩容"}},[e._v("#")]),e._v(" 集群横向扩容")]),e._v(" "),t("p",[e._v("利用"),t("code",[e._v("venus-cluster")]),e._v("对硬件资源详尽的配置能力，一个存储提供者可以非常便捷的使用一台"),t("code",[e._v("worker")]),e._v("机器上的配置文件，将其运用到另外一台硬件配置相同的"),t("code",[e._v("worker")]),e._v("机器上，并得到与前一台"),t("code",[e._v("worker")]),e._v("机器相同算力产能。这样就可使得集群能够快速横向扩容，降低提高集群产能带来的运维难度以及集群风险。而不是像当前参考实现中，为了扩容牵一发而动全身。")]),e._v(" "),t("h3",{attrs:{id:"post-worker-分离"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#post-worker-分离"}},[e._v("#")]),e._v(" Post worker 分离")]),e._v(" "),t("p",[t("code",[e._v("venus-cluster")]),e._v("支持部署专门运算时空证明的"),t("code",[e._v("worker")]),e._v("机器。这样，"),t("code",[e._v("windowPost")]),e._v("和"),t("code",[e._v("winningPost")]),e._v("就不必为与封装任务抢夺资源，导致算力和出块损失，而担心了。")]),e._v(" "),t("h3",{attrs:{id:"池化-worker-资源"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#池化-worker-资源"}},[e._v("#")]),e._v(" 池化 worker 资源")]),e._v(" "),t("p",[e._v("得益于全新的任务调度模型，使用"),t("code",[e._v("venus-cluster")]),e._v("的算力服务方案可以同时为多个节点服务。只需要通过简单的配置，您的"),t("code",[e._v("worker")]),e._v("算力机便能充分利用其价值，为多个矿工节点号提供算力服务（复制与时空证明服务）。")]),e._v(" "),t("h3",{attrs:{id:"定制化封装任务"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#定制化封装任务"}},[e._v("#")]),e._v(" 定制化封装任务")]),e._v(" "),t("p",[e._v("如果存储提供者有比较强的编程背景，能够针对某个封装阶段进行代码优化。那么存储提供者将无需再维护一个自己优化过的Filecoin参考实现，而是直接将该封装阶段的优化代码封装为一个可执行文件"),t("code",[e._v("bin")]),e._v("，直接配置到"),t("code",[e._v("venus-cluster")]),e._v("中让其运行优化后的代码。")])])}),[],!1,null,null,null);r.default=s.exports}}]);