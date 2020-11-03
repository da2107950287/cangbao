import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from "./staticRoute.js"
import {getPower} from "../utils/data.js"
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
let permissionList = []
function flat(arr) {
  for (const v of arr) {

    if (v.child && v.child.length) {

      flat(v.child)
    } else {
      permissionList.push(v)
    }
  }
}
function initRoute(router) {
  return new Promise((resolve) => {
    if (permissionList.length == 0) {
      let res = getPower()
      

      flat(res)
     
      permissionList.forEach(function (v) {
        let routeItem = router.match(v.path)
        if (routeItem) {
          routeItem.meta.permission = v.permission ? v.permission : []
          routeItem.meta.name = v.name
        }
      })
      resolve()
    } else {
      console.log("已有权限数据")
      resolve()
    }
  })
}

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.name} | 藏宝后台管理系统`;
  const role = localStorage.getItem('ms_username');
  if (to.path !== "/login" && to.path !== "/forgetPassword") {
    if (sessionStorage.getItem("userinfo")) {
      initRoute(router).then(() => {
        let isPermission = false
        console.log("进入权限判断")
        permissionList.forEach((v) => {
          // 判断跳转的页面是否在权限列表中
          if (v.path == to.path) {
            isPermission = true
          }
        })
        // 没有权限时跳转到401页面
        if (!isPermission) {
          next({ path: "/dashboard", replace: true })
        } else {
          next()
        }
      })
    } else {
      next('/login');
    }
  } else {
    next()
  }
});
export default router
