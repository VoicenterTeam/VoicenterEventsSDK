import { LoginSessionData } from '@/types/auth'

export class StorageClass{
    public static async getSessionStorageDataByKey (key: string): Promise<LoginSessionData | undefined> {
        if (window) {
            const loginSessionKey = window.sessionStorage.getItem(key)

            if (loginSessionKey) {
                return JSON.parse(loginSessionKey)
            }
        }

        if (chrome.storage) {
            const loginSessionKey = await chrome.storage.session.get(key)

            if (loginSessionKey[key]) {
                return JSON.parse(loginSessionKey[key])
            }
        }
    }

    public static async updateSessionStorageKey (key: string, storageData: LoginSessionData) {
        if (window) {
            window.sessionStorage.setItem(key, JSON.stringify(storageData))
        }

        if (chrome.storage) {
            await chrome.storage.session.set({
                [key]: JSON.stringify(storageData)
            })
        }
    }

    public static clearSessionStorage () {
        if (window) {
            window.sessionStorage.clear()
        }

        if (chrome.storage) {
            chrome.storage.session.clear()
        }
    }
}