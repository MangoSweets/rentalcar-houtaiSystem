// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'

import '@/assets/css/base.css'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(MyHttpServer)

// 全局过滤器
Vue.filter('fmtdate', v => {
  if (v != null) {
    return moment(v).format('YYYY-MM-DD')
  }
})

router.beforeEach((to, from, next) => {
  if (to.path === '/' || to.path === '/unauth') {
    next()
  } else {
    let token = localStorage.token
    // console.log('12333333')
    // console.log(token)
    if (token === 'null' || token === '' || token === undefined) {
      next('/')
    } else {
      next()
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
