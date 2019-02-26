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
    UserList ({ commit, state }) {

    }
  }
}

export default user
