import md5 from 'js-md5'
import { EventsSdkOptions } from '@/classes/events-sdk/events-sdk'

class AuthClass {
    private static delay = 1000
    public static lastLoginTimestamp: number

    public static login (options: EventsSdkOptions) {
        const payload = {
            token: options.token,
            email: options.email,
            username: options.username,
            password: options.password
        }

        const key = md5(JSON.stringify(payload))

        this.updateLastLoginTimestamp()

        return key
    }

    public static updateLastLoginTimestamp () {
        this.lastLoginTimestamp = new Date().getTime()
    }
}

export default AuthClass