import Vue from 'vue'
import Router from 'vue-router'
import Users from '@/components/users/users.vue'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import CarList from '@/components/car/carlist.vue'
import SeriesList from '@/components/car/seriesList.vue'
import Driver from '@/components/users/driver.vue'

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
        }
      ]
    }
  ]
})
