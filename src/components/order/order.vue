<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-row>
        <el-input
          @clear="loadOrderList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchOrder()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showAddUserDialog ()">添加订单</el-button>
      </el-row>
    </el-row>
    <!-- 表格 -->
    <el-table :data="orderList">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="username" label="用户名" width="80"></el-table-column>
      <el-table-column prop="seriesName" label="汽车名" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="startTime" label="生效时间" width="150">
        <template slot-scope="orderList">
          {{ orderList.row.startTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="失效时间" width="150">
        <template slot-scope="orderList">
          {{ orderList.row.endTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态"  width="150">
        <template slot-scope="scope">
          <el-switch
            @change="changeStatus(scope.row)"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="showEditOrderDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteOrderMsgBox(scope.row.orderId)"
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
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-autocomplete
            v-model="form.username"
            :fetch-suggestions="querySearchUserAsync"
            @select="handleSelectUsername"
            placeholder="请输入内容">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="汽车名" :label-width="formLabelWidth" prop="seriesName">
          <el-autocomplete
          v-model="form.seriesName"
          :fetch-suggestions="querySearchCarAsync"
          @select="handleSelectCar"
          placeholder="请输入内容">
        </el-autocomplete>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth"  prop="price">
          <el-input v-model="form.price" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="有效时间" :label-width="formLabelWidth"  required>
          <el-col :span="11">
            <el-form-item prop="startTime">
              <el-date-picker
                style="width: 100%;"
                v-model="form.startTime"
                type="date"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        <el-col class="line" :span="2">---</el-col>
        <el-col :span="11">
        <el-form-item prop="endTime">
          <el-date-picker
            style="width: 100%;"
            v-model="form.endTime"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        </el-col>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addOrder('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit" width="30%" center  top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-autocomplete
            v-model="form.username"
            :fetch-suggestions="querySearchUserAsync"
            @select="handleSelectUsername"
            placeholder="请输入内容">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="汽车名" :label-width="formLabelWidth" prop="seriesName">
          <el-autocomplete
          v-model="form.seriesName"
          :fetch-suggestions="querySearchCarAsync"
          @select="handleSelectCar"
          placeholder="请输入内容">
        </el-autocomplete>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth"  prop="price">
          <el-input v-model="form.price" disabled autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="有效时间" :label-width="formLabelWidth"  required>
          <el-col :span="11">
            <el-form-item prop="startTime">
              <el-date-picker
                style="width: 100%;"
                v-model="form.startTime"
                type="date"
                placeholder="开始时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        <el-col class="line" :span="2">---</el-col>
        <el-col :span="11">
        <el-form-item prop="endTime">
          <el-date-picker
            style="width: 100%;"
            v-model="form.endTime"
            type="date"
            placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        </el-col>
      </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="editOrder('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'orderManage',
  data () {
    return {
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      form: {
        userId: '',
        carId: '',
        username: '',
        seriesName: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        username: [
          { required: true, message: '请填写订单用户名,支持联想', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请输入系列名,支持联想', trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      query: '',
      orderList: [],
      nameList: [],
      total: -1,
      pageNum: 1,
      pagesize: 2
    }
  },
  created () {
    this.getOrderList()
    this.getNameList('')
    // console.log(this.$store.state.username)
  },
  mounted () {
    this.list = this.nameList.map(item => {
      console.log(item)
      return {value: `${item}`, label: `${item}`}
    })
  },
  methods: {
    showAddUserDialog () {
      this.dialogFormVisibleAdd = true
      this.form = {}
    },
    querySearchUserAsync (queryString, callback) {
      var list = [{}]
      // 调用的后台接口
      // let url = 后台接口地址 + queryString
      // 从后台获取到对象数组
      this.$http.get(`/user/getlikenames?username=${queryString}`).then((response) => {
        // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
        console.log(response.data.data)
        for (let i of response.data.data) {
          // 将想要展示的数据作为value
          i.value = i.username
        }
        list = response.data.data
        callback(list)
      }).catch((error) => {
        alert('该用户信息获取异常' + error)
        console.log(error)
      })
    },
    querySearchCarAsync (queryString, callback) {
      var list = [{}]
      // 调用的后台接口
      // let url = 后台接口地址 + queryString
      // 从后台获取到对象数组
      this.$http.get(`/car/getlikecar?seriesName=${queryString}`).then((response) => {
        // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
        for (let i of response.data.data) {
          // 将想要展示的数据作为value
          i.value = i.seriesName
        }
        list = response.data.data
        callback(list)
      }).catch((error) => {
        console.log(error)
      })
    },
    handleSelectUsername (item) {
      this.form.userId = item.userId
      // do something
    },
    handleSelectCar (item) {
      this.form.price = item.price
      this.form.carId = item.carId
      // do something
    },
    async getNameList (queryString) {
      const res = await this.$http.get(`/user/getlikenames?username=${queryString}`)
      console.log(this.nameList)
      if (res.data.code === 'SUCCESS') {
        this.nameList = res.data.data
        return res.data.data
      }
      console.log(this.nameList)
      // return res.data.data
    },
    async changeStatus (order) {
      const res = await this.$http.get(`/order/changestatus?orderId=${order.orderId}&status=${order.status}`)
      if (res.data.code === 'SUCCESS') {
        this.getOrderList()
      }
    },
    noEdit () {
      this.dialogFormVisibleEdit = false
      this.form = {}
      this.getOrderList()
    },
    async editOrder (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`/order/update`, this.form)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.getOrderList()
            this.dialogFormVisibleEdit = false
            this.$message.success('编辑成功')
          } else {
            this.$message.success('编辑失败')
          }
        }
      })
    },
    showEditOrderDia (order) {
      console.log(order)
      this.dialogFormVisibleEdit = true
      this.form = order
    },
    showDeleteOrderMsgBox (orderId) {
      this.$confirm('是否删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/order/delete?orderId=${orderId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getOrderList()
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
    async addOrder (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await this.$http.post(`/order/add`, this.form)
          this.dialogFormVisibleAdd = false
          if (res.data.code === 'SUCCESS') {
            this.$message.success('添加成功')
            this.getOrderList()
            this.form = {}
          } else {
            this.$message.warning('添加失败')
          }
        }
      })
    },
    async getOrderList () {
      //  需要授权的API,必须在请求头中使用后端定义的Authorization字段提供token令牌
      //  const AUTH_TOKEN =localStorage.getItem('token')
      //  this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `/order/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pagesize}`
      )
      // console.log(res.data)
      if (res.data.code === 'SUCCESS') {
        this.orderList = res.data.data.content
        this.total = res.data.data.totalSize
        console.log(this.orderList)
        // this.pageSize = res.data.data.pageSize
        // this.$message.success('ok')
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pageNum = 1
      this.getOrderList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getOrderList()
    },
    searchOrder () {
      console.log(this.query)
      this.getOrderList()
    },
    loadOrderList () {
      this.getOrderList()
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
