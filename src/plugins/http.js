import axios from 'axios'
import store from '@/store/index'
import router from '@/router'
const MyHttpServer = {}

MyHttpServer.install = Vue => {
  axios.defaults.baseURL = 'http://localhost:8081'
  Vue.prototype.$http = axios
  axios.interceptors.request.use(
    config => {
      if (store.state.token) {
        config.headers.common['Authorization'] = store.state.token
      }
      return config
    },
    error => {
      // 对请求错误做什么
      return Promise.reject(error)
    }
  )

  axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            localStorage.removeItem('token')
            // router.push('/views/login');
            router.replace({
              path: '/',
              query: {redirect: router.currentRoute.fullPath}// 登录成功后跳入浏览的当前页面
            })
        }
      }
    }
  )
}

export default MyHttpServer
