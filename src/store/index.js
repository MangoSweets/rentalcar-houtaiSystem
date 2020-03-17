import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)
// this.$store.state.变量名
export default new vuex.Store({
  state: {
    username: ''
  },
  mutations: {
    // 修改store中state的唯一方法
    modifyName (state, username) {
      state.username = username
    }
  },
  actions: {// 调用mutations去处理修改仓库
  },
  getters: {}// 数据包装，过滤器
})
