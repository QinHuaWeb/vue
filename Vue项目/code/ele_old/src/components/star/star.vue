<template>
  <div class="stars" :class="'star-'+size">
    <span class="star" v-for="c in starClasses" :class="c"></span>
  </div>
</template>

<script>
  const CLASS_ON = 'on'
  const CLASS_HALF = 'half'
  const CLASS_OFF = 'off'

  export default {
    props: {
      score: Number,
      size: Number
    },

    // 3.5: 3 + 1 + 1
    // 3.4: 3 + 0 + 2
    computed: {
      starClasses () {
        const scs = []

        const score = this.score
        const integerScore = Math.floor(score)

        // 向数组中添加CLASS_ON
        for (let i = 0; i < integerScore; i++) {
          scs.push(CLASS_ON)
        }
        // 向数组中添加CLASS_HALF
        if(score-integerScore>=0.5) {
          scs.push(CLASS_HALF)
        }
        // 向数组中添加CLASS_OFF
        while(scs.length<5) {
          scs.push(CLASS_OFF)
        }

        return scs
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .stars
    .star
      display inline-block
      background-repeat no-repeat
      background-size 100% 100%
    &.star-48
      .star
        width 20px
        height 20px
        margin-right 22px
        &:last-child
          margin-right 0
        &.on
          bg-image("./star48_on")
        &.half
          bg-image("./star48_half")
        &.off
          bg-image("./star48_off")
    &.star-36
      .star
        width 15px
        height 15px
        margin-right 6px
        &:last-child
          margin-right 0
        &.on
          bg-image("./star36_on")
        &.half
          bg-image("./star36_half")
        &.off
          bg-image("./star36_off")
    &.star-24
      .star
        width 10px
        height 10px
        margin-right 3px
        &:last-child
          margin-right 0
        &.on
          bg-image("./star24_on")
        &.half
          bg-image("./star24_half")
        &.off
          bg-image("./star24_off")
</style>