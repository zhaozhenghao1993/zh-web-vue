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
  if (Blob.prototype.constructor === response.data.constructor) {
    // 下载流输出
    const headers = response.headers
    if (headers['content-type'] === 'application/octet-stream;charset=UTF-8') {
      return response.data
    } else if (headers['content-type'] === 'application/json;charset=UTF-8') {
      // 为json说明存在后台异常，则将 response.data 的 blob 转为json串
      const reader = new FileReader()
      reader.onload = e => {
        response.data = JSON.parse(e.target.result)
        return responseHandle(response.data)
      }
      reader.readAsText(response.data)
    }
  } else {
    // 正常处理后台响应json
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
