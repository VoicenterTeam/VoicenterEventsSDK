import { SocketIoClass } from '@/classes/socket-io/socket-io.class'

class AuthClass {
    private static delay = 1000
    public static lastLoginTimestamp: number

    public static login () {
        if (this.lastLoginTimestamp + this.delay > new Date().getTime()) {
        }

        this.updateLastLoginTimestamp()

        return this.onLoginResponse()
    }

    public static updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }

    private static onLoginResponse () {
        return new SocketIoClass('https://loginapi.voicenter.co.il/monitorAPI/GetSocketClient?v=1.3.7').io
    }
}

export default AuthClass
