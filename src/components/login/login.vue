<template>
  <div class="login-wrap">
    <el-form class="login-from" ref="form" label-position="top" :model="userForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="userForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="userForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" @click="login">点击登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import {saveUserInfo} from '@/assets/js/auth'
export default {
  data () {
    return {
      userForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      const res = await this.$http.post('/login', this.userForm)
      console.log(res)
      if (res.data.meta.status === 200) {
        // 登录成功，我们把服务器发给我们当前登录的用户信息存储到本地
        saveUserInfo(res.data.data)
        // 登录成功，将服务器签发给用户的token身份令牌记录到localStorage中
        // 其他使用token的都去本地存储获取
        // 把当前登录用户信息存储到本地
        // auth模块   saveUserInfo   getToken  checkToken
        // window.localStorage.setItem('admin-token', JSON.stringify(res.data.data))
        this.$router.push({
          name: 'home'
        })
      }
    }
  }
}
</script>
<style>
 .login-wrap {
   background-color: #324;
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100%;
 }
 .login-from {
   background-color: #fff;
   width: 300px;
   padding: 30px;
 }
 .login-btn {
   width: 100%;
   background-color: #fff;
 }
</style>
