module.exports = {
  plugins: [
    require('./plugin.js')
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Voicenter Real time Events SDK',
      description: 'Real time javascript events sdk. Can be used in conjuction with voicenter servers to get real time events (via sockets) about calls, extensions, agent statuses and more.'
    }
  },
  head: [
    ['link', { rel: 'stylesheet', href: 'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'}]
  ],
  themeConfig: {
    repo: '/voicenter/VoicecenterEventsSDK',
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [{
          text: 'Release Notes',
          link: 'https://github.com//voicenter/VoicecenterEventsSDK/releases'
        }],
        sidebar: [
          {
            title: 'Installation',
            path: '/installation.md',
            sidebarDepth: 2
          },
          {
            title: 'Getting started',
            path: '/started.md',
            sidebarDepth: 3
          },
          {
            title: 'Demo',
            path: '/demo.md',
            sidebarDepth: 2
          }
        ]
      }
    }
  }
}
