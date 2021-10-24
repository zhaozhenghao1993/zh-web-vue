<template>
  <a-modal
    :title="modalStatus === 'create' ? '新增':'编辑'"
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
        <a-input placeholder="ID" v-decorator="[ 'id', {rules: []} ]" disabled="disabled" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="字典名称"
        hasFeedback
      >
        <a-input placeholder="请输入字典名称" v-decorator="['name',{rules: [{required: true, message: '请输入字典名称!'}]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="字典编码"
        hasFeedback
      >
        <a-input placeholder="请输入字典编码" v-decorator="['code',{rules: [{required: true, message: '请输入字典编码!'}]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
        hasFeedback
      >
        <a-input placeholder="请输入描述" v-decorator="['description',{rules: []}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { dictSave, dictEdit } from '@/api/system/dict'
import pick from 'lodash.pick'

export default {
  name: 'DictModal',
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
      modalStatus: 'create'
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
      this.modalStatus = 'create'
      this.modal = Object.assign({}, { id: 0 })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'name', 'code', 'description'))
      })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.modalStatus = 'edit'
      this.modal = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'name', 'code', 'description'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.modalStatus === 'create') {
            dictSave(values).then(() => {
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
            dictEdit(values.id, values).then(() => {
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
    }
  }
}
</script>
