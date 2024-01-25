import md5 from 'js-md5'

import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { Environment, EventsSdkOptions, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import {
    ExternalLoginResponse,
    ExternalLoginResponseDataNewStack,
    ExternalLoginResponseDataOldStack,
    LoginSessionData,
    LoginSessionPayload,
    Settings
} from '@/types/auth'
import { LoginTypeNewStackEnum, LoginTypeOldStackEnum } from '@/enum/auth.enum'
import { getSettingsUrl, newLoginUrl, oldLoginUrl } from '@/classes/auth/auth.urls'

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

        const isLoggedIn = await this.checkLoginStatus(options.environment, key)

        if (!isLoggedIn) {
            await this.userLoginFunction(payload, key, options.loginType, options.newStack)
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

    private async userLoginFunction (
        payload: LoginSessionPayload,
        key: string,
        loginType: LoginTypeNewStackEnum | LoginTypeOldStackEnum,
        newStack: boolean
    ) {
        const externalLoginUrl = this.getExternalLoginUrl(
            loginType,
            newStack
        )

        if (!externalLoginUrl) {
            throw new Error('External login url not found. Check provided options')
        }

        if (newStack) {
            const externalLoginResponse = await this.externalLogin<ExternalLoginResponseDataNewStack>(
                externalLoginUrl,
                payload,
                loginType,
                newStack
            )

            console.log('new stack logic...', externalLoginResponse)

            const settings = await this.getSettings(externalLoginResponse.Data.AccessToken)

            console.log('settings', settings)
        } else {
            const externalLoginResponse = await this.externalLogin<ExternalLoginResponseDataOldStack>(
                externalLoginUrl,
                payload,
                loginType,
                newStack
            )

            this.onLoginResponse(externalLoginResponse.Data.Socket)

            if (this.eventsSdkClass.options.environment === Environment.BROWSER) {
                window.sessionStorage.setItem(key, JSON.stringify(externalLoginResponse.Data.Socket))
            }
            if (this.eventsSdkClass.options.environment === Environment.CHROME_EXTENSION) {
                await chrome.storage.session.set({ [key]: JSON.stringify(externalLoginResponse.Data.Socket) })
            }
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

    private getExternalLoginUrl (
        loginType: LoginTypeNewStackEnum | LoginTypeOldStackEnum,
        newStack: boolean
    ) {
        if (newStack) {
            return newLoginUrl
        } else {
            if (loginType === LoginTypeOldStackEnum.TOKEN) {
                return `${oldLoginUrl}/Token`
            }
            if (loginType === LoginTypeOldStackEnum.USER) {
                return `${oldLoginUrl}/User`
            }
        }
    }

    private async externalLogin<T> (
        url: string,
        { password, token, email }: LoginSessionPayload,
        loginType: LoginTypeNewStackEnum | LoginTypeOldStackEnum,
        newStack: boolean
    ): Promise<ExternalLoginResponse<T>> {
        let body: string

        if (newStack) {
            if (loginType === LoginTypeNewStackEnum.TOKEN) {
                body = JSON.stringify({
                    type: Number(LoginTypeNewStackEnum.TOKEN),
                    token
                })
            } else {
                body = JSON.stringify({
                    type: Number(LoginTypeNewStackEnum.USER),
                    username: email,
                    password,
                })
            }
        } else {
            if (loginType === LoginTypeOldStackEnum.TOKEN) {
                body = JSON.stringify({
                    token
                })
            } else {
                body = JSON.stringify({
                    email,
                    pin: password
                })
            }
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
