import { axios } from '@/utils/request'

export function postList (parameter) {
  return axios({
    url: '/sys/post',
    method: 'get',
    params: parameter
  })
}

export function postInfo (id) {
  return axios({
    url: '/sys/post/' + id,
    method: 'get'
  })
}

export function postSave (parameter) {
  return axios({
    url: '/sys/post',
    method: 'post',
    data: parameter
  })
}

export function postEdit (id, parameter) {
  return axios({
    url: '/sys/post/' + id,
    method: 'put',
    data: parameter
  })
}

export function postDelete (id) {
  return axios({
    url: '/sys/post/' + id,
    method: 'delete'
  })
}

export function postBatchDelete (parameter) {
  return axios({
    url: '/sys/post',
    method: 'delete',
    data: parameter
  })
}

export function postSelect () {
  return axios({
    url: '/sys/post/select',
    method: 'get'
  })
}
