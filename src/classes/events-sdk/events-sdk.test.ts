import EventsSdkClass from '@/classes/events-sdk/events-sdk.class'
import { LoginType } from '@/enum/auth.enum'

describe('EventsSdkClass', () => {
    it('should be true', () => {
        const eventsSdkClass = new EventsSdkClass({
            loginUrl: 'https://loginapidev.voicenter.co.il/Auth/Login/Voicenter/Monitor',
            refreshTokenUrl: 'https://loginapidev.voicenter.co.il/Auth/RefreshToken',
            loginType: LoginType.TOKEN, // <=== "User" or "Token"
            token: 'QMSVU9dwNYC9Le9VCBqx24AB9TYyWj9Xn5aCPV0GFHIWoShQqfPtnAPmnw24xpJIUSsDDtlac2OPpjx0t3MSkxH3AhiQGHCeGZ8e',
            getSettingsUrl: 'https://loginapidev.voicenter.co.il/Application/GetSettings',
            isNewStack: true,
        })

        expect(eventsSdkClass.init()).toBe(true)
    })
})
