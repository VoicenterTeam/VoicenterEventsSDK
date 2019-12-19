import axios from 'axios'

//TODO: reset baseURL
const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
})

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
