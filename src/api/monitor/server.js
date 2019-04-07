import { axios } from '@/utils/request'

export function baseInfo () {
  return axios({
    url: '/monitor/server/base',
    method: 'get'
  })
}

export function instantInfo () {
  return axios({
    url: '/monitor/server/instant',
    method: 'get'
  })
}
