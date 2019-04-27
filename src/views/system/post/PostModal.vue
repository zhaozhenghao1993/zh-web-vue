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
        <a-input placeholder="ID" v-decorator="[ 'postId', {rules: []} ]" disabled="disabled" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="岗位编码"
        hasFeedback
      >
        <a-input placeholder="请输入岗位编码" v-decorator="['postCode',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="岗位名称"
        hasFeedback
      >
        <a-input placeholder="请输入岗位名称" v-decorator="['postName',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
        hasFeedback
      >
        <a-input placeholder="请输入排序" v-decorator="['orderNum',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="创建用户id"
        hasFeedback
      >
        <a-input placeholder="请输入创建用户id" v-decorator="['creatorId',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="创建时间"
        hasFeedback
      >
        <a-input placeholder="请输入创建时间" v-decorator="['createTime',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="最后修改人id"
        hasFeedback
      >
        <a-input placeholder="请输入最后修改人id" v-decorator="['modifierId',{rules: []}]"/>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="修改时间"
        hasFeedback
      >
        <a-input placeholder="请输入修改时间" v-decorator="['modifiedTime',{rules: []}]"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { postSave, postEdit } from '@/api/system/post'
import pick from 'lodash.pick'

export default {
  name: 'PostModal',
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
      this.modal = Object.assign({}, { postId: 0 })
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'postId', 'postCode', 'postName', 'orderNum', 'creatorId', 'createTime', 'modifierId', 'modifiedTime'))
      })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.modalStatus = 'edit'
      this.modal = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'postId', 'postCode', 'postName', 'orderNum', 'creatorId', 'createTime', 'modifierId', 'modifiedTime'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (this.modalStatus === 'create') {
            postSave(values).then(() => {
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
            postEdit(values.postId, values).then(() => {
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
