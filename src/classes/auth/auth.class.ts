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

    public async login (options: EventsSdkOptions) {
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

        const isLoggedIn = this.checkLoginStatus(options, key)

        if (!isLoggedIn) {
            await this.userLoginFunction(payload)
        }
    }

    public updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private checkLoginStatus (options: EventsSdkOptions, key: string): boolean {
        let loginSessionData: LoginSessionData
        if (options.environment === Environment.BROWSER && window) {
            const loginSessionKey = window.sessionStorage.getItem(key)
            if (loginSessionKey) {
                loginSessionData = JSON.parse(loginSessionKey)
                this.onLoginResponse(loginSessionData)
                return true
            }
        }
        // if (options.environment === Environment.CHROME_EXTENSION && chrome) {
        //     console.log('extension', key)
        // }
        return false
    }

    private onLoginResponse (loginSessionData: LoginSessionData) {
        if (loginSessionData.Client) {
            console.log('getSocketIoFunction...')
            this.eventsSdkClass.getSocketIoFunction(loginSessionData.Client)
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

    private async userLoginFunction (payload: LoginSessionPayload) {
        const externalLoginUrl = this.getExternalLoginUrl(this.eventsSdkClass.options.loginUrl, this.eventsSdkClass.options.loginType)

        const externalLoginResponse = await this.externalLogin(externalLoginUrl, payload)

        this.onLoginResponse(externalLoginResponse)
    }

    private getExternalLoginUrl (baseUrl: string, loginType: string) {
        if (loginType === 'user') {
            return `${baseUrl}/User`
        }
        if (loginType === 'token') {
            return `${baseUrl}/Token`
        }
        return baseUrl
    }

    private async externalLogin (url: string, { email, password, token, username }: LoginSessionPayload) {
        let body: string
        if (token) {
            body = JSON.stringify({ token })
        } else if (username) {
            body = JSON.stringify({
                username,
                password
            })
        } else {
            body = JSON.stringify({
                email,
                pin: password
            })
        }
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body,
        })
        const data = await res.json()
        if (data.error) {
            throw new Error(data.error)
        }
        return data.Data.Socket
    }
}

export default AuthClass
