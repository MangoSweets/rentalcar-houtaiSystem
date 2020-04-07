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
      <el-row>
        <el-input
          @clear="loadUserList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchUser()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDialog()"
          >添加用户</el-button
        >
      </el-row>
    </el-row>
    <!-- 表格 -->
    <el-table :data="userList">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="80">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="80">
      </el-table-column>
      <el-table-column prop="roles" label="角色" width="80"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="100"> </el-table-column>
      <el-table-column prop="sex" label="性别" width="60"> </el-table-column>
      <el-table-column prop="telephone" label="手机号码" width="120"> </el-table-column>
      <el-table-column prop="idcard" label="身份证" width="200"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <el-table-column prop="bankCard" label="银行卡" width="250"> </el-table-column>
      <el-table-column prop="address" label="常驻地址"> </el-table-column>
      <el-table-column prop="userCreateTime" label="创建日期" width="100">
        <template slot-scope="userList">
          <!--  userList.row.userCreatetime userlist的每个对象 会经度有误差 -->
          {{ userList.row.userCreateTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="userStatus" label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeStatus(scope.row)"
            v-model="scope.row.userStatus"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="showEditUserDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteUserMsgBox(scope.row.userId)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[1, 2, 4, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd"  width="30%" center  top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon class="formClass">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth"  prop="password">
          <el-input
            show-password
            v-model="form.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="telephone">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUser('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth" prop="telephone">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noEdit()">取 消</el-button>
        <el-button type="primary" @click="editUser('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {validatePsdReg, validatePhoneTwo, validateCode, validateEMail} from '@/assets/js/validate.js'
export default {
  name: 'userManage',
  data () {
    return {
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      form: {
        username: '',
        password: '',
        telephone: '',
        email: ''
      },
      rules: {
        username: [
          { validator: validateCode, trigger: 'blur' }
        ],
        password: [
          { validator: validatePsdReg, trigger: 'blur' }
        ],
        telephone: [
          { validator: validatePhoneTwo, trigger: 'blur' }
        ],
        email: [
          { validator: validateEMail, trigger: 'blur' }
        ]
      },
      query: '',
      userList: [],
      total: -1,
      pageNum: 1,
      pagesize: 2
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    showAddUserDialog () {
      this.dialogFormVisibleAdd = true
      this.form = {}
    },
    async changeStatus (user) {
      const res = await this.$http.get(`/user/changestatus?userId=${user.userId}&status=${user.userStatus}`)
      if (res.data.code === 'SUCCESS') {
        this.getUserList()
      }
    },
    noEdit () {
      this.dialogFormVisibleEdit = false
      this.form = {}
    },
    editUser (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`/user/updateuser`, this.form)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.getUserList()
            this.dialogFormVisibleEdit = false
            this.$message.success('编辑成功')
          } else {
            this.$message.success('编辑失败')
          }
        } else {
          return false
        }
      })
    },
    showEditUserDia (user) {
      console.log(user)
      this.dialogFormVisibleEdit = true
      this.form = user
    },
    showDeleteUserMsgBox (userId) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/user/deleteuser?userId=${userId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    addUser (formName) {
      console.log(this.form)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // console.log('校验通过')
          const res = await this.$http.post(`/user/addUser`, this.form)
          this.dialogFormVisibleAdd = false
          if (res.data.code === 'SUCCESS') {
            this.$message.success('添加成功')
            this.getUserList()
            this.form = {}
          } else {
            this.$message.warning('添加失败')
          }
        } else {
          console.log('用户信息不合法')
          return false
        }
      })
    },
    async getUserList () {
      //  需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
      // const AUTH_TOKEN = localStorage.getItem('token')
      // if (AUTH_TOKEN === '') {
      //   this.$router.push({name: 'unauth', path: '/unauth'})
      // }
      // this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `/user/selectall?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pagesize}`
      )
      console.log(res.data)
      if (res.data.code === 'SUCCESS') {
        this.userList = res.data.data.content
        this.total = res.data.data.totalSize
        // this.pageSize = res.data.data.pageSize
        // this.$message.success('ok')
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pageNum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getUserList()
    },
    searchUser () {
      console.log(this.query)
      this.getUserList()
    },
    loadUserList () {
      this.getUserList()
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
.formClass {
  border-spacing: 1px;
}
</style>
