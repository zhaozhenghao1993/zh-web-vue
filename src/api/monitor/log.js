import { axios } from '@/utils/request'

export function logList (parameter) {
  return axios({
    url: '/monitor/log',
    method: 'get',
    params: parameter
  })
}

export function logBatchDelete (parameter) {
  return axios({
    url: '/monitor/log',
    method: 'delete',
    data: parameter
  })
}

export function logClearDelete (type) {
  return axios({
    url: '/monitor/log/' + type + '/clear',
    method: 'delete'
  })
}

export function logVisit () {
  return axios({
    url: '/monitor/log/visit',
    method: 'get'
  })
}

export function logVisitWeek () {
  return axios({
    url: '/monitor/log/visit/week',
    method: 'get'
  })
}
