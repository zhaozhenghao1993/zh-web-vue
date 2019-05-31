<template>
  <a-modal
    title="分配权限"
    :width="400"
    v-model="visible"
    :confirmLoading="confirmLoading"
    :destroyOnClose="true"
    @ok="handleOk"
  >
    <a-spin :spinning="spinning">
      <div style="height: 500px; overflow: auto">
        <a-tree
          checkable
          @expand="onExpand"
          :checkStrictly="true"
          :expandedKeys="expandedKeys"
          v-model="checkedKeys"
          :treeData="treeData"
        />
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { menuTree } from '@/api/system/menu'
import { roleInfo, roleAuthorize } from '@/api/system/role'

export default {
  name: 'MenuTreeModal',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      role: {},
      treeData: [],
      checkedKeys: [],
      expandedKeys: [],
      spinning: false
    }
  },
  props: {
    tableRefresh: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleAuthorize (record) {
      this.spinning = true
      this.checkedKeys = []
      this.expandedKeys = []
      this.role = record
      this.loadData()
      this.loadRoleInfo(record.id)
      // this.modal = Object.assign({}, { menuId: 0, type: 0, parentName: '主目录', parentId: 0 })
      this.visible = true
    },
    handleOk (e) {
      e.preventDefault()
      this.confirmLoading = true
      roleAuthorize(this.role.id, this.checkedKeys.checked === undefined ? [] : this.checkedKeys.checked).then(() => {
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
    },
    handleCancel () {
      this.$emit('close')
      this.visible = false
    },
    loadData () {
      menuTree().then(res => {
        this.treeData = res.data
      }).catch(e => {
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
