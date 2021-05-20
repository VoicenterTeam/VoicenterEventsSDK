// This file should be used to compute the difference between 2 locales (missing translation keys)
const fs = require('fs')
const path = require('path')
const langPath = path.join(__dirname, '../locales')
let en = fs.readFileSync(path.join(langPath, 'en.json'), 'utf-8')
let nl = fs.readFileSync(path.join(langPath, 'he.json'), 'utf-8')

function replaceExport(str) {
  return str.replace('export default ', '')
}

function diff(obj1, obj2) {
  const diff = {}
  for (const key in obj1) {
    if (!obj2[key]) {
      diff[key] = obj1[key]
    }
  }
  return diff
}

en = JSON.parse(replaceExport(en))
nl = JSON.parse(replaceExport(nl))

const localeDiff = diff(en, nl)

fs.writeFileSync('./diff.json', JSON.stringify(localeDiff), 'utf-8')
