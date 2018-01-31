# vuex的理解(什么/为什么/作用)
	什么: vue的插件
	为什么?: 在应用开发, 多个组件共享状态的问题不太好解决
	作用: 管理(写/读)多个组件共享的状态

# vuex中的几个核心概念
	1. store
		创建对象: new Vuex.Store({})
		配置: Vue的配置中配置store属性
		组件中获取对象: this.$store
		对象的属性/方法:
			store.state.xxx: 读状态数据          mapState()
			store.getters.yyy: 读计算属性数据    mapGetters()
			store.dispatch(): 更新状态           mapActions()
	2. store内部: 
		1. state: 包含共享状态属性的对象
		2. mutations: 包含直接更新状态方法的对象
		3. actions: 包含异步/逻辑处理--->间接更新状态方法的对象
		4. getters: 包含多个计算属性的对象

# {}与...的使用
	{}: 创建对象, 解构(变量/形参)
	...: 打包数组, 解包数组/对象
# vuex的结构图

# vue组件间通信
	1. props
		函数: 子-->父
		非函数: 父--->子
	2. vue自定义事件
		代替函数props:  子-->父
	3. 消息订阅与发布/全局事件总线
		任意组件间通信, 不局限于关系
		轻量级
	4. vuex
		任意组件间通信, 不局限于关系
		重量级 (真实的项目使用)
