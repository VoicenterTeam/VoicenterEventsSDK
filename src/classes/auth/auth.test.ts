import AuthClass from './auth.class'
import { eventsSdkDefaultOptions } from '../events-sdk/events-sdk-default-options'

describe('AuthClass', () => {
    it('should be cypher', () => {
        const key = AuthClass.login(eventsSdkDefaultOptions)
        expect(typeof key).toBe('string')
    })
})