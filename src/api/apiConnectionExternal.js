import axios from 'axios'

const instance = axios.create()

instance.interceptors.request.use(
    (config) => {
        return config
    }, (e) => {
        return Promise.reject(e)
    })

instance.interceptors.response.use(
    (res) => {
        return res.data
    }, (e) => {
        return Promise.reject(e)
    })

export default instance
