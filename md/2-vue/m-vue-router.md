# vue router
## 相关知识
	https://segmentfault.com/a/1190000007825106  
	Vue-router2.0学习笔记  
	http://blog.csdn.net/github_26672553/article/details/54861174  
	vue-router： 嵌套路由 的实现案例   
	https://juejin.im/post/59ffb4b66fb9a04512385402#heading-0  
	vue面试题总汇

## vue router的简单使用
### 实现步骤
	// 0. 导入Vue和VueRouter
	Vue.use(VueRouter)
	// 1. 定义（路由）组件。 可以从其他文件 import 进来
	const Foo = { template: '<div>foo</div>' }
	const Bar = { template: '<div>bar</div>' }
	// 2. 定义路由
	// 3. 创建 router 实例
	const router = new VueRouter({
		routes :[ { path: '/foo', component: Foo }, { path: '/bar', component: Bar } ]
	})
	// 4. 创建和挂载根实例。
	const app = new Vue({
		router
	}).$mount('#app')
	// 4. 创建
	const app = new Vue({
		el: "#app",
		router
	})

### 关于动态路由匹配规则


### 一个组件匹配不同的路由
	我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用『动态路径参数』（dynamic segment）来达到这个效果：
	const User = {
		template: '<div>User</div>'
	}
	const User = {
		template: '<div>User {{ $route.params.id }}</div>'
	}
	const router = new VueRouter({
		routes: [
			// 动态路径参数 以冒号开头
			{ path: '/user/:id', component: User }
		]
	})

