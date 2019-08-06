import Vue from 'vue'
import axios from 'axios'

const $axios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    headers: {}
})

$axios.interceptors.response.use((res) => {
    return res
}, err => {
    return Promise.reject(err)
})

Vue.prototype.$axios = $axios

export default $axios
