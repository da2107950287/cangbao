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
      // banner列表
      {
        path: '/banners',
        component: () => import(/* webpackChunkName: "banners" */ 'views/Banners.vue'),
        meta: { title: 'banner管理' }
      },
      //系统消息
      {
        path: '/systemMsg',
        component: () => import(/* webpackChunkName: "banners" */ 'views/SystemMsg.vue'),
        meta: { title: '系统消息' }
      },
      //系统设置
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
      
      {
        path: '/dictionary',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Dictionary.vue'),
        meta: { title: '数据字典' }
      },
      {
        path: '/document',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Document.vue'),
        meta: { title: '文档管理' }
      },

      // 个人中心
      {
        path: '/personalInfo',
        component: () => import(/* webpackChunkName: "profile" */ 'views/profile/personalInfo.vue'),
        meta: { title: '个人信息' }
      },
      {
        path: '/updatePassword',
        component: () => import(/* webpackChunkName: "profile" */ 'views/profile/updatePassword.vue'),
        meta: { title: '修改密码' }
      }
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
