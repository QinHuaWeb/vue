<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleShow">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount>0}">
              <i class="icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
            </div>
            <div class="num" v-if="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price">￥{{totalPrice}}</div>
          <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right" @click="pay">
          <div class="pay" :class="totalPrice>=minPrice ? 'enough' : 'not-enough'">
            {{payText}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition v-for="(ball, index) in balls"
                    :key="index"
                    @before-enter="beforeDrop"
                    @enter="dropping"
                    @after-enter="afterDrop"
                    :css="false">
          <div class="ball" v-show="ball.isShow">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name='fold'>
	<div class="shopcart-list" v-show="listShow">
		<div class="list-header">
		  <h1 class="title">购物车</h1>
		  <span class="empty" @click="clearCart">清空</span>
      <mt-button type="primary" @click.native="clearCart" style="float: right">清空</mt-button>
		  <!--<mt-button type="primary" @click.native="clearCart" style="float: right">清空</mt-button>-->
		</div>
		<div class="list-content" ref="listContent">
		  <ul>
		    <li class="food" v-for="(food, index) in foods" :key="index">
		      <span class="name">{{food.name}}</span>
		      <div class="price"><span>￥{{food.price}}</span></div>
		      <div class="cartcontrol-wrapper">
			<cartcontrol :food="food" :updateFoodCount="updateFoodCount"></cartcontrol>
		      </div>
		    </li>
		  </ul>
		</div>
	</div>
      </transition>
      
    </div>
    <transition name="fade">
	<div class="list-mask" v-show="listShow" @click="toggleShow"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import cartcontrol from 'components/cartcontrol/cartcontrol.vue'

  export default {
    props: {
      minPrice: Number,
      deliveryPrice: Number,
      foods: Array,
      clearCart: Function,
      updateFoodCount: Function
    },

    data () {
      return {
        isShow: false,
        balls: [
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false},
          {isShow: false}
        ],
        droppingBalls: []   // 用来保存所有正在执行动画的ball对象
      }
    },

    computed: {
      totalCount () {
        /*var totoal = 0
        this.foods.forEach(food => {
          totoal += food.count
        })
        return totoal*/
        return this.foods.reduce((preTotal, food) => preTotal + food.count, 0)
      },
      totalPrice () {
        /*var totoal = 0
        this.foods.forEach(food => {
          totoal += food.count * food.price
        })
        return totoal*/
        return this.foods.reduce(
          (preTotal, food) => preTotal + food.count*food.price,
          0
        )
      },

      payText () {
        // ￥20元起送 还差￥10元起送 去结算
        const {totalPrice, minPrice} = this
        if (totalPrice === 0) {
          return `￥${minPrice}元起送`
        } else if (totalPrice < minPrice) {
          return `还差￥${minPrice - totalPrice}元起送`
        } else {
          return '去结算'
        }
      },

      listShow () {
        if(this.totalCount===0) {
          this.isShow = false
          return false
        }
        //要显示列表
        if(this.isShow) {
          this.$nextTick(() => {

            // 如何创建一个单例(单一的实例)对象
            // 1. 创建之前: 先判断是否已存在? 如果没有才去创建
            // 2. 创建这后: 将创建的对象保存起来
            if(!this.scroll) {
              console.log('创建BScroll对象...')
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh() // 刷新: 检查是否要形成滚动
            }
          })
        }

        return this.isShow
      }
    },

    methods: {

      /**
       * 开始一个小球动画
       * @param startEl
       */
      startBallAnimation (startEl) {
        // 找到一个隐藏的小球   balls中isShow为false的ball对象
        const ball = this.balls.find(ball => !ball.isShow)
        if(ball) {
          // 让它显示出
          ball.isShow = true
          ball.startEl = startEl // 将startEl保存到对应的ball上
          this.droppingBalls.push(ball) // 保存ball
        }
      },

      // 在显示动画开始之前调用
      // 作用: 用来指定动画开始时的样式状态
      beforeDrop (el) {
        console.log('beforeDrop()')
        const ball = this.droppingBalls.shift() //移除第一个ball
        const startEl = ball.startEl
        // 计算offsetX和offsetY
        const {left, top} = startEl.getBoundingClientRect()
        const elLeft = 32
        const elBottom = 22
        const offsetX = left-elLeft
        const offsetY = -(window.innerHeight-top-elBottom)

        el.style.transform = `translateY(${offsetY}px)`
        el.children[0].style.transform = `translateX(${offsetX}px)`

        // 保存ball
        el.ball = ball
      },
      // 在显示动画开始时调用
      // 作用: 指定动画结束时的样式状态
      dropping (el) {
        console.log('dropping()')
        // 强制重排/重绘
        const temp = el.clientHeight  // 让当前帧立即显示

        // 异步指定动画最终的状态
        this.$nextTick(() => {
          el.style.transform = `translateY(0)`
          el.children[0].style.transform = `translateX(0)`
        })
      },
      // 在动画结束后调用
      // 作用: 做一些收尾的工作: 比如隐藏小球
      afterDrop (el) {
        console.log('afterDrop()')
        const ball = el.ball
        // 当前这个方法立即执行了, 需要延迟隐藏
        setTimeout(() => {
          ball.isShow = false
        }, 400)
      },

      pay () {
        const {totalPrice, minPrice, deliveryPrice} = this
        if (totalPrice >= minPrice) {
          alert('支付' + (totalPrice + deliveryPrice))
        }
      },

      toggleShow () {
        //如果当前数量为0, 不切换
        if(this.totalCount===0) {
          return
        }
        console.log('toggleShow()')
        this.isShow = !this.isShow
      },

    },

    components: {
      cartcontrol
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .shopcart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px
              font-size: 24px
              color: #80858a
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            font-size: 9px
            font-weight: 700
            color: #fff
            background: rgb(240, 20, 20)
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b333b
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shopcart-list
      position: absolute
      left: 0
      top: 0
      z-index: -1
      width: 100%
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition: all .5s
      &.fold-enter, &.fold-leave-active
        transform: translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)

      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    z-index: 40
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
</style>