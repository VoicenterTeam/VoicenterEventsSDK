import { LoginSessionData } from '@/types/auth'

export class StorageClass{
    public static async getSessionStorageDataByKey (key: string): Promise<LoginSessionData | undefined> {
        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
            const loginSessionKey = await chrome.storage.session.get(key)

            if (loginSessionKey[key]) {
                return JSON.parse(loginSessionKey[key])
            }
        }

        if (typeof window !== 'undefined') {
            const loginSessionKey = window.sessionStorage.getItem(key)

            if (loginSessionKey) {
                return JSON.parse(loginSessionKey)
            }
        }
    }

    public static async updateSessionStorageKey (key: string, storageData: Partial<LoginSessionData>) {
        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
            await chrome.storage.session.set({
                [key]: JSON.stringify(storageData)
            })
        }

        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, JSON.stringify(storageData))
        }
    }

    public static clearSessionStorage () {
        if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined') {
            chrome.storage.session.clear()
        }

        if (typeof window !== 'undefined') {
            window.sessionStorage.clear()
        }
    }
}