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
    <el-table :data="carList">
      <el-table-column type="index" label="#" width="60"> </el-table-column>
      <el-table-column prop="seriesName" label="系列名" width="100"></el-table-column>
      <el-table-column prop="imageUrl" label="图片" width="200">
        <template slot-scope="carList">
          <img id="img" :src="carList.row.imageUrl" class="picture"/>
        </template>
      </el-table-column>
      <el-table-column prop="carType" label="汽车类型" width="100"></el-table-column>
      <el-table-column prop="plateNumber" label="车牌号" width="120"> </el-table-column>
      <el-table-column prop="price" label="价格" width="120"> </el-table-column>
      <el-table-column prop="carCreater" label="入库人" width="120"> </el-table-column>
      <el-table-column prop="carCreateTime" label="入库时间">
        <template slot-scope="carList">
          {{ carList.row.carCreateTime | fmtdate }}
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
            @click="showEditCarDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDeleteCarMsgBox(scope.row.carId)"
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

    <el-dialog title="添加" :visible.sync="dialogFormVisibleAdd"   width="30%" center top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="系列名" :label-width="formLabelWidth" prop="seriesId">
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
        <el-form-item label="汽车图片" :label-width="formLabelWidth" prop="imageUrl">
          <el-upload
          ref="upload"
          action="http://localhost:8081/upload"
          name="picture"
          list-type="picture-card"
          :headers="myHeader"
          :limit="1"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="汽车类型" :label-width="formLabelWidth" prop="carType">
          <el-select v-model="form.carType" placeholder="请选择">
            <el-option
            v-for="item in carTypeList"
            :key="item"
            :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="plateNumber">
          <el-input v-model="form.plateNumber"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用寿命" :label-width="formLabelWidth" required>
          <el-col :span="11">
            <el-form-item prop="productStartTime">
              <el-date-picker
                style="width: 100%;"
                v-model="form.productStartTime"
                type="date"
                placeholder="出厂日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">---</el-col>
          <el-col :span="11">
          <el-form-item prop="productEndTime">
            <el-date-picker
              style="width: 100%;"
              v-model="form.productEndTime"
              type="date"
              placeholder="报废日期">
            </el-date-picker>
          </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCar('form')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="编辑" :visible.sync="dialogFormVisibleEdit"   width="30%" center top="20">
      <el-form :model="form" :rules="rules" ref="form" status-icon>
        <el-form-item label="系列名" :label-width="formLabelWidth" prop="seriesId">
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
        <el-form-item label="汽车类型" :label-width="formLabelWidth" prop="carType">
          <el-select v-model="form.carType" placeholder="请选择">
            <el-option
              v-for="item in carTypeList"
              :key="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汽车图片" :label-width="formLabelWidth" prop="imageUrl">
          <el-upload
          ref="upload"
          action="http://localhost:8081/upload"
          name="picture"
          list-type="picture-card"
          :headers="myHeader"
          :limit="1"
          :on-exceed="onExceed"
          :before-upload="beforeUpload"
          :on-preview="handlePreview"
          :on-success="handleSuccess"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="车牌号" :label-width="formLabelWidth" prop="plateNumber">
          <el-input v-model="form.plateNumber"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
          <el-input v-model="form.price"  autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用寿命" :label-width="formLabelWidth" required>
          <el-col :span="11">
            <el-form-item prop="productStartTime">
              <el-date-picker
                style="width: 100%;"
                v-model="form.productStartTime"
                type="date"
                placeholder="出厂日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col class="line" :span="2">---</el-col>
          <el-col :span="11">
          <el-form-item prop="productEndTime">
            <el-date-picker
              style="width: 100%;"
              v-model="form.productEndTime"
              type="date"
              placeholder="报废日期">
            </el-date-picker>
          </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="noEdit()">取 消</el-button>
        <el-button type="primary" @click="editCar('form')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'carManager',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 图片列表（用于在上传组件中回显图片）
      fileList: [{name: '', url: ''}],
      myHeader: {'Authorization': this.getToken().replace('"', '')},
      query: '',
      pageNum: 1,
      pageSize: 10,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      formLabelWidth: '120px',
      carList: [],
      form: {
        seriesId: '',
        carCreater: '',
        carUpdater: '',
        carType: '',
        price: '',
        plateNumber: '',
        productStartTime: '',
        productEndTime: '',
        imageUrl: ''
      },
      rules: {
        seriesId: [
          { required: true, message: '请选择系列', trigger: 'change' }
        ],
        carType: [
          { required: true, message: '请选择汽车类型', trigger: 'change' }
        ],
        plateNumber: [
          { required: true, message: '请输入车牌号', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        productStartTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ],
        productEndTime: [
          { required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
      carTypeList: ['新能源', '燃油型'],
      seriesMap: new Map()
    }
  },
  created () {
    this.getCarList()
    this.getSeriesMap()
  },
  methods: {
    getToken () {
      return localStorage.getItem('token')
    },
    // 文件上传成功的钩子函数
    handleSuccess (res, file) {
      this.$message({
        type: 'info',
        message: '图片上传成功',
        duration: 2000
      })
      console.log(res)
      console.log('qqq')
      console.log(file)
      if (file.response.code === 'SUCCESS') {
        this.form.imageUrl = file.response.data // 将返回的文件储存路径赋值picture字段
      }
    },
    // 删除文件之前的钩子函数
    handleRemove (file, fileList) {
      this.$message({
        type: 'info',
        message: '已删除原有图片',
        duration: 2000
      })
    },
    // 点击列表中已上传的文件事的钩子函数
    handlePreview (file) {
    },
    // 上传的文件个数超出设定时触发的函数
    onExceed (files, fileList) {
      this.$message({
        type: 'info',
        message: '最多只能上传一个图片',
        duration: 2000
      })
    },
    // 文件上传前的前的钩子函数
    // 参数是上传的文件，若返回false，或返回Primary且被reject，则停止上传
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isGIF = file.type === 'image/gif'
      const isPNG = file.type === 'image/png'
      const isBMP = file.type === 'image/bmp'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isGIF && !isPNG && !isBMP) {
        this.$message.error('上传图片必须是JPG/GIF/PNG/BMP 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isBMP || isGIF || isPNG) && isLt2M
    },
    showDeleteCarMsgBox (carId) {
      this.$confirm('是否删除该汽车?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.get(`/car/delete?carId=${carId}`)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.pageNum = 1
            this.getCarList()
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
    getSeriesIdForSeriesName (seriesName) {
      // this.getSeriesMap()
      for (var i = 0; i < this.seriesMap.length; i++) {
        if (this.seriesMap[i].seriesName === seriesName) {
          return this.seriesMap[i].seriesId
        }
      }
    },
    showEditCarDia (user) {
      this.form = {}
      var id = this.getSeriesIdForSeriesName(user.seriesName)
      this.form = user
      this.form.seriesId = id
      this.form.imageUrl = this.form.imageUrl.replace('http://localhost:8081', '')
      this.form.carCreater = this.$store.state.username
      this.form.carUpdater = this.$store.state.username
      this.dialogFormVisibleEdit = true
    },
    noEdit () {
      console.log(this.form)
      this.dialogFormVisibleEdit = false
      this.form = {}
      this.getCarList()
    },
    editCar (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          const res = await this.$http.post(`/car/update`, this.form)
          console.log(res)
          if (res.data.code === 'SUCCESS') {
            this.getCarList()
            this.dialogFormVisibleEdit = false
            this.$message.success('编辑成功')
          } else {
            this.$message.warning('编辑失败')
          }
        }
      })
    },
    searchCarForSeriesName () {
      this.getCarList()
    },
    showCarAddDialog () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    async getSeriesMap () {
      const res = await this.$http.get(`/series/getSeriesIdAndName`)
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
    addCar (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(this.form)
          this.form.carCreater = this.$store.state.username
          const res = await this.$http.post(`/car/add`, this.form)
          if (res.data.code === 'SUCCESS') {
            this.$message.success('添加成功')
            this.getCarList()
            this.form = {}
            this.dialogFormVisibleAdd = false
          } else {
            this.$message.warning('添加失败')
          }
        }
      })
    },
    loadCarList () {
      this.getCarList()
    },
    async getCarList () {
      const res = await this.$http.get(`/car/query?query=${this.query}&pageNum=${this.pageNum}&pageSize=${this.pageSize}`)
      console.log(res)
      if (res.data.code === 'SUCCESS') {
        this.carList = res.data.data.content
        this.total = res.data.data.totalSize
        var baseUrl = 'http://localhost:8081'
        for (let i = 0; i < this.carList.length; i++) {
          console.log(this.carList[i].imageUrl)
          if (this.carList[i].imageUrl != null) {
            console.log(this.carList[i].imageUrl)
            this.carList[i].imageUrl = baseUrl + this.carList[i].imageUrl
          }
        }
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNum = 1
      this.getCarList()
    },
    handleCurrentChange (val) {
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
.picture {
  width: 100px;
  height: 100px;
}
img[src=""],img:not([src]){
 opacity:0;

}
</style>
