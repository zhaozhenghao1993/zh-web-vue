import { axios } from '@/utils/request'

export function userList (parameter) {
  console.log('down')
  console.log(parameter)
  return axios({
    url: '/sys/user',
    method: 'get',
    params: parameter
  })
}
