<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>汽车管理</el-breadcrumb-item>
      <el-breadcrumb-item>系列列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="searchRow">
      <el-row>
        <el-input
          @clear="loadSeriesList()"
          placeholder="请输入内容"
          clearable
          v-model="query"
          class="inputSearch"
        >
          <el-button
            @click="searchSeriesForSeriesName()"
            slot="append"
            icon="el-icon-search"
          ></el-button>
        </el-input>
        <el-button type="success" @click="showSeriesAddDialog()">添加系列</el-button>
      </el-row>
    </el-row>
    <el-table :data="seriesList">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="brand" label="品牌名" width="100"></el-table-column>
      <el-table-column prop="seriesName" label="系列名" width="100"></el-table-column>
      <el-table-column prop="doors" label="车门数" width="120"> </el-table-column>
      <el-table-column prop="skylightLabel" label="天窗" width="120"> </el-table-column>
      <el-table-column prop="airsac" label="气囊数" width="120"> </el-table-column>
      <el-table-column prop="seatType" label="座椅类型" width="120"> </el-table-column>
      <el-table-column prop="fuelTank" label="油箱容量" width="120"> </el-table-column>
      <el-table-column prop="displacement" label="排量" width="120"> </el-table-column>
      <el-table-column prop="seatNumber" label="座位数" width="120"> </el-table-column>
      <el-table-column prop="fuelType" label="燃料类型" width="120"> </el-table-column>
      <el-table-column prop="radarLabel" label="雷达" width="120"> </el-table-column>
      <el-table-column prop="fulelabel" label="燃油标号" width="120"> </el-table-column>
      <el-table-column prop="drivingMode" label="驱动方式" width="120"> </el-table-column>
      <el-table-column prop="transmissionType" label="变速箱类型" width="120"> </el-table-column>
      <el-table-column prop="voiceboxs" label="音箱个数" width="120"> </el-table-column>
      <el-table-column prop="seriesCreater" label="引进人" width="120"> </el-table-column>
      <el-table-column prop="seriesCreateTime" label="引进时间" width="120">
        <template slot-scope="seriesList">
          {{ seriesList.row.seriesCreateTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="seriesUpdater" label="更新人" width="120"> </el-table-column>
      <el-table-column prop="seriesUpdateTime" label="更新时间" width="120">
        <template slot-scope="seriesList">
          <!--  userList.row.userCreatetime userlist的每个对象 会经度有误差 -->
          {{ seriesList.row.seriesUpdateTime | fmtdate }}
        </template>
      </el-table-column>
      <el-table-column prop="seriesStatus" label="系列状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeStatus(scope.row)"
            v-model="scope.row.seriesStatus"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>

      </el-table-column>
      <el-table-column prop="name" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            @click="showEditCarDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteSeriesMsgBox(scope.row.seriesId)"
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
    :total="total">
  </el-pagination>

    <el-dialog title="添加" :visible.sync="dialogFormVisibleAdd"  width="30%" center top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="品牌名" :label-width="formLabelWidth" prop="brand">
          <el-input v-model="form.brand"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系列名" :label-width="formLabelWidth" prop="seriesName">
          <el-input v-model="form.seriesName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车门数" :label-width="formLabelWidth" prop="doors">
          <el-input v-model="form.doors"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="天窗" :label-width="formLabelWidth" prop="skylight">
          <el-select v-model="form.skylight" placeholder="请选择">
            <el-option
            v-for="item in haveOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
           </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="气囊数" :label-width="formLabelWidth" prop="airsac">
          <el-input v-model="form.airsac"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座椅类型" :label-width="formLabelWidth" prop="seatType">
          <el-select v-model="form.seatType" placeholder="请选择">
            <el-option v-for="val in seatTypeList" :value="val" :key="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油箱容量" :label-width="formLabelWidth" prop="fuelTank">
          <el-input v-model="form.fuelTank"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座位数" :label-width="formLabelWidth" prop="seatNumber">
          <el-input v-model="form.seatNumber"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="燃料类型" :label-width="formLabelWidth" prop="fuelType">
          <el-input v-model="form.fuelType"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="倒车雷达" :label-width="formLabelWidth" prop="radar">
          <!-- <el-input v-model="form.radar"  autocomplete="off"></el-input> -->
          <el-select v-model="form.radar" placeholder="请选择">
            <el-option
              v-for="item in haveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="燃油标号" :label-width="formLabelWidth" prop="fulelabel">
          <el-input v-model="form.fulelabel"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="驱动方式" :label-width="formLabelWidth" prop="drivingMode">
          <el-input v-model="form.drivingMode"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="变速箱类型" :label-width="formLabelWidth" prop="transmissionType">
          <el-input v-model="form.transmissionType"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排量" :label-width="formLabelWidth" prop="displacement">
          <el-input v-model="form.displacement"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="音箱个数" :label-width="formLabelWidth" prop="voiceboxs">
          <el-input v-model="form.voiceboxs"  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addSeries('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit"  width="30%" center top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="品牌名" :label-width="formLabelWidth" prop="brand">
          <el-input v-model="form.brand"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系列名" :label-width="formLabelWidth" prop="seriesName">
          <el-input v-model="form.seriesName"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="车门数" :label-width="formLabelWidth" prop="doors">
          <el-input v-model="form.doors"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="天窗" :label-width="formLabelWidth" prop="skylight">
          <el-select v-model="form.skylight" placeholder="请选择">
            <el-option
            v-for="item in haveOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
           </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="气囊数" :label-width="formLabelWidth" prop="airsac">
          <el-input v-model="form.airsac"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座椅类型" :label-width="formLabelWidth" prop="seatType">
          <el-select v-model="form.seatType" placeholder="请选择">
            <el-option v-for="val in seatTypeList" :value="val" :key="val"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="油箱容量" :label-width="formLabelWidth" prop="fuelTank">
          <el-input v-model="form.fuelTank"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座位数" :label-width="formLabelWidth" prop="seatNumber">
          <el-input v-model="form.seatNumber"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="燃料类型" :label-width="formLabelWidth" prop="fuelType">
          <el-input v-model="form.fuelType"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="倒车雷达" :label-width="formLabelWidth" prop="radar">
          <!-- <el-input v-model="form.radar"  autocomplete="off"></el-input> -->
          <el-select v-model="form.radar" placeholder="请选择">
            <el-option
              v-for="item in haveOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="燃油标号" :label-width="formLabelWidth" prop="fulelabel">
          <el-input v-model="form.fulelabel"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="驱动方式" :label-width="formLabelWidth" prop="drivingMode">
          <el-input v-model="form.drivingMode"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="变速箱类型" :label-width="formLabelWidth" prop="transmissionType">
          <el-input v-model="form.transmissionType"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="排量" :label-width="formLabelWidth" prop="displacement">
          <el-input v-model="form.displacement"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="音箱个数" :label-width="formLabelWidth" prop="voiceboxs">
          <el-input v-model="form.voiceboxs"  autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noEdit()">取 消</el-button>
        <el-button type="primary" @click="editSeries('form')">确 定</el-button>
      </div>
    </el-dialog>

  </el-card>
</template>

<script>
export default {
  name: 'seriesManager',
  data () {
    return {
      seatTypeList: ['真皮', '织物'],
      query: '',
      pageNum: 1,
      pageSize: 10,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      seriesList: [],
      haveOptions: [{
        value: true,
        label: '有'
      }, {
        value: false,
        label: '无'
      }],
      form: {
        brand: '',
        seriesName: '',
        doors: '',
        skylight: '',
        skylightLabel: '',
        airsac: '',
        seatType: '',
        fuelTank: '',
        seatNumber: '',
        fuelType: '',
        radar: '',
        radarLabel: '',
        fulelabel: '',
        drivingMode: '',
        transmissionType: '',
        displacement: '',
        voiceboxs: '',
        seriesStatus: '',
        seriesUpdater: '',
        seriesCreater: ''
      },
      rules: {
        brand: [
          { required: true, message: '请填写品牌名', trigger: 'blur' }
        ],
        seriesName: [
          { required: true, message: '请填写系列名', trigger: 'blur' }
        ],
        doors: [
          { required: true, message: '请填写车门数', trigger: 'blur' }
        ],
        skylight: [
          { required: true, message: '请选择是否拥有天窗', trigger: 'change' }
        ],
        airsac: [
          { required: true, message: '请填写气囊数', trigger: 'blur' }
        ],
        seatType: [
          { required: true, message: '请选择座椅类型', trigger: 'change' }
        ],
        fuelTank: [
          { required: true, message: '请填写油箱容量', trigger: 'blur' }
        ],
        seatNumber: [
          { required: true, message: '请填写座位数', trigger: 'blur' }
        ],
        fuelType: [
          { required: true, message: '请填写燃料类型', trigger: 'blur' }
        ],
        radar: [
          { required: true, message: '请填写雷达', trigger: 'blur' }
        ],
        fulelabel: [
          { required: true, message: '请填写燃油标号', trigger: 'blur' }
        ],
        drivingMode: [
          { required: true, message: '请填写驱动方式', trigger: 'blur' }
        ],
        transmissionType: [
          { required: true, message: '请填写变速箱类型', trigger: 'blur' }
        ],
        displacement: [
          { required: true, message: '请填写汽车排量', trigger: 'blur' }
        ],
        voiceboxs: [
          { required: true, message: '请填写音箱个数', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getSeriesList()
  },
  methods: {
    showDeleteSeriesMsgBox (seriesId) {
      this.$confirm('是否删除该系列?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/series/delete?seriesId=${seriesId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getSeriesList()
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
    showEditCarDia (series) {
      // this.getSeriesIdForSeriesName(user.seriesName)
      this.dialogFormVisibleEdit = true
      console.log(series)
      this.form = series
    },
    noEdit () {
      this.dialogFormVisibleEdit = false
      this.form = {}
      this.getSeriesList()
    },
    async editSeries (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.form.seriesUpdater = this.$store.state.username
          const res = await this.$http.post(`/series/update`, this.form)
          if (res.data.code === 'SUCCESS') {
            this.getSeriesList()
            this.dialogFormVisibleEdit = false
            this.$message.success('编辑成功')
          } else {
            this.$message.warning('编辑失败')
          }
        }
      })
    },
    searchSeriesForSeriesName () {
      this.getSeriesList()
    },
    showSeriesAddDialog () {
      this.dialogFormVisibleAdd = true
      this.form = {}
    },
    async changeStatus (series) {
      const res = await this.$http.get(`/series/changestatus?status=${series.seriesStatus}&seriesId=${series.seriesId}`)
      if (res.data.code === 'SUCCESS') {
        this.getSeriesList()
      }
    },
    async addSeries (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.form.seriesCreater = this.$store.state.username
          const res = await this.$http.post(`/series/add`, this.form)
          if (res.data.code === 'SUCCESS') {
            this.$message.success('添加成功')
            this.getSeriesList()
            this.form = {}
            this.dialogFormVisibleAdd = false
          } else {
            this.$message.warning('添加失败')
          }
        }
      })
    },
    loadSeriesList () {
      this.getSeriesList()
    },
    async getSeriesList () {
      const res = await this.$http.get(`/series/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`)
      console.log(res)
      if (res.data.code === 'SUCCESS') {
        this.seriesList = res.data.data.content
        this.total = res.data.data.totalSize
        for (var i = 0; i < this.seriesList.length; i++) {
          this.seriesList[i].skylightLabel = (this.seriesList[i].skylight === 0) ? '无' : '配备'
          this.seriesList[i].radarLabel = (this.seriesList[i].radar === 0) ? '无' : '配备'
        }
      }
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.pageNum = 1
      this.getSeriesList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.getSeriesList()
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
