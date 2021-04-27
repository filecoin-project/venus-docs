module.exports = {
  title: 'Venus Filecoin',
  description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
  base: '/',
  markdown: {
    config: md => {
      md.set({ linkify: true })
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
    ]
  ],
  head: [
    ['link', { rel: 'icon', href: '/assets/icon-coin-128.png' }]
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
    logo: '/assets/filecoin-logo.svg',
    lastUpdated: 'Last Updated',
    // Optional options for generating "Edit this page" link
    // if your docs are in a different repo from your main project:
    docsRepo: 'filecoin-project/docs',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
    // end Edit on Github section
    displayAllHeaders: false,
    /* sidebar: [
      *//* {
 title: 'Venus Filecoin Tutorial',
 collapsable: false,
 children: [
   ['Home.md', 'Overview'],
   ['Chain.md', 'Chain'],
   ['Venus-Worker.md', 'Venus Worker'],
   ['Commands.md', 'CLI commands'],
   ['Getting-Started.md', 'Getting started'],
   ['How-To-Connect-Network.md', 'How to start network'],
   ['How-To-Setup_2knet.md', 'How to start a local network'],
   ['How-To-Deploy-MingPool.md', 'How to deploy mingPool'],
   ['How-To-Use-Messager.md', 'How to use messager'],
   ['How-To-Use-Wallet.md', 'How to use wallet'],
   ['Multisig-Wallet.md','Multisig wallet'],
   ['Remote-Wallet.md','Remote wallet'],
   ['Payment-Channel.md', 'Payment channel'],
   ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
   ['How-To-Contribute-Docs.md', 'Welcome to Contributing'],
   ['Tips-Running-In-China.md', 'Tips when running in China'],
 ]
},*//*
       {
         title: 'Resources',
         collapsable: true,
         children: [
           ['https://docs.filecoin.io', 'Filecoin docs'],
           ['questions.md', 'Have a question?'],
         ]
       }
     ],*/
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        lang: 'en-US',
        title: 'Venus Filecoin',
        description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
        nav: [
          { text: 'Filecoin Docs', link: 'https://docs.filecoin.io' },
          {
            text: 'Github', link: 'https://github.com/filecoin-project/venus'
          },
        ],
        sidebar: [
          {
            title: 'Venus Filecoin Tutorial',
            collapsable: false,
            children: [
              ['Home.md', 'Overview'],
              ['Chain.md', 'Chain'],
              ['Venus-Worker.md', 'Venus Worker'],
              ['Commands.md', 'CLI commands'],
              ['Getting-Started.md', 'Getting started'],
              ['How-To-Connect-Network.md', 'How to start network'],
              ['How-To-Setup_2knet.md', 'How to start a local network'],
              //['How-To-Deploy-MingPool.md', 'How to deploy mingPool'],
              ['How-To-Use-Messager.md', 'How to use messager'],
              ['How-To-Use-Wallet.md', 'How to use wallet'],
              //['Multisig-Wallet.md','Multisig wallet'],
              //['Remote-Wallet.md','Remote wallet'],
              ['Payment-Channel.md', 'Payment channel'],
              ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
              ['How-To-Contribute-Docs.md', 'Welcome to Contributing'],
              ['Tips-Running-In-China.md', 'Tips when running in China'],
            ]
          },
          {
            title: 'Resources',
            collapsable: true,
            children: [
              ['https://docs.filecoin.io', 'Filecoin docs'],
              ['questions.md', 'Have a question?'],
            ]
          }
        ]
      },
      '/zh/': {
        selectText: '选择语言',
        label: '简体中文',
        title: 'Venus Filecoin',
        description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
        nav: [
          { text: 'Filecoin文档', link: 'https://docs.filecoin.io' },
          {
            text: 'Github', link: 'https://github.com/filecoin-project/venus'
          },
        ],
        sidebar: {
          '/zh/': [
            {
              title: 'Venus Filecoin Tutorial',
              collapsable: false,
              children: [
                ['Home.md', 'Overview'],
                //['Chain.md', 'Chain'],
                ['Venus-Worker.md', 'Venus Worker'],
                ['Commands.md', 'CLI commands'],
                ['Getting-Started.md', 'Getting started'],
                ['How-To-Connect-Network.md', 'How to start network'],
                ['How-To-Setup_2knet.md', 'How to start a local network'],
                ['How-To-Deploy-MingPool.md', 'How to deploy mingPool'],
                //['How-To-Use-Messager.md', 'How to use messager'],
                ['How-To-Use-Wallet.md', 'How to use wallet'],
                ['Multisig-Wallet.md', 'Multisig wallet'],
                ['Remote-Wallet.md', 'Remote wallet'],
                ['Payment-Channel.md', 'Payment channel'],
                ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
                ['How-To-Contribute-Docs.md', 'Welcome to Contributing'],
                //['Tips-Running-In-China.md', 'Tips when running in China'],
              ]
            },
            {
              title: 'Resources',
              collapsable: true,
              children: [
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
