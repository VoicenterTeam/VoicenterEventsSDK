import axios from 'axios'
import store from "../store/store";

const instance = axios.create()

instance.interceptors.request.use(
    (config) => {
        store.dispatch('dashboards/setLoadingData', true)
        return config
    }, (e) => {
        return Promise.reject(e)
    })

instance.interceptors.response.use(
    (res) => {
        store.dispatch('dashboards/setLoadingData', false)
        return res.data
    }, (e) => {
        store.dispatch('dashboards/setLoadingData', false)
        return Promise.reject(e)
    })

export default instance
