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
        'fulltext-search',
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
                    text: 'Deployment & Operation',
                    link: '/operation/'
                },
                {
                    text: 'About',
                    link: '/about/'
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
                            ['https://sophon.venus-fil.io', 'Sophon'],
                            ['https://damocles.venus-fil.io', 'Damocles'],
                            ['https://droplet.venus-fil.io', 'Droplet'],
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
                    '/operation/': [{
                        title: 'Deployment',
                        collapsable: false,
                        children: [
                            ['', 'Deployment of a Venus system'],
                        ]
                    },
                    {
                        title: 'Network Upgrade',
                        collapsable: false,
                        children: [
                            ['nv22-upgrade.md', 'nv22 upgrade'],
                            ['nv21-upgrade.md', 'nv21 upgrade'],
                            ['nv19-upgrade.md', 'nv19 upgrade'],
                            ['nv18-upgrade.md', 'nv18 upgrade'],
                            ['nv17-upgrade.md', 'nv17 upgrade'],
                            ['nv16-upgrade.md', 'nv16 upgrade'],
                            ['nv15-upgrade.md', 'nv15 upgrade'],
                        ]
                    },
                    ],
                    '/about/': [{
                        title: '',
                        collapsable: false,
                        children: [
                            ['', 'About'],
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
                    text: '运维/部署',
                    link: '/zh/operation/'
                },
                {
                    text: '关于',
                    link: '/zh/about/'
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
                            ['https://sophon.venus-fil.io/zh/', '智子'],
                            ['https://damocles.venus-fil.io/zh/', '执剑人'],
                            ['https://droplet.venus-fil.io/zh/', '水滴'],
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
                    '/zh/operation/': [{
                        title: '部署',
                        collapsable: false,
                        children: [
                            ['', '部署Venus解决方案'],
                        ]
                    },
                    {
                        title: '网络/产品升级',
                        collapsable: false,
                        children: [
                            ['nv22-upgrade.md', 'nv22网络升级'],
                            ['nv21-upgrade.md', 'nv21网络升级'],
                            ['nv19-upgrade.md', 'nv19网络升级'],
                            ['nv18-upgrade.md', 'nv18网络升级'],
                            ['nv17-upgrade.md', 'nv17网络升级'],
                            ['nv16-upgrade.md', 'nv16网络升级'],
                            ['nv15-upgrade.md', 'nv15网络升级'],
                            ['migrate_market_v1_to_v2.md', 'market_v2升级'],
                        ]
                    },
                    ],
                    '/zh/about/': [{
                        title: '',
                        collapsable: false,
                        children: [
                            ['', '关于我们'],
                        ]
                    },
                    ]
                }
            }
        }
    }
}
