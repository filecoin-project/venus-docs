module.exports = {
    title: 'Venus Filecoin',
    description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
    base: '/',
    markdown: {
        config: md => {
            md.set({
                linkify: true
            })
            md.use(require('markdown-it-emoji'))
            md.use(require('markdown-it-container'))
            md.use(require('markdown-it-footnote'))
            md.use(require('markdown-it-deflist'))
            md.use(require('markdown-it-task-lists'))
        }
    },
    plugins: [
        'vuepress-plugin-check-md',
        '@vuepress/active-header-links',
        '@vuepress/back-to-top',
        '@vuepress/nprogress',
        '@vuepress/medium-zoom',
        '@vuepress-plugin-zooming',
        ['vuepress-plugin-code-copy', true]
    ],
    head: [
        ['link', {
            rel: 'icon',
            href: '/assets/venus-logo.png'
        }],
        [
            'script',
            {
                async: true,
                src: 'https://www.googletagmanager.com/gtag/js?id=G-SMSDTMGLTV',
            },
        ],
        [
            'script',
            {},
            [
                "window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\ngtag('config', 'G-SMSDTMGLTV');",
            ],
        ],
    ],
    locales: {
        '/': {
            lang: 'en-US',
            title: 'Venus Filecoin',
            description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
        },
        '/zh/': {
            lang: 'zh-CN',
            title: '启明星',
            description: 'GO语言实现的Filecoin分布式存储网络',
        }
    },
    themeConfig: {
        logo: '/assets/venus-logo-title.svg',
        lastUpdated: 'Last Updated',
        // Optional options for generating "Edit this page" link
        // if your docs are in a different repo from your main project:
        docsRepo: 'filecoin-project/venus-docs',
        // if your docs are not at the root of the repo:
        docsDir: 'docs',
        // if your docs are in a specific branch (defaults to 'master'):
        docsBranch: 'master',
        // defaults to false, set to true to enable
        editLinks: true,
        // end Edit on Github section
        displayAllHeaders: false,
        locales: {
            '/': {
                selectText: 'Languages',
                label: 'English',
                lang: 'en-US',
                title: 'Venus Filecoin',
                description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
                nav: [{
                    text: 'Introduction',
                    link: '/intro/'
                },
                {
                    text: 'Advanced',
                    link: '/advanced/'
                },
                {
                    text: 'Operation',
                    link: '/operation/'
                },
                ],
                sidebar: {
                    '/intro/': [{
                        title: 'Introduction',
                        collapsable: false,
                        children: [
                            ['', 'Overview'],
                            ['one-pager.md', 'One Pager']
                        ]
                    },
                    {
                        title: 'Products',
                        collapsable: false,
                        children: [
                            ['sophon.md', 'Sophon'],
                            ['damocles.md', 'Damocles'],
                            ['droplet.md', 'Droplet'],
                        ]
                    },
                    {
                        title: 'Contributing',
                        collapsable: false,
                        children: [
                            ['contribute-docs.md', 'Contribute to doc']
                        ]
                    },
                    ],
                    '/advanced/': [{
                        title: 'Advanced Practice',
                        collapsable: false,
                        children: [
                            ['', 'Withdraw Rewards'],
                            ['Chain.md', 'Chain Management'],
                            ['venus-cli.md', 'Venus CLI Commands'],
                            ['venus_load_balancing.md', 'Simple Load Balancing'],

                        ]
                    },
                    {
                        title: 'Local Dev Env',
                        collapsable: false,
                        children: [
                            ['How-To-Setup_2knet.md', 'How to start a local dev network'],
                            ['How-To-Connect-Network.md', 'Connect to different network'],
                            ['Multisig-wallet.md', 'Multisig wallet'],
                            ['Payment-Channel.md', 'Payment channel'],

                        ]
                    },
                    {
                        title: 'RPC API Reference',
                        collapsable: false,
                        children: [
                            ['chain-api-v0.md', 'Chain api v0', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/chain/v0/method.md"],
                            ['chain-api-v1.md', 'Chain api v1', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/chain/v1/method.md"],
                            ['gateway-api-v0.md', 'Gateway api v0', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/gateway/v0/method.md"],
                            ['gateway-api-v1.md', 'Gateway api v1', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/gateway/v1/method.md"],
                            ['market-api.md', 'Market api', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/market/method.md"],
                            ['messager-api.md', 'Messager api', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/messager/method.md"],
                            ['wallet-api.md', 'Wallet api', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/wallet/method.md"]
                        ]
                    },
                    ],
                    '/operation/': [{
                        title: 'Operation',
                        collapsable: false,
                        children: [
                            ['', 'High Availability Solution'],
                            ['example-single-box.md', 'Example single box setup (depreciating)'],
                            ['Efficiency_of_sealing.md', 'Finding optimal configurations'],
                            ['System_monitor_of_Zabbix.md', 'System monitoring (Zabbix)'],
                            ['lotus-vs-venus.md', 'Configurations inherited from Lotus'],
                        ]
                    },
                    {
                        title: 'Upgrade',
                        collapsable: false,
                        children: [
                            ['nv17-upgrade.md', 'nv17 upgrade'],
                            ['nv16-upgrade.md', 'nv16 upgrade'],
                            ['nv15-upgrade.md', 'nv15 upgrade'],
                        ]
                    },
                    ],
                    '/master/': [{
                        title: 'Master Course',
                        collapsable: false,
                        children: [
                            ['', 'TOC'],
                            ['Intro_to_Venus.md', 'Introduction'],
                            ['Chain_service_construction.md', 'Deploy/join a Chain Service'],
                            ['Daily_op_and_maintenance.md', 'Node operations'],
                            ['Q&A.md', 'Q&A'],
                            ['Incubation_exit_guide.md', 'Exit incubation program'],
                        ]
                    }]
                }
            },
            '/zh/': {
                selectText: '选择语言',
                label: '简体中文',
                title: '启明星',
                description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
                nav: [{
                    text: '简介',
                    link: '/zh/intro/'
                },
                {
                    text: '进阶',
                    link: '/zh/advanced/'
                },
                {
                    text: '运维',
                    link: '/zh/operation/'
                },
                {
                    text: '研究',
                    link: '/zh/research/'
                },
                ],
                sidebar: {
                    '/zh/intro/': [{
                        title: '概述',
                        collapsable: false,
                        children: [
                            ['', '启明星概要'],
                            ['one-pager.md', '单页介绍文档'],

                        ]
                    },
                    {
                        title: '产品',
                        collapsable: false,
                        children: [
                            ['sophon.md', '智子'],
                            ['damocles.md', '执剑人'],
                            ['droplet.md', '水滴'],
                        ]
                    },
                    {
                        title: '参与',
                        collapsable: false,
                        children: [
                            ['contribute-doc.md', '贡献文档'],
                        ]
                    },
                    ],
                    '/zh/advanced/': [{
                        title: '进阶实战',
                        collapsable: false,
                        children: [
                            ['', '提取奖励'],
                            ['chain.md', '链维护'],
                            ['venus_load_balancing.md', '简易负载均衡'],
                            ['tips-running-in-China.md', '中国部署小贴士'],
                        ]
                    },
                    {
                        title: '本地开发',
                        collapsable: false,
                        children: [
                            ['How-To-Setup_2knet.md', '本地2k开发网络'],
                            ['Multisig-Wallet.md', '多签钱包'],
                            ['Payment-Channel.md', '支付通道'],

                        ]
                    },
                    {
                        title: 'RPC 接口参考',
                        collapsable: false,
                        children: [
                            ['chain-api-v0.md', 'Chain api v0', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/chain/v0/method.md"],
                            ['chain-api-v1.md', 'Chain api v1', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/chain/v1/method.md"],
                            ['gateway-api-v0.md', 'Gateway api v0', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/gateway/v0/method.md"],
                            ['gateway-api-v1.md', 'Gateway api v1', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/gateway/v1/method.md"],
                            ['market-api.md', 'Market api', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/market/method.md"],
                            ['messager-api.md', 'Messager api', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/messager/method.md"],
                            ['wallet-api.md', 'Wallet api', "https://github.com/filecoin-project/venus/blob/master/venus-shared/api/wallet/method.md"]
                        ]
                    },
                    ],
                    '/zh/operation/': [{
                        title: '运维实战',
                        collapsable: false,
                        children: [
                            ['', 'Venus链服务高可用方案'],
                            ['example-single-box.md', '单矿机示例（depreciating）'],
                            ['Efficiency_of_sealing.md', '最大化利用资源提升密封扇区效率'],
                            ['System_monitor_of_Zabbix.md', '系统监控安装与使用之Zabbix'],
                            ['lotus-vs-venus.md', 'Venus封装配置解释'],
                        ]
                    },
                    {
                        title: '网络/组件升级',
                        collapsable: false,
                        children: [
                            ['nv17-upgrade.md', 'nv17网络升级'],
                            ['nv16-upgrade.md', 'nv16网络升级'],
                            ['nv15-upgrade.md', 'nv15网络升级'],
                            ['migrate_market_v1_to_v2.md', 'market_v2升级'],
                        ]
                    },
                    ],
                    '/zh/research/': [{
                        title: 'Venus生态研究',
                        collapsable: false,
                        children: [
                            ['', '概述'],
                        ]
                    },
                    {
                        title: '协议解读',
                        collapsable: false,
                        children: [
                            ['fip0045.md', 'FIP0045'],
                            ['fip0034.md', 'FIP0034'],
                            ['boost-protocol-research.md', 'Boost协议解读'],
                        ]
                    },
                    {
                        title: '设计方案',
                        collapsable: false,
                        children: [
                            ['user-data-isolation.md', '用户数据隔离'],
                            ['market-attributes-self-config.md', '市场的交易属性配置'],
                            ['impl-mk-1.2.0.md', '集成Boost协议'],
                            ['metrics-design.md', 'Metrics指标'],
                        ]
                    },
                    ]
                }
            }
        }
    }
}
