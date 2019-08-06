import axios from 'axios'
import {dashboards} from '@/store/mockData'

export const DashboardApi = {
    getAll() {
        // return $axios.get(`/DashBoards/GetAllDashBoards/`)
        return dashboards
    },

    find(id) {
        // return $axios.get(`/DashBoards/Get/{$id}`)
    },

    update(data) {
        // return $axios.post(`/DashBoards/Update/`)
    },

    store(data) {
        // return $axios.get(`/DashBoards/Add/`)
    }
}
