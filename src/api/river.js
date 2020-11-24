import { axios } from '@/utils/request'

const api = {
  riverList: '/river/find',
  riverPost: '/river/post',
  riverDelete: '/river/delete',
  riverPut: '/river/put'
}

export default api

export function riverList(parameter) {
  return axios({
    url: api.riverList,
    method: 'post',
    data: parameter
  })
}

export function riverPost(parameter) {
  return axios({
    url: api.riverPost,
    method: 'post',
    data: parameter
  })
}

export function riverDelete(parameter) {
  return axios({
    url: api.riverDelete,
    method: 'post',
    data: parameter
  })
}

export function riverPut(parameter) {
  return axios({
    url: api.riverPut,
    method: 'post',
    data: parameter
  })
}