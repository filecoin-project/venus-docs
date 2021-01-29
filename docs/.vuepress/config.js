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
          ['Commands.md', 'CLI commands'],
          ['Getting-Started.md', 'Getting started'],
          ['How-to-connect-network.md', 'How to Start network'],
          ['How-to-setup_2knet.md', 'How to Start a local network'],
          ['Mining-Filecoin.md', 'Mining Filecoin'],
          ['Troubleshooting-&-FAQ.md', 'Troubleshooting & FAQ'],
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


bafy2bzaced4dyarx3pyz53ecwibru62vktsb6z7pyl735ljz53xgqeg7vfbno bafy2bzacebvkqkseyyifhgxkyfrwengbgzofmzn3xtgfx3osnbflkxkc5rrdw bafy2bzacedlf4tyypgo7w6vnyudzopo473pf6np345zoue2flc45ssxv4jti4 bafy2bzacebuldkqwwcylm6tzwzdbrga23ulxbjqhltsbdqv7yewjpbp4s4vge


bafy2bzacebbxwyicp4zjavswpeixe2pkaw6vc54ahrqd6dc7vucm7mwcgulru bafy2bzacebv2awifkmvdgrk2gpnk7qj5pca57bc54pfsurmkekxiu5uwvublw bafy2bzacedjtnpprzlmk5vhukc4wboxgtwvxh6kdjsskmhtopqs5gt2yh5lha bafy2bzacedemqsqgpmqktieayjj4a3cxyedh6nak7vito22k25lro37ioqpqy bafy2bzacebgpggug242sexq7luvn5armividdbksww6gh47df4cg3dkzjrkz6 bafy2bzaceb2jruetan7pjgn7c5ea2tv6nfibqmmtp7pl2s2aww6gxlc6hbsnw bafy2bzacecrx3fnuoukr5z3lxwyixxdn4lhm5iwlyfxxnksvrli5l6crnk3ly bafy2bzacearmqayjayn742kbgve7z57a2q36spnxnmntgy7mi27swkwm34urq bafy2bzaceb27bs5kv7gl2sarv7m2qpgkyn7hvy2nh4n5my73tlivuu7vz4rpe bafy2bzaced4wvfvdhmhsqkdqngz4boolhwavi7p6du3mnuczmhmzjwqy3r2ti bafy2bzacecisgkx5utbvzl67uiteg6mifytt7lkkjld72jiigpswcfxaejpga
