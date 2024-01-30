import md5 from 'js-md5'

import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { Environment, EventsSdkOptions, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import {
    ExternalLoginRequestBody,
    ExternalLoginResponse,
    LoginSessionData,
    LoginSessionPayload,
    Settings
} from '@/types/auth'
import { LoginType } from '@/enum/auth.enum'
import { getSettingsUrl, newLoginUrl } from '@/classes/auth/auth.urls'

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
            password: options.password
        }

        const key = md5(JSON.stringify(payload))

        if (this.lastLoginTimestamp && this.lastLoginTimestamp + this.delay > new Date().getTime()) {
            return
        }

        this.updateLastLoginTimestamp()

        const isLoggedIn = await this.checkLoginStatus(options.environment, key)

        if (!isLoggedIn) {
            await this.userLoginFunction(payload, key, options.loginType)
        }
    }

    public updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private async checkLoginStatus (environment: Environment, key: string): Promise<boolean> {
        let loginSessionData: LoginSessionData
        if (environment === Environment.BROWSER && window) {
            const loginSessionKey = window.sessionStorage.getItem(key)

            if (loginSessionKey) {
                loginSessionData = JSON.parse(loginSessionKey)

                this.onLoginResponse(loginSessionData)

                return true
            }
        }
        if (environment === Environment.CHROME_EXTENSION && chrome) {
            const loginSessionKey = await chrome.storage.session.get(key)

            if (loginSessionKey[key]) {
                loginSessionData = JSON.parse(loginSessionKey[key])

                this.onLoginResponse(loginSessionData)

                return true
            }
        }
        return false
    }

    private onLoginResponse (loginSessionData: Partial<LoginSessionData>) {
        if (loginSessionData.MonitorList && loginSessionData.MonitorList.length) {
            this.eventsSdkClass.servers = [ ...loginSessionData.MonitorList ]
            this.eventsSdkClass.server = this.eventsSdkClass.servers.reduce((prev, current) =>
                (prev.Priority > current.Priority) ? prev : current
            )
        }
        if (this.eventsSdkClass.server) {
            this.eventsSdkClass.socketIoClass.getSocketIoFunction(`v=${this.eventsSdkClass.server.Version}`)
        }
        if (loginSessionData.IdentityCode) {
            this.token = loginSessionData.IdentityCode
            this.eventsSdkClass.connect(ServerParameter.DEFAULT, true)
        }
        if (loginSessionData.RefreshToken && loginSessionData.IdentityCodeExpiry && this.eventsSdkClass.options.loginType === LoginType.USER) {
            this.eventsSdkClass.options.refreshToken = loginSessionData.RefreshToken
            this.eventsSdkClass.options.tokenExpiry = loginSessionData.IdentityCodeExpiry
            this.handleTokenExpiry()
        }
    }

    private async userLoginFunction (
        payload: LoginSessionPayload,
        key: string,
        loginType: LoginType,
    ) {
        const externalLoginResponse = await this.externalLogin(
            newLoginUrl,
            payload,
            loginType,
        )

        const settings = await this.getSettings(externalLoginResponse.Data.AccessToken)

        this.onLoginResponse({
            ...externalLoginResponse.Data,
            ...settings
        })

        if (this.eventsSdkClass.options.environment === Environment.BROWSER) {
            window.sessionStorage.setItem(key, JSON.stringify({
                ...externalLoginResponse.Data,
                ...settings
            }))
        }
        if (this.eventsSdkClass.options.environment === Environment.CHROME_EXTENSION) {
            await chrome.storage.session.set({
                [key]: JSON.stringify({
                    ...externalLoginResponse.Data,
                    ...settings
                })
            })
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

    private async externalLogin (
        url: string,
        { password, token, email }: LoginSessionPayload,
        loginType: LoginType,
    ): Promise<ExternalLoginResponse> {
        let body: ExternalLoginRequestBody

        if (loginType === LoginType.TOKEN) {
            body = {
                identityType: LoginType.TOKEN,
                token
            }
        } else {
            body = {
                identityType: LoginType.USER,
                username: email,
                password,
            }
        }

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
        })

        const data = await res.json()

        if (data.error) {
            throw new Error(data.error)
        }
        return data
    }

    private async getSettings (token: string): Promise<Settings> {
        const res = await fetch(getSettingsUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.json()
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
