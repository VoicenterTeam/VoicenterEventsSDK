import Vue from 'vue'
import axios from 'axios'
import { authorizationData } from '@/helpers/authUtil'
import setRequestInfo from '@/helpers/setRequestInfoInStore'

const $axios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
})

$axios.interceptors.request.use(
    (config) => {
        config.headers.Authorization = authorizationData()
        config.headers['RequestStartTime'] = new Date().getTime();
        return config
    }, (e) => {
        return Promise.reject(e)
    })

$axios.interceptors.response.use(
    (res) => {
        setRequestInfo(res)

        return res.data
    }, (e) => {
        return Promise.reject(e)
    })

Vue.prototype.$axios = $axios

export default $axios
