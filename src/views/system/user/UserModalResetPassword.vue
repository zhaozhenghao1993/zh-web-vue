<template>
  <a-modal
    title="重置密码"
    :visible="visibleResetPassword"
    @ok="handleOkForResetPassword"
    @cancel="handleCancelForResetPassword"
    :confirmLoading="resetPasswordConfirmLoading"
  >
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="ID"
      >
        <a-input placeholder="ID" v-decorator="[ 'id', {rules: []} ]" disabled="disabled" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="用户名"
      >
        <a-input v-decorator="['username',{rules: []}]" disabled="disabled"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="新密码"
        hasFeedback
      >
        <a-input v-decorator="['password',{rules: [{required: true, message: 'Please input your password!',}, {validator: validateToNextPassword,}],}]" type="password" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="请确认密码"
        hasFeedback
      >
        <a-input v-decorator="['confirm',{rules: [{required: true, message: 'Please confirm your password!',}, {validator: compareToFirstPassword,}],}]" type="password" @blur="handleConfirmBlur"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { userResetPassword } from '@/api/system/user'
import pick from 'lodash.pick'

export default {
  name: 'UserModalResetPassword',
  data () {
    return {
      visibleResetPassword: false,
      resetPasswordConfirmLoading: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      modal: {}
    }
  },
  methods: {
    handleResetPassword (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.visibleResetPassword = true
      this.modal = Object.assign({}, record)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'username', 'password', 'confirm'))
      })
    },
    handleOkForResetPassword (e) {
      e.preventDefault()
      this.modal = {}
      this.resetPasswordConfirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          userResetPassword(values.id, values).then(() => {
            // Do something
            this.$message.success('保存成功')
            this.$emit('ok')
          }).catch(() => {
            // Do something
            this.$message.error('保存失败')
          }).finally(() => {
            this.resetPasswordConfirmLoading = false
            this.visibleResetPassword = false
          })
        }
      })
    },
    handleCancelForResetPassword () {
      this.resetPasswordConfirmLoading = false
      this.visibleResetPassword = false
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
  }
}
</script>
