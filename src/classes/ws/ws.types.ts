export interface WsOptions {
    reconnection: boolean,
    perMessageDeflate: boolean,
    upgrade: boolean,
    transports: string[],
    debug: boolean,
    query: {
        token: string
    }
}