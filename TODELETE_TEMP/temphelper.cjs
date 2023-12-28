const { ExtensionEvent, loginStatus, AllExtensionsStatus } = require('./events.json')

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

        return commonKeys.filter(key => currentObjectKeys.includes(key))
    }, firstObjectKeys)
}

// console.log(getUniquePropertyValues(ExtensionEvent, 'reason'))

// console.log(allPresent(ExtensionEvent, 'dialStatus'))

const ExtensionEventCurrentCalls = ExtensionEvent.filter(event => event.data.currentCall).map(event => event.data.currentCall)
const ExtensionEventCalls = ExtensionEvent.map(event => event.data.calls).flat()
const AllExtensionsStatusCalls = AllExtensionsStatus[0].extensions.map(event => event.calls).flat()
const inAll = getPropertiesWhichExistInAllObjects(ExtensionEventCurrentCalls)
const most = Object.keys(getObjectWithMostProperties(ExtensionEventCurrentCalls))
const notInAll = most.filter(key => !inAll.includes(key))

console.log(notInAll)