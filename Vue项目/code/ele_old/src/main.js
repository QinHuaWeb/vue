import Vue from 'vue'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import VueScroller from 'vue-scroller'
import {Button} from 'mint-ui'
import app from './app.vue'
import store from './store'
import router from './router'
import './filters'
import './mock/mockServer'

import "./common/stylus/index.styl"
import loading from './common/img/loading.gif'

//声明使用插件
Vue.use(VueResource)  // 内部给vm和组件对象添加一个属性$http(发送ajax请求)
Vue.use(VueLazyload, {
  loading
})
Vue.use(VueScroller)

// 注册全局组件
Vue.component(Button.name, Button)

new Vue({
  el: '#app',
  render: h => h(app),
  router,  // 配置路由器
  store // 配置vuex
})

