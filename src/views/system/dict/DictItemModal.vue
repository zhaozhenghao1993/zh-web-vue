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
        label="名称"
        hasFeedback
      >
        <a-input placeholder="请输入字典元素名称" v-decorator="['name',{rules: [{required: true, message: '请输入元素名称!'}]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="值"
        hasFeedback
      >
        <a-input placeholder="请输入字典元素值" v-decorator="['value',{rules: [{required: true, message: '请输入元素值!'}]}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
        hasFeedback
      >
        <a-input placeholder="请输入描述" v-decorator="['description',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="状态"
        hasFeedback
      >
        <a-switch v-model="checkedStatus" checked-children="正常" un-checked-children="禁用" default-checked />
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
        hasFeedback
      >
        <a-input-number placeholder="请输入排序" v-decorator="['order',{rules: []}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { dictItemSave, dictItemEdit } from '@/api/system/dict'
import pick from 'lodash.pick'

export default {
  name: 'DictItemModal',
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
      checkedStatus: true,
      dictCode: null
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleCreate (dictCode) {
      // 每次都重置form表单
      this.form.resetFields()
      this.modalStatus = 'create'
      this.modal = Object.assign({}, { id: 0 })
      this.visible = true
      this.checkedStatus = true
      this.dictCode = dictCode
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'name', 'value', 'description', 'order'))
      })
    },
    handleEdit (dictCode, record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.modalStatus = 'edit'
      this.modal = Object.assign({}, record)
      this.visible = true
      this.checkedStatus = record.status === 0
      this.dictCode = dictCode
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'name', 'value', 'description', 'order'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.checkedStatus) {
            values.status = 0
          } else {
            values.status = 1
          }
          if (this.modalStatus === 'create') {
            dictItemSave(this.dictCode, values).then(() => {
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
            dictItemEdit(this.dictCode, values.id, values).then(() => {
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
