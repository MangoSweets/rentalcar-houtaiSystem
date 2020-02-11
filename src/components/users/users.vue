<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-rol>
        <el-input placeholder="请输入内容" v-model="query" class="inputSearch">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button type="success">成功按钮</el-button>
      </el-rol>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="80">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="80">
      </el-table-column>
      <el-table-column prop="salt" label="盐" width="80"> </el-table-column>
      <el-table-column prop="roles" label="角色" width="80"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="80"> </el-table-column>
      <el-table-column prop="sex" label="性别" width="60"> </el-table-column>
      <el-table-column prop="telephone" label="手机号码"> </el-table-column>
      <el-table-column prop="idcard" label="身份证"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="bankcard" label="银行卡"> </el-table-column>
      <el-table-column prop="address" label="常驻地址"> </el-table-column>
      <el-table-column prop="userCreateTime" label="创建日期">
        <template slot-scope="userList">
          <!--  userList.row.userCreatetime userlist的每个对象 会经度有误差 -->
          {{ userList.userCreateTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="userStatus" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.userStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
          <el-button size="mini" plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      userList: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      //  需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
      //  const AUTH_TOKEN =localStorage.getItem('token')
      //  this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get('/user/selectall')
      console.log(res.data)
      if (res.data.code === 'SUCCESS') {
        this.userList = res.data.data
        this.$message.success('ok')
      }
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.inputSearch {
  width: 300px;
}
.searchRow {
  margin-top: 20px;
}
</style>
