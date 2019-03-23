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
        <a-input placeholder="ID" v-decorator="[ 'menuId', {rules: []} ]" disabled="disabled" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="类型"
      >
        <a-radio-group buttonStyle="solid" v-decorator="['type', {rules: [{required: true}]}]">
          <a-radio-button v-for="radio in radioValue" :key="radio.radioCode" :value="radio.radioCode">{{ radio.radioText }}</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="菜单名称"
        hasFeedback
      >
        <a-input placeholder="请输入菜单名称" v-decorator="['name',{rules: [{required: true, message: '请输入菜单名称!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级菜单ID"
        hasFeedback
        v-show="false"
      >
        <a-input placeholder="请输入角色标识, 例：admin" v-decorator="['parentId',{rules: [{required: true, message: '请输入上级菜单ID!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级菜单名称"
        hasFeedback
        v-show="false"
      >
        <a-input placeholder="请输入角色标识, 例：admin" v-decorator="['parentName',{rules: [{required: true, message: '请输入菜单名称!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="上级菜单"
        hasFeedback
      >
        <a-tree-select
          v-model="selectTree"
          showSearch
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          placeholder="Please select"
          :treeDefaultExpandedKeys="treeExpandedKeys"
          treeNodeFilterProp="title"
          @change="onChange"
        >
        </a-tree-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="uri"
        hasFeedback
        v-show="this.form.getFieldValue('type') === 2 || this.form.getFieldValue('type') === 3"
      >
        <a-input placeholder="请输入uri,此为路由后的地址, 例：/sys/user/{id}" v-decorator="['uri',{rules: [{ pattern: /^[^\u4E00-\u9FA5]+$/, message: '输入的uri格式不正确! 例：/sys/user/{id} ！' }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="method"
        hasFeedback
        v-show="this.form.getFieldValue('type') === 2 || this.form.getFieldValue('type') === 3"
      >
        <a-input placeholder="请输入请求method, 例：GET 或 POST" v-decorator="['method',{rules: [{ pattern: /^[A-Z]+$/, message: '输入的method格式不正确! 例：GET 或 POST ！' }]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="授权标识"
        hasFeedback
      >
        <a-input placeholder="请输入授权标识, 例：sys:user:save" v-decorator="['perms',{rules: [{required: true, message: '请输入授权标识, 例：sys:user:save!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="排序"
        hasFeedback
      >
        <a-input v-decorator="['orderNum',{rules: [{ pattern: /^[0-9]+$/, message: '请输入数字' }]}]" />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="描述"
        hasFeedback
      >
        <a-input v-decorator="['description', {rules: []}]"/>
      </a-form-item>

      <a-divider />
    </a-form>
  </a-modal>
</template>

<script>
import { menuSave, menuEdit, menuTree } from '@/api/system/menu'
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
      defaultRadioValue: 1,
      radioValue: [
        { radioCode: 0, radioText: '目录' },
        { radioCode: 1, radioText: '菜单' },
        { radioCode: 2, radioText: '按钮' },
        { radioCode: 3, radioText: '链接' }
      ],
      treeData: [],
      selectTree: '',
      treeExpandedKeys: []
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
      this.treeExpandedKeys = []
      this.loadData()
      this.modalStatus = 'create'
      this.modal = Object.assign({}, { menuId: 0, type: 0, parentName: '主目录', parentId: 0 })
      this.selectTree = '0'
      this.treeExpandedKeys.push('0')
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'menuId', 'parentId', 'parentName', 'name', 'uri', 'method', 'perms', 'type', 'orderNum', 'description'))
      })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.treeExpandedKeys = []
      this.loadData()
      this.modalStatus = 'edit'
      this.modal = Object.assign({ parentName: '主目录' }, record)
      this.selectTree = record.parentId + ''
      this.treeExpandedKeys.push(record.parentId + '')
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'menuId', 'parentId', 'parentName', 'name', 'uri', 'method', 'perms', 'type', 'orderNum', 'description'))
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
            menuSave(values).then(() => {
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
            menuEdit(values.menuId, values).then(() => {
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
      menuTree({ isNotButton: true }).then(res => {
        this.treeData = res.data
      }).catch(e => {
      })
    },
    onChange (value, label) {
      this.form.setFieldsValue({ parentName: label[0], parentId: value })
    }
  }
}
</script>
