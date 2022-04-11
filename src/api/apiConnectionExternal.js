import axios from 'axios'
import setRequestInfo from '@/helpers/setRequestInfoInStore'

const instance = axios.create()

instance.interceptors.request.use(
    (config) => {
        // config.headers['RequestStartTime'] = new Date().getTime();
        return config
    }, (e) => {
        return Promise.reject(e)
    })

instance.interceptors.response.use(
    (res) => {
        setRequestInfo(res)

        return res.data
    }, (e) => {
        return Promise.reject(e)
    })

export default instance
