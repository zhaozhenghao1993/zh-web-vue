<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="日志类型">
              <a-select placeholder="请选择" default-value="" v-model="queryParam.type">
                <a-select-option v-for="type in selectType" :key="type.typeCode" :value="type.typeCode">{{ type.typeText }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作用户">
              <a-input placeholder="请输入" v-model="queryParam.username"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作">
              <a-input placeholder="请输入" v-model="queryParam.operation"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作状态">
              <a-select placeholder="请选择" default-value="" v-model="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option v-for="status in selectStatus" :key="status.statusCode" :value="status.statusCode">{{ status.statusText }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="操作日期">
              <a-range-picker @change="onDateChange" v-model="rangePicker" />
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
      <a-button type="primary" v-if="checkPermission('monitor:log:clear')" icon="delete" @click="handleClear">清空日志</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" v-if="checkPermission('monitor:log:batch')" @click="handleBatchDelete(selectedRowKeys)"><a-icon type="delete"/>删除</a-menu-item>
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
      rowKey="id"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
    >
      <template
        slot="status"
        slot-scope="status">
        <a-badge :status="status | statusFilterIcon" :text="status | statusFilterText"/>
      </template>
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <p>操作用户ID： {{ record.userId }} </p>
        <p>浏览器： {{ record.browser }}&nbsp;&nbsp;&nbsp;&nbsp;操作系统： {{ record.os }} </p>
        <p>执行方法：{{ record.method }} </p>
        <p style="width: 100%;height: auto;word-wrap: break-word;word-break: break-all;overflow: hidden;">请求参数： {{ record.params }} </p>
      </div>
    </s-table>

  </a-card>
</template>

<script>
import STable from '@/components/Table/'
import checkPermission from '@/utils/permissions'
import { logList, logBatchDelete, logClearDelete } from '@/api/monitor/log'

export default {
  name: 'LogList',
  components: {
    STable
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      selectStatus: [
        { statusCode: 0, statusText: '成功' },
        { statusCode: 1, statusText: '失败' }
      ],
      selectType: [
        { typeCode: 1, typeText: '登录日志' },
        { typeCode: 2, typeText: '访问日志' },
        { typeCode: 3, typeText: '操作日志' },
        { typeCode: 4, typeText: '异常日志' },
        { typeCode: 5, typeText: '授权日志' }
      ],
      // 日期范围选择
      rangePicker: [],
      // 查询参数
      queryParam: {
        type: 1,
        status: '',
        username: '',
        operation: '',
        startDate: '',
        endDate: ''
      },
      // 表头
      columns: [
        {
          title: 'ID',
          dataIndex: 'id'
        },
        {
          title: '操作用户',
          dataIndex: 'username'
        },
        {
          title: '操作',
          dataIndex: 'operation'
        },
        {
          title: 'IP',
          dataIndex: 'ip'
        },
        {
          title: '操作描述',
          dataIndex: 'remark'
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
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return logList(Object.assign(parameter, this.queryParam))
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
        0: '成功',
        null: '成功',
        undefined: '成功',
        1: '失败'
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
      this.queryParam.operation = ''
      this.queryParam.status = ''
      this.queryParam.startDate = ''
      this.queryParam.endDate = ''
      this.rangePicker = []
    },
    handleTableRefresh (boolean) {
      this.$refs.table.refresh(boolean)
    },
    handleBatchDelete (selectedRowKeys) {
      const that = this
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要删除选中日志吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return logBatchDelete(selectedRowKeys).then(() => {
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
    handleClear () {
      const that = this
      let title = '登录日志'
      this.selectType.forEach(type => {
        if (type.typeCode === that.queryParam.type) {
          title = type.typeText
        }
      })
      this.$confirm({
        type: 'error',
        title: '提示',
        content: '真的要清空<' + title + '>吗 ?',
        okType: 'danger',
        okText: '删除',
        onOk () {
          return logClearDelete(that.queryParam.type).then(() => {
            that.$message.success('清空成功')
          }).catch(err => {
            that.$message.error(err.msg)
          }).finally(() => {
            that.$refs.table.refresh(true)
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
    onDateChange (date, dateString) {
      this.queryParam.startDate = dateString[0]
      this.queryParam.endDate = dateString[1]
    }
  }
}
</script>
