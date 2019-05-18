import Cookies from 'js-cookie'
import { ACCESS_TOKEN } from '@/store/mutation-types'

export function getToken () {
  return Cookies.get(ACCESS_TOKEN)
}

export function setToken (token) {
  return Cookies.set(ACCESS_TOKEN, token)
}

export function removeToken () {
  return Cookies.remove(ACCESS_TOKEN)
}
