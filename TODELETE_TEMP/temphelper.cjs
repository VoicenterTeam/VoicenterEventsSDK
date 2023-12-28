const { ExtensionEvent, loginStatus, AllExtensionsStatus, QueueEvent } = require('./events.json')

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

const extensionCalls = [
    ...(ExtensionEvent.map(event => event.data.calls).flat() || []),
    ...(ExtensionEvent.filter(event => event.data.currentCall).map(event => event.data.currentCall) || [])
];


const extensionEventExpectedCallsParameters = Object
    .keys(
        getObjectWithMostProperties(extensionCalls)
    )
    .filter(
        key => ['c2cdirection', 'callerID', 'Ivruniqueid', 'campaignID'].includes(key)
    )

const extensionEventDataExpectedCParameters = Object
    .keys(
        getObjectWithMostProperties(ExtensionEvent.map(event => event.data))
    )
    .filter(
        key => ['c2cdirection', 'callerID', 'Ivruniqueid', 'campaignID'].includes(key)
    )

const extensionEventExpectedCParameters = Object
    .keys(
        getObjectWithMostProperties(ExtensionEvent)
    )
    .filter(
        key => ['c2cdirection', 'callerID', 'Ivruniqueid', 'campaignID'].includes(key)
    )

const extensionDirectionValues = getUniquePropertyValues(extensionCalls, 'direction').filter(value => ['Spy', 'Click2call'].includes(value))

console.log('Extension callstatus values (expect to get "Spying")', getUniquePropertyValues(extensionCalls, 'callstatus'))
console.log('Extension cause values (expect to get "Answered elsewhere")', getUniquePropertyValues(ExtensionEvent, 'cause'))
console.log('Extension event calls expected parameters (expect to get c2cdirection, callerID, Ivruniqueid or campaignID)', extensionEventExpectedCallsParameters)
console.log('Extension event data expected parameters (expect to get c2cdirection, callerID, Ivruniqueid or campaignID)', extensionEventDataExpectedCParameters)
console.log('Extension event expected parameters (expect to get c2cdirection, callerID, Ivruniqueid or campaignID)', extensionEventExpectedCParameters)
console.log('Extension direction values (expect to get "Spy" and "Click2call")', extensionDirectionValues)