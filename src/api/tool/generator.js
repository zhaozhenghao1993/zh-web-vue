import { axios } from '@/utils/request'

export function generatorList (parameter) {
  return axios({
    url: '/tool/generator',
    method: 'get',
    params: parameter
  })
}

export function generatorCode (parameter) {
  return axios({
    url: '/tool/generator/code',
    method: 'get',
    params: parameter,
    responseType: 'blob'
  })
}
