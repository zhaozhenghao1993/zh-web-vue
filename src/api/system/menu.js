import { axios } from '@/utils/request'

export function menuList (parameter) {
  return axios({
    url: '/sys/menu',
    method: 'get',
    params: parameter
  })
}

export function menuSave (parameter) {
  return axios({
    url: '/sys/menu',
    method: 'post',
    data: parameter
  })
}

export function menuEdit (id, parameter) {
  return axios({
    url: '/sys/menu/' + id,
    method: 'put',
    data: parameter
  })
}

export function menuDelete (id) {
  return axios({
    url: '/sys/menu/' + id,
    method: 'delete'
  })
}
