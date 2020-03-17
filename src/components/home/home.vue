<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
        <el-col :span="4"
          ><div class="grid-content bg-purple">
            <img src="../../assets/msld.jpg" alt="无法显示图片" /></div
        ></el-col>
        <el-col :span="18" class="middle">
          <h3>租车后台管理系统</h3>
        </el-col>
        <el-col :span="2"
          ><div class="grid-content bg-purple">
            <label>{{this.username}}</label>
            <a class="loginOut" href="#" @click.prevent="handleSignOut()">退出</a>
          </div></el-col
        >
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu :unique-opened="true" :router="true">
          <!-- 1 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
            <el-menu-item index="drivers">
              <i class="el-icon-menu"></i>
              <span>代驾列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>汽车管理</span>
            </template>
            <el-menu-item index="carlist">
              <i class="el-icon-menu"></i>
              <span>汽车列表</span>
            </el-menu-item>
            <el-menu-item index="seriesList">
              <i class="el-icon-menu"></i>
              <span>系列列表</span>
            </el-menu-item>
          </el-submenu>
          <!--4-->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="order">
              <i class="el-icon-menu"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>
          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="5-1">
              <i class="el-icon-menu"></i>
              <span>选项1</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'home',
  // 通过验证token判断是否登录
  beforeCreate () {
    // const token = localStorage.getItem('token')
    // if (!token) {
    //   this.$router.push({ name: 'login' })
    // }
    // console.log(this.$route.params)
  },
  created () {
    // this.username = this.$route.params.username
    this.username = this.$store.state.username
    // console.log(this.username)
  },
  data () {
    return {
      username: ''
    }
  },
  methods: {
    handleSignOut () {
      localStorage.clear()
      this.$message.success('退出成功')
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #b3c0d1;
}
.aside {
  background-color: #d3dce6;
}
.main {
  background-color: #e9eef3;
  height: 100%;
}
.middle {
  text-align: center;
}
.loginOut {
  line-height: 60px;
  text-decoration: none;
}
</style>
