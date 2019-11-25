import axios from 'axios'
import {authorizationData} from '@/helpers/authUtil'

const httpInterceptor = axios.create({
    baseURL: process.env.VUE_APP_API_URL_C_PANEL,
})

httpInterceptor.interceptors.request.use(
    (config) => {
        config.headers.Authorization = authorizationData()
        return config
    }, (e) => {
        return Promise.reject(e)
    })

httpInterceptor.interceptors.response.use(
    (res) => {
        return res.data
    }, (e) => {
        return Promise.reject(e)
    })

export default httpInterceptor
