import Vue from 'vue'
import Router from 'vue-router'
import Containers from '@/components/Containers'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Containers',
      component: Containers
    }
  ]
})
