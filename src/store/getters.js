const getters = {
  device: state => state.app.device,
  theme: state => state.app.theme,
  color: state => state.app.color,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  nickname: state => state.user.name,
  welcome: state => state.user.welcome,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  userPerms: state => state.user.perms,
  addRouters: state => state.permission.addRouters,
  multiTab: state => state.app.multiTab,
  cachedViews: state => state.tagsView.cachedViews
}

export default getters
