import { axios } from '@/utils/request'

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  // 获取google 身份验证器，后期增加
}

export function login (parameter) {
  return axios({
    url: '/sys/login',
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  // 获取短信验证码，依照需求决定
}

export function getInfo () {
  return axios({
    url: '/sys/user/info',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function logout () {
  return axios({
    url: '/auth/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
