<template>
  <div class="login-wrap">
    <el-form
      class="login-form"
      label-position="left"
      label-width="80px"
      :model="formdata"
    >
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button
        @click.prevent="handleLogin()"
        class="login-button"
        type="primary "
        >登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // es7新语法，async,await 让asios异步操作看起来像同步
    async handleLogin () {
      const res = await this.$http.post('/manager/login', this.formdata)
      console.log(res)
      if (res.data.code === 'SUCCESS') {
        // 登录成功，保存token
        // localStorage.setItem('token', res.headers.authorization)
        this.$store.commit('$_setStorage', res.headers.authorization)
        let count = this.formdata
        // this.$store.commit('modifyRoles', roles)
        // localStorage.setItem('roles', res.data.data.role)
        // localStorage.setItem('permissions', res.data.data.permissions)
        this.$store.commit('modifyName', this.formdata.username)
        this.$router.push(
          {name: 'home', path: '/home', params: count})
        this.$message.success(res.data.params[0])
      } else {
        this.$message.error(res.data.params[0])
      }
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color:lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color:lightslategray;
  border-radius: 5px;
  padding: 30px;
}

.login-wrap .login-button {
  width: 100%;
}
</style>
