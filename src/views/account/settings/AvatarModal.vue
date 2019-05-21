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
      <label class="btn" for="uploads">upload</label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg($event, 1)">
      <a-button key="back" @click="cancelHandel">取消</a-button>
      <a-button key="submit" type="primary" :loading="confirmLoading" @click="okHandel('blob')">保存</a-button>
    </template>
  </a-modal>
</template>
<script>
import { VueCropper } from 'vue-cropper'

export default {
  components: {
    VueCropper
  },
  data () {
    return {
      visible: false,
      id: null,
      confirmLoading: false,

      option: {
        img: '/avatar2.jpg',
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: false, // 输出原图比例截图 props名full
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
    edit (id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    okHandel (type) {
      /* const vm = this

      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('上传头像成功')
      }, 2000) */
      console.log('finish')
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          console.log('data', data)
          formData.append('file', data, this.fileName)
          /* this.$http.post(Api.uploadSysHeadImg.url, formData, { contentType: false, processData: false, headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
            .then((response) => {
              var res = response.data
              if (res.success === 1) {
                _this.imgFile = ''
                _this.headImg = res.realPathList[0] // 完整路径
                _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
                _this.$message({ // element-ui的消息Message消息提示组件
                  type: 'success',
                  message: '上传成功'
                })
              }
            }) */
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    // 选择本地图片
    uploadImg (e, num) {
      console.log('uploadImg')
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
          console.log('data', data)
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
    overflow: hidden;
    margin: 5px;
    border-radius: 50%;
    position: absolute;
    box-shadow: 0 0 4px #ccc;
    transform: translate3d(88px, 75px, 0px);

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
