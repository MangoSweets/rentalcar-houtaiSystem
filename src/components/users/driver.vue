<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>代驾列表</el-breadcrumb-item>
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
        <el-button type="success" @click="showAddUserDialog()">添加代驾</el-button>
      </el-row>
    </el-row>
    <!-- 表格 -->
    <el-table :data="driverList">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="sex" label="性别" width="80"></el-table-column>
      <el-table-column prop="telephone" label="手机号码" width="120"> </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
      <!-- <el-table-column prop="drivingComment" label="评论" width="60"> </el-table-column> -->
      <!-- <el-table-column prop="behalfLicense" label="驾照" width="120"> </el-table-column>
      <el-table-column prop="drivingCreateTime" label="入库时间" width="150">
        <template slot-scope="driverList">
          {{ driverList.drivingCreateTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="drivingStatus" label="代驾状态"  width="150">
        <template slot-scope="scope">
          <el-switch
            @change="changeStatus(scope.row)"
            v-model="scope.row.drivingStatus"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template> -->
      <!-- </el-table-column> -->
      <el-table-column prop="name" label="操作" width="180">
        <template slot-scope="scope">
          <!-- <el-button
            @click="showEditDriverDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button> -->
          <el-button
            @click="showDeleteDriverMsgBox(scope.row.drivingBehalfId)"
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
      :page-sizes="[10, 20, 30, 40]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <el-dialog title="添加" :visible.sync="dialogFormVisibleAdd" width="30%" center  top="20">
      <el-form :model="form" :rules="rules" ref="form" >
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username" style="width: 200px;" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addDriver('form')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit" width="30%" center  top="20">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth" prop="sex">
          <el-input v-model="form.sex" autocomplete="off" disabled></el-input>
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
        <el-button type="primary" @click="editDriver('form')">确 定</el-button>
      </div>
    </el-dialog> -->
  </el-card>
</template>

<script>
export default {
  name: 'driverManage',
  data () {
    return {
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      form: {
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入要添加的代驾的用户名', trigger: 'blur' }
        ]
      },
      query: '',
      driverList: [],
      total: -1,
      pageNum: 1,
      pagesize: 10
    }
  },
  created () {
    this.getDriverList()
    // console.log(this.$store.state.username)
  },
  methods: {
    showAddUserDialog () {
      this.dialogFormVisibleAdd = true
      this.form = {}
    },
    // noEdit () {
    //   this.dialogFormVisibleEdit = false
    //   this.form = {}
    //   this.getDriverList()
    // },
    // async editDriver (formName) {
    //   this.$refs[formName].validate(async (valid) => {
    //     if (valid) {
    //       const res = await this.$http.post(`/driver/update`, this.form)
    //       console.log(res)
    //       if (res.data.code === 'SUCCESS') {
    //         this.getDriverList()
    //         this.dialogFormVisibleEdit = false
    //         this.$message.success('编辑成功')
    //       } else {
    //         this.$message.success('编辑失败')
    //       }
    //     }
    //   })
    // },
    // showEditDriverDia (driver) {
    //   console.log(driver)
    //   this.dialogFormVisibleEdit = true
    //   this.form = driver
    // },
    showDeleteDriverMsgBox (drivingBehalfId) {
      this.$confirm('是否删除该代驾?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/driver/delete?drivingBehalfId=${drivingBehalfId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getDriverList()
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
    async addDriver (formName) {
      console.log(this.form)
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.get(`/driver/add?username=${this.form.username}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.$message.success('添加成功')
            this.getDriverList()
            this.form = {}
          } else {
            this.$message.error(res.data.params[0])
          }
          this.dialogFormVisibleAdd = false
        }
      })
    },
    async getDriverList () {
      //  需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
      //  const AUTH_TOKEN =localStorage.getItem('token')
      //  this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `/driver/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pagesize}`
      )
      console.log(res.data)
      if (res.data.code === 'SUCCESS') {
        this.driverList = res.data.data.content
        this.total = res.data.data.totalSize
        console.log(this.driverList)
        // this.pageSize = res.data.data.pageSize
        // this.$message.success('ok')
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pageNum = 1
      this.getDriverList()
    },
    handleCurrentChange (val) {
      this.pageNum = val
      this.getDriverList()
    },
    searchDriver () {
      console.log(this.query)
      this.getDriverList()
    },
    loadDriverList () {
      this.getDriverList()
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
