import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/users/users.vue'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import CarList from '@/components/car/carlist.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'carlist',
          path: '/carlist',
          component: CarList
        }
      ]
    }
  ]
})
