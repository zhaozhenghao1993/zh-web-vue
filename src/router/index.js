import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      component: () => import('@/views/login/login.vue'),
      name: '登陆zh-admin',
      hidden: true
    },
    {
      path: '/',
      name: 'index',
      component: () => import('@/views/index/index.vue'),
      hidden: true
    }
  ]
})
