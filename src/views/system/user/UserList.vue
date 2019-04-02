<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="4">
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
        <a-button type="primary" icon="sync" @click="handleFilter()"></a-button>
        <a-tree
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          :treeData="gData"
        >
          <template slot="title" slot-scope="{title}">
            <span v-if="title.indexOf(searchValue) > -1">
              {{ title.substr(0, title.indexOf(searchValue)) }}
              <span style="color: #f50">{{ searchValue }}</span>
              {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
            </span>
            <span v-else>{{ title }}</span>
          </template>
        </a-tree>
      </a-col>
      <a-col :span="20">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="用户名">
                  <a-input placeholder="请输入" v-model="queryParam.username"/>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="状态">
                  <a-select placeholder="请选择" default-value="" v-model="queryParam.status">
                    <a-select-option value="">全部</a-select-option>
                    <a-select-option v-for="status in selectStatus" :key="status.statusCode" :value="status.statusCode">{{ status.statusText }}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" @click="handleFilter">查询</a-button>
                  <a-button style="margin-left: 8px" @click="clearFilter">重置</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <div class="table-operator">
          <a-button type="primary" v-if="checkPermission('sys:user:save')" icon="plus" @click="$refs.modal.handleCreate()">新建</a-button>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" v-if="checkPermission('sys:user:batch')" @click="handleBatchDelete(selectedRowKeys)"><a-icon type="delete"/>删除</a-menu-item>
              <!-- lock | unlock -->
              <a-menu-item key="2" v-if="checkPermission('sys:user:disable')" @click="handleBatchDisable(selectedRowKeys)"><a-icon type="lock" />锁定</a-menu-item>
              <a-menu-item key="3" v-if="checkPermission('sys:user:enable')" @click="handleBatchEnable(selectedRowKeys)"><a-icon type="unlock" />解锁</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作 <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>

        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          rowKey="userId"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
        >
          <template
            slot="status"
            slot-scope="status">
            <a-badge :status="status | statusFilterIcon" :text="status | statusFilterText"/>
          </template>
          <span slot="action" slot-scope="text, record">
            <a v-if="checkPermission('sys:user:edit')" @click="$refs.modal.handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;">详情</a>
                </a-menu-item>
                <a-menu-item v-if="checkPermission('sys:user:reset')">
                  <a href="javascript:;" @click="$refs.modalResetPassword.handleResetPassword(record)">重置密码</a>
                </a-menu-item>
                <a-menu-item v-if="checkPermission('sys:user:remove')">
                  <a href="javascript:;" @click="handleDelete(record)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </s-table>
      </a-col>
    </a-row>

    <user-modal ref="modal" :tableRefresh="this.handleTableRefresh" ></user-modal>

    <user-modal-reset-password ref="modalResetPassword"></user-modal-reset-password>

  </a-card>
</template>

<script>
import STable from '@/components/table/'
import checkPermission from '@/utils/permissions'
import { userList, userDelete, batchUserDelete, userEnable, userDisable } from '@/api/system/user'
import UserModal from './UserModal'
import UserModalResetPassword from './UserModalResetPassword'
import ACol from 'ant-design-vue/es/grid/Col'

const x = 3
const y = 2
const z = 1
const gData = []

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key, scopedSlots: { title: 'title' } })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)

const dataList = []
const generateList = (data) => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children, node.key)
    }
  }
}
generateList(gData)

const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

export default {
  name: 'UserList',
  components: {
    ACol,
    UserModalResetPassword,
    UserModal,
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      selectStatus: [
        { statusCode: 0, statusText: '正常' },
        { statusCode: 1, statusText: '锁定' }
      ],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        username: '',
        status: ''
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'userId'
        },
        {
          title: '用户名',
          dataIndex: 'username'
        },
        {
          title: '姓名',
          dataIndex: 'name'
        },
        {
          title: '邮箱',
          dataIndex: 'email'
        },
        {
          title: '手机号',
          dataIndex: 'mobile'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return userList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
          }).catch(e => {
          })
      },

      selectedRowKeys: [],
      selectedRows: [],
      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: true },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      gData
    }
  },
  filters: {
    statusFilterIcon (status) {
      const statusMap = {
        0: 'success',
        null: 'success',
        undefined: 'success',
        1: 'error'
      }
      return statusMap[status]
    },
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
  methods: {
    checkPermission,
    handleFilter () {
      this.$refs.table.refresh(true)
    },
    clearFilter () {
      this.queryParam.username = ''
      this.queryParam.status = ''
    },
    handleTableRefresh (boolean) {
      this.$refs.table.refresh(boolean)
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要删除用户<' + record.username + '>吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return userDelete(record.userId).then(() => {
            that.$message.success('删除成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.$refs.table.refresh(false)
            // 批量删除完毕后清空复选框
            that.$refs.table.clearSelected()
          })
        },
        onCancel () {
        }
      })
    },
    handleBatchDelete (selectedRowKeys) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要删除选中用户吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return batchUserDelete(selectedRowKeys).then(() => {
            that.$message.success('删除成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.$refs.table.refresh(false)
            // 批量删除完毕后清空复选框
            that.$refs.table.clearSelected()
          })
        },
        onCancel () {
        }
      })
    },
    handleBatchDisable (selectedRowKeys) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要锁定选中用户吗 ?',
        okType: 'danger',
        okText: '锁定',
        onOk () {
          return userDisable(selectedRowKeys).then(() => {
            that.$message.success('锁定成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.$refs.table.refresh(false)
            // 批量删除完毕后清空复选框
            that.$refs.table.clearSelected()
          })
        },
        onCancel () {
        }
      })
    },
    handleBatchEnable (selectedRowKeys) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要解锁选中用户吗 ?',
        okType: 'danger',
        okText: '解锁',
        onOk () {
          return userEnable(selectedRowKeys).then(() => {
            that.$message.success('解锁成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.$refs.table.refresh(false)
            // 批量删除完毕后清空复选框
            that.$refs.table.clearSelected()
          })
        },
        onCancel () {
        }
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = dataList.map((item) => {
        if (item.key.indexOf(value) > -1) {
          return getParentKey(item.key, gData)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    }
  }
}
</script>

<style lang="less">

</style>
