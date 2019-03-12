import { axios } from '@/utils/request'

export function userList (parameter) {
  return axios({
    url: '/sys/user',
    method: 'get',
    params: parameter
  })
}

export function userSave (parameter) {
  return axios({
    url: '/sys/user',
    method: 'post',
    data: parameter
  })
}

export function userEdit (id, parameter) {
  return axios({
    url: '/sys/user/' + id,
    method: 'put',
    data: parameter
  })
}

export function userDelete (id) {
  return axios({
    url: '/sys/user/' + id,
    method: 'delete'
  })
}

export function batchUserDelete (parameter) {
  return axios({
    url: '/sys/user',
    method: 'delete',
    data: parameter
  })
}

export function userResetPassword (id, parameter) {
  return axios({
    url: '/sys/user/' + id + '/reset',
    method: 'put',
    data: parameter
  })
}
