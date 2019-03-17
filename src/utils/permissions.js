import store from '@/store'

export function actionToObject (json) {
  try {
    return JSON.parse(json)
  } catch (e) {
    console.log('err', e.message)
  }
  return []
}

/**
 * @param {String} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission (value) {
  const permissions = store.getters.userPerms
  if (!permissions || permissions.length === 0) { return false }
  for (let i = 0; i < permissions.length; i++) {
    if (permissions[i] === value) { return true }
  }
  return false
}
