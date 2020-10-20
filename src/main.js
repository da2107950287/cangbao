import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import { post, uploadPost } from "./utils/request.js"

import EditorBar from "@/components/wangeditor/WangEditor.vue";

Vue.prototype.$post = post
Vue.prototype.$uploadPost = uploadPost
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('EditorBar', EditorBar)
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 藏宝后台管理系统`;
  const role = localStorage.getItem('ms_username');
  if (to.path !== "/login" && to.path !== "/forgetPassword") {
    console.log(JSON.parse(localStorage.getItem("userinfo")))
    if (JSON.parse(localStorage.getItem("userinfo"))) {
      next()
    } else {
      next('/login');
    }
  } else {
    next()
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
