import Vue from 'vue'
import axios from 'axios'
import store from "../store/store";
import {authorizationData} from '@/helpers/authUtil'

const $axios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
})

$axios.interceptors.request.use(
    (config) => {
        config.headers.Authorization = authorizationData()
        store.dispatch('dashboards/setLoadingData', true)
        return config
    }, (e) => {
        return Promise.reject(e)
    })

$axios.interceptors.response.use(
    (res) => {
        store.dispatch('dashboards/setLoadingData', false)
        return res.data
    }, (e) => {
        return Promise.reject(e)
    })

Vue.prototype.$axios = $axios

export default $axios
