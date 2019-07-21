import { axios } from '@/utils/request'

export function systemInfo (actuator) {
  return axios({
    url: '/monitor/performance/system/' + actuator,
    method: 'get'
  })
}

export function jvmInfo (actuator) {
  return axios({
    url: '/monitor/performance/jvm/' + actuator,
    method: 'get'
  })
}

export function tomcatInfo (actuator) {
  return axios({
    url: '/monitor/performance/tomcat/' + actuator,
    method: 'get'
  })
}
