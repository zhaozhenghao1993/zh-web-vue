<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">

        <a-form :form="form" layout="vertical">
          <a-form-item
            label="姓名"
          >
            <a-input placeholder="给自己起个名字" v-decorator="['name',{rules: [{required: true, message: '请输入姓名!'}]}]" />
          </a-form-item>

          <a-form-item
            label="手机号"
            :required="false"
          >
            <a-input placeholder="搞个手机号" v-decorator="['mobile', {rules: [{ pattern: /^1[34578]\d{9}$/, message: '输入的手机号格式不正确!' }], validateTrigger: 'change'}]"/>
          </a-form-item>

          <a-form-item
            label="电子邮件"
            :required="false"
          >
            <a-input placeholder="不整个邮箱？" v-decorator="['email',{rules: [{type: 'email', message: '输入的E-mail格式不正确!'}]}]"/>
          </a-form-item>

          <a-form-item>
            <a-button type="primary" @click="handleSubmit" :loading="confirmLoading">保存</a-button>
          </a-form-item>
        </a-form>

      </a-col>
      <a-col :md="24" :lg="8" :style="{ minHeight: '180px' }">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)" >
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus" />
          </div>
          <img :src="option.img"/>
        </div>
      </a-col>

    </a-row>

    <avatar-modal ref="modal">

    </avatar-modal>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { profile } from '@/api/login'
import store from '@/store'
import pick from 'lodash.pick'

export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      // cropper
      preview: {},
      option: {
        img: '/avatar2.jpg',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1]
      },
      form: this.$form.createForm(this),
      user: {},
      confirmLoading: false
    }
  },
  created () {
    this.loadUserInfo()
  },
  methods: {
    loadUserInfo () {
      this.user = store.getters.userInfo
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.user, 'name', 'email', 'mobile'))
      })
    },
    handleSubmit () {
      this.confirmLoading = true
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          profile(values).then(() => {
            // Do something
            store.dispatch('GetInfo').then(res => {
              this.$message.success('保存成功')
              this.confirmLoading = false
            })
          }).catch(() => {
            // Do something
            this.$message.error('保存失败')
            this.confirmLoading = false
          })
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0,0,0,0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
</style>
