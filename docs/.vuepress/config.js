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
                            ['getting-started.md', 'Getting started'],
                        ]
                    },
                    {
                        title: 'Configurations',
                        collapsable: false,
                        children: [
                            ['venus-sector-manager-config.md', 'venus-sector-manager config'],
                            ['venus-worker-config.md', 'venus-worker config'],
                        ]
                    },
                    {
                        title: 'Operations',
                        collapsable: false,
                        children: [
                            ['task-management.md', 'Task management'],
                            ['task-flow.md', 'Task flow'],
                        ]
                    },
                    {
                        title: 'Migration',
                        collapsable: false,
                        children: [
                            ['migrate-sectors.md', 'Import existing sectors', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/06.%E5%AF%BC%E5%85%A5%E5%B7%B2%E5%AD%98%E5%9C%A8%E7%9A%84%E6%89%87%E5%8C%BA%E6%95%B0%E6%8D%AE.md"],
                        ]
                    },
                    {
                        title: 'Other Features',
                        collapsable: false,
                        children: [
                            ['other.md', 'More features...'],
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
                    {
                        title: 'Storage deals',
                        collapsable: false,
                        children: [
                            ['prep-datasets.md', 'preping large datasets'],
                        ]
                    },
                    {
                        title: 'Other Features',
                        collapsable: false,
                        children: [
                            ['other.md', 'More features...'],
                        ]
                    },
                    ],
                    '/modules/': [{
                        title: 'Chain Service',
                        collapsable: false,
                        children: [
                            ['', 'venus daemon'],
                            ['venus-auth.md', 'venus-auth'],
                            ['venus-miner.md', 'venus-miner'],
                            ['venus-messager.md', 'venus-messager'],
                            ['venus-gateway.md', 'venus-gateway'],
                            ['venus-wallet-builtin.md', 'venus-wallet (builtin)'],
                        ]
                    },
                    {
                        title: 'Local Component',
                        collapsable: false,
                        children: [
                            ['venus-cluster.md', 'venus-cluster'],
                            ['venus-wallet.md', 'venus-wallet (remote)'],
                        ]
                    },
                    {
                        title: 'Hybrid Component',
                        collapsable: false,
                        children: [
                            ['venus-market.md', 'venus-market'],
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
                            ['nv15-upgrade.md', 'nv15 upgrade'],
                            ['nv16-upgrade.md', 'nv16 upgrade'],
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
                    {
                        title: '简易部署',
                        collapsable: false,
                        children: [
                            ['venus-run-in-docker.md', '使用Docker部署链服务'],
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
                            ['getting-started.md', '快速上手'],
                        ]
                    },
                    {
                        title: '配置',
                        collapsable: false,
                        children: [
                            ['venus-sector-manager-config.md', 'venus-sector-manager配置', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/04.venus-sector-manager%E7%9A%84%E9%85%8D%E7%BD%AE%E8%A7%A3%E6%9E%90.md"],
                            ['venus-worker-config.md', 'venus-worker配置', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/03.venus-worker%E7%9A%84%E9%85%8D%E7%BD%AE%E8%A7%A3%E6%9E%90.md"],
                            ['processors-config-example.md', '外部执行器配置范例', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/07.venus-worker%E5%A4%96%E9%83%A8%E6%89%A7%E8%A1%8C%E5%99%A8%E7%9A%84%E9%85%8D%E7%BD%AE%E8%8C%83%E4%BE%8B.md"],
                        ]
                    },
                    {
                        title: '运维',
                        collapsable: false,
                        children: [
                            ['task-management.md', 'worker任务管理', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/10.venus-worker%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86.md"],
                            ['task-flow.md', '任务状态流转', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/11.%E4%BB%BB%E5%8A%A1%E7%8A%B6%E6%80%81%E6%B5%81%E8%BD%AC.md"],
                        ]
                    },
                    {
                        title: '迁移',
                        collapsable: false,
                        children: [
                            ['migrate-sectors.md', '导入已有扇区', "https://github.com/ipfs-force-community/venus-cluster/blob/main/docs/zh/06.%E5%AF%BC%E5%85%A5%E5%B7%B2%E5%AD%98%E5%9C%A8%E7%9A%84%E6%89%87%E5%8C%BA%E6%95%B0%E6%8D%AE.md"],
                        ]
                    },
                    {
                        title: '其他功能特性',
                        collapsable: false,
                        children: [
                            ['other.md', '其他'],
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
                            ['getting-started.md', '部署'],
                        ]
                    },
                    {
                        title: '配置',
                        collapsable: false,
                        children: [
                            ['market-client-config.md', 'market-client配置', "https://github.com/filecoin-project/venus-market/blob/master/docs/zh/market-client%E9%85%8D%E7%BD%AE%E8%A7%A3%E9%87%8A.md"],
                            ['market-config.md', 'venus-market配置', "https://github.com/filecoin-project/venus-market/blob/master/docs/zh/venus-market%E9%85%8D%E7%BD%AE%E8%A7%A3%E9%87%8A.md"],
                        ]
                    },
                    {
                        title: '订单',
                        collapsable: false,
                        children: [
                            ['prep-datasets.md', '大数据集准备'],
                            ['migrate-offline-deal.md', '迁移离线订单', "https://github.com/filecoin-project/venus-market/blob/master/docs/zh/%E5%A6%82%E4%BD%95%E8%BF%81%E7%A7%BB%E7%A6%BB%E7%BA%BF%E8%AE%A2%E5%8D%95.md"],
                        ]
                    },
                    {
                        title: '其他',
                        collapsable: false,
                        children: [
                            ['other.md', '其他'],
                        ]
                    },
                    ],
                    '/zh/modules/': [{
                        title: '链服务组件',
                        collapsable: false,
                        children: [
                            ['', 'Venus daemon'],
                            ['venus-auth.md', 'venus-auth'],
                            ['venus-miner.md', 'venus-miner'],
                            ['venus-messager.md', 'venus-messager'],
                            ['venus-gateway.md', 'venus-gateway'],
                            ['venus-wallet-builtin.md', 'venus-wallet（内置）'],
                        ]
                    },
                    {
                        title: '本地组件',
                        collapsable: false,
                        children: [
                            ['venus-cluster.md', 'venus-cluster'],
                            ['venus-wallet.md', 'venus-wallet（远程）'],
                        ]
                    },
                    {
                        title: '混合组件',
                        collapsable: false,
                        children: [
                            ['venus-market.md', 'venus-market'],
                        ]
                    },
                    {
                        title: '组件构建',
                        collapsable: false,
                        children: [
                            ['build.md', '全组件构建'],
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
                        title: '功能设计',
                        collapsable: false,
                        children: [
                            ['design-user-data-isolation.md', '用户数据隔离'],

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
                            ['nv15-upgrade.md', 'nv15网络升级'],
                            ['nv16-upgrade.md', 'nv16网络升级'],
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
