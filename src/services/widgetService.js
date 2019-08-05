import $axios from './apiService'
import { widgets } from '@/store/mockData'


export function getAll() {
    // return $axios.get(`/Widgets/GetAllWidgets/`)
    return widgets
}

export function find(id) {
    // return $axios.get(`/Widgets/GetAllWidgets/{$id}`)
}

export function update(data) {
    // return $axios.post(`/Widgets/Update/`)
}

export function store(data) {
    // return $axios.get(`/Widgets/Add/`)
}

