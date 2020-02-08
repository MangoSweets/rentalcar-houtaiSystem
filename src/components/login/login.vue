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
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button
        @click.prevent="handleLogin()"
        class="login-button"
        type="primary"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin () {
      this.$http.post('/login', this.formdata).then(res => {
        console.log(res)
        console.log(res.data.code)
        // const { data } = res.data
        // console.log('---')
        // const { data: {code, message} } = res.data

        if (res.data.code === 'SUCCESS') {
          this.$router.push({ name: 'home' })
          // console.log('ok')
          this.$message.success(res.data.message)
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style>
.login-wrap {
  height: 100%;
  background-color: blanchedalmond;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-wrap .login-form {
  width: 400px;
  background-color: gold;
  border-radius: 5px;
  padding: 30px;
}

.login-wrap .login-button {
  width: 100%;
}
</style>
