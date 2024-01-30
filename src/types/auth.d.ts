import { Server } from '@/classes/events-sdk/events-sdk.types'
import { LoginType } from '@/enum/auth.enum'

export interface LoginSessionPayload {
    token: string,
    email: string,
    password: string
}

export interface ExternalLoginRequestBody {
    identityType: LoginType,
    username?: string,
    password?: string,
    token?: string
}

interface ExternalLoginResponseData {
    AccessToken: string,
    RefreshToken: string
}

export interface ExternalLoginResponse {
    StatusCode: number,
    Status: string,
    Data: ExternalLoginResponseData
}

export interface Socket {
    Client: string,
    PersonId: number,
    RefreshToken: string,
    RefreshTokenExpiry: Date,
    Token: string,
    TokenExpiry: Date,
    URLList: string[],
    Url: string,
    Version: string
}

export interface Settings {
    IdentityCode: string,
    IdentityCodeExpiry: Date,
    PersonID: number,
    PersonType: number,
    ExtensionMonitorID: number,
    MonitorList: Server[]
}

export interface LoginSessionData extends Settings, ExternalLoginResponseData {}