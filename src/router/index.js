import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/users/users.vue'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import CarList from '@/components/car/carlist.vue'
import SeriesList from '@/components/car/seriesList.vue'
import Driver from '@/components/users/driver.vue'
import Order from '@/components/order/order.vue'
import Role from '@/components/users/role.vue'
import Permission from '@/components/users/permission.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'drivers',
          path: '/drivers',
          component: Driver
        },
        {
          name: 'carlist',
          path: '/carlist',
          component: CarList
        },
        {
          name: 'seriesList',
          path: '/seriesList',
          component: SeriesList
        },
        {
          name: 'order',
          path: '/order',
          component: Order
        },
        {
          name: 'role',
          path: '/role',
          component: Role
        },
        {
          name: 'permission',
          path: '/permission',
          component: Permission
        }
      ]
    }
  ]
})
