import { axios } from '@/utils/request'

export function dictList (parameter) {
  return axios({
    url: '/sys/dict',
    method: 'get',
    params: parameter
  })
}

export function dictInfo (id) {
  return axios({
    url: '/sys/dict/' + id,
    method: 'get'
  })
}

export function dictSave (parameter) {
  return axios({
    url: '/sys/dict',
    method: 'post',
    data: parameter
  })
}

export function dictEdit (id, parameter) {
  return axios({
    url: '/sys/dict/' + id,
    method: 'put',
    data: parameter
  })
}

export function dictDelete (id) {
  return axios({
    url: '/sys/dict/' + id,
    method: 'delete'
  })
}

export function dictItemList (dictCode, parameter) {
  return axios({
    url: '/sys/dict/' + dictCode + '/item',
    method: 'get',
    params: parameter
  })
}

export function dictItemInfo (dictCode, id) {
  return axios({
    url: '/sys/dict/' + dictCode + '/item/' + id,
    method: 'get'
  })
}

export function dictItemSave (dictCode, parameter) {
  return axios({
    url: '/sys/dict/' + dictCode + '/item',
    method: 'post',
    data: parameter
  })
}

export function dictItemEdit (dictCode, id, parameter) {
  return axios({
    url: '/sys/dict/' + dictCode + '/item/' + id,
    method: 'put',
    data: parameter
  })
}

export function dictItemDelete (dictCode, id) {
  return axios({
    url: '/sys/dict/' + dictCode + '/item/' + id,
    method: 'delete'
  })
}
