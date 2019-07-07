import axios from 'axios'
import store from '@/store'
import router from '../router'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api/v1', // api base_url
  timeout: 6000 // 请求超时时间
})

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = getToken()
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
      router.push({ path: '/exception/500' })
    }
  }
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['ZH-TOKEN'] = getToken()
  }
  return config
}, err)

// response interceptor
service.interceptors.response.use((response) => {
  // 处理不同模式响应
  // 下载流输出
  const headers = response.headers
  if (headers['content-type'] === 'application/octet-stream;charset=UTF-8') {
    // 统一下载响应流为 responseType: 'arraybuffer', 拿到结果后再判断是否可以解析，是json还是文件流，文件流的话就转 Blob
    const blob = new Blob([response.data], { type: 'application/octet-stream' })
    return blob
  } else if (headers['content-type'] === 'application/json;charset=UTF-8') {
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
  if (!data.success) {
    const token = getToken()
    if (data.code === 500) {
      notification.error({ message: 'Error', description: data.msg })
    }
    if (data.code === 40101 || data.code === 40401) {
      notification.error({ message: 'Forbidden', description: data.msg })
      router.push({ path: '/exception/403' })
    }
    if (data.code === 40102 || data.code === 40104 || data.code === 40301 || data.code === 40302 || data.code === 40303 || data.code === 40304) {
      notification.error({ message: 'Unauthorized', description: 'Authorization verification failed' })
      if (token) {
        store.dispatch('FedLogOut').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
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
