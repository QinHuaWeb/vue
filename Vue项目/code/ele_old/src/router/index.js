import Vue from 'vue'
import VueRouter from 'vue-router'
/*
import goods from 'pages/goods/goods.vue'
import ratings from 'pages/ratings/ratings.vue'
import seller from 'pages/seller/seller.vue'
*/
const goods = () => import('pages/goods/goods.vue')
const ratings = () => import('pages/ratings/ratings.vue')
const seller = () => import('pages/seller/seller.vue')


// 声明使用插件
Vue.use(VueRouter)

export default new VueRouter({
  linkActiveClass:"active",
  routes: [ // 配置多个路由
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/',
      redirect: '/goods'
    }
  ]
})
