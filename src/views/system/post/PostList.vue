<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="岗位名称">
              <a-input placeholder="请输入" v-model="queryParam.postName"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="岗位编码">
              <a-input placeholder="请输入" v-model="queryParam.postCode"/>
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
      <a-button type="primary" v-if="checkPermission('sys:post:save')" icon="plus" @click="$refs.modal.handleCreate()">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" v-if="checkPermission('sys:post:batch')" @click="handleBatchDelete(selectedRowKeys)"><a-icon type="delete"/>删除</a-menu-item>
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
      rowKey="postId"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="checkPermission('sys:post:edit')" @click="$refs.modal.handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-if="checkPermission('sys:post:remove')">
              <a href="javascript:;" @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <Post-modal ref="modal" :tableRefresh="this.handleTableRefresh" ></Post-modal>

  </a-card>
</template>

<script>
import STable from '@/components/Table/'
import checkPermission from '@/utils/permissions'
import { postList, postDelete, postBatchDelete } from '@/api/system/post'
import PostModal from './PostModal'

export default {
  name: 'PostList',
  components: {
    PostModal,
    STable
  },
  data () {
    return {
      description: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        postName: '',
        postCode: ''
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'postId'
        },
        {
          title: '岗位名称',
          dataIndex: 'postName'
        },
        {
          title: '岗位编码',
          dataIndex: 'postCode'
        },
        {
          title: '排序',
          dataIndex: 'orderNum'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return postList(Object.assign(parameter, this.queryParam))
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
      }
    }
  },
  methods: {
    checkPermission,
    handleFilter () {
      this.$refs.table.refresh(true)
    },
    clearFilter () {
      this.queryParam.postName = ''
      this.queryParam.postCode = ''
    },
    handleTableRefresh (boolean) {
      this.$refs.table.refresh(boolean)
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要删除岗位<' + record.postName + '>吗吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return postDelete(record.postId).then(() => {
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
        content: '真的要删除选中岗位吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return postBatchDelete(selectedRowKeys).then(() => {
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
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
