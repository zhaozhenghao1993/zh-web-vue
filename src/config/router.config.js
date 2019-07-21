// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

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
        name: 'Dashboard',
        redirect: '/dashboard/workplace',
        component: RouteView,
        meta: { title: '仪表盘', keepAlive: true, icon: bxAnaalyse },
        children: [
          // 外部链接
          {
            path: 'https://www.baidu.com/',
            name: 'Outside',
            meta: { title: '监控页（外部）', target: '_blank' }
          },
          {
            path: '/dashboard/workplace',
            name: 'Workplace',
            component: () => import('@/views/dashboard/Workplace'),
            meta: { title: '工作台', keepAlive: true }
          }
        ]
      },

      // sys
      {
        path: '/sys',
        name: 'System',
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
            path: '/sys/user/:id(\\d+)',
            name: 'UserDetail',
            component: () => import('@/views/system/user/UserDetail'),
            hidden: true,
            meta: { title: '用户详情', permission: [ 'sys:user:detail' ] }
          },
          {
            path: '/sys/role',
            name: 'RoleList',
            component: () => import('@/views/system/role/RoleList'),
            meta: { title: '角色管理', keepAlive: true, permission: [ 'sys:role' ] }
          },
          {
            path: '/sys/menu',
            name: 'MenuList',
            component: () => import('@/views/system/menu/MenuList'),
            meta: { title: '权限管理', keepAlive: true, permission: [ 'sys:menu' ] }
          },
          {
            path: '/sys/org',
            name: 'OrgList',
            component: () => import('@/views/system/org/OrgList'),
            meta: { title: '组织管理', keepAlive: true, permission: [ 'sys:org' ] }
          },
          {
            path: '/sys/post',
            name: 'PostList',
            component: () => import('@/views/system/post/PostList'),
            meta: { title: '岗位管理', keepAlive: true, permission: [ 'sys:post' ] }
          }
        ]
      },

      // monitor
      {
        path: '/monitor',
        name: 'Monitor',
        component: PageView,
        redirect: '/monitor/log',
        meta: { title: '系统监控', icon: 'dashboard', hiddenHeaderContent: true, permission: [ 'monitor' ] },
        children: [
          {
            path: '/monitor/log',
            name: 'LogList',
            component: () => import('@/views/monitor/log/LogList'),
            meta: { title: '日志管理', keepAlive: true, permission: [ 'monitor:log' ] }
          },
          {
            path: '/monitor/server',
            name: 'ServerMonitor',
            component: () => import('@/views/monitor/server/ServerMonitor'),
            meta: { title: '服务器监控', permission: [ 'monitor:server' ] }
          },
          {
            path: '/monitor/performance',
            name: 'PerformanceMonitor',
            component: () => import('@/views/monitor/performance/MonitorLayout'),
            redirect: '/monitor/performance/system',
            meta: { title: '性能监控', keepAlive: true, permission: [ 'monitor:performance' ] },
            children: [
              {
                path: '/monitor/performance/system',
                name: 'SystemInfo',
                component: () => import('@/views/monitor/performance/SystemInfo'),
                meta: { title: '系统信息', permission: [ 'monitor:performance:system' ] }
              },
              {
                path: '/monitor/performance/jvm',
                name: 'JvmInfo',
                component: () => import('@/views/monitor/performance/JvmInfo'),
                meta: { title: 'JVM信息', permission: [ 'monitor:performance:jvm' ] }
              },
              {
                path: '/monitor/performance/tomcat',
                name: 'TomcatInfo',
                component: () => import('@/views/monitor/performance/TomcatInfo'),
                meta: { title: 'Tomcat信息', permission: [ 'monitor:performance:tomcat' ] }
              }
            ]
          },
          {
            path: '/monitor/druid',
            name: 'DruidMonitor',
            component: () => import('@/views/monitor/druid/DruidMonitor'),
            meta: { title: '数据库监控', permission: [ 'monitor:druid' ] }
          }
        ]
      },

      // tool
      {
        path: '/tool',
        name: 'Tool',
        component: PageView,
        redirect: '/tool/icon-selector',
        meta: { title: '开发工具', icon: 'tool', hiddenHeaderContent: true, permission: [ 'tool' ] },
        children: [
          {
            path: '/tool/icon-selector',
            name: 'IconSelect',
            component: () => import('@/views/tool/icon/IconSelectorView'),
            meta: { title: 'IconSelector', keepAlive: true, permission: [ 'tool:icon' ] }
          },
          {
            path: '/tool/generator',
            name: 'GeneratorList',
            component: () => import('@/views/tool/generator/GeneratorList'),
            meta: { title: '代码生成器', keepAlive: true, permission: [ 'tool:generator' ] }
          }
        ]
      },

      // Exception
      {
        path: '/exception',
        name: 'exception',
        component: RouteView,
        redirect: '/exception/403',
        meta: { title: '异常页', icon: 'warning' },
        hidden: true,
        children: [
          {
            path: '/exception/403',
            name: 'Exception403',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/403'),
            meta: { title: '403' }
          },
          {
            path: '/exception/404',
            name: 'Exception404',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404'),
            meta: { title: '404' }
          },
          {
            path: '/exception/500',
            name: 'Exception500',
            component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/500'),
            meta: { title: '500' }
          }
        ]
      },

      // account
      {
        path: '/account',
        component: PageView,
        redirect: '/account/center',
        name: 'Account',
        meta: { title: '个人页', icon: 'user', keepAlive: true },
        children: [
          {
            path: '/account/center',
            name: 'Center',
            component: () => import('@/views/account/center/Index'),
            meta: { title: '个人中心', keepAlive: true }
          },
          {
            path: '/account/settings',
            name: 'Settings',
            component: () => import('@/views/account/settings/Index'),
            meta: { title: '个人设置', hideHeader: true },
            redirect: '/account/settings/base',
            hideChildrenInMenu: true,
            children: [
              {
                path: '/account/settings/base',
                name: 'BaseSettings',
                component: () => import('@/views/account/settings/BaseSetting'),
                meta: { title: '基本设置', hidden: true }
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
    name: '404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }

]
