import md5 from 'js-md5'

import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import { Environment, EventsSdkOptions } from '@/classes/events-sdk/events-sdk.types'
import { LoginSessionPayload } from '@/types/auth'

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

        return this.onLoginResponse()
    }

    public static updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private static checkLoginStatus (options: EventsSdkOptions, key: string) {
        if (options.environment === Environment.BROWSER && window) {
        }
        if (options.environment === Environment.CHROME_EXTENSION && chrome) {
        }
    }

    private static onLoginResponse () {
        return new SocketIoClass('https://loginapi.voicenter.co.il/monitorAPI/GetSocketClient?v=1.3.7').io
    }
}

export default AuthClass
