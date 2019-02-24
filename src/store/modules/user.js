import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    routes: [],
    perms: [],
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
          if (data.roles.length > 0 && data.perms.length > 0) {
            data.perms.map(perm => {
              if (perm.type === 0 || perm.type === 1) {
                routes.push(perm.perms)
              }
              if (perm.type === 2) {
                perms.push(perm.perms)
              }
            })
            response.data.routes = routes
            commit('SET_ROUTES', routes)
            commit('SET_PERMS', perms)
            commit('SET_ROLES', data.roles)
            commit('SET_INFO', data)
          } else {
            reject(new Error('getInfo: roles must be a non-null array !'))
          }

          commit('SET_NAME', { name: data.username, welcome: welcome() })
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
    }

  }
}

export default user
