module.exports = {
  title: 'Venus Filecoin',
  description: 'Venus is a Go implementation of the Filecoin Distributed Storage Network.',
  base: '/venus-filecoin/',
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
  themeConfig: {
    logo: '/assets/filecoin-logo.svg',
    lastUpdated: 'Last Updated',
    nav: [
      { text: 'Filecoin Docs', link: 'https://docs.filecoin.io' },
      { text: 'Github', link: 'https://github.com/filecoin-project/venus'
      },
    ],
      /*{ text: 'Languages',
        items: [ 
          { text: 'English', link: '/' },
        //  { text: 'Chinese', link: '/language/chinese' }
        ]
      }*/
    // Optional options for generating "Edit this page" link
    // if your docs are in a different repo from your main project:
    docsRepo: 'filecoin-project/docs',
    // if your docs are not at the root of the repo:
    docsDir: 'docs',
    // if your docs are in a specific branch (defaults to 'master'):
    docsBranch: 'master',
    // defaults to false, set to true to enable
    editLinks: true,
    // custom text for edit link. Defaults to "Edit this page"
    editLinkText: 'Suggest an Edit',
    // end Edit on Github section
    displayAllHeaders: false,
    sidebar: [
      {
        title: 'Venus Filecoin Tutorial',
        collapsable: false,
        children: [
          ['Home.md', 'Overview'],
          ['Getting-Started.md', 'Getting started'],
          ['Mining-Filecoin.md', 'Mining Filecoin'],
          ['Storing-on-Filecoin.md', 'Storing on Filecoin'],
          ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
          ['Commands.md', 'CLI commands'],
          ['How-to-connect-two-nodes-directly.md', 'Connecting two nodes directly'],
          ['Running-a-network-locally.md', 'Running a local network']
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
