# Vue入门
## Vue理解
  * 发明： 尤雨溪， 2014
  * vue: 渐进式框架： 
    * 核心库只保留基本的功能(最简单的功能)，可以满足基本开发
    * vue-router：扩展库。。。
## 知识点
  * 引入Vue.js
  * 创建Vue的实例对象
    * 配置对象
      - el(element)： 选择器字符串(id)，关联页面中的模板，管理页面中指定区域
      - data： 初始化Vue的数据， 数据最终供实例对象使用---- <font color=red>数据代理： Vue实例对象代理了data中的数据</font>
      - methods: 事件的回调函数： click，keyup。。。
      - computed(计算属性): 当使用的数据是根据data中的数据计算得到的---函数/对象(getter, setter存取器属性) 
      - watch: 监视数据(data中的数据)
          属性名： function(value){
            value === 监视属性最新的值
          }
   * 绑定事件：
     * v-on:事件名
     * v-on:事件名(传入的参数)
     * 简写方式：@事件名
   * 指令：
     * v-if：条件判断指令
     * v-for：
       * 遍历目标元素
       * 形式： v-for=todo in todos/  v-for=(todo, index) in todos
   * 强制数据绑定：
     * 标签中原生的属性无法直接解析变量
       * <a href='变量'>百度</a>
       * <a v-bind:href='变量'>百度</a>
       * <a :href='变量'>百度</a>
   * class与style绑定
     * 当这两个属性指定的是变量
     * :class   :style
   * 条件渲染
     * v-if/v-else(什么不用指定，和v-if的条件相反)
     * v-show
     * <font color=red>v-if: 影响DOM初始化结构</font>
     * <font color=red>v-show: display: none/去掉</font>
     * <font color=red>template：影响元素组，注意：只能v-if，template标签不会再页面添加新的DOM节点</font>

## 事件处理
  * v-on:事件ming
  * @事件名
  * 默认的event对象
    * 可以直接在事件的回调函数使用
    * 如果形参声明event对象，必须注入$event对象
    * 阻止默认行为： 事件后 + .prevent
    * 阻止冒泡： 事件后 + .stop
    * 事件修饰符： @keyup.enter/按键的编码
## 表单项
  * v-model: 对表单项进行双向数据绑定
  * 关联的属性： value/checked
  * 如果在type=checkbox的input，想关联value值，设置value，而且初始化的应该是数组
 ## 实例对象的生命周期
  * <font color=red>初始化渲染的过程</font>
    * beforeCreate: 实例对象将要被创建
      * 没有监视数据/事件
    * created: 实例对象已经被创建
      * 已经监视了数据/事件
    * beforeMount: 页面片段(模板页面转换完的页面片段)将要被挂载
      * 不能看到页面渲染后的效果
    * mounted: 页面已经挂载------>发送ajax请求/开启监听
      * 能看到页面渲染后的效果
  * <font color=red>改变数据，从新渲染</font>
    * beforeUpdate: 实例对象将要被更新/页面将要被更新
    * updated: 页面已经更新完毕
  * <font color=red>实例对象被销毁的过程</font>
    * beforeDestroy: 实例对象将要被销毁 ------> 扫尾工作，关闭监听
    * destroyed: 实例对象已经被销毁
 ## 过渡&动画
  * Vue对transition和animation进行了包装
  * transition: 属性： name
  * name-enter-active, name-leave-active: 动画/过渡开启
  * name-enter: 动画进入页面的状态
  * name-leave-to: 动画离开页面的状态
## 过滤器
  * 概念： 对已有的数据进行过滤格式
  * 格式： {{date | date-filter}}
  * Vue.filter(过滤器名字，function(value){value===过滤的目标数据})
## 指令
  * 如何解决表达式闪屏问题？
    - v-text: 
    - v-cloak:与css配合: [v-cloak] { display: none }
  * 某个元素注册一个唯一标识
    * 如何去获取： this.$refs.标识名
  
## 自定义插件
  * Vue为开发者提供了完善的扩展Vue库的功能
  * 公开的API： install
  * 初始化一个对象： MyPlugin.install = function(Vue){}
  * Vue.use(MyPlugin)  // 调用MyPlugin.install同时将Vue对象传入