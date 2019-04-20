<template>
  <a-modal
    title="生成代码"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
  >
    <a-form :form="form">

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="表名称"
        hasFeedback
      >
        <a-input placeholder="请输入数据库表名称" v-decorator="['tableName',{rules: [{required: true, message: '请输入数据库表名称!'}]}]" disabled="disabled"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="模块包名"
        hasFeedback
      >
        <a-input placeholder="模块包名, 例：权限模块 -> auth" v-decorator="['module',{rules: [{required: true, message: '请输入模块包名!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="功能编码"
        hasFeedback
      >
        <a-input placeholder="功能编码, 例：用户管理 -> user" v-decorator="['functionCode',{rules: [{required: true, message: '请输入功能编码!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="请求地址"
        hasFeedback
      >
        <a-input placeholder="请求地址, 例：用户管理 -> sys/user" v-decorator="['requestMapping',{rules: [{required: true, message: '请输入请求地址!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="页面模块"
        hasFeedback
      >
        <a-input placeholder="页面模块, 例：用户管理 -> system/user" v-decorator="['viewPath',{rules: [{required: true, message: '请输入页面模块!'}]}]"/>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="生成类型"
      >
        <a-radio-group buttonStyle="solid" v-decorator="['type', {rules: [{required: true, message: '请选择类型!'}]}]">
          <a-radio v-for="radio in radioValue" :key="radio.radioCode" :value="radio.radioCode">{{ radio.radioText }}</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
    <a-divider orientation="left">注意事项</a-divider>
    <a-card>
      <p>1.模块包名：java文件package使用，比如权限模块应为auth</p>
      <p>2.功能编码：用户管理应配置为user，生成api</p>
      <p>3.请求地址：用户管理应配置为sys/user，requestMapping的值</p>
      <p>4.页面模块：用户管理应配置为system/user，views资源路径</p>
    </a-card>
  </a-modal>
</template>

<script>
import { generatorCode } from '@/api/tool/generator'
import pick from 'lodash.pick'

export default {
  name: 'GeneratorModal',
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
      radioValue: [
        { radioCode: 0, radioText: '生成包结构' },
        { radioCode: 1, radioText: '只生成源代码' }
      ]
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleGenerator (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.modal = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'tableName'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          generatorCode(values).then(() => {
            // Do something
            this.$message.success('生成代码成功')
            this.$emit('ok')
            this.tableRefresh(true)
            this.confirmLoading = false
            this.visible = false
          }).catch(() => {
            // Do something
            this.$message.error('生成代码失败')
            this.confirmLoading = false
          })
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
