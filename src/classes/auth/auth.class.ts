import md5 from 'js-md5'

import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import { Environment, EventsSdkOptions } from '@/classes/events-sdk/events-sdk.types'
import { LoginSessionData, LoginSessionPayload } from '@/types/auth'

class AuthClass {
    private static delay = 1000
    public static lastLoginTimestamp: number

    public static login (options: EventsSdkOptions) {
        const payload: LoginSessionPayload = {
            token: options.token,
            email: options.email,
            username: options.username,
            password: options.password
        }

        const key = md5(JSON.stringify(payload))

        if (this.lastLoginTimestamp + this.delay > new Date().getTime()) {
            return
        }

        this.updateLastLoginTimestamp()

        this.checkLoginStatus(options, key)
    }

    public static updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private static checkLoginStatus (options: EventsSdkOptions, key: string) {
        let loginSessionData: LoginSessionData
        if (options.environment === Environment.BROWSER && window) {
            const loginSessionKey = window.sessionStorage.getItem(key)
            if (loginSessionKey) {
                loginSessionData = JSON.parse(loginSessionKey)
                this.onLoginResponse(loginSessionData)
            }
        }
        // if (options.environment === Environment.CHROME_EXTENSION && chrome) {
        //     console.log('extension', key)
        // }
    }

    private static onLoginResponse (loginSessionData: LoginSessionData) {
        if (loginSessionData) {
            SocketIoClass.getSocketIoFunction(loginSessionData)
        }
    }
}

export default AuthClass
