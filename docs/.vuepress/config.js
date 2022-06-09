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
                        text: 'Chain Service',
                        link: '/cs/'
                    },
                    {
                        text: 'Power Service',
                        link: '/cluster/'
                    },
                    {
                        text: 'Deal Service',
                        link: '/market/'
                    },
                    {
                        text: 'Components',
                        link: '/modules/'
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
                    '/cs/': [{
                            title: 'Introduction',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                            ]
                        },
                        {
                            title: 'Deployment',
                            collapsable: false,
                            children: [
                                ['deploy-a-cs.md', 'Deploy a chain service'],
                                ['join-a-cs.md', 'Use a chain service'],
                            ]
                        },
                    ],
                    '/cluster/': [{
                            title: 'Introduction',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['architecture.md', 'Architecture'],
                            ]
                        },
                        {
                            title: 'Deployment',
                            collapsable: false,
                            children: [
                                ['Using-venus-cluster-alt.md', 'Getting started'],
                            ]
                        },
                    ],
                    '/market/': [{
                            title: 'Introduction',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['architecture.md', 'Architecture'],
                            ]
                        },
                        {
                            title: 'Deployment',
                            collapsable: false,
                            children: [
                                ['Using-venus-market.md', 'Getting started'],
                                ['migrate_market_v1_to_v2.md', 'Upgrading to version 2.0'],
                            ]
                        },
                    ],
                    '/modules/': [{
                            title: 'Chain Service',
                            collapsable: false,
                            children: [
                                ['', 'venus daemon'],
                                ['Venus-Auth.md', 'venus-auth'],
                                ['venus-miner.md', 'venus-miner'],
                                ['How-To-Use-Messager.md', 'venus-messager'],
                                ['Venus-Gateway.md', 'venus-gateway'],
                                ['How-To-Use-Wallet-In-Venus.md', 'venus-wallet (local)'],
                                ['Venus-Market.md', 'venus-market'],
                            ]
                        },
                        {
                            title: 'Local Component',
                            collapsable: false,
                            children: [
                                ['Venus-Wallet.md', 'venus-wallet (remote)'],
                                ['Venus-Worker.md', 'venus-worker'],
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
                                ['Nv15_upgrade_guide.md', 'nv15 upgrade'],
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
                        text: '启明星简介',
                        link: '/zh/intro/'
                    },
                    {
                        text: '链服务',
                        link: '/zh/cs/'
                    },
                    {
                        text: '算力服务',
                        link: '/zh/cluster/'
                    },
                    {
                        text: '订单服务',
                        link: '/zh/market/'
                    },
                    {
                        text: '组件',
                        link: '/zh/modules/'
                    },
                    {
                        text: '进阶',
                        link: '/zh/advanced/'
                    },
                    {
                        text: '运维',
                        link: '/zh/operation/'
                    },
                ],
                sidebar: {
                    '/zh/intro/': [{
                            title: '简述',
                            collapsable: false,
                            children: [
                                ['', '启明星概要'],
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
                    '/zh/cs/': [{
                            title: '简述',
                            collapsable: false,
                            children: [
                                ['', '概要'],
                            ]
                        },
                        {
                            title: '部署',
                            collapsable: false,
                            children: [
                                ['deploy-a-cs.md', '部署链服务'],
                                ['join-a-cs.md', '使用链服务'],
                            ]
                        },
                    ],
                    '/zh/cluster/': [{
                            title: '简述',
                            collapsable: false,
                            children: [
                                ['', '概要'],
                                ['architecture.md', '架构'],
                            ]
                        },
                        {
                            title: '部署',
                            collapsable: false,
                            children: [
                                ['Using-venus-cluster-alt.md', '快速上手'],
                                ['Venus-Sector-Manager.md', 'venus-sector-manager配置'],
                                ['Venus-Worker-c.md', 'venus-worker配置'],
                                ['processors_example.md', 'Processors配置范例'],
                            ]
                        },
                        {
                            title: '其他功能特性',
                            collapsable: false,
                            children: [
                                ['poster.md', 'poster分离'],
                                ['snapdeal.md', 'Snapdeal'],
                                ['migrate_sectors.md', '导入已有扇区'],
                            ]
                        },
                    ],
                    '/zh/market/': [{
                            title: '简述',
                            collapsable: false,
                            children: [
                                ['', '概要'],
                                ['architecture.md', '架构'],
                            ]
                        },
                        {
                            title: '部署',
                            collapsable: false,
                            children: [
                                ['using-venus-market-for-master.md', '链服务部署market服务'],
                                ['using-venus-market-for-miner.md', '本地部署market节点'],
                            ]
                        }
                    ],
                    '/zh/modules/': [{
                            title: '链服务组件',
                            collapsable: false,
                            children: [
                                ['', 'Venus daemon'],
                                ['Venus-Auth.md', 'venus-auth'],
                                ['venus-miner.md', 'venus-miner'],
                                ['How-To-Use-Messager.md', 'venus-messager'],
                                ['Venus-Gateway.md', 'venus-gateway'],
                                ['How-To-Use-Wallet-In-Venus.md', 'venus-wallet（本地）'],
                            ]
                        },
                        {
                            title: '本地组件',
                            collapsable: false,
                            children: [
                                ['Venus-Cluster.md', 'venus-cluster'],
                                ['Venus-Market.md', 'venus-market'],
                                ['Venus-Worker.md', 'venus-worker（sealer）'],
                                ['Venus-Wallet.md', 'venus-wallet（远程）'],
                            ]
                        },
                    ],
                    '/zh/advanced/': [{
                            title: '进阶实战',
                            collapsable: false,
                            children: [
                                ['', '提取奖励'],
                                ['chain.md', '链维护'],
                                ['venus-cli.md', '常用CLI'],
                                ['venus_load_balancing.md', '简易负载均衡'],
                                // ['How-To-Connect-Network.md', '加入不同网络'],
                                ['tips-running-in-China.md', '中国部署小贴士'],
                                ['venus-run-in-docker.md', '在Docker中运行venus'],
                            ]
                        },
                        {
                            title: '本地开发',
                            collapsable: false,
                            children: [
                                // ['venus_system_architcture.md', 'Venus系统架构'],
                                ['How-To-Setup_2knet.md', '本地2k开发网络'],
                                ['Multisig-Wallet.md', '多签钱包'],
                                ['Payment-Channel.md', '支付通道'],

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
                                ['Nv15_upgrade_guide.md', 'nv15网络升级'],
                                ['migrate_market_v1_to_v2.md', 'market_v2升级'],
                            ]
                        },
                    ],
                    '/zh/master/': [{
                        title: '大师课',
                        collapsable: false,
                        children: [
                            ['', '目录'],
                            ['Intro_to_Venus.md', 'Venus概要'],
                            ['Chain_service_construction.md', '部署/加入链服务'],
                            ['Daily_op_and_maintenance.md', '节点日常运维'],
                            ['Q&A.md', 'Q&A'],
                            ['Incubation_exit_guide.md', '节点迁出指南'],
                        ]
                    }]
                }
            }
        }
    }
}
