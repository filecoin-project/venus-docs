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
                        text: 'Incubation Center',
                        link: '/incubation/'
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
                                ['How-To-Deploy-MingPool.md', 'Deploy a storage pool'],
                                ['Using-venus-Shared-Modules.md', 'Join a storage pool'],
                                ['Using-venus-market.md', 'Deal making'],
                                ['fil_withdraw_and_send.md', 'Retrieve rewards'],
                                ['Chain.md', 'Chain management'],
                                ['How-To-Connect-Network.md', 'Connect to different network'],
                                ['How-To-Contribute-Docs.md', 'Contribute to doc']
                            ]
                        }
                    ],
                    '/modules/': [
                        {
                            title: 'Venus Modules',
                            collapsable: false,
                            children: [
                                ['', 'Venus daemon'],
                                ['How-To-Use-Messager.md', 'Venus messager'],
                                ['How-To-Use-Wallet-In-Venus.md', 'Venus local wallet'],
                                ['Venus-Wallet.md', 'Venus remote wallet'],
                                ['Venus-Worker.md', 'Venus worker'],
                                ['Venus-Gateway.md', 'Venus gateway'],
                                ['Venus-Auth.md', 'Venus auth'],
                                ['Venus-Market.md', 'Venus market'],
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
                                ['venus-cli.md', 'Venus CLI commands'],
                                ['Multisig-wallet.md', 'Multisig wallet'],
                                ['venus_load_balancing.md', 'Venus load balancing'],
                                ['Payment-Channel.md', 'Payment channel'],
                                ['How-To-Setup_2knet.md', 'How to start a local dev network'],
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
                            ]
                        }
                    ],
                    '/incubation/': [
                        {
                            title: 'Incubation',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['Incubation Center participation process.md', 'Participation process'],
                                ['Incubation_Center_Prize_Pool.md', 'Participation incentives'],
                                ['announcement.md', 'Announcement'],
                                ['Rules.md', 'Rules'],
                            ]
                        }
                    ],
                    '/master/': [
                        {
                            title: 'Master',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['Course_introduction.md', 'Classes'],
                                ['Intro_to_Venus.md', 'Venus storage pool introduction'],
                                ['Chain_service_construction.md', 'Up a Chain Service'],
                                ['Daily_op_and_maintenance.md', 'Daily Maintenance and Operation'],
                                ['Q&A.md', 'Q&A'],
                                ['Incubation_exit_guide.md', 'Incubation Exit Guide'],
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
                        text: '孵化器',
                        link: '/zh/incubation/'
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
                                ['How-To-Deploy-MingPool.md', '部署存储池'],
                                ['Using-venus-Shared-Modules.md', '加入存储池'],
                                ['Using-venus-market.md', '发送接收订单'],
                                ['fil_withdraw_and_send.md', '提取奖励'],
                                ['chain.md', '链维护'],
                                ['How-To-Connect-Network.md', '加入不同网络'],
                                ['How-To-Contribute-Docs.md', '贡献文档']
                            ]
                        }
                    ],
                    '/zh/modules/': [
                        {
                            title: '启明星模块',
                            collapsable: false,
                            children: [
                                ['', 'Venus daemon'],
                                ['How-To-Use-Messager.md', 'Venus messager'],
                                ['How-To-Use-Wallet-In-Venus.md', 'Venus 本地钱包'],
                                ['Venus-Wallet.md', 'Venus 远程钱包'],
                                ['Venus-Worker.md', 'Venus worker'],
                                ['Venus-Gateway.md', 'Venus gateway'],
                                ['Venus-Auth.md', 'Venus auth'],
                                ['Venus-Market.md', 'Venus market'],
                                ['Venus-Messager-Design-Spec.md', 'Venus Messager 设计说明书'],
                            ]
                        }
                    ],
                    '/zh/advanced/': [
                        {
                            title: '进阶',
                            collapsable: false,
                            children: [
                                ['', 'venus矿池进阶'],
                                ['How-To-Setup_2knet.md', '如何搭建私网'],
                                ['tips-running-in-China.md', '中国部署小贴士'],
                                ['Venus-Project-Dependency-Upgrade.md', 'venus组件依赖与升级'],
                                ['venus-cli.md', 'CLI命令'],
                                ['Multisig-Wallet.md', '多签钱包'],
                                ['venus_load_balancing.md', '负载均衡'],
                                ['Payment-Channel.md', '支付通道'],
                                ['How-To-Setup_2knet.md', '本地2k开发网络'],
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
                                ['Incubation_Center_Prize_Pool.md', '参与奖励'],
                                ['announcement.md', '公告'],
                                ['Rules.md', '规则'],
                            ]
                        }
                    ],
                    '/zh/master/': [
                        {
                            title: 'Master',
                            collapsable: false,
                            children: [
                                ['', '概述'],
                                ['Course_introduction.md', '教程'],
                                ['Intro_to_Venus.md', 'Venus的分布式存储池介绍'],
                                ['Chain_service_construction.md', 'Venus的链服务搭建'],
                                ['Daily_op_and_maintenance.md', '孵化中心节点日常运维'],
                                ['Q&A.md', '孵化中心答疑篇'],
                                ['Incubation_exit_guide.md', '孵化中心的节点迁出指南'],
                            ]
                        }
                    ]
                }
            }
        }
    }
}

