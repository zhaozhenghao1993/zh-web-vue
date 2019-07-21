<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    width=650
    placement="right"
    :closable="true"
    @close="handleCancel"
    :destroyOnClose="true"
    :visible="visible"
    style="height: calc(100% - 55px);overflow: auto;padding-bottom: 53px;">

    <a-form>
      <a-form-item>
        <a-spin :spinning="spinning">
          <a-tree
            checkable
            @expand="onExpand"
            :checkStrictly="checkStrictly"
            :expandedKeys="expandedKeys"
            v-model="checkedKeys"
            :treeData="treeData"
          />
        </a-spin>
      </a-form-item>
    </a-form>

    <div class="drawer-bootom-button">
      <a-dropdown style="float: left" :trigger="['click']" placement="topCenter">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="switchCheckStrictly(1)">父子关联</a-menu-item>
          <a-menu-item key="2" @click="switchCheckStrictly(2)">取消关联</a-menu-item>
          <a-menu-item key="3" @click="checkALL">全部勾选</a-menu-item>
          <a-menu-item key="4" @click="cancelCheckALL">取消全选</a-menu-item>
          <a-menu-item key="5" @click="expandAll">展开所有</a-menu-item>
          <a-menu-item key="6" @click="closeAll">合并所有</a-menu-item>
        </a-menu>
        <a-button>
          树操作 <a-icon type="up" />
        </a-button>
      </a-dropdown>
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { menuTree } from '@/api/system/menu'
import { roleInfo, roleAuthorize } from '@/api/system/role'

export default {
  name: 'MenuTreeModal',
  data () {
    return {
      title: '角色授权权限配置',
      visible: false,
      confirmLoading: false,
      role: {},
      treeData: [],
      checkedKeys: [],
      allTreeKeys: [],
      expandedKeys: [],
      spinning: false,
      checkStrictly: true
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
    }
  },
  methods: {
    reset () {
      this.checkStrictly = true
      this.expandedKeys = []
      this.allTreeKeys = []
      this.checkedKeys = []
      this.spinning = true
      this.confirmLoading = false
    },
    handleAuthorize (record) {
      this.reset()
      this.role = record
      this.loadData()
      this.loadRoleInfo(record.id)
      // this.modal = Object.assign({}, { menuId: 0, type: 0, parentName: '主目录', parentId: 0 })
      this.visible = true
    },
    handleCancel () {
      this.reset()
      this.$emit('close')
      this.visible = false
    },
    switchCheckStrictly (v) {
      if (v === 1) {
        this.checkStrictly = false
      } else if (v === 2) {
        this.checkStrictly = true
      }
    },
    checkALL () {
      this.checkedKeys = this.allTreeKeys
    },
    cancelCheckALL () {
      this.checkedKeys = []
    },
    expandAll () {
      this.expandedKeys = this.allTreeKeys
    },
    closeAll () {
      this.expandedKeys = []
    },
    handleSubmit (e) {
      e.preventDefault()
      this.confirmLoading = true

      roleAuthorize(this.role.id, this.checkedKeys.checked === undefined ? this.checkedKeys : this.checkedKeys.checked).then(() => {
        // Do something
        this.$message.success('保存成功')
        this.$emit('ok')
        this.tableRefresh(false)
        this.confirmLoading = false
        this.handleCancel()
      }).catch(() => {
        // Do something
        this.$message.error('保存失败')
        this.confirmLoading = false
      })
    },
    loadData () {
      menuTree().then(res => {
        this.treeData = res.data
        this.loadAllTreeKeys(this.treeData)
      }).catch(e => {
      })
    },
    loadAllTreeKeys (array) {
      array.forEach(tree => {
        this.allTreeKeys.push(tree.id)
        if (tree.children !== undefined && tree.children.length > 0) {
          this.loadAllTreeKeys(tree.children)
        }
      })
    },
    loadRoleInfo (id) {
      roleInfo(id).then(res => {
        if (res.data.menuIdList !== undefined) {
          this.checkedKeys = res.data.menuIdList
          this.expandedKeys = res.data.menuIdList
        }
        this.spinning = false
      }).catch(e => {
      })
    },
    onExpand (expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
    }
  }
}
</script>

<style lang="less" scoped>
  .drawer-bootom-button {
    position: absolute;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e8e8e8;
    padding: 10px 16px;
    text-align: right;
    left: 0;
    background: #fff;
    border-radius: 0 0 2px 2px;
  }

</style>
