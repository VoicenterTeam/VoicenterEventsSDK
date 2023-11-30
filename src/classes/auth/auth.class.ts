import md5 from 'js-md5'

import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { SocketIoClass } from '@/classes/socket-io/socket-io.class'
import { Environment, EventsSdkOptions, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import { LoginSessionData, LoginSessionPayload } from '@/types/auth'

class AuthClass {
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }
    
    private delay = 1000
    public lastLoginTimestamp: number | undefined
    public token: string | undefined
    private socketIoClass = new SocketIoClass()

    public login (options: EventsSdkOptions) {
        const payload: LoginSessionPayload = {
            token: options.token,
            email: options.email,
            username: options.username,
            password: options.password
        }

        const key = md5(JSON.stringify(payload))

        if (this.lastLoginTimestamp && this.lastLoginTimestamp + this.delay > new Date().getTime()) {
            return
        }

        this.updateLastLoginTimestamp()

        this.checkLoginStatus(options, key)
    }

    public updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private checkLoginStatus (options: EventsSdkOptions, key: string) {
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

    private onLoginResponse (loginSessionData: LoginSessionData) {
        if (loginSessionData.Client) {
            this.socketIoClass.getSocketIoFunction(loginSessionData.Client)
        }
        if (loginSessionData.Url) {
            this.socketIoClass.setServer({
                Priority: 0,
                Domain: loginSessionData.Url.replace('https://', '')
            })
        }
        if (loginSessionData.URLList) {
            this.socketIoClass.setServersByURLList(loginSessionData.URLList)
        }
        if (loginSessionData.Token) {
            // this.options.token = loginSessionData.Token
            this.token = loginSessionData.Token
            this.eventsSdkClass.connect(ServerParameter.DEFAULT, true)
        }
        if (loginSessionData.TokenExpiry) {
            // this.options.tokenExpiry = loginSessionData.TokenExpiry
        }
        if (loginSessionData.RefreshToken) {
            // this.options.refreshToken = loginSessionData.RefreshToken
            // this.handleTokenExpiry()
        }
    }
}

export default AuthClass
