import { axios } from '@/utils/request'

const api = {
  waterList: '/water/find',
  waterPost: '/water/post',
  waterDelete: '/water/delete',
  waterPut: '/water/put'
}

export default api

export function waterList(parameter) {
  return axios({
    url: api.waterList,
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