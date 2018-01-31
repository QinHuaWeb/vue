<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--current-->
          <li class="menu-item" v-for="(good, index) in goods" :key="index"
              :class="{current: currentIndex===index}" @click="clickMenuItem(index)">
            <span class="text border-1px">
              <span class="icon" v-if="good.type>=0" :class="supportClasses[good.type]"></span>{{good.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="(good, index1) in goods" :key="index1">
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item border-1px"
                  v-for="(food, index2) in good.foods" :key="index2" @click="showFood(food)">
                <div class="icon">
                  <img width="57" height="57" v-lazy="food.icon">
                </div>

                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" :updateFoodCount="updateFoodCount"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart :minPrice="seller.minPrice"
                :deliveryPrice="seller.deliveryPrice"
                :foods="cartFoods"
                :clearCart="clearCart"
                :updateFoodCount="updateFoodCount"
                ref="shopcart">

      </shopcart>
    </div>
    <food :food="food" :updateFoodCount="updateFoodCount" ref="food"></food>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'
  import shopcart from 'components/shopcart/shopcart.vue'
  import food from 'components/food/food.vue'
  import { MessageBox, Toast} from 'mint-ui';

  export default {

    data () {
      return {
        supportClasses: ['decrease', 'discount', 'guarantee', 'invoice', 'special'],
        scrollY: 0, //滚动的y坐标
        tops: [],  // li的top的数组
        food: {}
      }
    },

    mounted () {
      // 使用axios请求mockjs提供的接口
      this.$store.dispatch('getGoods', () => {
        /*setTimeout(() => {
              this._initScroll()
            }, 1)*/
        // 将回调延迟到下次 DOM 更新循环之后执行
        this.$nextTick(() => {
          this._initScroll()
          this._initTops()
        })
      })
    },

    methods: {
      _initScroll () {
        // 创建对应左侧分类列表的scroll对象
        new BScroll(this.$refs.menuWrapper, {
          click: true //触发点击
        })
        // 创建对应右侧食物列表的scroll对象
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, { // 配置对象
          // startY: 100
          probeType: 2, //会在屏幕滑动(只能是用户操作)的过程中实时的派发 scroll 事件
          click: true //触发点击
        })

        //绑定指定名称(滚动)的事件监听
        this.foodsScroll.on('scroll', (event) => {
          console.log(event.y)
          this.scrollY = Math.abs(event.y)
        })
        this.foodsScroll.on('scrollEnd', (event) => { // 滚动结束时回调
          console.log('scrollEnd', event.y)
          this.scrollY = Math.abs(event.y)
        })
      },

      _initTops () {
        const tops = []
        // 得到所有li
        const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        // 根据lis添加top
        let top = 0
        tops.push(top)
        Array.prototype.slice.call(lis).forEach(li => {
          top += li.clientHeight
          tops.push(top)
        })
        // 更新tops
        this.tops = tops
      },

      clickMenuItem (index) {
        // console.log('clickMenuItem()', index)
        const li = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')[index]
        // 右侧滑动到对应的位置
        this.foodsScroll.scrollToElement(li, 300)
        // 更新scrollY-->更新当前分类项
        this.scrollY = this.tops[index]
      },

      updateFoodCount (isAdd, food, event) {
        console.log('updateFoodCount()')
        if(isAdd) { // 增加
          if(!food.count) {
            // food.count = 1 // 给food添加一个新的属性, 没有数据绑定
            this.$set(food, 'count', 1)
          } else {
            food.count++
          }

          // 启动一个小球动画
          this.$refs.shopcart.startBallAnimation(event.target)
        } else { // 减少
          if(food.count) {
            food.count--
          }
        }
      },

      clearCart () {// 将cartFoods中的所有food的count=0
        /*if(confirm('确定清除吗?')) {
          this.cartFoods.forEach(food => {
            food.count = 0
          })
        }*/

        MessageBox.confirm('确定清除吗?').then(action => {
          console.log(action)
          if(action==='confirm') {
            this.cartFoods.forEach(food => {
              food.count = 0
            })
            Toast({
              message: '清除成功',
              position: 'middle',
              duration: 2000
            });
          }
        }, () => {
          // 处理取消的逻辑
        });
      },

      showFood (food) {
        // 更新food
        this.food = food
        // 显示food界面
        this.$refs.food.toggleShow()
      }
    },

    computed: {
      ...mapState(['seller', 'goods']),
      currentIndex () {
        const {scrollY, tops} = this

        // 从tops中根据scrollY找出对应的下标
        // tops.indexOf(scrollY)

        // 命令式编程
        /*for (var i = 0; i < tops.length; i++) {
          var top = tops[i]
          var nextTop = tops[i+1]
          if(scrollY>=top && scrollY<nextTop) {
            return i
          }
        }*/
        // 使用数组声明式编程的函数
        return tops.findIndex(function (top, index) {
          var nextTop = tops[index+1]
          // 大于等于当前top && 小于等于下一个top
          return scrollY>=top && scrollY<nextTop
        })
      },

      cartFoods () { // 包含所有count>0的food
        const foods = []
        this.goods.forEach(good => {
          good.foods.forEach(food => {
            if(food.count) {
              foods.push(food)
            }
          })
        })
        return foods
      }
    },

    components: {
      cartcontrol,
      shopcart,
      food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>