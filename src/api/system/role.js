import { axios } from '@/utils/request'

export function roleList (parameter) {
  return axios({
    url: '/sys/role',
    method: 'get',
    params: parameter
  })
}

export function roleSave (parameter) {
  return axios({
    url: '/sys/role',
    method: 'post',
    data: parameter
  })
}

export function roleEdit (id, parameter) {
  return axios({
    url: '/sys/role/' + id,
    method: 'put',
    data: parameter
  })
}

export function roleDelete (id) {
  return axios({
    url: '/sys/role/' + id,
    method: 'delete'
  })
}

export function batchRoleDelete (parameter) {
  return axios({
    url: '/sys/role',
    method: 'delete',
    data: parameter
  })
}

export function roleInfo (id) {
  return axios({
    url: '/sys/role/' + id,
    method: 'get'
  })
}

export function roleAuthorize (id, parameter) {
  return axios({
    url: '/sys/role/' + id + '/authorize',
    method: 'put',
    data: parameter
  })
}
