import { Server } from '@/classes/events-sdk/events-sdk.types'

export interface LoginSessionPayload {
    token: string,
    email: string,
    username: string,
    password: string
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

export interface ExternalLoginResponse<T> {
    StatusCode: number,
    Status: string,
    Data: T
}

export interface ExternalLoginResponseDataOldStack {
    Socket: Socket,
}

export interface ExternalLoginResponseDataNewStack {
    AccessToken: string,
    RefreshToken: string
}

export interface Settings {
    IdentityCode: string,
    IdentityCodeExpiry: Date,
    PersonID: number,
    PersonType: number,
    ExtensionMonitorID: number,
    MonitorList: Server[]
}

export interface LoginSessionData extends Settings, Socket, ExternalLoginResponseDataNewStack {}