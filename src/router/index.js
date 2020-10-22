import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
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
        component: () => import(/* webpackChunkName: "course" */ 'views/course/Course.vue'),
        meta: { title: '课程管理', isShow: true },
      },
      //藏友圈管理
      {
        path: '/circle',
        component: () => import(/* webpackChunkName: "tibetan-friend-circle" */ 'views/tibetan-friend-circle/Circle.vue'),
        meta: { title: '藏友圈管理', isShow: true }
      },
      //藏品管理
      {
        path: '/collection',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/Collection.vue'),
        meta: { title: '藏品列表', isShow: true }
      },
      {
        path: '/collRegion',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/CollRegion.vue'),
        meta: { title: '藏品区域管理', isShow: true }
      },
      {
        path: '/collYears',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/CollYears.vue'),
        meta: { title: '藏品年份管理', isShow: true }
      },
      {
        path: '/collCategory',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/CollCategory.vue'),
        meta: { title: '藏品类别管理', isShow: true }
      },
      //市场
      {
        path: '/marketType',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/MarketType.vue'),
        meta: { title: '报告类型管理', isShow: true }
      },
      {
        path: '/artAnalyst',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/ArtAnalyst.vue'),
        meta: { title: '艺术分析师管理', isShow: true }
      },

      {
        path: '/auction',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/Auction.vue'),
        meta: { title: '艺术分析师管理', isShow: true }
      },
      {
        path: '/marketReport',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/MarketReport.vue'),
        meta: { title: '市场报告管理', isShow: true }
      },
      
      {
        path: '/auctionYear',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/AuctionYear.vue'),
        meta: { title: '拍卖会年份管理', isShow: true }
      },
      
      {
        path: '/auctionCategory',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/AuctionCategory.vue'),
        meta: { title: '拍卖会类别管理', isShow: true }
      },
      
      {
        path: '/specialAuction',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/SpecialAuction.vue'),
        meta: { title: '拍卖会专场管理', isShow: true }
      },
      
      {
        path: '/auctionCompany',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/AuctionCompany.vue'),
        meta: { title: '拍卖公司管理', isShow: true }
      },
      //用户管理
      {
        path: '/user',
        component: () => import(/* webpackChunkName: "user" */ 'views/user/User.vue'),
        meta: { title: '用户管理', isShow: true }
      },
      //新闻管理
      {
        path: '/news',
        component: () => import(/* webpackChunkName: "new" */ 'views/News.vue'),
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
  {
    path: '/demo',
    name: 'demo',
    component: () => import('views/demo.vue')

  },
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
