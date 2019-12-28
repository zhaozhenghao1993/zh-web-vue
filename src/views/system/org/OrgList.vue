<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary" icon="sync" @click="handleFilter()">刷新</a-button>
      <a-button type="primary" v-if="checkPermission('sys:org:save')" icon="plus" @click="$refs.modal.handleCreate({id: 0})">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="checkPermission('sys:org:edit')" @click="$refs.modal.handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-if="checkPermission('sys:org:save')">
              <a href="javascript:;" @click="$refs.modal.handleCreate(record)">新建下级组织</a>
            </a-menu-item>
            <a-menu-item v-if="checkPermission('sys:org:remove')">
              <a href="javascript:;" @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <org-modal ref="modal" :tableRefresh="this.handleTableRefresh" ></org-modal>

  </a-card>
</template>

<script>
import STable from '@/components/Table/'
import checkPermission from '@/utils/permissions'
import { orgList, orgDelete } from '@/api/system/org'
import OrgModal from './OrgModal'

export default {
  name: 'OrgList',
  components: {
    OrgModal,
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: '组织名称',
          dataIndex: 'orgName'
        },
        {
          title: '祖级列表',
          dataIndex: 'ancestors'
        },
        {
          title: '排序',
          dataIndex: 'orderNum'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return orgList(Object.assign(parameter, this.queryParam))
          .then(response => {
            return response.data
          }).catch(e => {
          })
      }
    }
  },
  methods: {
    checkPermission,
    handleFilter () {
      this.$refs.table.refresh(true)
    },
    handleTableRefresh (boolean) {
      this.$refs.table.refresh(boolean)
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要删除组织<' + record.orgName + '>吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return orgDelete(record.id).then(() => {
            that.$message.success('删除成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.$refs.table.refresh(false)
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
