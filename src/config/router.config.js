// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/dashboard/workplace',
    children: [
      // dashboard
      {
        path: '/dashboard',
        name: 'dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: 'dashboard' },
        children: [
          {
            path: '/dashboard/analysis',
            name: 'Analysis',
            component: () => import('@/views/dashboard/Analysis'),
            meta: { title: '分析页', keepAlive: false }
          },
          {
            path: '/dashboard/monitor',
            name: 'Monitor',
            hidden: true,
            component: () => import('@/views/dashboard/Monitor'),
            meta: { title: '监控页', keepAlive: true }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true }
          }
        ]
      },

      // list
      {
        path: '/sys',
        name: 'sys',
        component: PageView,
        redirect: '/sys/user',
        meta: { title: '系统管理', icon: 'desktop', hiddenHeaderContent: true, permission: [ 'sys' ] },
        children: [
          {
            path: '/sys/user',
            name: 'UserList',
            component: () => import('@/views/system/user/UserList'),
            meta: { title: '用户管理', keepAlive: true, permission: [ 'sys:user' ] }
          },
          {
            path: '/sys/role',
            name: 'RoleList',
            component: () => import('@/views/list/RoleList'),
            meta: { title: '角色管理', keepAlive: true, permission: [ 'sys:role' ] }
          },
          {
            path: '/sys/menu',
            name: 'TreeList',
            component: () => import('@/views/list/TreeList'),
            meta: { title: '权限管理', keepAlive: true, permission: [ 'sys:menu' ] }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: RouteView,
        name: 'account',
        meta: { title: '个人页', icon: 'user', keepAlive: true },
        children: [
          {
            path: '/account/center',
            name: 'center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true }
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true, keepAlive: true },
            redirect: '/account/settings/base',
            alwaysShow: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/security',
                name: 'SecuritySettings',
                component: () => import('@/views/account/settings/Security'),
                meta: { title: '安全设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/custom',
                name: 'CustomSettings',
                component: () => import('@/views/account/settings/Custom'),
                meta: { title: '个性化设置', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/binding',
                name: 'BindingSettings',
                component: () => import('@/views/account/settings/Binding'),
                meta: { title: '账户绑定', hidden: true, keepAlive: true }
              },
              {
                path: '/account/settings/notification',
                name: 'NotificationSettings',
                component: () => import('@/views/account/settings/Notification'),
                meta: { title: '新消息通知', hidden: true, keepAlive: true }
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },
  {
    path: '/403',
    name: 'Exception403',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
    meta: { title: '403' }
  },
  {
    path: '/500',
    name: 'Exception500',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
    meta: { title: '500' }
  }

]
