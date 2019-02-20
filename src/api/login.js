import request from '@/utils/request'

export function login (username, password) {
  const data = 'username=' + username + '&password=' + password
  return request({
    url: '/api/v1/sys/login',
    method: 'post',
    data: data
  })
}

export function getUserInfo (token) {
  return request({
    url: '/api/v1/sys/user/info',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/api/v1/sys/logout',
    method: 'get'
  })
}
