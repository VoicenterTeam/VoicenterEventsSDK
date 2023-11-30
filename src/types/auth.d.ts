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
    URLList: string[],
    Url: string,
    Version: string
}