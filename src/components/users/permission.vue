<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-row>
        <el-input
          @clear="loadPermissionList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchPermission()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDialog()">添加权限</el-button>
      </el-row>
    </el-row>
    <!-- 表格 -->
    <el-table :data="permissionList" border>
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="permissionName" label="权限名" width="300"></el-table-column>
      <el-table-column prop="permissionCode" label="权限码" width="300"></el-table-column>
      <el-table-column prop="permissionUrl" label="权限URL" width="300"></el-table-column>
      <el-table-column prop="name" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            @click="showEditPermissionDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeletePermissionMsgBox(scope.row.permissionId)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <!-- <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button> -->
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
      <el-form :model="form">
        <el-form-item label="权限名" :label-width="formLabelWidth">
          <el-input v-model="form.permissionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限码" :label-width="formLabelWidth">
          <el-input v-model="form.permissionCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限URL" :label-width="formLabelWidth">
          <el-input v-model="form.permissionUrl" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noAdd()">取 消</el-button>
        <el-button type="primary" @click="addPermission()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit" width="30%" center  top="20">
      <el-form :model="form">
        <el-form-item label="权限名" :label-width="formLabelWidth">
          <el-input v-model="form.permissionName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限码" :label-width="formLabelWidth">
          <el-input v-model="form.permissionCode" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限URL" :label-width="formLabelWidth">
          <el-input v-model="form.permissionUrl" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noEdit()">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'permissionManage',
  data () {
    return {
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      form: {
        permissionName: '',
        permissionCode: '',
        permissionUrl: ''
      },
      query: '',
      permissionList: [],
      total: -1,
      pageNum: 1,
      pagesize: 2
    }
  },
  created () {
    this.getPermissionList()
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
    },
    async editRole () {
      const res = await this.$http.post(`/permission/update`, this.form)
      console.log(res)
      if (res.data.code === 'SUCCESS') {
        this.getPermissionList()
        this.dialogFormVisibleEdit = false
        this.$message.success('编辑成功')
      } else {
        this.$message.success('编辑失败')
      }
    },
    showEditPermissionDia (permission) {
      // console.log(driver)
      this.dialogFormVisibleEdit = true
      this.form = permission
    },
    showDeletePermissionMsgBox (permissionId) {
      this.$confirm('是否删除该角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/permission/delete?permissionId=${permissionId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getPermissionList()
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
    async addPermission () {
      console.log(this.form)
      const res = await this.$http.post(`/permission/add`, this.form)
      this.dialogFormVisibleAdd = false
      if (res.data.code === 'SUCCESS') {
        this.$message.success('添加成功')
        this.getPermissionList()
        this.form = {}
      } else {
        this.$message.warning('添加失败')
      }
    },
    async getPermissionList () {
      //  需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
      //  const AUTH_TOKEN =localStorage.getItem('token')
      //  this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `/permission/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pagesize}`
      )
      console.log(res.data)
      if (res.data.code === 'SUCCESS') {
        this.permissionList = res.data.data.content
        this.total = res.data.data.totalSize
        console.log(this.permissionList)
        // this.pageSize = res.data.data.pageSize
        // this.$message.success('ok')
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pageNum = 1
      this.getPermissionList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getPermissionList()
    },
    searchPermission () {
      console.log(this.query)
      this.getPermissionList()
    },
    loadPermissionList () {
      this.getPermissionList()
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
