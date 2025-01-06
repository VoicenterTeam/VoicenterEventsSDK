import md5 from 'md5'

import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { ServerParameter } from '@/classes/events-sdk/events-sdk.types'
import {
    ExternalLoginNewStackResponseData,
    ExternalLoginOldStackResponseData,
    ExternalLoginResponse,
    LoginSessionData,
    LoginSessionPayload,
    Settings
} from '@/types/auth'
import { LoginType } from '@/enum/auth.enum'
import { StorageClass } from '@/classes/storage/storage.class'
import { ActionNameEnum, LevelEnum, LogTypeEnum } from '@voicenter-team/socketio-storage-logger'

class AuthClass {
    constructor (private readonly eventsSdkClass: EventsSdkClass) {
        this.eventsSdkClass = eventsSdkClass

        this.storageKey = ''
    }

    private delay = 1000
    public lastLoginTimestamp: number | undefined
    public token: string | undefined
    private refreshToken: string | undefined
    private tokenExpiry: Date | undefined

    private storageKey: string

    public async login () {
        const payload: LoginSessionPayload = {
            token: this.eventsSdkClass.options.token && this.eventsSdkClass.options.token,
            email: this.eventsSdkClass.options.email && this.eventsSdkClass.options.email,
            password: this.eventsSdkClass.options.password && this.eventsSdkClass.options.password
        }

        this.storageKey = md5(JSON.stringify({
            ...this.eventsSdkClass.options,
            loggerSocketConnection: null
        }, this.eventsSdkClass.getCircularReplacer()))

        if (this.lastLoginTimestamp && this.lastLoginTimestamp + this.delay > new Date().getTime()) {
            return
        }

        this.updateLastLoginTimestamp()

        const loginSessionData = await this.checkLoginStatus(this.storageKey)

        if (!loginSessionData) {
            StorageClass.clearSessionStorage()

            return await this.userLoginFunction(payload, this.storageKey, this.eventsSdkClass.options.loginType)
        }

        return loginSessionData
    }

    public updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private async checkLoginStatus (key: string): Promise<LoginSessionData | undefined> {
        const loginSessionData = await StorageClass.getSessionStorageDataByKey<LoginSessionData>(key)

        if (!loginSessionData) {
            return
        }

        return loginSessionData
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

        await StorageClass.updateSessionStorageKey(key, loginSessionData)

        return loginSessionData
    }

    public onLoginResponse (loginSessionData: Partial<LoginSessionData>) {
        if (!this.eventsSdkClass.options.isNewStack && this.eventsSdkClass.options.servers) {
            this.eventsSdkClass.servers = [ ...this.eventsSdkClass.options.servers ]
            this.eventsSdkClass.server = this.eventsSdkClass.servers.reduce((prev, current) =>
                (prev.Priority > current.Priority) ? prev : current
            )
        }
        if (this.eventsSdkClass.options.isNewStack && this.eventsSdkClass.options.servers) {
            this.eventsSdkClass.servers = [ ...this.eventsSdkClass.options.servers ]
            this.eventsSdkClass.server = this.eventsSdkClass.servers.reduce((prev, current) =>
                (prev.Priority > current.Priority) ? prev : current
            )
        }
        if (loginSessionData.MonitorList && loginSessionData.MonitorList.length) {
            this.eventsSdkClass.servers = [ ...loginSessionData.MonitorList ]
            this.eventsSdkClass.server = this.eventsSdkClass.servers.reduce((prev, current) =>
                (prev.Priority > current.Priority) ? prev : current
            )
        }
        if (!this.eventsSdkClass.options.isNewStack && !this.eventsSdkClass.servers.length && loginSessionData.URLList) {
            this.eventsSdkClass.URLList = loginSessionData.URLList
        }
        if (!this.eventsSdkClass.options.isNewStack && !this.eventsSdkClass.URLList.length && !this.eventsSdkClass.servers.length) {
            throw new Error('Socket servers not defined')
        }
        if (this.eventsSdkClass.options.isNewStack && !this.eventsSdkClass.servers.length) {
            throw new Error('Socket servers not defined')
        }
        if (this.eventsSdkClass.server) {
            this.eventsSdkClass.socketIoClass.getSocketIoFunction(`v=${this.eventsSdkClass.server.Version}`)
        }
        if (!this.eventsSdkClass.server && this.eventsSdkClass.URLList.length) {
            this.eventsSdkClass.socketIoClass.getSocketIoFunction(`v=${loginSessionData.Version}`)
        }
        if (loginSessionData.IdentityCode) {
            this.token = loginSessionData.IdentityCode
            this.eventsSdkClass.connect(ServerParameter.MAIN)
        }
        if (loginSessionData.Token) {
            this.token = loginSessionData.Token
            this.eventsSdkClass.connect(ServerParameter.MAIN)
        }
        if (loginSessionData.RefreshToken && loginSessionData.IdentityCodeExpiry && this.eventsSdkClass.options.loginType === LoginType.USER) {
            this.refreshToken = loginSessionData.RefreshToken
            this.tokenExpiry = loginSessionData.IdentityCodeExpiry
            this.handleTokenExpiry()
        }
        if (loginSessionData.RefreshToken && loginSessionData.TokenExpiry && this.normalizeLoginType(this.eventsSdkClass.options.loginType) === LoginType.USER) {
            this.refreshToken = loginSessionData.RefreshToken
            this.tokenExpiry = loginSessionData.TokenExpiry
            this.handleTokenExpiry()
        }
    }

