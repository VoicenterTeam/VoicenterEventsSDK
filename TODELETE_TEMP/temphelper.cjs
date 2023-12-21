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

function allPresent (array, propertyPath) {
    return array.every(item => {
        const value = get(item, propertyPath)

        return value !== undefined && value !== null
    })
}

function getObjectWithMostProperties (array) {
    return array.reduce((curr, prev) => {
        return Object.keys(curr).length > Object.keys(prev).length ? curr : prev
    })
}

function getPropertiesWhichExistInAllObjects (array) {
    if (array.length === 0) {
        return []
    }

    const firstObjectKeys = Object.keys(array[0])

    return array.reduce((commonKeys, currentObject) => {
        const currentObjectKeys = Object.keys(currentObject)

        const intersection = commonKeys.filter(key => currentObjectKeys.includes(key))

        return intersection
    }, firstObjectKeys)
}

// console.log(getUniquePropertyValues(ExtensionEvent, 'reason'))

// console.log(allPresent(ExtensionEvent, 'dialStatus'))

const array = ExtensionEvent.map(obj => obj.data.calls).flat().map(call => call.recording)
console.log(array.filter(a => a.IsMuted))
