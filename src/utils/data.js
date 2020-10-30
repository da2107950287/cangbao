let mock = [
  {
    path: '/dashboard',
    name: '系统首页'
  },
  //课程管理
  {
    path: '/course',
    name: '课程管理',
  },
  //藏友圈管理
  {
    path: '/circle',
    name: '藏友圈管理'
  },
   //用户管理
   {
    path: '/user',
    name: '用户管理'
  },
  //新闻管理
  {
    path: '/news',
    name: '新闻管理'
  },
  // banner列表
  {
    path: '/banners',
    name: 'banner管理'
  },
  //系统消息
  {
    path: '/systemMsg',
    name: '系统消息'
  },
  //藏品管理
  {
    name: "藏品管理",
    child: [
      {
        path: '/collection',

        name: '藏品列表'
      },
      {
        path: '/collRegion',

        name: '藏品区域管理'
      },
      {
        path: '/collYears',

        name: '藏品年份管理'
      },
      {
        path: '/collCategory',

        name: '藏品类别管理'
      },
    ]
  },
  //市场
  {
    name: "市场管理",
    child: [
      {
        path: '/marketType',
        name: '报告类型管理'
      },
      {
        path: '/artAnalyst',
        name: '艺术分析师管理'
      },
      {
        path: '/marketReport',
        name: '市场报告管理'
      },
    ]
  },
  //拍卖会
  {
    name: "拍卖会管理",
    child: [
      {
        path: '/auction',
        name: '拍卖会管理'
      },
      {
        path: '/auctionYear',

        name: '拍卖会年份管理'
      },

      {
        path: '/auctionCategory',

        name: '拍卖会类别管理'
      },

      {
        path: '/specialAuction',
        name: '拍卖会专场管理'
      },

      {
        path: '/auctionCompany',
        name: '拍卖公司管理'
      },
    ]
  },
 
  //系统设置
  {
    name: "系统设置",
    child: [
      {
        path: '/role',

        name: '角色管理'
      },
      {
        path: '/manager',

        name: '管理员管理'
      },

      {
        path: '/dictionary',
        name: '数据字典'
      },
      {
        path: '/document',
        name: '文档管理'
      },

      {
        path: '/systemUpdate',
        name: '系统更新'
      },
    ]
  },
  // 个人中心
  {
    name: "个人中心",
    child: [
      {
        path: '/personalInfo',
        name: '个人信息'
      },
      {
        path: '/updatePassword',
        name: '修改密码'
      }
    ]

  }
]
export default mock;