### 对路由变化监测
	对路由的切换进行监控：
		1.watch $route对象
			const User = { template: '...', watch: { '$route' (to, from) { // 对路由变化作出响应... } } }
		2.使用beforeRouteUpdate守卫 v2.2

### 关于路由加载时获取页面所需的相关数据( 使用组件内部钩子 beforeRouteEnter beforeRouteUpdate )
	有时候，进入某个路由后，需要从服务器获取数据。例如，在渲染用户信息时，你需要从服务器获取用户的数据。我们可以通过两种方式来实现：
		导航完成之前获取：导航完成前，在路由进入的守卫中获取数据，在数据获取成功后执行导航。
		导航完成之后获取：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示『加载中』之类的指示。
	1.在导航完成前获取数据
		通过这种方式，我们在导航转入新的路由前获取数据。我们可以在接下来的组件的 beforeRouteEnter 守卫中获取数据，当数据获取成功后只调用 next 方法。
		// 路由改变前，组件就已经渲染完了
		// 逻辑稍稍不同
		beforeRouteEnter (to, from, next) { getPost(to.params.id, (err, post) => { next(vm => vm.setData(err, post)) }) },
		beforeRouteUpdate (to, from, next) { this.post = null getPost(to.params.id, (err, post) => { this.setData(err, post) next() }) },
		methods: { setData (err, post) { if (err) { this.error = err.toString() } else { this.post = post } } }

	2.导航完成后获取数据
		当你使用这种方式时，我们会马上导航和渲染组件，然后在组件的 created 钩子中获取数据。这让我们有机会在数据获取期间展示一个 loading 状态，还可以在不同视图间展示不同的 loading 状态。
		假设我们有一个 Post 组件，需要基于 $route.params.id 获取文章数据：
			<template>
				<div class="post">
					<div class="loading" v-if="loading"> Loading... </div>
					<div v-if="error" class="error"> {{ error }} </div>
					<div v-if="post" class="content"> <h2>{{ post.title }}</h2> <p>{{ post.body }}</p> </div>
				</div>
			</template>
			export default {
				data () {
					return { loading: false, post: null, error: null }
				},
				created () {
					// 组件创建完后获取数据，
					// 此时 data 已经被 observed 了
					this.fetchData()
				},
				watch: {
					// 如果路由有变化，会再次执行该方法
					'$route': 'fetchData'
				},
				methods: {
					fetchData () {
						this.error = this.post = null
						this.loading = true
						// replace getPost with your data fetching util / API wrapper
						getPost(this.$route.params.id, (err, post) => {
							this.loading = false
							if (err) { this.error = err.toString() } else { this.post = post }
						})
					}
				}
			}

### 导航守卫 导航钩子
	参数或查询的改变并不会触发进入/离开的导航守卫； 你可以通过观察 $route 对象来应对这些变化，或使用 beforeRouteUpdate 的组件内守卫。
	有多种机会植入路由导航过程中：全局的, 单个路由独享的, 或者组件级的。
	1.全局导航钩子：
		router.beforeEach((to, from, next) => { // ... }) // 全局前置守卫 作用：跳转前进行判断拦截。
		router.afterEach((to, from) => { // ... }) // 你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
	2.单独路由独享new VueRouter({routes:[{beforeEnter:function(){}}]})
		const router = new VueRouter({ routes: [ 
			{ path: '/foo', component: Foo, beforeEnter: (to, from, next) => { // ... } }
		]})
	3.组件内部的钩子：new vue({ beforeRouteEnter(){} })
		beforeRouteEnter 
			在渲染该组件的对应路由被 confirm 前调用,不能获取组件实例 `this`, 因为当守卫执行前，组件实例还没被创建
		beforeRouterUpdate 2.2
			说明：
				可以访问组件实例 `this`
				在当前路由改变，但是该组件被复用时调用
				举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，由于会渲染同样的 Foo 组件，因此组件实例会被复用，意味着组件的生命周期不会再被调用。而这个钩子就会在这个情况下被调用。
			demo:
				const User = { template: '...', beforeRouteUpdate (to, from, next) { } }
				// react to route changes...  don't forget to call next() 
			
		beforeRouteLeave 
			可以直接访问 this。
			这个离开守卫通常用来禁止用户在还未保存修改前突然离开。可以通过 next(false) 来取消导航。 next(vm => { // 通过 `vm` 访问组件实例 })
#### 钩子参数：
	(
		to（去的那个路由）,
		from（离开的路由）,
		next（一定要用这个函数才能去到下一个路由，如果不用就拦截）
	)
#### next使用方式:
	next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed （确认的）。
	next(false): 中断当前的导航。如果浏览器的 URL 改变了（可能是用户手动或者浏览器后退按钮），那么 URL 地址会重置到 from 路由对应的地址。
	next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。
	next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
	确保要调用 next 方法，否则钩子就不会被 resolved。

### 完整的导航解析流程
	导航被触发。
	在失活的组件里调用离开守卫。
	调用全局的 beforeEach 守卫。
	在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
	在路由配置里调用 beforeEnter。
	解析异步路由组件。
	在被激活的组件里调用 beforeRouteEnter。
	调用全局的 beforeResolve 守卫 (2.5+)。
	导航被确认。
	调用全局的 afterEach 钩子。
	触发 DOM 更新。
	用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。



## 嵌套路由

## 编程式导航
	除了使用 <router-link> 创建 a 标签来定义导航链接，我们还可以借助 router 的实例方法，通过编写代码来实现。
	router.push(location, onComplete?, onAbort?) 	// 点击 <router-link :to="..."> 等同于调用 router.push(...)
		router.push('home')// 字符串
		router.push({ path: 'home' })	// 对象
		router.push({ name: 'user', params: { userId: 123 }})// 命名的路由
		router.push({ path: 'register', query: { plan: 'private' }})// 带查询参数，变成 /register?plan=private

	router.replace(location, onComplete?, onAbort?)
		跟 router.push 很像，唯一的不同就是，它不会向 history 添加新记录，而是跟它的方法名一样 —— 替换掉当前的 history 记录。

	router.go(n)
		router.go(1) // 在浏览器记录中前进一步，等同于 history.forward()
		router.go(-1) // 后退一步记录，等同于 history.back()
		router.go(3) // 前进 3 步记录
		router.go(-100)
		router.go(100) // 如果 history 记录不够用，那就默默地失败呗

## 命名路由
	有时候，通过一个名称来标识一个路由显得更方便一些，特别是在链接一个路由，或者是执行一些跳转的时候。你可以在创建 Router 实例的时候，在 routes 配置中给某个路由设置名称。
	const router = new VueRouter({
		routes: [ { path: '/user/:userId', name: 'user', component: User } ]
	})
	<router-link :to="{ name: 'user', params: { userId: 123 }}">User</router-link>
	router.push({ name: 'user', params: { userId: 123 }})
	这两种方式都会把路由导航到 /user/123 路径。
	
## 命名视图
	有时候想同时（同级）展示多个视图，而不是嵌套展示，例如创建一个布局，有 sidebar（侧导航） 和 main（主内容） 两个视图，这个时候命名视图就派上用场了。
	<router-view class="view one"></router-view>
	<router-view class="view two" name="a"></router-view>
	<router-view class="view three" name="b"></router-view>
	一个视图使用一个组件渲染，因此对于同个路由，多个视图就需要多个组件。确保正确使用 components 配置（带上 s）：
	const router = new VueRouter({
		routes: [
			{ path: '/', components: { default: Foo, a: Bar, b: Baz } }
		]
	})

## 重命名 别名
	redirect 
		redirect: '/b' 
		redirect: { name: 'foo' } 
		redirect: to => { // 方法接收 目标路由 作为参数 // return 重定向的 字符串路径/路径对象 } 
	alias
		alias: '/b'

# 标签
## router-link
	生成带链接的a标签
	被选中的router-link将自动添加一个class属性值.router-link-active
### 常用的属性值
	to
		表示目标路由链接，被点击后会将to的值传入router.push()
		to="home"  
		:to="'home'"  
		:to="{ path: 'home' }"  
		:to="{ name: 'user', params: { userId: 123 }}" //命名路由  
		:to="{ path: 'register', query: { plan: 'private' }}" //带查询参数，下面的结果为 /register?plan=private  
	replace
		决定是否调用route.replace();
	append
		设置 append 属性后，则在当前（相对）路径前添加基路径。例如，我们从 /a 导航到一个相对路径 b，如果没有配置 append，则路径为 /b，如果配了，则为 /a/b
	tag
		tag="li" //渲染结果  <li>foo</li>
	active-class  
		设置 链接激活时使用的 CSS 类名。  
		默认值可以通过路由的构造选项 linkActiveClass 来全局配置。
	exact  
		激活匹配的方式
	event  
		声明可以用来触发导航的事件。可以是一个字符串或是一个包含字符串的数组。
	exact-active-class  
		配置当链接被精确匹配的时候应该激活的 class。  
		注意默认值也是可以通过路由构造函数选项 linkExactActiveClass 进行全局配置的。
	将激活class应用在外层
		<router-link tag="li" to="/foo">
			<a>/foo</a>
		</router-link>

## router-view
### 简介
	用来渲染路径匹配到的视图组件
	可以给router-view组件设置transition过渡
	可以配合<keep-alive>来缓存数据，不至于重新渲染
	name 渲染对应路由配置中components下相应的组件


## router
### VueRouter构造配置
	new VueRouter({ 
		routes: Array<RouteConfig> ,
		mode // 配置路由模式
		base // 应用的基路径
		linkActiveClass // 默认值: "router-link-active"
		linkExactActiveClass // 默认值: "router-link-exact-active"
		scrollBehavior (to, from, savedPosition) { // return 期望滚动到哪个的位置 } ,
		parseQuery / stringifyQuery 
	})
#### routes: Array < RouteConfig >
	{
		path: string;
		component?: Component;
		name?: string; // 命名路由
		components?: { [name: string]: Component }; // 命名视图组件
		redirect?: string | Location | Function; // 重定向
		props?: boolean | string | Function; 
		alias?: string | Array<string>; // 别名
		children?: Array<RouteConfig>; // 嵌套路由
		beforeEnter?: (to: Route, from: Route, next: Function) => void;
		meta?: any; 

		// 2.6.0+
		caseSensitive?: boolean; // 匹配规则是否大小写敏感？(默认值：false)
		pathToRegexpOptions?: Object; // 编译正则的选项
	}
### VueRouter实例
	属性
		.app	Vue根实例
		.mode	使用的模式
		.currentRoute	当前路由对应的路由信息对象
	方法
		.beforeEach		全局导航钩子
		.beforeResolve		
		.afterEach

		.push .go .replace .back .forward

		.addRoutes
		.onReady(callback, [errorCallback])		在路由完成初始导航时调用
		.getMatchedComponents(location?)		返回目标位置或是当前路由匹配的组件数组（是数组的定义/构造类，不是实例）
