<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="字典名称">
              <a-input placeholder="请输入字典名称" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="字典编码">
              <a-input placeholder="请输入字典编码" v-model="queryParam.code"/>
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
      <a-button type="primary" v-if="checkPermission('sys:dict:save')" icon="plus" @click="$refs.modal.handleCreate()">新建</a-button>
    </div>

    <s-table
      ref="table"
      size="default"
      :columns="columns"
      :data="loadData"
      rowKey="id"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="checkPermission('sys:dict:edit')" @click="$refs.modal.handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="checkPermission('sys:dict:item:view')" @click="$refs.dictItemList.handleDictItem(record)">字典配置</a>
        <a-divider type="vertical" />
        <a v-if="checkPermission('sys:dict:remove')" @click="handleDelete(record)">删除</a>
      </span>
    </s-table>

    <dict-modal ref="modal" :tableRefresh="this.handleTableRefresh" ></dict-modal>

    <dict-item-list ref="dictItemList" :tableRefresh="this.handleTableRefresh"></dict-item-list>

  </a-card>
</template>

<script>
import STable from '@/components/Table/'
import checkPermission from '@/utils/permissions'
import { dictList, dictDelete } from '@/api/system/dict'
import DictModal from './DictModal'
import DictItemList from './DictItemList'

export default {
  name: 'DictList',
  components: {
    DictModal,
    STable,
    DictItemList
  },
  data () {
    return {
      description: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        name: '',
        code: ''
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '字典名称',
          dataIndex: 'name'
        },
        {
          title: '字典编码',
          dataIndex: 'code'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },

        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return dictList(Object.assign(parameter, this.queryParam))
          .then(response => {
            return response.data
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
      this.queryParam.name = ''
      this.queryParam.code = ''
    },
    handleTableRefresh (boolean) {
      this.$refs.table.refresh(boolean)
    },
    handleDelete (record) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要删除吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return dictDelete(record.id).then(() => {
            that.$message.success('删除成功')
          }).catch(err => {
            that.$message.error(err.msg ? err.msg : '删除失败')
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
