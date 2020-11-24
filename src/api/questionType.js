import { axios } from '@/utils/request'

const api = {
  questionTypeTree: '/questionType/tree',
  questionTypeList: '/questionType/find',
  questionTypePost: '/questionType/post',
  questionTypeDelete: '/questionType/delete',
  questionTypePut: '/questionType/put'
}

export default api

export function questionTypeTree(parameter) {
  return axios({
    url: api.questionTypeTree,
    method: 'post',
    data: parameter
  })
}

export function questionTypeList(parameter) {
  return axios({
    url: api.questionTypeList,
    method: 'post',
    data: parameter
  })
}

export function questionTypePost(parameter) {
  return axios({
    url: api.questionTypePost,
    method: 'post',
    data: parameter
  })
}

export function questionTypeDelete(parameter) {
  return axios({
    url: api.questionTypeDelete,
    method: 'post',
    data: parameter
  })
}

export function questionTypePut(parameter) {
  return axios({
    url: api.questionTypePut,
    method: 'post',
    data: parameter
  })
}