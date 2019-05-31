<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <a-spin :spinning="spinning">
            <div class="account-center-avatarHolder">
              <div class="avatar">
                <img :src="avatar">
              </div>
              <div class="username">{{ nickname }}</div>
              <div class="bio">{{ username }}</div>
            </div>
            <div class="account-center-detail">
              <p>
                <a-icon type="idcard"/>ID: {{ userId }}
              </p>
              <p>
                <a-icon type="team"/>{{ posts }}
              </p>
              <p>
                <a-icon type="cluster"/>{{ orgs }}
              </p>
            </div>
          </a-spin>
          <a-divider/>

          <div class="account-center-tags">
            <div class="tagsTitle">角色</div>
            <a-spin :spinning="spinning">
              <div>
                <template v-for="role in roles">
                  <a-tag
                    :key="role"
                    color="blue"
                  >{{ role }}</a-tag>
                </template>
              </div>
            </a-spin>
          </div>
          <a-divider :dashed="true"/>

          <div class="account-center-tags">
            <div class="tagsTitle">账号状态</div>
            <a-spin :spinning="spinning">
              <div>
                <a-tag :key="0" v-if="this.status === 0" color="green">{{ this.status | statusFilterText }}</a-tag>
                <a-tag :key="1" v-else color="pink">{{ this.status | statusFilterText }}</a-tag>
              </div>
            </a-spin>
          </div>
          <a-divider/>
          <a-button type="primary">
            <router-link :to="{ name: 'UserList'}"><a-icon type="left" />Go back</router-link>
          </a-button>
        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
          :tabList="tabListNoTitle"
          :activeTabKey="noTitleKey"
          @tabChange="key => handleTabChange(key, 'noTitleKey')"
        >
          <a-spin :spinning="spinning">
            <permission-page v-if="noTitleKey === 'permission'" :permissions="this.permissions"></permission-page>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import PermissionPage from '@/components/PermissionPage'
import { userDetail } from '@/api/system/user'

export default {
  components: {
    RouteView,
    PageView,
    PermissionPage
  },
  data () {
    return {
      spinning: true,
      userInfo: {},
      userId: 0,
      avatar: '',
      nickname: '',
      username: '',
      posts: '',
      orgs: '',
      roles: [],
      permissions: [],
      status: 0,

      tabListNoTitle: [
        {
          key: 'permission',
          tab: '权限'
        }
      ],
      noTitleKey: 'permission'
    }
  },
  filters: {
    statusFilterText (status) {
      const statusMap = {
        0: '正常',
        null: '正常',
        undefined: '正常',
        1: '锁定'
      }
      return statusMap[status]
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo () {
      if (this.$route.params.id === undefined) {
        return
      }
      userDetail(this.$route.params.id).then(res => {
        if (res.data.roles === undefined) {
          res.data.roles = []
        }
        if (res.data.perms === undefined) {
          res.data.perms = []
        }
        if (res.data.posts === undefined) {
          res.data.posts = []
        }
        if (res.data.orgs === undefined) {
          res.data.orgs = []
        }
        this.userInfo = res.data
        this.handleUserInfo()
        this.spinning = false
      }).catch(e => {
      })
    },
    handleUserInfo () {
      this.userId = this.userInfo.id
      this.avatar = this.userInfo.avatar
      this.nickname = this.userInfo.name
      this.username = this.userInfo.username
      this.status = this.userInfo.status
      const posts = []
      const orgs = []
      this.userInfo.posts.forEach(post => {
        posts.push(post.postName)
      })
      this.userInfo.orgs.forEach(org => {
        orgs.push(org.orgName)
      })
      this.userInfo.roles.forEach(role => {
        this.roles.push(role.roleName)
      })
      this.posts = posts.join(' ')
      this.orgs = orgs.join(' - ')
      this.handlePermission(this.userInfo.perms)
    },
    handlePermission (perms) {
      const actions = [] // 所有类型为 2，3 的 action
      if (perms !== undefined && perms.length > 0) {
        perms.map(perm => {
          // 只匹配类型 type 为 1，2，3 的菜单和 action 处理
          if (perm.type === 1) {
            this.permissions.push(perm)
          }
          if (perm.type === 2 || perm.type === 3) {
            actions.push(perm)
          }
        })
        this.permissions.map(perm => {
          perm.action = []
          actions.map((action, index) => {
            if (perm.id === action.parentId) {
              perm.action.push(action)
            }
          })
        })
      }
    },
    handleTabChange (key, type) {
      this[type] = key
    }
  }
}
</script>

<style lang="less" scoped>
.page-header-wrapper-grid-content-main {
  width: 100%;
  height: 100%;
  min-height: 100%;
  transition: 0.3s;

  .account-center-avatarHolder {
    text-align: center;
    margin-bottom: 24px;

    & > .avatar {
      margin: 0 auto;
      width: 104px;
      height: 104px;
      margin-bottom: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }

    .username {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      line-height: 28px;
      font-weight: 500;
      margin-bottom: 4px;
    }
  }

  .account-center-detail {
    p {
      height: 20px;
      margin-bottom: 8px;
      padding-left: 26px;
      position: relative;
    }

    i {
      position: absolute;
      height: 14px;
      width: 14px;
      left: 0;
      top: 4px;
    }

    .title {
      background-position: 0 0;
    }
    .group {
      background-position: 0 -22px;
    }
    .address {
      background-position: 0 -44px;
    }
  }

  .account-center-tags {
    .ant-tag {
      margin-bottom: 8px;
    }
  }

  .tagsTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
