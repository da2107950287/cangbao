const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "home" */ 'components/common/Home.vue'),
    children: [
      {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/Dashboard.vue'),
      },
      //课程管理
      {
        path: '/course',
        component: () => import(/* webpackChunkName: "course" */ 'views/course/Course.vue'),
      },
      //藏友圈管理
      {
        path: '/circle',
        component: () => import(/* webpackChunkName: "tibetan-friend-circle" */ 'views/tibetan-friend-circle/Circle.vue'),
      },
      //藏品管理
      {
        path: '/collection',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/Collection.vue'),
      },
      {
        path: '/collRegion',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/CollRegion.vue'),
      },
      {
        path: '/collYears',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/CollYears.vue'),
      },
      {
        path: '/collCategory',
        component: () => import(/* webpackChunkName: "collection" */ 'views/collection/CollCategory.vue'),
      },
      //市场
      {
        path: '/marketType',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/MarketType.vue'),
      },
      {
        path: '/artAnalyst',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/ArtAnalyst.vue'),
      },
      {
        path: '/auction',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/Auction.vue'),
      },
      {
        path: '/marketReport',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/MarketReport.vue'),
      },

      {
        path: '/auctionYear',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/AuctionYear.vue'),
      },

      {
        path: '/auctionCategory',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/AuctionCategory.vue'),
      },

      {
        path: '/specialAuction',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/SpecialAuction.vue'),
      },

      {
        path: '/auctionCompany',
        component: () => import(/* webpackChunkName: "market" */ 'views/market/AuctionCompany.vue'),
      },
      //用户管理
      {
        path: '/user',
        component: () => import(/* webpackChunkName: "user" */ 'views/user/User.vue'),
      },
      //新闻管理
      {
        path: '/news',
        component: () => import(/* webpackChunkName: "new" */ 'views/News.vue'),
      },
      // banner列表
      {
        path: '/banners',
        component: () => import(/* webpackChunkName: "banners" */ 'views/Banners.vue'),
      },
      //系统消息
      {
        path: '/systemMsg',
        component: () => import(/* webpackChunkName: "banners" */ 'views/SystemMsg.vue'),
      },
      //系统设置
      {
        path: '/role',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Role.vue'),
      },
      {
        path: '/manager',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Manager.vue'),
      },

      {
        path: '/dictionary',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Dictionary.vue'),
      },
      {
        path: '/document',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/Document.vue'),
      },

      {
        path: '/systemUpdate',
        component: () => import(/* webpackChunkName: "dashboard" */ 'views/system-settings/SystemUpdate.vue'),
      },
      // 个人中心
      {
        path: '/personalInfo',
        component: () => import(/* webpackChunkName: "profile" */ 'views/profile/personalInfo.vue'),
      },
      {
        path: '/updatePassword',
        component: () => import(/* webpackChunkName: "profile" */ 'views/profile/updatePassword.vue'),
      }
    ]
  },
  {
    path: '/login',
    component: () => import('views/Login.vue'),
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
export default routes