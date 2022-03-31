const fs = require('fs')
const path = require('path')

const translationRegex = new RegExp("\\$t\\(['|\"]([^'\"]+)['|\"]\\)", "g")
const pathToLookIn = path.join(process.cwd(), 'src')
const existingTranslations = require(path.join(process.cwd(), 'src', 'locales', 'en.json'))

let allTranslations = []

function sortMethod(a, b) {
    a = a.toLowerCase()
    b = b.toLowerCase()

    if(a < b) return -1
    if(a > b) return 1

    return 0
}

function sortKeys(key1, key2) {
    let prev = key1.split('.')
    let next = key2.split('.')

    const prevLen = prev.length
    const nextLen = next.length

    // Move single keys to the end of the object
    if (prevLen === 1 && prevLen < nextLen) return 1
    else if (prevLen > nextLen && nextLen === 1) return -1

    const minLength = prevLen > nextLen? nextLen: prevLen
    let move = 0

    for (let i = 0; i < minLength; i++) {
        move = sortMethod(prev[i], next[i])
        if (move !== 0) break
    }

    return move
}

function getMissingTranslationFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath).toString()
    const missingTranslation = []

    let match = translationRegex.exec(fileContent)

    while (match != null) {
        missingTranslation.push(match[1])
        match = translationRegex.exec(fileContent)
    }

    return missingTranslation
}

function getAllTranslationFromFolder(folderPath) {
    fs.readdirSync(folderPath).forEach(element => {
        const elementPath = path.join(folderPath, element)

        if (fs.lstatSync(elementPath).isDirectory()) {
            getAllTranslationFromFolder(elementPath)
        } else if (fs.lstatSync(elementPath).isFile()) {
            allTranslations = [...allTranslations, ...getMissingTranslationFromFile(elementPath)]
        }
    })
}

getAllTranslationFromFolder(pathToLookIn)

const missingTranslation = allTranslations.filter((translation, index, self) => {
    return !Object.keys(existingTranslations).includes(translation) && self.indexOf(translation) === index
})

fs.writeFileSync('./missingTranslations.json', JSON.stringify(missingTranslation.sort(sortKeys)))
