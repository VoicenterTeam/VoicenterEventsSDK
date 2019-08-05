import axios from 'axios'
import { dashboards} from '@/store/mockData'
export function getDashboards() {
  //TODO: integrate api call to get dashboards from api
  return dashboards
}



export function getAll() {
    // return $axios.get(`/DashBoards/GetAllWidgets/`)
    return widgets
}

export function find(id) {
    // return $axios.get(`/DashBoards/GetAllWidgets/{$id}`)
}

export function update(data) {
    // return $axios.post(`/DashBoards/Update/`)
}

export function store(data) {
    // return $axios.get(`/DashBoards/Add/`)
}
