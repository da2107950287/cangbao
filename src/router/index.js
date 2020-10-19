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
    component: () => import(/* webpackChunkName: "home" */ 'components/common/Home.vue'),
    meta: { title: '自述文件' },
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/Dashboard.vue'),
        meta: { title: '系统首页', isShow: true }
      },
      //课程管理
      {
        path: '/course',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/course/Course.vue'),
        meta: { title: '课程管理', isShow: true },
      },
      //藏友圈管理
      {
        path: '/circle',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/tibetan-friend-circle/Circle.vue'),
        meta: { title: '藏友圈管理', isShow: true }
      },
      //藏品管理
      {
        path: '/collection',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/collection/Collection.vue'),
        meta: { title: '藏品列表', isShow: true }
      },
      {
        path: '/collRegion',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/collection/CollRegion.vue'),
        meta: { title: '藏品区域管理', isShow: true }
      },
      {
        path: '/collYears',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/collection/CollYears.vue'),
        meta: { title: '藏品年份管理', isShow: true }
      },
      {
        path: '/collCategory',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/collection/CollCategory.vue'),
        meta: { title: '藏品类别管理', isShow: true }
      },

      //新闻管理
      {
        path: '/news',
        component: () => import(/* webpackChunkName: "banners" */ 'views/News.vue'),
        meta: { title: '新闻管理', isShow: true }
      },
      // banner列表
      {
        path: '/banners',
        component: () => import(/* webpackChunkName: "banners" */ 'views/Banners.vue'),
        meta: { title: 'banner管理', isShow: true }
      },
      //系统消息
      {
        path: '/systemMsg',
        component: () => import(/* webpackChunkName: "banners" */ 'views/SystemMsg.vue'),
        meta: { title: '系统消息', isShow: true }
      },
      //系统设置
      {
        path: '/role',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Role.vue'),
        meta: { title: '角色管理', isShow: true }
      },
      {
        path: '/manager',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Manager.vue'),
        meta: { title: '管理员管理', isShow: true }
      },

      {
        path: '/dictionary',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Dictionary.vue'),
        meta: { title: '数据字典', isShow: true }
      },
      {
        path: '/document',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Document.vue'),
        meta: { title: '文档管理', isShow: true }
      },

      {
        path: '/systemUpdate',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/SystemUpdate.vue'),
        meta: { title: '系统更新', isShow: true }
      },
      // 个人中心
      {
        path: '/personalInfo',
        component: () => import(/* webpackChunkName: "profile" */ 'views/profile/personalInfo.vue'),
        meta: { title: '个人信息', isShow: true }
      },
      {
        path: '/updatePassword',
        component: () => import(/* webpackChunkName: "profile" */ 'views/profile/updatePassword.vue'),
        meta: { title: '修改密码', isShow: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('views/Login.vue'),
    meta: { title: '登录', isShow: false }
  },
  {
    path: '/forgetPassword',
    name: 'ForgetPassword',
    component: () => import('views/ForgetPassword.vue')

  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
