import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import "./assets/iconfont/iconfont.css"
import { post, uploadPost } from "./utils/request.js"
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.prototype.$post = post
Vue.prototype.$uploadPost = uploadPost
Vue.config.productionTip = false
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
