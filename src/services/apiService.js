import Vue from 'vue'
import axios from 'axios'

const $axios = axios.create({
    // setup root url for all http requests
    baseURL: process.env.VUE_APP_API_URL,
    // customized XMLHttpRequest wrapper library
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    }
})

// global request interceptor
$axios.interceptors.response.use((res) => {
    return res
}, err => {
    // let {response} = err
    // if (response && response.status === 401) {
    //     redirectToLogin()
    // }
    return Promise.reject(err)
})

Vue.prototype.$axios = $axios

export default $axios
