const { ExtensionEvent } = require('./events.json')

function get (obj, path) {
    const pathArray = path.split('.')
    let result = obj

    for (const key of pathArray) {
        if (result === undefined || result === null) {
            return undefined
        }

        result = result[key]
    }

    return result
}
function getUniquePropertyValues (array, propertyPath) {
    return array.reduce(
        (acc, item) => {
            const value = get(item, propertyPath)

            if (value && !acc.includes(value)) {
                acc.push(value)
            }

            return acc
        },
        []
    )
}

const extensionUniqueReasons = getUniquePropertyValues(ExtensionEvent, 'cause')

console.log(extensionUniqueReasons)