    public handleTokenExpiry () {
        if (!this.eventsSdkClass.options.refreshTokenUrl) {
            throw new Error('refreshTokenUrl not provided')
        }

        let date: Date

        if (this.tokenExpiry) {
            date = new Date(this.tokenExpiry)
        } else {
            return
        }

        const timeout = date.getTime() - new Date().getTime() - 5000 // 5 seconds before expire

        const maxAllowedTimeout = Math.min(timeout, 0x7FFFFFFF)

        setTimeout(
            async () => {
                if (this.refreshToken) {
                    this.eventsSdkClass.socketIoClass.closeAllConnections()

                    let settings

                    let loginSessionData: Partial<LoginSessionData>

                    if (this.eventsSdkClass.options.isNewStack) {
                        const refreshTokenResponse = await this.externalRefreshToken<ExternalLoginNewStackResponseData>(
                            this.eventsSdkClass.options.refreshTokenUrl,
                            this.refreshToken
                        )

                        settings = await this.getSettings(refreshTokenResponse.Data.AccessToken)

                        loginSessionData = {
                            ...refreshTokenResponse.Data,
                            ...settings
                        }
                    } else {
                        const refreshTokenResponse = await this.externalRefreshToken<ExternalLoginOldStackResponseData>(
                            this.eventsSdkClass.options.refreshTokenUrl,
                            this.refreshToken
                        )

                        loginSessionData = {
                            ...refreshTokenResponse.Data.Socket,
                        }
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
        if (!url) {
            throw new Error('loginUrl not provided')
        }

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
            if (this.eventsSdkClass.options.loginType === LoginType.TOKEN) {
                body = JSON.stringify({ token })

                url = `${url}/${LoginType.TOKEN}`
            } else {
                body = JSON.stringify({
                    email,
                    pin: password
                })

                url = `${url}/${LoginType.USER}`
            }
        }

        let statusCode

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body,
            })

            if (!res.ok && res.status === 400) {
                statusCode = 400

                throw new Error('Bad body request. Login type or isNewStack values not correct or not provided')
            }

            if (!res.ok && res.status === 401) {
                statusCode = 401

                throw new Error('Unauthorized. Invalid token provided')
            }

            if (!res.ok && res.status === 403) {
                statusCode = 403

                throw new Error('Forbidden. Identity token not provided or not valid')
            }

            const data = await res.json()

            if (data.error) {
                throw new Error(data.error)
            }
            return data
        } catch (error) {
            this.eventsSdkClass.loggerClass.log({
                Message: `External login request error with the login type ${loginType} ${loginType === LoginType.TOKEN ? token : email}`,
                ActionName: ActionNameEnum.WSCONNECT,
                isShowClient: false,
                Status: 'External login error',
                StatusCode: statusCode ? statusCode : 400,
                Level: LevelEnum.ERROR,
                LogType: LogTypeEnum.ERROR
            })

            throw error
        }
    }

    private async getSettings (token: string): Promise<Settings> {
        try {
            if (!this.eventsSdkClass.options.getSettingsUrl) {
                throw new Error('getSettingsUrl not provided')
            }

            const res = await fetch(this.eventsSdkClass.options.getSettingsUrl, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!res.ok && res.status === 401) {
                throw new Error('Unauthorized. Access token not provided or not valid')
            }

            return res.json()
        } catch (error) {
            this.eventsSdkClass.loggerClass.log({
                Message: `Get settings error with token ${token}, error: ${error}`,
                ActionName: ActionNameEnum.WSCONNECT,
                isShowClient: false,
                Status: 'Get settings error',
                StatusCode: 400,
                Level: LevelEnum.ERROR,
                LogType: LogTypeEnum.ERROR
            })

            throw error
        }
    }

    private async externalRefreshToken<T> (refreshTokenUrl: string, oldRefreshToken: string): Promise<ExternalLoginResponse<T>> {
        try {
            const res = await fetch(refreshTokenUrl, {
                method: 'GET',

                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${oldRefreshToken}`
                }
            })
            return res.json()
        } catch (error) {
            this.eventsSdkClass.loggerClass.log({
                Message: `Refresh token error with old refresh token ${oldRefreshToken}, url: ${refreshTokenUrl}, error: ${error}`,
                ActionName: ActionNameEnum.WSCONNECT,
                isShowClient: false,
                Status: 'Get settings error',
                StatusCode: 400,
                Level: LevelEnum.ERROR,
                LogType: LogTypeEnum.ERROR
            })

            throw error
        }
    }

    private normalizeLoginType (loginType: string): string {
        return loginType.charAt(0).toUpperCase() + loginType.slice(1).toLowerCase()
    }
}

export default AuthClass
