import md5 from 'js-md5'

import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { EventsSdkOptions, ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import {
    ExternalLoginNewStackResponseData,
    ExternalLoginOldStackResponseData,
    ExternalLoginResponse,
    LoginSessionData,
    LoginSessionPayload,
    Settings
} from '@/types/auth'
import { LoginType } from '@/enum/auth.enum'
import { getSettingsUrl, refreshTokenUrl } from '@/classes/auth/auth.urls'
import { StorageClass } from '@/classes/storage/storage.class'

class AuthClass{
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass

        this.storageKey = ''
    }

    private delay = 1000
    public lastLoginTimestamp: number | undefined
    public token: string | undefined

    private storageKey: string

    public async login (options: EventsSdkOptions) {
        const payload: LoginSessionPayload = {
            token: options.token,
            email: options.email,
            password: options.password
        }

        this.storageKey = md5(JSON.stringify(payload))

        if (this.lastLoginTimestamp && this.lastLoginTimestamp + this.delay > new Date().getTime()) {
            return
        }

        this.updateLastLoginTimestamp()

        const isLoggedIn = await this.checkLoginStatus(this.storageKey)

        if (!isLoggedIn) {
            await this.userLoginFunction(payload, this.storageKey, options.loginType)
        }
    }

    public updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private async checkLoginStatus (key: string): Promise<boolean> {
        const loginSessionData = await StorageClass.getSessionStorageDataByKey(key)

        if (loginSessionData) {
            this.onLoginResponse(loginSessionData)

            return true
        }

        return false
    }

    private async userLoginFunction (
        payload: LoginSessionPayload,
        key: string,
        loginType: LoginType,
    ) {
        let externalLoginResponse

        let settings

        let loginSessionData: Partial<LoginSessionData>

        if (this.eventsSdkClass.options.isNewStack) {
            externalLoginResponse = await this.externalLogin<ExternalLoginNewStackResponseData>(
                this.eventsSdkClass.options.loginUrl,
                payload,
                loginType,
            )

            settings = await this.getSettings(externalLoginResponse.Data.AccessToken)

            loginSessionData = {
                ...externalLoginResponse.Data,
                ...settings
            }
        } else {
            externalLoginResponse = await this.externalLogin<ExternalLoginOldStackResponseData>(
                this.eventsSdkClass.options.loginUrl,
                payload,
                loginType,
            )

            loginSessionData = {
                ...externalLoginResponse.Data.Socket,
            }
        }

        if (externalLoginResponse) {
            this.onLoginResponse(loginSessionData)

            await StorageClass.updateSessionStorageKey(key, loginSessionData)
        }
    }

    private onLoginResponse (loginSessionData: Partial<LoginSessionData>) {
        if (loginSessionData.MonitorList && loginSessionData.MonitorList.length) {
            this.eventsSdkClass.servers = [ ...loginSessionData.MonitorList ]
            this.eventsSdkClass.server = this.eventsSdkClass.servers.reduce((prev, current) =>
                (prev.Priority > current.Priority) ? prev : current
            )
        }
        if (!this.eventsSdkClass.options.isNewStack && this.eventsSdkClass.options.servers) {
            this.eventsSdkClass.servers = [ ...this.eventsSdkClass.options.servers ]
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
        if (loginSessionData.Token) {
            this.token = loginSessionData.Token
            this.eventsSdkClass.connect(ServerParameter.DEFAULT, true)
        }
        if (loginSessionData.RefreshToken && loginSessionData.IdentityCodeExpiry && this.eventsSdkClass.options.loginType === LoginType.USER) {
            this.eventsSdkClass.options.refreshToken = loginSessionData.RefreshToken
            this.eventsSdkClass.options.tokenExpiry = loginSessionData.IdentityCodeExpiry
            this.handleTokenExpiry()
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
                if (refreshTokenUrl && this.eventsSdkClass.options.refreshToken) {
                    this.eventsSdkClass.socketIoClass.closeAllConnections()

                    const refreshTokenResponse = await this.refreshToken(refreshTokenUrl, this.eventsSdkClass.options.refreshToken)

                    const settings = await this.getSettings(refreshTokenResponse.Data.AccessToken)

                    const loginSessionData: LoginSessionData = {
                        ...refreshTokenResponse.Data,
                        ...settings
                    }

                    this.onLoginResponse(loginSessionData)

                    await StorageClass.updateSessionStorageKey(this.storageKey, loginSessionData)
                }
            },
            maxAllowedTimeout)
    }

    private async externalLogin<T> (
        url: string,
        { password, token, email }: LoginSessionPayload,
        loginType: LoginType,
    ): Promise<ExternalLoginResponse<T>> {
        let body: string

        if (this.eventsSdkClass.options.isNewStack) {
            if (loginType === LoginType.TOKEN) {
                body = JSON.stringify({
                    identityType: LoginType.TOKEN,
                    token
                })
            } else {
                body = JSON.stringify({
                    identityType: LoginType.USER,
                    username: email,
                    password,
                })
            }
        } else {
            if (token) {
                body = JSON.stringify({ token })

                url = `${url}/Token`
            } else {
                body = JSON.stringify({
                    email,
                    pin: password
                })

                url = `${url}/User`
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

    private async refreshToken<T> (refreshTokenUrl: string, oldRefreshToken: string): Promise<ExternalLoginResponse<T>> {
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
