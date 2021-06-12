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
            title: 'Venus Filecoin',
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
                ],
                sidebar: [
                    {
                        title: 'Getting-Started',
                        collapsable: true,
                        children: [
                            ['Overview.md', 'Overview'],
                            ['How-To-Deploy-MingPool.md', 'How to deploy a mining pool'],
                            ['Using-venus-Shared-Modules.md', 'How to join a mining pool'],
                            ['Venus-replace-lotus.md', 'Migrate from Lotus'],
                            ['Chain.md', 'Chain management'],
                            ['How-To-Connect-Network.md', 'Connect to different network'],
                            ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
                            ['How-To-Contribute-Docs.md', 'Contribute to doc']
                        ]
                    },
                    {
                        title: 'Modules',
                        collapsable: true,
                        children: [
                            ['Getting-Started.md', 'Venus daemon'],
                            ['How-To-Use-Messager.md', 'Venus messager'],
                            ['How-To-Use-Wallet-In-Venus.md', 'Venus wallet'],
                            // ['Venus-wallet.md', 'Venus wallet'],
                            ['Venus-Worker.md', 'Venus worker'],
                        ]
                    },
                    {
                        title: 'Advanced',
                        collapsable: true,
                        children: [
                            ['Commands.md', 'Venus CLI commands'],
                            ['Tips-Running-In-China.md', 'Tips running in China'],
                            ['Multisig-wallet.md', 'Multisig wallet'],
                            ['venus_load_balancing.md', 'Venus load balancing'],
                            ['Payment-Channel.md', 'Payment channel'],
                            ['How-To-Setup_2knet.md', 'How to start a local dev network'],
                        ]
                    }
                    // ]
                ]
            },
            '/zh/': {
                selectText: '选择语言',
                label: '简体中文',
                title: 'Venus Filecoin',
                description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
                nav: [
                    {text: 'Filecoin文档', link: 'https://docs.filecoin.io'},
                    {
                        text: 'Github', link: 'https://github.com/filecoin-project/venus'
                    },
                ],
                sidebar: {
                    '/zh/': [
                        {
                            title: 'Filecoin Venus教程',
                            collapsable: false,
                            children: [
                                ['Home.md', '首页'],
                                ['Overview.md', '概述'],
                                ['How-To-Deploy-MingPool.md', '部署Venus组件集群'],
                                ['Venus-replace-lotus.md', 'Venus替换Lotus'],
                                ['venus_load_balancing.md', 'Venus负载均衡'],
                                ['Tips-Running-In-China.md', '中国部署小贴士'],
                                ['How to use venus messager.md', '如何使用Venus messager组件'],
                                ['Venus-Worker.md', 'Venus Worker用法'],
                                ['Venus wallet.md', 'Venus wallet使用'],
                                ['chain.md', '链管理'],
                                ['How-To-Use-Wallet-In-Venus.md', 'Venus程序中的钱包使用'],
                                ['Multisig-Wallet.md', 'Venus内嵌的多签使用'],
                                ['Payment-Channel.md', '付款通道（paych）使用'],
                                ['Commands.md', 'CLI 命令'],
                                ['Getting-Started.md', '快速启动'],
                                ['How-To-Connect-Network.md', '连接节点网络'],
                                ['How-To-Setup_2knet.md', '启动本地2K测试网'],
                                ['Troubleshooting-&-FAQ.md', '故障排除和常见问题解答'],
                                ['How-To-Contribute-Docs.md', '如何部署文档'],
                            ]
                        },
                        {
                            title: 'Resources',
                            collapsable: true,
                            children:
                                [
                                    ['https://docs.filecoin.io', 'Filecoin docs'],
                                    ['questions.md', 'Have a question?'],
                                ]

                        }
                    ]
                }
            }
        }
    }
}

