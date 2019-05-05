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
              <div class="bio"></div>
            </div>
            <div class="account-center-detail">
              <p>
                <a-icon type="idcard"/>{{ posts }}
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
                <template v-for="(role, index) in roles">
                  <a-tag
                    :key="role"
                    :closable="index !== 0"
                    color="blue"
                  >{{ role }}</a-tag>
                </template>
              </div>
            </a-spin>
          </div>
          <a-divider :dashed="true"/>

          <div class="account-center-team">
            <div class="teamTitle">团队</div>
            <a-spin :spinning="teamSpinning">
              <div class="members">
                <a-row>
                  <a-col :span="12" v-for="(item, index) in teams" :key="index">
                    <a>
                      <a-avatar size="small" :src="item.avatar"/>
                      <span class="member">{{ item.name }}</span>
                    </a>
                  </a-col>
                </a-row>
              </div>
            </a-spin>
          </div>
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
      posts: '',
      orgs: '',
      roles: [],
      permissions: [],

      tagInputVisible: false,
      tagInputValue: '',

      teams: [],
      teamSpinning: true,

      tabListNoTitle: [
        {
          key: 'permission',
          tab: '权限'
        }
      ],
      noTitleKey: 'permission'
    }
  },
  mounted () {
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo () {
      userDetail(this.$route.params.uid).then(res => {
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
      this.avatar = this.userInfo.avatar
      this.nickname = this.userInfo.name
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
            if (perm.menuId === action.parentId) {
              perm.action.push(action)
            }
          })
        })
      }
    },
    getTeams () {
    },

    handleTabChange (key, type) {
      this[type] = key
    },

    showTagInput () {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },

    handleInputChange (e) {
      this.tagInputValue = e.target.value
    },

    handleTagInputConfirm () {
      const inputValue = this.tagInputValue
      let tags = this.tags
      if (inputValue && !tags.includes(inputValue)) {
        tags = [...tags, inputValue]
      }

      Object.assign(this, {
        tags,
        tagInputVisible: false,
        tagInputValue: ''
      })
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

  .account-center-team {
    .members {
      a {
        display: block;
        margin: 12px 0;
        line-height: 24px;
        height: 24px;
        .member {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
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
  }

  .tagsTitle,
  .teamTitle {
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 12px;
  }
}
</style>
