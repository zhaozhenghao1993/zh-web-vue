import axios from 'axios'
import store from '@/store'
import router from '../router'
import {
  VueAxios
} from './axios'
import notification from 'ant-design-vue/es/notification'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api/admin', // api base_url
  timeout: 30000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = getToken()
    if (error.response.status === 404) {
      notification.error({ message: 'Forbidden', description: '请求不存在' })
      router.push({ path: '/exception/404' })
    }
    if (error.response.status === 403) {
      notification.error({ message: 'Forbidden', description: data.message })
    }
    if (error.response.status === 401) {
      notification.error({ message: 'Unauthorized', description: 'Authorization verification failed' })
      if (token) {
        store.dispatch('FedLogOut').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
    if (error.response.status === 500) {
      notification.error({ message: 'Server exception', description: '服务器异常,请稍后再试' })
      // router.push({ path: '/exception/500' })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['ZH-TOKEN'] = getToken() // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  // 处理不同模式响应
  // 下载流输出
  const headers = response.headers
  if (headers['content-type'] === 'application/octet-stream' || headers['content-type'] === 'application/octet-stream;charset=UTF-8') {
    // 统一下载响应流为 responseType: 'arraybuffer', 拿到结果后再判断是否可以解析，是json还是文件流，文件流的话就转 Blob
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    return blob
  } else if (headers['content-type'] === 'application/json' || headers['content-type'] === 'application/json;charset=UTF-8') {
    if (ArrayBuffer.prototype.constructor === response.data.constructor) {
      // this.response为arraybuffer对象，转为uint8数组
      const uint8 = new Uint8Array(response.data)
      // 解决使用fromCharCode后中文乱码的问题
      const resToString = decodeURIComponent(escape((String.fromCharCode(...uint8))))
      response.data = JSON.parse(resToString)
    }
    return responseHandle(response.data)
  }
}, err)

const responseHandle = (data) => {
  if (data.success === undefined) {
    // 如果后台响应数据不为正常格式，则直接返回，交由下级Promise处理
    return data
  }
  if (!data.success) {
    const token = getToken()
    if (data.code === 500) {
      notification.error({ message: 'Error', description: data.msg })
    }
    if (data.code === 403) {
      notification.error({ message: 'Forbidden', description: data.msg })
    }
    if (data.code === 401) {
      notification.error({ message: '登录超时', description: '请重新登录' })
      if (token) {
        store.dispatch('FedLogOut').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1000)
        })
      }
    }
    return Promise.reject(data)
  } else {
    return data
  }
}

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
