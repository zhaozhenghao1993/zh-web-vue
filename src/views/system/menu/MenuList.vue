<template>
  <a-card :bordered="false">

    <div class="table-operator">
      <a-button type="primary" icon="sync" @click="handleFilter()">刷新</a-button>
      <a-button type="primary" v-if="checkPermission('sys:menu:save')" icon="plus" @click="$refs.modal.handleCreate({name: '主目录', id: 0})">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      :showPagination="false"
    >
      <template
        slot="type"
        slot-scope="type">
        <a-tag v-if="type === 0" color="cyan">目录</a-tag>
        <a-tag v-else-if="type === 1" color="green">菜单</a-tag>
        <a-tag v-else-if="type === 2" color="orange">按钮</a-tag>
        <a-tag v-else-if="type === 3" color="purple">链接</a-tag>
      </template>
      <span slot="action" slot-scope="text, record">
        <a v-if="checkPermission('sys:menu:edit')" @click="$refs.modal.handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-if="checkPermission('sys:menu:save') && (record.type === 0 || record.type === 1)">
              <a href="javascript:;" @click="$refs.modal.handleCreate(record)">新建下级菜单</a>
            </a-menu-item>
            <a-menu-item v-if="checkPermission('sys:menu:remove')">
              <a href="javascript:;" @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <menu-modal ref="modal" :tableRefresh="this.handleTableRefresh" ></menu-modal>

  </a-card>
</template>

<script>
import STable from '@/components/Table/'
import checkPermission from '@/utils/permissions'
import { menuList, menuDelete } from '@/api/system/menu'
import MenuModal from './MenuModal'

export default {
  name: 'MenuList',
  components: {
    MenuModal,
    STable
  },
  data () {
    return {
      description: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '上级菜单',
          dataIndex: 'parentName'
        },
        {
          title: '排序',
          dataIndex: 'orderNum'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: 'uri',
          dataIndex: 'uri'
        }, {
          title: 'method',
          dataIndex: 'method'
        }, {
          title: '授权标识',
          dataIndex: 'perms'
        }, {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return menuList(Object.assign(parameter, this.queryParam))
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
        content: '真的要删除菜单<' + record.name + '>吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return menuDelete(record.id).then(() => {
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
