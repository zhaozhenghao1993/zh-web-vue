import { axios } from '@/utils/request'

export function profile (parameter) {
  return axios({
    url: '/sys/user/profile',
    method: 'put',
    data: parameter
  })
}

export function profilePassword (parameter) {
  return axios({
    url: '/sys/user/profile/password',
    method: 'put',
    data: parameter
  })
}

export function profileTheme (parameter) {
  return axios({
    url: '/sys/user/profile/theme',
    method: 'put',
    data: parameter
  })
}

export function profileColor (parameter) {
  return axios({
    url: '/sys/user/profile/color',
    method: 'put',
    data: parameter
  })
}
