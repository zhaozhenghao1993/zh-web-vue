<template>
  <a-card :bordered="false">
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
                <a-select-option value="0">锁定</a-select-option>
                <a-select-option value="1">正常</a-select-option>
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
      <a-button type="primary" icon="plus" @click="handleCreate">新建</a-button>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
          <!-- lock | unlock -->
          <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
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
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a href="javascript:;">详情</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a href="javascript:;">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
    >
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="ID"
          hasFeedback
          validateStatus="success"
        >
          <a-input placeholder="ID" v-model="user.userId" id="no" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
        >
          <a-input placeholder="起一个名字" v-decorator="['user.username',{rules: [{required: true, message: 'Please input your username!'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="E-mail"
        >
          <a-input v-decorator="['user.email',{rules: [{type: 'email', message: 'The input is not valid E-mail!'}, {required: true, message: 'Please input your E-mail!'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="mobile"
        >
          <a-input v-decorator="['user.mobile', {rules: [{ pattern: /^1[34578]\d{9}$/, message: 'The input is not valid mobile!' }, {required: true, message: 'Please input your mobile!'}], validateTrigger: 'change'}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
        >
          <a-select v-model="user.status">
            <a-select-option value="1">正常</a-select-option>
            <a-select-option value="0">锁定</a-select-option>
          </a-select>
        </a-form-item>

        <a-divider />
      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
import STable from '@/components/table/'
import { userList } from '@/api/system/user'

export default {
  name: 'UserList',
  components: {
    STable
  },
  data () {
    return {
      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,
      confirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: null,
      user: {
        userId: null,
        username: '',
        password: '',
        email: '',
        mobile: '',
        avatar: '',
        status: 1,
        roleIdList: []
      },
      mdl: {},
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
        console.log(Object.assign(parameter, this.queryParam))
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
      }
    }
  },
  filters: {
    statusFilterIcon (status) {
      const statusMap = {
        1: 'success',
        null: 'success',
        undefined: 'success',
        0: 'error'
      }
      return statusMap[status]
    },
    statusFilterText (status) {
      const statusMap = {
        1: '正常',
        null: '正常',
        undefined: '正常',
        0: '锁定'
      }
      return statusMap[status]
    }
  },
  methods: {
    handleFilter () {
      this.$refs.table.refresh(true)
    },
    clearFilter () {
      this.queryParam.username = ''
      this.queryParam.status = ''
    },
    handleCreate () {
      this.visible = true
      this.form = this.$form.createForm(this)
    },
    handleEdit (record) {
      this.mdl = Object.assign({}, record)

      this.mdl.permissions.forEach(permission => {
        permission.actionsOptions = permission.actionEntitySet.map(action => {
          return { label: action.describe, value: action.action, defaultCheck: action.defaultCheck }
        })
      })

      this.visible = true
    },
    handleOk () {
      this.confirmLoading = true

      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
      setTimeout(() => {
        // this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  },
  watch: {
    /* 'selectedRows': function (selectedRows) {
      this.needTotalList = this.needTotalList.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum, val) => {
            return sum + val[item.dataIndex]
          }, 0)
        }
      })
    } */
  }
}
</script>
