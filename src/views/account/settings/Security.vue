<template>
  <a-collapse :bordered="false">
    <a-collapse-panel header="修改密码" key="1">
      <a-form :form="passwordForm" layout="vertical">
        <a-form-item
          label="Old password"
          hasFeedback
          :required="false"
        >
          <a-input placeholder="Old password" v-decorator="['oldPassword',{rules: [{required: true, message: 'Please input your old password!',}, {validator: validateToNextPassword,}],}]" type="password" />
        </a-form-item>

        <a-form-item
          label="New password"
          hasFeedback
          :required="false"
        >
          <a-input placeholder="New password" v-decorator="['password',{rules: [{required: true, message: 'Please input your new password!',}, {validator: validateToNextPassword,}],}]" type="password"/>
        </a-form-item>

        <a-form-item
          label="Confirm new password"
          hasFeedback
          :required="false"
        >
          <a-input placeholder="Confirm new password" v-decorator="['confirm',{rules: [{required: true, message: 'Please confirm your new password!',}, {validator: compareToFirstPassword,}],}]" type="password" @blur="handleConfirmBlur"/>
        </a-form-item>

        <a-form-item>
          <a-button type="primary" @click="handlePasswordSubmit" :loading="confirmPasswordLoading">修改密码</a-button>
          <a-button @click="handlePasswordClear" style="margin-left: 8px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-collapse-panel>
    <a-collapse-panel header="This is panel header 2" key="2">
      <p>{{ text }}</p>
    </a-collapse-panel>
    <a-collapse-panel header="This is panel header 3" key="3">
      <p>{{ text }}</p>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import { profilePassword } from '@/api/account/profile'
import { getRsaKey } from '@/api/login'
import JSEncrypt from 'jsencrypt/bin/jsencrypt'

export default {
  data () {
    return {
      text: `待开发`,
      passwordForm: this.$form.createForm(this),
      confirmPasswordLoading: false,
      rsaPublicKey: ''
    }
  },
  created () {
    this.getSysRsaKey()
  },
  methods: {
    getSysRsaKey () {
      getRsaKey()
        .then((res) => {
          this.rsaPublicKey = res.data
        })
        .catch(() => {
          this.$notification['error']({
            message: '错误',
            description: '请重新刷新页面',
            duration: 4
          })
        })
    },
    handlePasswordSubmit () {
      this.confirmPasswordLoading = true
      this.passwordForm.validateFieldsAndScroll((err, values) => {
        if (!err) {
          // 新建JSEncrypt对象
          const encryptor = new JSEncrypt()
          // 设置公钥
          encryptor.setPublicKey(this.rsaPublicKey)
          // 对需要加密的数据进行加密
          values.password = encryptor.encrypt(values.password)
          values.oldPassword = encryptor.encrypt(values.oldPassword)
          profilePassword(values).then(() => {
            // Do something
            this.$message.success('保存成功')
            this.passwordForm.resetFields()
            this.confirmPasswordLoading = false
          }).catch(() => {
            // Do something
            this.$message.error('保存失败')
            this.confirmPasswordLoading = false
          }).finally(() => {
            this.getSysRsaKey()
          })
        } else {
          this.confirmPasswordLoading = false
        }
      })
    },
    handlePasswordClear () {
      this.passwordForm.resetFields()
    },
    handleConfirmBlur  (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword  (rule, value, callback) {
      const form = this.passwordForm
      if (value && value !== form.getFieldValue('password')) {
        callback(new Error('Two passwords that you enter is inconsistent!'))
      } else {
        callback()
      }
    },
    validateToNextPassword  (rule, value, callback) {
      const form = this.passwordForm
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    }
  }
}
</script>

<style scoped>

</style>
