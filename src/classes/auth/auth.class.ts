import md5 from 'js-md5'

import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { Environment, EventsSdkOptions, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import { LoginSessionData, LoginSessionPayload } from '@/types/auth'

class AuthClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass
    }
    
    private delay = 1000
    public lastLoginTimestamp: number | undefined
    public token: string | undefined

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
            await this.userLoginFunction(payload, key)
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
            this.eventsSdkClass.socketIoClass.getSocketIoFunction(loginSessionData.Client)
        }
        if (loginSessionData.Url) {
            this.eventsSdkClass.server = {
                Priority: 0,
                Domain: loginSessionData.Url.replace('https://', '')
            }
        }
        if (loginSessionData.URLList) {
            this.eventsSdkClass.servers = loginSessionData.URLList.map((url, index) => {
                return {
                    Priority: index,
                    Domain: url.replace('https://', '')
                }
            })
        }
        if (loginSessionData.Token) {
            // this.options.token = loginSessionData.Token
            this.token = loginSessionData.Token
            this.eventsSdkClass.connect(ServerParameter.DEFAULT, true)
        }
        if (loginSessionData.RefreshToken && loginSessionData.TokenExpiry && this.eventsSdkClass.options.loginType === 'user') {
            this.eventsSdkClass.options.refreshToken = loginSessionData.RefreshToken
            this.eventsSdkClass.options.tokenExpiry = loginSessionData.TokenExpiry
            this.handleTokenExpiry()
        }
    }

    private async userLoginFunction (payload: LoginSessionPayload, key: string) {
        const externalLoginUrl = this.getExternalLoginUrl(this.eventsSdkClass.options.loginUrl, this.eventsSdkClass.options.loginType)

        const externalLoginResponse = await this.externalLogin(externalLoginUrl, payload, this.eventsSdkClass.options.loginType)

        this.onLoginResponse(externalLoginResponse)

        if (this.eventsSdkClass.options.environment === Environment.BROWSER) {
            window.sessionStorage.setItem(key, JSON.stringify(externalLoginResponse))
        }
    }

    public handleTokenExpiry () {
        let date: Date

        if (this.eventsSdkClass.options.tokenExpiry) {
            date = new Date(this.eventsSdkClass.options.tokenExpiry)
        } else {
            return
        }

        const timeout = date.getTime() - new Date().getTime() - 5000 // 5 seconds before expire

        const maxAllowedTimeout = Math.min(timeout, 0x7FFFFFFF)

        setTimeout(
            async () => {
                if (this.eventsSdkClass.options.refreshTokenUrl && this.eventsSdkClass.options.refreshToken) {
                    let Socket = null
                    const res = await this.refreshToken(this.eventsSdkClass.options.refreshTokenUrl, this.eventsSdkClass.options.refreshToken)

                    if (res.Data) {
                        Socket = res.Data.Socket
                        return this.onLoginResponse(Socket)
                    }

                    throw new Error('Error on refreshToken')
                }
            },
            maxAllowedTimeout)
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

    private async externalLogin (url: string, { password, token, email }: LoginSessionPayload, loginType: string) {
        let body: string

        if (loginType === 'token') {
            body = JSON.stringify({ token })
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

    private async refreshToken (refreshTokenUrl: string, oldRefreshToken: string) {
        const res = await fetch(refreshTokenUrl, {
            method: 'GET',

            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${oldRefreshToken}`
            }
        })
        return res.json()
    }
}

export default AuthClass
