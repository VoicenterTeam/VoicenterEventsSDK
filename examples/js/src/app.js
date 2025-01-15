import EventsSdk from '@voicenter-team/events-sdk'

(async () => {
    const sdk = new EventsSdk({
        loginType: 'Token',
        isNewStack: true,
        token: 'GvNkq0UFK3CcQiOujr705yIWITClJcy1kBRW2dajxg6c9GlWkPHCQDVfwcfG0xnQiT5NEMvspo0F7kCFbyvPjID9wknEVhy3mGyC',
        getSettingsUrl: 'https://loginapidev.voicenter.co.il/Application/GetSettings',
        loginUrl: "https://loginapidev.voicenter.co.il/Auth/Login/Voicenter/Monitor",
        refreshTokenUrl: "https://loginapidev.voicenter.co.il/Auth/RefreshToken",
    })

    await sdk.init();

    sdk.on("*", (data) => {
        console.log(`Event: ${data.name}`)
    })
})()
