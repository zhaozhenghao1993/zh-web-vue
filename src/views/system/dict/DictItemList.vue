<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width="800"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :destroyOnClose="true"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="名称">
              <a-input placeholder="请输入" v-model="queryParam.name"/>
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

    <div class="table-operations">
      <a-button type="primary" v-if="checkPermission('sys:dict:item:save')" icon="plus" @click="$refs.dictItemModal.handleCreate(dict.code)">新建</a-button>
    </div>

    <a-table
      rowKey="id"
      :columns="columns"
      :data-source="dictItemData"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange">
      <template
        slot="status"
        slot-scope="status">
        <a-badge :status="status | statusFilterIcon" :text="status | statusFilterText"/>
      </template>
      <span slot="action" slot-scope="text, record">
        <a @click="$refs.dictItemModal.handleEdit(dict.code, record)" v-if="checkPermission('sys:dict:item:edit')">编辑</a>
        <a-divider type="vertical" />
        <a @click="handleDelete(record)" v-if="checkPermission('sys:dict:item:remove')">删除</a>
      </span>
    </a-table>

    <dict-item-modal ref="dictItemModal" :tableRefresh="this.handleTableRefresh" ></dict-item-modal>
  </a-drawer>
</template>

<script>
import checkPermission from '@/utils/permissions'
import { dictItemList, dictItemDelete } from '@/api/system/dict'
import DictItemModal from './DictItemModal'

export default {
  name: 'DictItemList',
  components: {
    DictItemModal
  },
  data () {
    return {
      title: '数据字典配置',
      selectStatus: [
        { statusCode: 0, statusText: '正常' },
        { statusCode: 1, statusText: '禁用' }
      ],
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        status: null
      },
      dict: {},
      dictItemData: [],
      pagination: {},
      loading: false,
      // 表头
      columns: [
        {
          title: '名称',
          dataIndex: 'name',
          width: '200px'
        },
        {
          title: '值',
          dataIndex: 'value',
          width: '200px'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          dataIndex: 'order'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      visible: false
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
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
        1: '禁用'
      }
      return statusMap[status]
    }
  },
  methods: {
    checkPermission,
    handleTableRefresh (boolean) {
      this.loadData()
    },
    handleFilter () {
      this.loadData()
    },
    clearFilter () {
      this.queryParam.name = ''
      this.queryParam.status = null
    },
    reset () {
      this.visible = true
      this.clearFilter()
      this.dict = {}
      this.pagination = {}
      this.queryParam.pageNum = 1
      this.queryParam.pageSize = 10
    },
    handleDictItem (record) {
      this.reset()
      this.dict = record
      this.loadData()
    },
    handleCancel () {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.queryParam.pageNum = pagination.current
      this.loadData()
    },
    loadData () {
      this.loading = true
      dictItemList(this.dict.code, this.queryParam).then(response => {
        const pagination = { ...this.pagination }
        const data = response.data
        this.dictItemData = data.data
        pagination.total = data.totalCount
        pagination.pageSize = this.queryParam.pageSize
        this.pagination = pagination
        this.loading = false
      }).catch(e => {
      })
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
          return dictItemDelete(that.dict.code, record.id).then(() => {
            that.$message.success('删除成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.loadData()
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }
.table-operations {
    margin-bottom: 16px;
  }
.table-operations > button {
  margin-right: 8px;
  }

</style>
