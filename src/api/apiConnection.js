import Vue from 'vue'
import axios from 'axios'
import {autorizationData} from '@/helpers/authUtil'

const $axios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {
        Authorization: autorizationData(),
    }
})

$axios.interceptors.response.use((res) => {
    return res.data
}, (e) => {
    return Promise.reject(e)
})

Vue.prototype.$axios = $axios

export default $axios
