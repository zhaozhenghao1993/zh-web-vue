import { axios } from '@/utils/request'

export function orgList (parameter) {
  return axios({
    url: '/sys/org',
    method: 'get',
    params: parameter
  })
}

export function orgSave (parameter) {
  return axios({
    url: '/sys/org',
    method: 'post',
    data: parameter
  })
}

export function orgEdit (id, parameter) {
  return axios({
    url: '/sys/org/' + id,
    method: 'put',
    data: parameter
  })
}

export function orgDelete (id) {
  return axios({
    url: '/sys/org/' + id,
    method: 'delete'
  })
}

export function orgTree (parameter) {
  return axios({
    url: '/sys/org/tree',
    method: 'get',
    params: parameter
  })
}
