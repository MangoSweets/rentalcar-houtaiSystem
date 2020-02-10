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
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="name" label="用户名" width="80"> </el-table-column>
      <el-table-column prop="name" label="密码" width="80"> </el-table-column>
      <el-table-column prop="name" label="盐" width="80"> </el-table-column>
      <el-table-column prop="name" label="角色" width="80"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="80"> </el-table-column>
      <el-table-column prop="name" label="性别" width="60"> </el-table-column>
      <el-table-column prop="name" label="手机号码"> </el-table-column>
      <el-table-column prop="name" label="身份证"> </el-table-column>
      <el-table-column prop="name" label="邮箱"> </el-table-column>
      <el-table-column prop="name" label="银行卡"> </el-table-column>
      <el-table-column prop="address" label="常驻地址"> </el-table-column>
      <el-table-column prop="name" label="创建日期"> </el-table-column>
      <el-table-column prop="name" label="用户状态"> </el-table-column>
      <el-table-column prop="name" label="操作"> </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }
      ]
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // 需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
    //  const AUTH_TOKEN =localStorage.getItem('token')
    //  this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN

      const res = await this.$http.get('/user/selectall?参数')
      console.log(res)
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
