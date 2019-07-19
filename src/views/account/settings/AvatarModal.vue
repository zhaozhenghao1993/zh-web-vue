<template>
  <a-modal
    title="修改头像"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <vue-cropper
          ref="cropper"
          :img="option.img"
          :info="true"
          :outputSize="option.size"
          :outputType="option.outputType"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixedBox="option.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <div :style="{'width': previews.w + 'px', 'height': previews.h + 'px'}" class="avatar-upload-preview">
          <div :style="previews.div" class="preview">
            <img :src="previews.url" :style="previews.img">
          </div>
        </div>
      </a-col>
    </a-row>

    <template slot="footer">
      <a-button style="margin-right: 68%" @click="selectOnClick">
        <a-icon type="upload" /> 选择文件
      </a-button>
      <input type="file" ref="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel()">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
import { profileAvatar } from '@/api/account/profile'
import store from '@/store'

export default {
  data () {
    return {
      visible: false,
      confirmLoading: false,
      fileName: '',
      option: {
        img: '/avatar.png',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: 'png',
        canMove: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      previews: {}
    }
  },
  methods: {
    edit (img) {
      this.visible = true
      /* 获取原始头像 */
      this.option.img = img
    },
    close () {
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    selectOnClick () {
      this.$refs.uploads.dispatchEvent(new MouseEvent('click'))
    },
    okHandel () {
      const formData = new FormData()
      // 输出
      this.$refs.cropper.getCropBlob((data) => {
        if (this.fileName === '') {
          this.fileName = 'avatar.png'
        }
        formData.append('file', data, this.fileName)
        profileAvatar(formData).then(() => {
          // Do something
          store.dispatch('GetInfo').then(res => {
            this.$message.success('上传头像成功')
            this.visible = false
          })
        }).catch(() => {
          // Do something
          this.$message.error('上传头像失败')
        })
      })
    },
    // 选择本地图片
    uploadImg (e, num) {
      const _this = this
      // 上传图片
      const file = e.target.files[0]
      _this.fileName = file.name
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        this.$message.error('图片类型必须是.gif,jpeg,jpg,png,bmp中的一种')
        return false
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        if (num === 1) {
          _this.option.img = data
        } else if (num === 2) {
          _this.example2.img = data
        }
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    },
    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
