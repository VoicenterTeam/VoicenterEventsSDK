const fs = require('fs')
const VueI18NExtract = require('vue-i18n-extract').default;

let missingKeys = []
const report = VueI18NExtract.createI18NReport(`./src/**/*.?(js|vue)`, './src/locales/*.?(js|json)')
missingKeys = report.missingKeys
const missingKeysMap = {}
missingKeys.forEach(key => {
  if (key.language === 'en') {
    missingKeysMap[key.path] = key.path
  }
})
fs.writeFileSync('./missingKeys.json', JSON.stringify(missingKeysMap))
