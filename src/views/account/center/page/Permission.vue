<template>
  <a-row
    :gutter="24"
    :style="{ marginBottom: '12px' }">
    <a-col :span="24" v-for="(perms, index) in permissions" :key="index" :style="{ marginBottom: '12px' }">
      <a-col :span="4">
        <span>{{ perms.name }}：</span>
      </a-col>
      <a-col :span="20" v-if="perms.action.length > 0">
        <a-tag color="cyan" v-for="(action, k) in perms.action" :key="k">{{ action.name }}</a-tag>
      </a-col>
      <a-col :span="20" v-else>-</a-col>
    </a-col>
    <a-divider orientation="left">注意事项</a-divider>
    <span>此列表只展示菜单 <a-tag>type = 1</a-tag>的菜单列表所拥有的权限 </span>
  </a-row>
</template>

<script>

export default {
  name: 'Permission',
  data () {
    return {
    }
  },
  props: {
    permissions: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>

</style>
