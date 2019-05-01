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
      <div style="height: 600px; overflow: auto">
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

          <a-divider orientation="left">基本信息</a-divider>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="用户名"
            hasFeedback
          >
            <a-input placeholder="请输入用户名" v-decorator="['username',{rules: [{required: true, message: '请输入用户名!'}]}]" :disabled="editInputDisabled"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="姓名"
            hasFeedback
          >
            <a-input placeholder="起一个名字" v-decorator="['name',{rules: [{required: true, message: '请输入姓名!'}]}]"/>
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

          <a-divider orientation="left">用户安全</a-divider>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="密码"
            hasFeedback
          >
            <a-input v-decorator="['password',{rules: [{required: true, message: 'Please input your password!',}, {validator: validateToNextPassword,}],}]" type="password" :disabled="editInputDisabled" />
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="请确认密码"
            hasFeedback
          >
            <a-input v-decorator="['confirm',{rules: [{required: true, message: 'Please confirm your password!',}, {validator: compareToFirstPassword,}],}]" type="password" :disabled="editInputDisabled" @blur="handleConfirmBlur"/>
          </a-form-item>

          <a-divider orientation="left">组织岗位</a-divider>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="组织ID"
            hasFeedback
            v-show="false"
          >
            <a-input placeholder="请输入组织ID" v-decorator="['orgId',{rules: [{required: true, message: '请输入上级菜单ID!'}]}]"/>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="组织机构"
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
            label="岗位"
            hasFeedback
          >
            <a-select mode="multiple" v-model="userPostList" optionFilterProp="children" placeholder="Please select">
              <a-select-option v-for="post in postList" :key="post.postId">{{ post.postName }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-divider orientation="left">用户角色</a-divider>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="角色"
          >
            <a-checkbox-group v-model="userRoleList">
              <a-checkbox v-for="role in roleList" :key="role.roleId" :value="role.roleId">{{ role.roleName }}</a-checkbox>
            </a-checkbox-group>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { userSave, userEdit, userInfo } from '@/api/system/user'
import { orgTree } from '@/api/system/org'
import { roleSelect } from '@/api/system/role'
import { postSelect } from '@/api/system/post'
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
      editInputDisabled: false,
      selectStatus: [
        { statusCode: 0, statusText: '正常' },
        { statusCode: 1, statusText: '锁定' }
      ],
      spinning: false,
      roleList: [],
      userRoleList: [],
      postList: [],
      userPostList: [],
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
      this.userRoleList = []
      this.userPostList = []
      // 加载组织列表
      this.loadData()
      this.treeExpandedKeys = []
      this.spinning = true
      // 加载角色列表
      this.loadRoleSelect()
      this.editInputDisabled = false
      this.modalStatus = 'create'
      this.modal = Object.assign({}, { userId: 0, orgId: 0, status: 0 })
      this.selectTree = '0'
      this.treeExpandedKeys.push('0')
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'userId', 'orgId', 'username', 'password', 'name', 'confirm', 'email', 'mobile', 'status'))
      })
    },
    handleEdit (record) {
      // 每次都重置form表单
      this.form.resetFields()
      this.userRoleList = []
      this.userPostList = []
      // 加载组织列表
      this.loadData()
      this.treeExpandedKeys = []
      this.spinning = true
      // 加载角色列表
      this.loadRoleSelect(record.userId)
      // 如果是修改操作, 则password disabled 制空
      this.editInputDisabled = true
      this.modalStatus = 'edit'
      if (record.orgId === undefined || record.orgId === null) { record.orgId = 0 }
      this.modal = Object.assign({}, record)
      this.selectTree = record.orgId + ''
      this.treeExpandedKeys.push(record.orgId + '')
      this.modal.password = '******'
      this.modal.confirm = '******'
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.modal, 'userId', 'orgId', 'username', 'password', 'name', 'confirm', 'email', 'mobile', 'status'))
      })
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          values.roleIdList = this.userRoleList
          values.postIdList = this.userPostList
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
          this.userPostList = res.data.postIdList
        }
        this.spinning = false
      }).catch(e => {
      })
    },
    loadData () {
      orgTree({ isRoot: true }).then(res => {
        this.treeData = res.data
      }).catch(e => {
      })
      postSelect().then(res => {
        this.postList = res.data
      }).catch(e => {
      })
    },
    onChange (value, label) {
      this.form.setFieldsValue({ orgId: value })
    }
  }
}
</script>
