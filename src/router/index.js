import Vue from 'vue'
import Router from 'vue-router'
import Containers from '@/components/Containers'
import Images from '@/components/Images'
import Main from '@/components/Main'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/containers',
      name: 'Containers',
      component: Containers
    },
    {
      path: '/images',
      name: 'Images',
      component: Images
    }
  ]
})
