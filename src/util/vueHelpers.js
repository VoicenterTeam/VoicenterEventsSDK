function checkRef(ref) {
    if (ref instanceof HTMLElement) {
        return ref
    } else if (ref.constructor.name === 'VueComponent' && ref.$el instanceof HTMLElement) {
        return ref.$el
    }
    return null
}

export const getRefElement = function (ref) {
    if (!ref) {
        return null
    }
    if (Array.isArray(ref) && ref.length) {
        return checkRef(ref[0])
    }
    return checkRef(ref)
}
