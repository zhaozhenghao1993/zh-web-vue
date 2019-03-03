import { axios } from '@/utils/request'

export function userList (parameter) {
  return axios({
    url: '/sys/user',
    method: 'get',
    params: parameter
  })
}
