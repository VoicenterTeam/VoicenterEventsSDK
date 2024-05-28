export class StorageClass {
    public static getSessionStorageDataByKey <T extends object> (key: string, doParse?: true): Promise<T | undefined>
    public static getSessionStorageDataByKey (key: string, doParse?: false): Promise<string | undefined>
    public static async getSessionStorageDataByKey (key: string, doParse = true) {
        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
            const loginSessionKey = await chrome.storage.session.get(key)

            if (loginSessionKey[key]) {
                if (doParse) {
                    return JSON.parse(loginSessionKey[key])
                } else {
                    return loginSessionKey[key]
                }
            }
        }

        if (typeof window !== 'undefined') {
            const loginSessionKey = window.sessionStorage.getItem(key)

            if (loginSessionKey) {
                if (doParse) {
                    return JSON.parse(loginSessionKey)
                } else {
                    return loginSessionKey
                }
            }
        }
    }

    public static async updateSessionStorageKey <T> (key: string, storageData: Partial<T>) {
        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
            await chrome.storage.session.set({
                [key]: JSON.stringify(storageData)
            })
        }

        if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.setItem === 'function') {
            window.sessionStorage.setItem(key, JSON.stringify(storageData))
        }
    }

    public static clearSessionStorage () {
        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
            chrome.storage.session.clear()
        }

        if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined' && typeof window.sessionStorage.clear === 'function') {
            window.sessionStorage.clear()
        }
    }
}
