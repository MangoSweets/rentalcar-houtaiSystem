<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>汽车管理</el-breadcrumb-item>
      <el-breadcrumb-item>汽车列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-row>
        <el-input
          @clear="loadCarList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchCarForSeriesName()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showCarAddDialog()"
          >添加汽车</el-button>
      </el-row>
    </el-row>
    <el-table :data="carList" style="width: 100%">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="seriesName" label="系列名" width="100"></el-table-column>
      <el-table-column prop="carType" label="汽车类型" width="100"></el-table-column>
      <el-table-column prop="plateNumber" label="车牌号" width="120"> </el-table-column>
      <el-table-column prop="carCreater" label="入库人" width="120"> </el-table-column>
      <el-table-column prop="carCreateTime" label="入库时间">
        <template slot-scope="carList">
          {{ carList.carCreateTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="productStartTime" label="出厂时间">
        <template slot-scope="carList">
          <!--  userList.row.userCreatetime userlist的每个对象 会经度有误差 -->
          {{ carList.row.productEndTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="productEndTime" label="报废时间">
        <template slot-scope="carList">
          <!--  userList.row.userCreatetime userlist的每个对象 会经度有误差 -->
            {{ carList.row.productEndTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="carStatus" label="汽车状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeStatus(scope.row)"
            v-model="scope.row.carStatus"
            active-color="#13ce66"
            inactive-color="#ff4949">
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
    :total="total">
  </el-pagination>

    <el-dialog title="添加汽车" :visible.sync="dialogFormVisibleAdd"   width="30%" center top="20">
      <el-form :model="form" :rules="carAddRules">
        <el-form-item label="系列名" :label-width="formLabelWidth">
          <!-- <el-input v-model="form.seriesName"  autocomplete="off"></el-input> -->
          <el-select v-model="form.seriesId" placeholder="请选择">
            <el-option
              v-for="item in seriesMap"
              :key="item.seriesId"
              :label="item.seriesName"
              :value="item.seriesId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车类型" :label-width="formLabelWidth">
          <el-select v-model="form.carType" placeholder="请选择">
            <el-option
              v-for="item in carTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth">
          <el-input v-model="form.plateNumber"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用寿命" :label-width="formLabelWidth">
          <el-date-picker
            v-model="form.productStartTime"
            type="date"
            placeholder="出厂日期">
          </el-date-picker> 至
          <el-date-picker
            v-model="form.productEndTime"
            type="date"
            placeholder="报废日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCar()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input disabled v-model="form.username"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" :label-width="formLabelWidth">
          <el-input v-model="form.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noEdit()">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'carManager',
  data () {
    return {
      query: '',
      pageNum: 1,
      pageSize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      carList: [],
      form: {
        seriesId: '',
        carType: '',
        plateNumber: '',
        productStartTime: '',
        productEndTime: ''
      },
      carTypeList: [{
        value: '新能源',
        label: '新能源'
      },
      {
        value: '燃油型',
        label: '燃油型'
      }],
      seriesMap: new Map(),
      carAddRules: {
        seriesId: [{required: true, message: '请选择系列', trigger: 'blur'}]
      }
    }
  },
  created () {
    this.getCarList()
  },
  methods: {
    searchCarForSeriesName () {
      this.getCarList()
    },
    showCarAddDialog () {
      this.getSeriesMap()
      this.dialogFormVisibleAdd = true
    },
    async getSeriesMap () {
      const res = await this.$http.get(`/series/getSeriesIdAndName`)
      console.log(res)
      // console.log(res.data.data)
      // console.log(this.seriesMap)
      if (res.data.code === 'SUCCESS') {
        this.seriesMap = res.data.data
      }
    },
    async changeStatus (car) {
      const res = await this.$http.get(`/car/changestatus?status=${car.carStatus}&carId=${car.carId}`)
      if (res.data.code === 'SUCCESS') {
        this.getCarList()
      }
    },
    async addCar () {
      console.log(this.form)
      // this.getSeriesMap()
      // this.form
      const res = await this.$http.post(`/car/addcar`, this.form)
      if (res.data.code === 'SUCCESS') {
        this.$message.success('添加成功')
        this.getCarList()
        this.form = {}
        this.dialogFormVisibleAdd = false
      } else {
        this.$message.warning('添加失败')
      }
    },
    loadCarList () {
      this.getCarList()
    },
    async getCarList () {
      console.log('pagenum:' + this.pageNum + 'pagesize:' + this.pageSize)
      const res = await this.$http.get(`/car/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`)
      console.log(res)
      if (res.data.code === 'SUCCESS') {
        this.carList = res.data.data.content
        this.total = res.data.data.totalSize
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNum = 1
      this.getCarList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getCarList()
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.searchRow {
  margin-top: 20px;
}
.inputSearch {
  width: 300px;
}
</style>
