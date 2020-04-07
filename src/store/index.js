import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)
const key = 'token'
// this.$store.state.变量名
export default new vuex.Store({
  state: {
    username: '',
    roles: '',
    token: localStorage.getItem('token') ? localStorage.getItem('token') : ''
  },
  mutations: {
    // 修改store中state的唯一方法
    modifyName (state, param) {
      state.username = param
    },
    modifyRoles (state, param) {
      state.roles = param
    },
    $_setStorage (state, value) {
      state.token = value
      localStorage.setItem(key, JSON.stringify(value))
    },
    $_removeStorage (state) {
      state.token = null
      localStorage.removeItem(key)
    }
  },
  actions: {// 调用mutations去处理修改仓库
  },
  getters: {
    getSortage: function (state) {
      if (!state.token) {
        state.token = JSON.parse(localStorage.getItem(key))
      }
      return state.token
    }
  }// 数据包装，过滤器
})
