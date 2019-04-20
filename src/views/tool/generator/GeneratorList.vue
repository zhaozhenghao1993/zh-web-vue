<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="数据库表名称">
              <a-input placeholder="请输入" v-model="queryParam.tableName"/>
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

    <s-table
      ref="table"
      size="default"
      rowKey="tableName"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="checkPermission('sys:role:edit')" @click="$refs.modal.handleGenerator(record)">生成代码</a>
      </span>
    </s-table>

    <generator-modal ref="modal" :tableRefresh="this.handleTableRefresh"></generator-modal>
  </a-card>
</template>

<script>
import STable from '@/components/Table/'
import checkPermission from '@/utils/permissions'
import { generatorList } from '@/api/tool/generator'
import GeneratorModal from './GeneratorModal'

export default {
  name: 'GeneratorList',
  components: {
    GeneratorModal,
    STable
  },
  data () {
    return {
      description: '',
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        tableName: ''
      },
      // 表头
      columns: [
        {
          title: '表名称',
          dataIndex: 'tableName'
        },
        {
          title: '数据库引擎类型',
          dataIndex: 'engine'
        },
        {
          title: '备注',
          dataIndex: 'tableComment'
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
        return generatorList(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res
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
    clearFilter () {
      this.queryParam.tableName = ''
    },
    handleTableRefresh (boolean) {
      this.$refs.table.refresh(boolean)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>
