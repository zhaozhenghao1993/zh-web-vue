import request from '@/utils/request'

export function login (username, password) {
  const data = 'username=' + username + '&password=' + password
  return request({
    url: '/sys/login',
    method: 'post',
    data: data
  })
}

export function getInfo (token) {
  return request({
    url: '/sys/user/info',
    method: 'get'
  })
}

export function logout () {
  return request({
    url: '/sys/logout',
    method: 'get'
  })
}
