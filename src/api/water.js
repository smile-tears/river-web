import { axios } from '@/utils/request'

const api = {
  waterList: '/water/find',
  waterList2: '/water/find2',
  waterPost: '/water/post',
  waterDelete: '/water/delete',
  waterPut: '/water/put',
  waterReport: '/water/report',
  getCurrentSw: '/currentSw',
}

export default api

export function getCurrentSw(parameter) {
  return axios({
    url: api.getCurrentSw,
    method: 'post',
    data: parameter
  })
}

export function waterList(parameter) {
  return axios({
    url: api.waterList,
    method: 'post',
    data: parameter
  })
}

export function waterList2(parameter) {
  return axios({
    url: api.waterList2,
    method: 'post',
    data: parameter
  })
}

export function waterPost(parameter) {
  return axios({
    url: api.waterPost,
    method: 'post',
    data: parameter
  })
}

export function waterDelete(parameter) {
  return axios({
    url: api.waterDelete,
    method: 'post',
    data: parameter
  })
}

export function waterPut(parameter) {
  return axios({
    url: api.waterPut,
    method: 'post',
    data: parameter
  })
}

export function waterReport(parameter) {
  return axios({
    url: api.waterReport,
    method: 'post',
    data: parameter
  })
}

