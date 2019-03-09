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
          <a-input placeholder="ID" v-decorator="[ 'userId', {rules: []} ]" disabled="disabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-decorator="['username',{rules: [{required: true, message: '请输入用户名!'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input v-decorator="['password',{rules: [{required: true, message: 'Please input your password!',}, {validator: validateToNextPassword,}],}]" type="password" :disabled="passwordInputDisabled" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="请确认密码"
          hasFeedback
        >
          <a-input v-decorator="['confirm',{rules: [{required: true, message: 'Please confirm your password!',}, {validator: compareToFirstPassword,}],}]" type="password" :disabled="passwordInputDisabled" @blur="handleConfirmBlur"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="E-mail"
          hasFeedback
        >
          <a-input v-decorator="['email',{rules: [{type: 'email', message: '输入的E-mail格式不正确!'}]}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号"
          hasFeedback
        >
          <a-input v-decorator="['mobile', {rules: [{ pattern: /^1[34578]\d{9}$/, message: '输入的手机号格式不正确!' }], validateTrigger: 'change'}]"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
        >
          <a-select v-decorator="['status', {rules: []}]">
            <a-select-option v-for="status in selectStatus" :key="status.statusCode" :value="status.statusCode">{{ status.statusText }}</a-select-option>
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
import pick from 'lodash.pick'

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
      form: this.$form.createForm(this),
      modal: {},
      passwordInputDisabled: false,
      selectStatus: [
        { statusCode: 1, statusText: '正常' },
        { statusCode: 0, statusText: '锁定' }
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
      this.handleEdit({ userId: 0, status: 1 })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.passwordInputDisabled = false
      this.modal = Object.assign({}, record)
      // 如果是修改操作, 则password disabled 制空
      if (this.modal.userId !== 0) {
        this.passwordInputDisabled = true
        this.modal.password = '******'
        this.modal.confirm = '******'
      }
      console.log('this.modal', this.modal)
      console.log('this.passwordInputDisabled', this.passwordInputDisabled)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'userId', 'username', 'password', 'confirm', 'email', 'mobile', 'status'))
      })
      this.visible = true
    },
    handleOk () {
      this.confirmLoading = true

      this.form.validateFieldsAndScroll((err, values) => {
        console.log('err', err)
        console.log('values', values)
        if (!err) {
          new Promise((resolve) => {
            setTimeout(() => resolve(), 2000)
          }).then(() => {
            // Do something
            this.$message.success('保存成功')
            this.$emit('ok')
          }).catch(() => {
            // Do something
          }).finally(() => {
            this.$refs.table.refresh(true)
            this.confirmLoading = false
            this.visible = false
          })
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
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback(new Error('Two passwords that you enter is inconsistent!'))
      } else {
        callback()
      }
    },
    validateToNextPassword  (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
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
