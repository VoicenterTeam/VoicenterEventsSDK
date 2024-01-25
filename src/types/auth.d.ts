export interface LoginSessionPayload {
    token: string,
    email: string,
    username: string,
    password: string
}

export interface LoginSessionData {
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
    Socket: LoginSessionData,
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
    MonitorList: {
        URLID: string,
        Priority: number,
        Version: string,
        Domain: string,
        MonitorServerData: {
            joghn: string
        }
    }[]
}