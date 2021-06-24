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
                'ga': 'UA-148766289-1' // Property: Filecoin Docs
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
            description: 'Venus是完全兼容Filecoin分布式存储网络的一个go版本代码实现',
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
                        text: 'Incubation',
                        link: '/incubation/'
                    }
                ],
                sidebar: {
                    '/guide/': [
                        {
                            title: 'Getting Started',
                            collapsable: false,
                            children: [
                                ['', 'Overview'],
                                ['How-To-Deploy-MingPool.md', 'How to deploy a mining pool'],
                                ['Using-venus-Shared-Modules.md', 'How to join a mining pool'],
                                ['Venus-replace-lotus.md', 'Migrate from Lotus'],
                                ['Chain.md', 'Chain management'],
                                ['How-To-Connect-Network.md', 'Connect to different network'],
                                ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
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
                                ['How-To-Use-Wallet-In-Venus.md', 'Venus wallet'],
                                // ['Venus-wallet.md', 'Venus wallet'],
                                ['Venus-Worker.md', 'Venus worker'],
                            ]
                        }
                    ],
                    '/advanced/': [
                        {
                            title: 'Advanced',
                            collapsable: false,
                            children: [
                                ['', 'Venus CLI commands'],
                                ['Tips-Running-In-China.md', 'Tips running in China'],
                                ['Multisig-wallet.md', 'Multisig wallet'],
                                ['venus_load_balancing.md', 'Venus load balancing'],
                                ['Payment-Channel.md', 'Payment channel'],
                                ['How-To-Setup_2knet.md', 'How to start a local dev network'],
                            ]
                        }
                    ],
                    '/incubation/': [
                        {
                            title: 'Incubation',
                            collapsable: false,
                            children: [
                                ['', 'How to deploy a mining pool'],
                                ['Using-venus-Shared-Modules.md', 'How to join a mining pool'],
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
                ],
                sidebar: {
                    '/zh/': [
                        {
                            title: '快速上手',
                            collapsable: true,
                            children: [
                                ['Overview.md', '概述'],
                                ['How-To-Deploy-MingPool.md', '如何部署矿池'],
                                // ['Using-venus-Shared-Modules.md', '如何加入矿池'],
                                ['Venus-replace-lotus.md', '从Lotus迁移到Venus'],
                                ['chain.md', '链维护'],
                                ['How-To-Connect-Network.md', '加入不同网络'],
                                ['Troubleshooting-&-FAQ.md', '故障排除'],
                                ['How-To-Contribute-Docs.md', '贡献文档']
                            ]
                        },
                        {
                            title: '模块',
                            collapsable: true,
                            children: [
                                ['Getting-Started.md', 'Venus daemon'],
                                ['How to use venus messager.md', 'Venus messager'],
                                ['How-To-Use-Wallet-In-Venus.md', 'Venus wallet'],
                                // ['Venus-wallet.md', 'Venus wallet'],
                                ['Venus-Worker.md', 'Venus worker'],
                            ]
                        },
                        {
                            title: '进阶',
                            collapsable: true,
                            children: [
                                ['Commands.md', 'CLI命令'],
                                ['Tips-Running-In-China.md', '中国部署提示'],
                                ['Multisig-Wallet.md', '多签钱包'],
                                ['venus_load_balancing.md', '负载均衡'],
                                ['Payment-Channel.md', '支付通道'],
                                ['How-To-Setup_2knet.md', '本地2k开发网络'],
                            ]
                        }
                    ]
                }
            }
        }
    }
}

