import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/personalPage',
    name: 'personalPage',
    component: () => import('@/views/PersonalInfoMain/index')
  },
  {
    path: '/signup',
    component: () => import('@/views/SignUp/index')
  },
  {
    path: '/login',
    component: () => import('@/views/Login/index')
  },
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/interests',
    name: 'interests',
    component: () => import('@/views/SignUp/Interests')
  },
  {
    path: '/searchPage',
    name: 'searchPage',
    component: () => import('@/views/paperSearch/index')
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/PaperRecommend/index')
  },
  {
    path: '/Model',
    name: 'Model',
    component: () => import('@/views/PersonalInfoMain/indexModel')
  },
  {
    path: '/specificVenue',
    name: 'specificVenue',
    component: () => import('@/views/SpecificVenue/index')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
