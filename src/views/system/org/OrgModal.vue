<template>
  <a-modal
    :title="modalStatus === 'create' ? '新增':'编辑'"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    :destroyOnClose="true"
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
        label="组织名称"
        hasFeedback
      >
        <a-input placeholder="请输入组织名称" v-decorator="['orgName',{rules: [{required: true, message: '请输入组织名称!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级组织ID"
        hasFeedback
        v-show="false"
      >
        <a-input placeholder="请输入上级组织ID" v-decorator="['parentId',{rules: [{required: true, message: '请输入上级菜单ID!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级组织"
        hasFeedback
      >
        <a-tree-select
          v-model="selectTree"
          showSearch
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          placeholder="Please select"
          treeNodeFilterProp="title"
          @change="onChange"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
        hasFeedback
      >
        <a-input-number v-decorator="['orderNum',{rules: [{ pattern: /^[0-9]+$/, message: '请输入数字' }]}]" />
      </a-form-item>

      <a-divider />
    </a-form>
  </a-modal>
</template>

<script>
import { orgSave, orgEdit, orgTree } from '@/api/system/org'
import pick from 'lodash.pick'

export default {
  name: 'OrgModal',
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
      treeData: [],
      selectTree: ''
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleCreate (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.loadData()
      this.modalStatus = 'create'
      this.modal = Object.assign({}, { id: 0, parentId: record.id })
      this.selectTree = record.id + ''
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'parentId', 'orgName', 'orderNum'))
      })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.loadData()
      this.modalStatus = 'edit'
      this.modal = Object.assign({}, record)
      this.selectTree = record.parentId + ''
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'id', 'parentId', 'orgName', 'orderNum'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          if (values.type === 0 || values.type === 1) {
            // 如果为 目录或菜单，就将 uri 和 method 制空
            values.uri = ''
            values.method = ''
          }
          if (this.modalStatus === 'create') {
            orgSave(values).then(() => {
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
            orgEdit(values.id, values).then(() => {
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
          this.confirmLoading = false
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.$emit('close')
      this.visible = false
    },
    loadData () {
      orgTree({ isRoot: true }).then(res => {
        this.treeData = res.data
      }).catch(e => {
      })
    },
    onChange (value, label) {
      this.form.setFieldsValue({ parentId: value })
    }
  }
}
</script>
