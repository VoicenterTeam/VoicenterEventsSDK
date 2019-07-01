module.exports = {
  plugins: [
    require('./plugin.js')
  ],
  locales: {
    '/': {
      lang: 'en-US',
      title: 'VoicenterEventsSdk',
      description: 'VoicenterEventsSdk for Vue.js'
    }
  },
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
          '/installation.md',
          '/started.md',
        ]
      }
    }
  }
}
