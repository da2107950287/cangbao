import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import {post,uploadPost} from "./utils/request.js"
　  import'../public/ueditor/ueditor.config.js'
　import'../public/ueditor/ueditor.all.min.js'
　import'../public/ueditor/lang/zh-cn/zh-cn.js'
　import'../public/ueditor/ueditor.parse.min.js'
import EditorBar from "@/components/wangeditor/WangEditor.vue";

Vue.prototype.$post=post
Vue.prototype.$uploadPost=uploadPost
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('EditorBar',EditorBar)
//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | 藏宝后台管理系统`;
  const role = localStorage.getItem('ms_username');
  // if (!role && to.path !== '/login') {
  //     next('/login');
  // } else if (to.meta.permission) {
  //     // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
  //     role === 'admin' ? next() : next('/403');
  // } else {
  //     // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
  //     if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
  //         Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
  //             confirmButtonText: '确定'
  //         });
  //     } else {
          next();
  //     }
  // }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
