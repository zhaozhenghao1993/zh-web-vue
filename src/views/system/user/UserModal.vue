<template>
  <a-modal
    :title="modalStatus === 'create' ? '新增':'编辑'"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    :destroyOnClose="true"
  >
    <a-spin :spinning="spinning">
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

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色"
        >
          <a-checkbox-group v-model="userRoleList">
            <a-row>
              <a-col :span="8" v-for="role in roleList" :key="role.roleId">
                <a-checkbox :value="role.roleId">{{ role.roleName }}</a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { userSave, userEdit, userInfo } from '@/api/system/user'
import { roleSelect } from '@/api/system/role'
import pick from 'lodash.pick'

export default {
  name: 'UserModal',
  data () {
    return {
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
      modalStatus: 'create',
      passwordInputDisabled: false,
      selectStatus: [
        { statusCode: 1, statusText: '正常' },
        { statusCode: 0, statusText: '锁定' }
      ],
      spinning: false,
      roleList: [],
      userRoleList: []
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleCreate () {
      // 每次都重置form表单
      this.form.resetFields()
      this.userRoleList = []
      this.spinning = true
      // 加载角色列表
      this.loadRoleSelect()
      this.passwordInputDisabled = false
      this.modalStatus = 'create'
      this.modal = Object.assign({}, { userId: 0, status: 1 })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'userId', 'username', 'password', 'confirm', 'email', 'mobile', 'status'))
      })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.userRoleList = []
      this.spinning = true
      // 加载角色列表
      this.loadRoleSelect(record.userId)
      // 如果是修改操作, 则password disabled 制空
      this.passwordInputDisabled = true
      this.modalStatus = 'edit'
      this.modal = Object.assign({}, record)
      this.modal.password = '******'
      this.modal.confirm = '******'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'userId', 'username', 'password', 'confirm', 'email', 'mobile', 'status'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.roleIdList = this.userRoleList
          if (this.modalStatus === 'create') {
            userSave(values).then(() => {
              // Do something
              this.$message.success('保存成功')
              this.$emit('ok')
              this.tableRefresh(true)
              this.confirmLoading = false
              this.visible = false
            }).catch(() => {
              // Do something
              this.$message.error('保存失败')
              this.confirmLoading = false
            })
          } else if (this.modalStatus === 'edit') {
            userEdit(values.userId, values).then(() => {
              // Do something
              this.$message.success('保存成功')
              this.$emit('ok')
              this.tableRefresh(false)
              this.confirmLoading = false
              this.visible = false
            }).catch(() => {
              // Do something
              this.$message.error('保存失败')
              this.confirmLoading = false
            })
          }
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.$emit('close')
      this.visible = false
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
    },
    loadRoleSelect (id) {
      roleSelect().then(res => {
        if (res.data !== undefined) {
          console.log(res.data)
          this.roleList = res.data
          if (id !== undefined) {
            // 如果当前是编辑则加载该用户角色信息
            this.loadUserInfo(id)
          } else {
            this.spinning = false
          }
        }
      }).catch(e => {
      })
    },
    loadUserInfo (id) {
      userInfo(id).then(res => {
        if (res.data.roleIdList !== undefined) {
          this.userRoleList = res.data.roleIdList
        }
        this.spinning = false
      }).catch(e => {
      })
    }
  }
}
</script>
