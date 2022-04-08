import axios from 'axios'

const instance = axios.create()

instance.interceptors.request.use(
    (config) => {
        config.headers['request-startTime'] = new Date().getTime();
        return config
    }, (e) => {
        return Promise.reject(e)
    })

instance.interceptors.response.use(
    (res) => {
        const currentTime = new Date().getTime()
        const startTime = res.config.headers['request-startTime']
        res.headers['request-duration'] = currentTime - startTime

        return res.data
    }, (e) => {
        return Promise.reject(e)
    })

export default instance
