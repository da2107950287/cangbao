import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
    meta: { title: '自述文件' },
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
        meta: { title: '系统首页' }
      },
      {
        path: '/role',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Role.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: '/manager',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Manager.vue'),
        meta: { title: '管理员管理' }
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta:{title:'登录'}
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    component: () => import('../views/ForgetPassword.vue')
   
  },

  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
