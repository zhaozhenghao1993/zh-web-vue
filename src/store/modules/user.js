import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'
import store from '@/store'
import { updateTheme, colorList } from '@/components/SettingDrawer/settingConfig'
import defaultConfig from '@/config/defaultSettings'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    routes: [],
    perms: [],
    posts: [],
    orgs: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTES: (state, routes) => {
      state.routes = routes
    },
    SET_PERMS: (state, perms) => {
      state.perms = perms
    },
    SET_POSTS: (state, perms) => {
      state.posts = perms
    },
    SET_ORGS: (state, perms) => {
      state.orgs = perms
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response
          Vue.ls.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const routes = []
          const perms = []
          const data = response.data
          // 处理权限
          if (data.roles !== undefined && data.perms !== undefined && data.roles.length > 0 && data.perms.length > 0) {
            data.perms.map(perm => {
              /* if (perm.type === 0 || perm.type === 1) {
                routes.push(perm.perms)
              } */
              // 万一有修改页面需要加载到路由中，则 router 的 permission = ['sys:user:edit']，routes将所有的权限标签纳入其中做匹配
              routes.push(perm.perms)
              if (perm.type === 2) {
                perms.push(perm.perms)
              }
            })
            response.data.routes = routes
            commit('SET_ROUTES', routes)
            commit('SET_PERMS', perms)
            commit('SET_ROLES', data.roles)
          } else {
            data.roles = []
            data.perms = []
          }
          if (data.posts === undefined) {
            data.posts = []
          }
          if (data.orgs === undefined) {
            data.orgs = []
          }
          // 处理主题样式
          if (data.theme !== undefined) {
            if (data.theme === 'dark') {
              store.dispatch('ToggleTheme', 'dark')
            } else if (data.theme === 'light') {
              store.dispatch('ToggleTheme', 'light')
            } else {
              store.dispatch('ToggleTheme', 'dark')
            }
          }

          // 处理主题颜色
          if (data.color !== undefined) {
            let color = '#1890FF'
            colorList.forEach(items => {
              if (data.color === items.code) {
                color = items.color
              }
            })
            defaultConfig.primaryColor = color
            store.dispatch('ToggleColor', color)
            updateTheme(color)
          }

          commit('SET_POSTS', data.posts)
          commit('SET_ORGS', data.orgs)
          commit('SET_INFO', data)
          commit('SET_NAME', { name: data.name, welcome: welcome() })
          commit('SET_AVATAR', data.avatar)

          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        })
      })
    },

    // 前端登出
    FedLogOut ({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_NAME', {})
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
