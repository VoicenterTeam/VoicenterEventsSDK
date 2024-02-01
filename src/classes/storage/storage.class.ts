import { LoginSessionData } from '@/types/auth'

export class StorageClass{
    public static async getSessionStorageDataByKey (key: string): Promise<LoginSessionData | undefined> {
        if (chrome.storage) {
            const loginSessionKey = await chrome.storage.session.get(key)

            if (loginSessionKey[key]) {
                return JSON.parse(loginSessionKey[key])
            }
        }

        if (window) {
            const loginSessionKey = window.sessionStorage.getItem(key)

            if (loginSessionKey) {
                return JSON.parse(loginSessionKey)
            }
        }
    }

    public static async updateSessionStorageKey (key: string, storageData: LoginSessionData) {
        if (chrome.storage) {
            await chrome.storage.session.set({
                [key]: JSON.stringify(storageData)
            })
        }

        if (window) {
            window.sessionStorage.setItem(key, JSON.stringify(storageData))
        }
    }

    public static clearSessionStorage () {
        if (chrome.storage) {
            chrome.storage.session.clear()
        }

        if (window) {
            window.sessionStorage.clear()
        }
    }
}