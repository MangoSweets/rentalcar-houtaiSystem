<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-row>
        <el-input
          @clear="loadDriverList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchDriver()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDialog()">添加角色</el-button>
      </el-row>
    </el-row>
    <!-- 表格 -->
    <el-table :data="roleList" border>
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="roleName" label="角色名" width="300"></el-table-column>
      <el-table-column prop="roleIdentity" label="角色标识" width="300"></el-table-column>
      <el-table-column prop="name" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            @click="showEditRoleDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteRoleMsgBox(scope.row.roleId)"
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

    <el-dialog title="添加" :visible.sync="dialogFormVisibleAdd" width="30%" center  top="20">
      <el-form :model="form"  :rules="rules" ref="form" status-icon>
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" :label-width="formLabelWidth" prop="roleIdentity">
          <el-input v-model="form.roleIdentity" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noAdd()">取 消</el-button>
        <el-button type="primary" @click="addRole('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit" width="30%" center  top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="角色名" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" :label-width="formLabelWidth" prop="roleIdentity">
          <el-input v-model="form.roleIdentity" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noEdit()">取 消</el-button>
        <el-button type="primary" @click="editRole('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'roleManage',
  data () {
    return {
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      form: {
        roleName: '',
        roleIdentity: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' }
        ],
        roleIdentity: [
          { required: true, message: '请输入角色标识', trigger: 'blur' }
        ]
      },
      query: '',
      roleList: [],
      total: -1,
      pageNum: 1,
      pagesize: 2
    }
  },
  created () {
    this.getRoleList()
    // console.log(this.$store.state.username)
  },
  methods: {
    showAddUserDialog () {
      this.dialogFormVisibleAdd = true
      this.form = {}
    },
    noEdit () {
      this.dialogFormVisibleEdit = false
      this.form = {}
    },
    noAdd () {
      this.dialogFormVisibleAdd = false
      this.form = {}
      this.getRoleList()
    },
    async editRole (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`/role/update`, this.form)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.getRoleList()
            this.dialogFormVisibleEdit = false
            this.$message.success('编辑成功')
          } else {
            this.$message.success('编辑失败')
          }
        }
      })
    },
    showEditRoleDia (role) {
      // console.log(driver)
      this.dialogFormVisibleEdit = true
      this.form = role
    },
    showDeleteRoleMsgBox (roleId) {
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/role/delete?roleId=${roleId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getRoleList()
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
    async addRole (formName) {
      console.log(this.form)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`/role/add`, this.form)
          this.dialogFormVisibleAdd = false
          if (res.data.code === 'SUCCESS') {
            this.$message.success('添加成功')
            this.getRoleList()
            this.form = {}
          } else {
            this.$message.warning('添加失败')
          }
        }
      })
    },
    async getRoleList () {
      //  需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
      //  const AUTH_TOKEN =localStorage.getItem('token')
      //  this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `/role/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pagesize}`
      )
      console.log(res.data)
      if (res.data.code === 'SUCCESS') {
        this.roleList = res.data.data.content
        this.total = res.data.data.totalSize
        console.log(this.roleList)
        // this.pageSize = res.data.data.pageSize
        // this.$message.success('ok')
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pageNum = 1
      this.getRoleList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getRoleList()
    },
    searchDriver () {
      console.log(this.query)
      this.getRoleList()
    },
    loadDriverList () {
      this.getRoleList()
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
