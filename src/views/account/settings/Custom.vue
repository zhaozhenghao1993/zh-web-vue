<template>
  <a-list itemLayout="horizontal">
    <a-list-item>
      <Meta>
      <a slot="title">风格配色</a>
      <span slot="description">整体风格配色设置</span>
      </Meta>
      <div slot="actions">
        <a-switch :loading="this.themeLoading" checkedChildren="暗色" unCheckedChildren="白色" :defaultChecked="this.navTheme === 'dark' && true || false" @change="this.onChange" />
      </div>
    </a-list-item>
    <a-list-item>
      <Meta>
      <a slot="title">主题色</a>
      <span slot="description">页面风格配色： <a>{{ this.colorFilter(this.primaryColor) }}</a></span>
      </Meta>
      <div slot="actions">
        <a-tooltip class="setting-drawer-theme-color-colorBlock" v-for="(item, index) in colorList" :key="index">
          <template slot="title">
            {{ item.key }}
          </template>
          <a-tag :color="item.color" @click="changeColor(item.color, item.code)">
            <a-icon type="check" v-if="item.color === primaryColor"></a-icon>
          </a-tag>
        </a-tooltip>
      </div>
    </a-list-item>
  </a-list>
</template>

<script>
import { updateTheme, updateColorWeak, colorList } from '@/components/SettingDrawer/settingConfig'
import ASwitch from 'ant-design-vue/es/switch'
import AList from 'ant-design-vue/es/list'
import AListItem from 'ant-design-vue/es/list/Item'
import { mixin } from '@/utils/mixin.js'
import { profileTheme, profileColor } from '@/api/account/profile'
import config from '@/config/defaultSettings'

const Meta = AListItem.Meta

export default {
  components: {
    AListItem,
    AList,
    ASwitch,
    Meta
  },
  mixins: [mixin],
  data () {
    return {
      colorList,
      themeLoading: false,
      baseConfig: Object.assign({}, config)
    }
  },
  filters: {
    themeFilter (theme) {
      const themeMap = {
        'dark': '暗色',
        'light': '白色'
      }
      return themeMap[theme]
    }
  },
  mounted () {
    const vm = this
    setTimeout(() => {
      vm.visible = false
    }, 16)
    // 当主题色不是默认色时，才进行主题编译
    if (this.primaryColor !== config.primaryColor) {
      updateTheme(this.primaryColor)
    }
    if (this.colorWeak !== config.colorWeak) {
      updateColorWeak(this.colorWeak)
    }
  },
  methods: {
    colorFilter (color) {
      const c = colorList.filter(o => o.color === color)[0]
      return c && c.key
    },
    onChange (checked) {
      this.themeLoading = true
      let theme
      if (checked) {
        // this.$store.dispatch('ToggleTheme', 'dark')
        theme = 'dark'
      } else {
        // this.$store.dispatch('ToggleTheme', 'light')
        theme = 'light'
      }
      profileTheme({ theme: theme }).then(() => {
        // Do something
        this.$store.dispatch('GetInfo').then(res => {
          this.$message.success('保存成功')
          this.themeLoading = false
        })
      }).catch(() => {
        // Do something
        this.$message.error('保存失败')
        this.themeLoading = false
      })
    },
    changeColor (color, code) {
      if (this.primaryColor !== color) {
        profileColor({ color: code }).then(() => {
          // Do something
          this.$store.dispatch('GetInfo').then(res => {
            this.$message.success('保存成功')
            this.themeLoading = false
          })
        }).catch(() => {
          // Do something
          this.$message.error('保存失败')
          this.themeLoading = false
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .setting-drawer-theme-color-colorBlock {
    width: 20px;
    height: 20px;
    border-radius: 2px;
    float: left;
    cursor: pointer;
    margin-right: 8px;
    padding-left: 0px;
    padding-right: 0px;
    text-align: center;
    color: #fff;
    font-weight: 700;

    i {
      font-size: 14px;
    }
  }
</style>
