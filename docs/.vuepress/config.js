module.exports = {
    title: 'Venus Filecoin',
    description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
    base: '/',
    markdown: {
        config: md => {
            md.set({linkify: true})
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
        ['@vuepress/google-analytics',
            {
                'ga': 'G-SYDDWWLQSP' // Property: Filecoin Docs
            }
        ],
        ['vuepress-plugin-code-copy', true]
    ],
    head: [
        ['link', {rel: 'icon', href: '/assets/venus-logo.png'}]
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
                nav: [
                    {
                        text: 'Getting Started',
                        link: '/guide/'
                    },
                    {
                        text: 'Venus Modules',
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
                    {
                        text: 'Master',
                        link: '/master/'
                    }
                ],
                sidebar: {
                    '/guide/': [
                        {
                            title: 'Getting Started',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['How-To-Deploy-MingPool.md', 'Deploy a chain service'],
                                ['Using-venus-Shared-Modules.md', 'Use a chain service'],
                                ['Using-venus-market.md', 'Join storage market'],
                                ['Using-venus-cluster-alt.md', 'Use venus-cluster'],
                                ['How-To-Contribute-Docs.md', 'Contribute to doc']
                            ]
                        }
                    ],
                    '/modules/': [
                        {
                            title: 'Venus Modules',
                            collapsable: false,
                            children: [
                                ['', 'venus daemon'],
                                ['Venus-Auth.md', 'venus-auth'],
                                ['venus-miner.md', 'venus-miner'],
                                ['How-To-Use-Messager.md', 'venus-messager'],
                                ['Venus-Gateway.md', 'venus-gateway'],
                                ['How-To-Use-Wallet-In-Venus.md', 'venus-wallet (local)'],
                                ['Venus-Wallet.md', 'venus-wallet (remote)'],
                                ['Venus-Worker.md', 'venus-worker'],
                                ['Venus-Market.md', 'venus-market'],
                            ]
                        }
                    ],
                    '/advanced/': [
                        {
                            title: 'Advanced',
                            collapsable: false,
                            children: [
                                ['', 'Using lotus-miner'],
                                ['tips-running-in-China.md', 'Tips running in China'],
                                ['fil_withdraw_and_send.md', 'Retrieve rewards'],
                                ['Chain.md', 'Chain management'],
                                ['How-To-Connect-Network.md', 'Connect to different network'],
                                ['How-To-Setup_2knet.md', 'How to start a local dev network'],
                                ['Multisig-wallet.md', 'Multisig wallet'],
                                ['venus_load_balancing.md', 'Venus load balancing'],
                                ['Payment-Channel.md', 'Payment channel'],
                                ['venus-cli.md', 'Venus CLI commands'],

                            ]
                        }
                    ],
                    '/operation/': [
                        {
                            title: 'Operation',
                            collapsable: false,
                            children: [
                                ['', 'Example single box setup'],
                                ['Efficiency_of_sealing.md', 'Finding optimal configurations'],
                                ['System_monitor_of_Zabbix.md', 'System monitoring (Zabbix)'],
                                ['lotus-vs-venus.md', 'Coming from Lotus'],
                                ['Nv15_upgrade_guide.md', 'nv15 upgrade'],
                                ['migrate_market_v1_to_v2.md', 'market v2 upgrade'],
                            ]
                        }
                    ],
                    '/incubation/': [
                        {
                            title: 'Incubation',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['The phase 2  was officially launched.md', 'Incubation center phase II'],
                                ['Incubation Center participation process.md', 'Participation process'],
                                ['Incubation_Center_Prize_Pool.md', 'Participation incentives'],
                                ['announcement.md', 'Announcement'],
                                ['Rules.md', 'Rules'],
                            ]
                        }
                    ],
                    '/master/': [
                        {
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
                        }
                    ]
                }
            },
            '/zh/': {
                selectText: '选择语言',
                label: '简体中文',
                title: '启明星',
                description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
                nav: [
                    {
                        text: '快速上手',
                        link: '/zh/guide/'
                    },
                    {
                        text: '组件模块',
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
                    {
                        text: 'Master',
                        link: '/zh/master/'
                    }
                ],
                sidebar: {
                    '/zh/guide/': [
                        {
                            title: '快速上手',
                            collapsable: false,
                            children: [
                                ['', '启明星概要'],
                                ['How-To-Deploy-MingPool.md', '部署链服务'],
                                ['Using-venus-Shared-Modules.md', '使用链服务'],
                                ['using-venus-market-for-master.md', '链服务部署market服务'],
                                ['using-venus-market-for-miner.md', '本地部署market节点'],
                                ['Using-venus-cluster-alt.md', '使用cluster'],
                                ['How-To-Contribute-Docs.md', '贡献文档'],
                            ]
                        }
                    ],
                    '/zh/modules/': [
                        {
                            title: '启明星模块',
                            collapsable: false,
                            children: [
                                ['', 'Venus daemon'],
                                ['Venus-Auth.md', 'venus-auth'],
                                ['venus-miner.md', 'venus-miner'],
                                ['How-To-Use-Messager.md', 'venus-messager'],
                                ['Venus-Gateway.md', 'venus-gateway'],
                                ['How-To-Use-Wallet-In-Venus.md', 'venus-wallet（本地）'],
                                ['Venus-Wallet.md', 'venus-wallet（远程）'],
                                ['Venus-Worker.md', 'venus-worker（sealer）'],
                                ['Venus-Market.md', 'venus-market'],
                                ['Venus-Cluster.md', 'venus-cluster'],
                                ['Venus-Sector-Manager.md', 'venus-sector-manager（cluster）'],
                                ['Venus-Worker-c.md', 'venus-worker（cluster）'],
                            ]
                        }
                    ],
                    '/zh/advanced/': [
                        {
                            title: '进阶',
                            collapsable: false,
                            children: [
                                ['', '使用lotus-miner'],
                                ['tips-running-in-China.md', '中国部署小贴士'],
                                ['fil_withdraw_and_send.md', '提取奖励'],
                                ['chain.md', '链维护'],
                                ['How-To-Connect-Network.md', '加入不同网络'],
                                ['How-To-Setup_2knet.md', '本地2k开发网络'],
                                ['venus_load_balancing.md', '负载均衡'],
                                ['Venus-Project-Dependency-Upgrade.md', 'venus组件依赖与升级'],
                                ['Multisig-Wallet.md', '多签钱包'],
                                ['Payment-Channel.md', '支付通道'],
                                ['venus-cli.md', 'CLI命令'],

                            ]
                        }
                    ],
                    '/zh/operation/': [
                        {
                            title: '独立组件运维',
                            collapsable: false,
                            children: [
                                ['', '独立组件运维进阶'],
                                ['example-single-box.md', '单矿机示例'],
                                ['Efficiency_of_sealing.md', '最大化利用资源提升密封扇区效率'],
                                ['System_monitor_of_Zabbix.md', '系统监控安装与使用之Zabbix'],
                                ['lotus-vs-venus.md', '从Lotus中来'],
                                ['Nv15_upgrade_guide.md', 'nv15网络升级'],
                                ['migrate_market_v1_to_v2.md', 'market_v2升级'],
                            ]
                        }
                    ],
                    '/zh/incubation/': [
                        {
                            title: '孵化器',
                            collapsable: false,
                            children: [
                                ['', '概述'],
                                ['存储提供者孵化中心参与流程.md', '参与流程'],
                                ['第二阶段正式启动.md', '孵化中心第二阶段'],
                                ['Incubation_Center_Prize_Pool.md', '参与奖励'],
                                ['announcement.md', '公告'],
                                ['Rules.md', '规则'],
                            ]
                        }
                    ],
                    '/zh/master/': [
                        {
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
                        }
                    ]
                }
            }
        }
    }
}

