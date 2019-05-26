<template>
  <page-view :avatar="avatar()" :title="false">
    <div slot="headerContent">
      <div class="title">{{ timeFix }}，{{ nickname() }}<span class="welcome-text">，{{ welcome() }}</span></div>
      <div>{{ posts }} | {{ orgs }}</div>
    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="12">
          <head-info title="今日访问" :content="todayVisitCount" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="12">
          <head-info title="总访问量" :content="totalVisitCount" :center="false" />
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;"
            :bordered="false"
            title="进行中的项目"
            :body-style="{ padding: 0 }">
            <a slot="extra" href="https://github.com/zhaozhenghao1993?tab=repositories" target="_blank">全部项目</a>
            <div>
              <a-card-grid class="project-card-grid" :key="i" v-for="(item, i) in projects">
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar size="small" :src="item.cover"/>
                      <a>{{ item.title }}</a>
                    </div>
                    <div slot="description" class="card-description">
                      {{ item.description }}
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <a :href="item.repository" target="_blank">仓库地址</a>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
          </a-card>

          <a-card :loading="loading" title="技术选型" :bordered="false">
            <a-tabs defaultActiveKey="1">
              <a-tab-pane tab="zh-admin" key="1">
                <a-timeline>
                  <a-timeline-item>基础框架 springboot 2.1.1.RELEASE</a-timeline-item>
                  <a-timeline-item>持久层 mybatis.spring.boot 1.3.2</a-timeline-item>
                  <a-timeline-item>持久层缓存 ehcache 2.10.4</a-timeline-item>
                  <a-timeline-item>数据库连接池 druid-spring-boot 1.1.9</a-timeline-item>
                  <a-timeline-item>安全框架 jwt 3.2.0 jjwt 0.9.1</a-timeline-item>
                  <a-timeline-item>分页 pagehelper 1.2.5</a-timeline-item>
                  <a-timeline-item>摸板引擎 velocity 1.7</a-timeline-item>
                </a-timeline>
                <p>权限控制精确到每个请求的 uri 和 method ,支持通配符批量放行</p>
              </a-tab-pane>
              <a-tab-pane tab="zh-web-vue" key="2" forceRender>
                <a-timeline>
                  <a-timeline-item>vue</a-timeline-item>
                  <a-timeline-item>vuex</a-timeline-item>
                  <a-timeline-item>axios</a-timeline-item>
                  <a-timeline-item>@vue/cli ~3</a-timeline-item>
                  <a-timeline-item>ant-design-vue</a-timeline-item>
                  <a-timeline-item>ant-design-vue-pro - 脚手架</a-timeline-item>
                  <a-timeline-item>vue-cropper - 头像裁剪组件</a-timeline-item>
                  <a-timeline-item>@antv/g2 - Alipay AntV 数据可视化图表</a-timeline-item>
                  <a-timeline-item>Viser-vue - antv/g2 封装实现</a-timeline-item>
                </a-timeline>
                <p>权限控制精确到每个路由页面,每个操作按钮</p>
              </a-tab-pane>
            </a-tabs>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false" :body-style="{padding: 0}">
            <div class="item-group">
              <router-link :to="{ name: 'UserList' }">用户管理</router-link>
              <router-link :to="{ name: 'RoleList' }">角色管理</router-link>
              <router-link :to="{ name: 'MenuList' }">权限管理</router-link>
              <router-link :to="{ name: 'LogList' }">日志管理</router-link>
              <router-link :to="{ name: 'GeneratorList' }">代码生成器</router-link>
            </div>
          </a-card>
          <a-card title="近一周访问量" style="margin-bottom: 24px" :loading="visitLoading" :bordered="false" :body-style="{ padding: 0 }">
            <div style="min-height: 300px;">
              <g2-line :dataSource="visitWeekSource" :xScale="xScale" :yScale="yScale" :id="'visitWeekCount'"></g2-line>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { timeFix } from '@/utils/util'
import { mapGetters } from 'vuex'

import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { Radar } from '@/components'
import G2Line from '@/components/G2/G2Line'
import { logVisit, logVisitWeek } from '@/api/monitor/log'

export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    Radar,
    G2Line
  },
  data () {
    return {
      timeFix: timeFix(),
      user: {},
      posts: '',
      orgs: '',
      projects: [
        { cover: '/avatar.png', title: 'zh-admin', description: '基于springboot权限管理系统', repository: 'https://github.com/zhaozhenghao1993/zh-admin' },
        { cover: '/avatar.png', title: 'zh-web-vue', description: 'zh-admin 权限系统前端, ant-design-vue', repository: 'https://github.com/zhaozhenghao1993/zh-web-vue' },
        { cover: '', title: 'zh-boot-oauth', description: '基于springboot和OAuth2搭建的简易授权登陆', repository: 'https://github.com/zhaozhenghao1993/zh-boot-oauth' },
        { cover: '', title: 'zh-boot-dubbo', description: 'springboot搭建dubbo, dubbo注解开发实例', repository: 'https://github.com/zhaozhenghao1993/zh-boot-dubbo' }
      ],
      loading: true,
      visitLoading: true,
      todayVisitCount: 0,
      totalVisitCount: 0,
      visitWeekSource: [],
      xScale: {
      },
      yScale: {
        alias: '访问量'
      },
      searchUserScale: [
        {
          dataKey: 'x',
          alias: '时间'
        },
        {
          dataKey: 'y',
          alias: '用户数',
          min: 0,
          max: 10
        }
      ]
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.loadUserInfo()
  },
  mounted () {
    this.getVisitCount()
    this.getVisitWeek()
    this.loading = false
  },
  methods: {
    ...mapGetters(['nickname', 'welcome', 'avatar']),
    loadUserInfo () {
      this.user = this.userInfo
      const posts = []
      const orgs = []
      this.userInfo.posts.forEach(post => {
        posts.push(post.postName)
      })
      this.userInfo.orgs.forEach(org => {
        orgs.push(org.orgName)
      })
      this.posts = posts.join(' ')
      this.orgs = orgs.join(' - ')
    },
    getVisitCount () {
      logVisit().then((res) => {
        const data = res.data
        this.todayVisitCount = data.todayVisitCount
        this.totalVisitCount = data.totalVisitCount
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    getVisitWeek () {
      logVisitWeek().then((res) => {
        this.visitWeekSource = res.data
      }).catch(err => {
        this.$message.error(err.msg)
      }).finally(() => {
        this.visitLoading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
