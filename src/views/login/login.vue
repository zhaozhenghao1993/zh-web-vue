<template>
  <div class="login-page">
    <div class="middle-box loginscreen container">
      <div class="login-header">
        <img src="../../assets/zh-loge.png" class="login-logo">
        <span class="login-title">ZH Admin登陆</span>
      </div>
      <div class="login-title-desc">ZH Admin 是springboot + vue权限模板框架设计</div>
      <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
        <el-form-item prop="username">
          <el-input status-icon prefix-icon="ele-icon-user" name="username" type="text" v-model="loginForm.username" auto-complete="on" placeholder="请输入用户名"/>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="ele-icon-lock" name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"></el-input>
          <span class="show-pwd" :style="eyeStatus" @click="showPassword"><i class="ele-icon-eye"></i></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data: function () {
    const validateUsername = (rule, value, callback) => {
      if (value.trim().length < 1) {
        callback(new Error('用户名不能为空'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.trim().length < 1) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      pwdType: 'password',
      eyeStatus: ''
    }
  },
  methods: {
    showPassword () {
      if (this.pwdType === 'password') {
        this.pwdType = ''
        this.eyeStatus = 'color:#1296db'
      } else {
        this.pwdType = 'password'
        this.eyeStatus = ''
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch((e) => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  $dark_gray:#889aa4;
  .login-page{
    width: 100%;
    height: 100%;
    background: #f0f2f5 url(../../assets/login.svg) no-repeat center 110px;
    background-size: 100%;
    position: fixed;
  }
  .container {
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
  }
  .middle-box{
    max-width: 400px;
    z-index: 100;
    margin: 7% auto;
    padding-bottom: 10px;
  }
  .loginscreen .middle-box{
    width: 300px;
  }
  .login-top{
    background-color: #3b3127;
    height: 6px;
  }
  .login-header{
    font-weight:bold;
    text-align: center;
  }
  .login-title{
    font-size: 33px;
    font-family: Avenir,Helvetica Neue,Arial,Helvetica,sans-serif;
    font-weight: 600;
    position: relative;
    top: 2px;
  }
  .login-logo{
    height: 44px;
    vertical-align: top;
    margin-right: 16px;
  }
  .login-title-desc {
    text-align: center;
    font-size: 14px;
    color: rgba(0,0,0,.45);
    margin-top: 12px;
    margin-bottom: 40px;
  }
  .middle-box{
    .el-input {
      display: inline-block;
    }
    .el-button {
      display: inline-block;
      width:100%;
    }
    .el-input__inner {
      text-align: center;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
</style>
<style>
  .container .el-input__prefix {
    left: 9px;
  }
</style>
