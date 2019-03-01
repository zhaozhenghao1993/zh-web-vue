import { userList } from '@/api/system/user'

const user = {

  state: {
    user: {},
    userList: [],
    params: {}
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_USER_LIST: (state, userList) => {
      state.userList = userList
    }
  },

  actions: {
    UserList ({ commit }, params) {
      return new Promise((resolve, reject) => {
        userList(params).then(response => {
          const data = response
          commit('SET_USER_LIST', data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
