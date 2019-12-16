### 	
	https://juejin.im/post/5cf495e96fb9a07ef5622025
	公司要求会使用框架vue，面试题会被问及哪些？

    https://juejin.im/post/5d59f2a451882549be53b170
    30 道 Vue 面试题，内含详细讲解（涵盖入门到精通，自测 Vue 掌握程度）

    https://github.com/answershuto/learnVue/blob/master/docs/Vue组件间通信.MarkDown
    https://github.com/answershuto/learnVue/tree/master/docs
    Vue.js学习及源码分析


    https://www.mmxiaowu.com/article/584820f6d4352863efb55459
    前端收藏夹

    https://blog.csdn.net/liangrongliu1991/article/details/100523879
    Vue 的小奇技

### methods computed watch
    在Vue中有三种方法可以让你的组件使用Vue的响应性。这些是methods、computed和watch
    当你点击“添加”按钮后，data中的tests就有对应的变化，那么我们的总分和平均分也有对应的变化。Vue的观察者就会执行autoSave方法。你可以看到控制台中打印出autoSave方法中的log信息，
    原文: http://www.w3cplus.com/vue/when-to-use-methods-computed-properties-or-watchers.html

```html
|--------------------------------
|-学生:[    ]  分数:[     ]   [+]
|--------------------------------
|-Billy :   76
|-Suzy  :   85
|-Emma  :   93
|--------------------------------
|-总分 254    平均 84.67
|--------------------------------
```
```js

let app = new Vue({
    el: '#app',
    data() {
        return {
            newTest: { studentName: 'Jack', score: 0 },
            tests: [
                { studentName: 'Billy', score: 76 }, { studentName: 'Suzy', score: 85 }, { studentName: 'Emma', score: 93 }
            ]
        }
    },
    watch: {
        averageScore: function () {
            this.autoSave()
        }
    },
    computed: {
        totalScore: function () {
            let totalArray = this.tests.reduce((acc, test) => {
                return acc + parseInt(test.score)
            }, 0)
            return totalArray
        },
        averageScore: function () {
            let totalArray = this.tests.reduce((acc, test) => {
                return acc + parseInt(test.score)
            }, 0)
            return parseFloat(totalArray / this.tests.length).toFixed(2)
        }
    },
    methods: {
        addTestScore: function () {
            this.tests.push({
                studentName: this.newTest.studentName,
                score: this.newTest.score
            })
            this.newTest.studentName = 'Jack'
            this.newTest.score = 0
        },
        autoSave: function () {
            // 假设我们正在调用我们的后端来保存数据
            console.log('Calling Api, Saving data')
        }
    },
    template: `<div>
          <div id="linkList">
              <div v-for="(item,index) in linkList" v-if="!_.includes(['file:','','D:'],item[0].name)">
                  <div 
                      v-for="(childLi,childLiIndex) in item"
                      :class="['linkLi',{'md' : /.md$/.test(childLi.name)},{'folder': childLi.type === '1' },{'folderActive': childLi.active }]"
                      :title="childLi.name"
                      :data-url="childLi.url"
                      @click="showChild(index,childLiIndex)">
                      {{childLi.name}}
                  </div>
              </div>
          </div>
          <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
          <div v-bind:style="styleObject"></div>
      <div>`
})
```

### 方法-事件 methods 
	<button @click="greet">Greet</button>
	methods: {
		greet: function(event) { }
	}

	<button :click="say('what')">Say What</button>
	methods: {
		say: function(msg) { }
	}

    Vue.js为我们提供了四个事件API，分别是$on，$once，$off，$emit
        $on     方法用来在vm实例上监听一个自定义事件，该事件可用$emit触发。
        $emit   用来触发指定的自定义事件。
        $once   监听一个只能触发一次的事件，在触发以后会自动移除该事件。
        $off    用来移除自定义事件


    事件修饰符
        在事件处理器中经常需要调用event.preventDefault 或 event.stopPropagation
            <a @click.stop="do"></a> // 阻止单击事件冒泡
            <a @submit.prevent="submit"></a> // 提交事件不再重载页面
            <a @click.stop.prevent="do"></a> // 修饰符可以串联
            <form @submit.prevent></form> // 只有修饰符
        在Vue中事件修饰符主要有：
            .stop：等同于JavaScript中的event.stopPropagation()，防止事件冒泡
            .prevent：等同于JavaScript中的event.preventDefault()，防止执行预设的行为（如果事件可取消，则取消该事件，而不停止事件的进一步传播）
            .capture：与事件冒泡的方向相反，事件捕获由外到内
            .self：只会触发自己范围内的事件，不包含子元素
            .once：只会触发一次
        按键修饰符
            .enter .tab .delete .esc .space .up .down .left .right
            <input v-on:keyup.13="submit">
            <input v-on:keyup.enter="submit">
            <input @keyup.enter="submit">
        自定义按键别名
            Vue.directive('on').keyCodes.f1 = 112 // 可以使用 @keyup.f1


### 监听 watch $watch
	https://www.w3cplus.com/vue/vue-watch.html
	https://www.colabug.com/1744689.html

    小结
        想要观察数据的变化和反应，通常会使用计算属性 computed；
        但是某些场景需要定制的监视程序（异步、大开销操作），则需要通过 观察者watch提供一个更通用的方法，来响应数据的变化；
        除了观察者watch，还提供了$watch实例方法（外部）

	vm.$watch(expOrFun,callback,[option])
		app.$watch('count', function(newValue, oldValue){  }) 
		// 注意：这里我们不能使用ES6的箭头函数，因为箭头函数被绑定到父的上下文，而this这个关键词将不会被正确绑定到Vue的实例。

		app.$watch('person.name.firstName', function(newValue, oldValue){ ... })
		// 使用点方法访问到这个属性

		app.$watch('person.name', function(newValue, oldValue){  }, {deep: true}) 
		// 改变firstName, oldValue和newValue的值是一样的。这是因为当改变一个对象或数组（意味着在不创建新副本情况下修改它）时，oldValue和newValue的值将是相同的，因为Vue没有保留以前的值作为副本。因此，两个参数都引用同一个对象或数组。我们可以通过将选项的对象作为 $watch 方法的第三个参数来实现。这里选择的是 deep 选项，并且将其值设置为 true

		app.$watch( function () { return this.count }, function (newValue, oldValue) {   } ) 
		// 可以传入一个函数。这个函数应该简单地返回你希望监视更改的表达式

		let unwatch = app.$watch(); unwatch();
		// 每当我们使用 $watch 方法时，它实际上会返回一个函数，然后我们可以调用它来停止观察脚本中后面的更改。通过将方法的返回值赋给一个变量来尝试使用这个方法。

### 过滤器 filter
	全局过滤器
		来看一个简单的示例。下面这个示例演示的是注册一个全局过滤器，其作用就是在价格前面加上美元符号：

		// 声明一个全局的过滤器
		Vue.filter('toUSD', function (value) { return `$${value}` })
		// 在模板中这样使用 文本插值的使用方式
		<div id="app">
			<h1>{{ price | toUSD}}</h1>
		</div>

	本过过滤器
		本地过滤器被注册到一个Vue组件中。下面这个示例展示了本地过滤器是如何创建的。这个过滤器的功能是将字母变成大写：
		let app = new Vue({
			el: '#app',
			data () { return { name: 'w3cplus.com' } },
			filters: { Upper: function (value) { return value.toUpperCase() } }
		})
		<div id="app">
			<h1>{{ name | Upper }}</h1>
		</div>

	添加参数
		// 声明一个全局的过滤器readMore
		// 这个过滤器传了三个参数：text, length, suffix | 文本 显示的长度 剩余表示
		Vue.filter('readMore', function (text, length, suffix) {
			return text.substring(0, length) + suffix
		})
		<div class="summary">{{ article.summary | readMore(100, '...') }}</div>
		
	串联使用
		<h1>{{ price | toFixed(2) | toUSD }}</h1>

### 插件 plugin
    插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：
        1. 添加全局方法或者属性。如: vue-custom-element
        2. 添加全局资源：指令/过滤器/过渡等。如 vue-touch
        3. 通过全局混入来添加一些组件选项。如 vue-router
        4. 添加 Vue 实例方法，通过把它们添加到 Vue.prototype 上实现。
        5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 vue-router

    Vue插件的写法
    https://www.cnblogs.com/luozhihao/p/7414419.html

```js
export default {
    install(Vue, options) {
        Vue.myGlobalMethod = function () {  // 1. 添加全局方法或属性，如:  vue-custom-element
            // 逻辑...
        }

        Vue.directive('my-directive', {  // 2. 添加全局资源：指令/过滤器/过渡等，如 vue-touch
            bind (el, binding, vnode, oldVnode) {
                // 逻辑...
            }
            ...
        })

        Vue.mixin({
            created: function () {  // 3. 通过全局 mixin方法添加一些组件选项，如: vuex
                // 逻辑...
            }

			methods: { // 会在每个组件实例中添加greetingFn方法,在单文件组件中可以直接通过this.greetingFn()调用
                greetingFn() {
                    console.log('greeting');
                }
            }
            ...
        })    

        Vue.prototype.$myMethod = function (options) {  // 4. 添加实例方法，通过把它们添加到 Vue.prototype 上实现
            // 逻辑...
        }
    }
}


// 插件的使用
Vue.use(MyPlugin);
```

## 知识点
### 双向数据绑定
	vue.js 是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
    
	第一步：需要observe的数据对象进行递归遍历，包括子属性对象的属性，都加上setter和getter这样的话，给这个对象的某个值赋值，就会触发setter，那么就能监听到了数据变化

	第二步：compile解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图

	第三步：Watcher订阅者是Observer和Compile之间通信的桥梁，主要做的事情是:
		1、在自身实例化时往属性订阅器(dep)里面添加自己
		2、自身必须有一个update()方法
		3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

	第四步：MVVM作为数据绑定的入口，整合Observer、Compile和Watcher三者，
		通过Observer来监听自己的model数据变化，
		通过Compile来解析编译模板指令，
		最终利用Watcher搭起Observer和Compile之间的通信桥梁，达到数据变化 -> 视图更新；视图交互变化(input) -> 数据model变更的双向绑定效果。

### 不同路由修改页面的标题：设置afterEach钩子函数
	// 定义路由的时候如下定义，name也可为中文
	const routes = [
		{ path: '/goods', component: goods, name: 'goods' },
		{ path: '/ratings', component: ratings, name: 'ratings' },
		{ path: '/seller', component: seller, name: 'seller' }
	];
	// 创建路由实例
	const router = new VueRouter({
		routes: routes
	})
	// 关键在这里，设置afterEach钩子函数
	router.afterEach((to, from, next) => {
		document.title = to.name;
	})

### 怎样在刚进入应用就渲染某个路由组件  
	1.重定向  
		const routes = [ { path: '/', redirect: '/goods'} ]  
		const routes = [ { path: '/', redirect: { name: 'goods' }} ] //也可以是一个命名路由  
	2.导航式编程  
		router.push("/goods")

### how to define the vue router dynamic routing? And how to obtain the dynamic parameters?  
	对path属性加上id  
	通过router对象的params.id来获取动态值

### Vuex 模块化+命名空间后, 如何调用其他模块的 state, actions, mutations, getters ?
    Vuex 允许我们把 store 分 module（模块）。每一个模块包含各自的状态、mutation、action 和 getter。
    那么问题来了, 模块化+命名空间之后, 数据都是相对独立的, 如果想在模块 A 调用 模块 B 的state, actions, mutations, getters
    https://www.mmxiaowu.com/article/591a74f60ef91a5c93a340c4


### this.$once('hook:beforeDestroy', () => { })
    const timer = setInterval(() =>{                    
        // 某些定时器操作                
    }, 500);            
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once('hook:beforeDestroy', () => {            
        clearInterval(timer);                                    
    })

### Proxy 相比于 defineProperty 的优势
    Object.defineProperty() 的问题主要有三个：
    1. 不能监听数组的变化
    2. 必须遍历对象的每个属性
    3. 必须深层遍历嵌套的对象

    Proxy 在 ES2015 规范中被正式加入，它有以下几个特点：
    1. 针对对象：针对整个对象，而不是对象的某个属性，所以也就不需要对 keys 进行遍历。这解决了上述 Object.defineProperty() 第二个问题
    2. 支持数组：Proxy 不需要对数组的方法进行重载，省去了众多 hack，减少代码量等于减少了维护成本，而且标准的就是最好的。


    除了上述两点之外，Proxy 还拥有以下优势：
    1. Proxy 的第二个参数可以有 13 种拦截方法，这比起 Object.defineProperty() 要更加丰富
    2. Proxy 作为新标准受到浏览器厂商的重点关注和性能优化，相比之下 Object.defineProperty() 是一个已有的老方法。


### Vue与React的区别
    1. vue组件分为全局注册和局部注册，在react中都是通过import相应组件，然后模版中引用；
    2. props是可以动态变化的，子组件也实时更新，在react中官方建议props要像纯函数那样，输入输出一致对应，而且不太建议通过props来更改视图；
    3. 子组件一般要显示地调用props选项来声明它期待获得的数据。而在react中不必需，另两者都有props校验机制；
    4. 每个Vue实例都实现了事件接口，方便父子组件通信，小型项目中不需要引入状态管理机制，而react必需自己实现；
    5. 使用插槽分发内容，使得可以混合父组件的内容与子组件自己的模板；
    6. 多了指令系统，让模版可以实现更丰富的功能，而React只能使用JSX语法；
    7. Vue增加的语法糖computed和watch，而在React中需要自己写一套逻辑来实现；
    8. react的思路是all in js，通过js来生成html，所以设计了jsx，还有通过js来操作css，社区的styled-component、jss等；而 vue是把html，css，js组合到一起，用各自的处理方式，vue有单文件组件，可以把html、css、js写到一个文件中，html提供了模板引擎来处理。
    9. react做的事情很少，很多都交给社区去做，vue很多东西都是内置的，写起来确实方便一些， 比如 redux的combineReducer就对应vuex的modules， 比如reselect就对应vuex的getter和vue组件的computed， vuex的mutation是直接改变的原始数据，而redux的reducer是返回一个全新的state，所以redux结合immutable来优化性能，vue不需要。
    10. react是整体的思路的就是函数式，所以推崇纯组件，数据不可变，单向数据流，当然需要双向的地方也可以做到，比如结合redux-form，组件的横向拆分一般是通过高阶组件。而vue是数据可变的，双向绑定，声明式的写法，vue组件的横向拆分很多情况下用mixin。



### 自定义指令（v-check、v-focus）的方法有哪些？它有哪些钩子函数？还有哪些钩子函数参数？
	全局定义指令：在vue对象的directive方法里面有两个参数，一个是指令名称，另外一个是函数。
	组件内定义指令：directives
	钩子函数：bind（绑定事件触发）、inserted(节点插入的时候触发)、update（组件内相关更新）
	钩子函数参数：el、binding

### 对于MVVM的理解
	MVVM 是 Model-View-ViewModel 的缩写
	Model: 代表数据模型，也可以在Model中定义数据修改和操作的业务逻辑。我们可以把Model称为数据层，因为它仅仅关注数据本身，不关心任何行为
	View: 用户操作界面。当ViewModel对Model进行更新的时候，会通过数据绑定更新到View
	ViewModel： 业务逻辑层，View需要什么数据，ViewModel要提供这个数据；View有某些操作，ViewModel就要响应这些操作，所以可以说它是Model for View.
	总结： MVVM模式简化了界面与业务的依赖，解决了数据频繁更新。MVVM 在使用当中，利用双向绑定技术，使得 Model 变化时，ViewModel 会自动更新，而 ViewModel 变化时，View 也会自动变化。

### mvvm模型
           -------------------
    view   |  dom listeners  |     model
           | data bingdings  |
           -------------------
    dom         VUe             plain js object


### 请详细说下你对vue生命周期的理解？
	总共分为8个阶段创建前/后，载入前/后，更新前/后，销毁前/后
		创建前/后： 在beforeCreated阶段，vue实例的挂载元素$el和数据对象data都为undefined，还未初始化。在created阶段，vue实例的数据对象data有了，$el还没有。

		载入前/后：在beforeMount阶段，vue实例的$el和data都初始化了，但还是挂载之前为虚拟的dom节点，data.message还未替换。在mounted阶段，vue实例挂载完成，data.message成功渲染。

		更新前/后：当data变化时，会触发beforeUpdate和updated方法。

		销毁前/后：在执行destroy方法后，对data的改变不会再触发周期函数，说明此时vue实例已经解除了事件监听以及和dom的绑定，但是dom结构依然存在

### 请说下封装 vue 组件的过程？
	首先，组件可以提升整个项目的开发效率。能够把页面抽象成多个相对独立的模块，解决了我们传统项目开发：效率低、难维护、复用性等问题。
	然后，使用Vue.extend方法创建一个组件，然后使用Vue.component方法注册组件。子组件需要数据，可以在props中接受定义。而子组件修改好数据后，想把数据传递给父组件。可以采用emit方法。

### 你是怎么认识vuex的？
	vuex可以理解为一种开发模式或框架。比如PHP有thinkphp，java有spring等。通过状态（数据源）集中管理驱动组件的变化（好比spring的IOC容器对bean进行集中管理）。
	应用级的状态集中放在store中； 改变状态的方式是提交mutations，这是个同步的事物； 异步逻辑应该封装在action中。
    Vuex有5个关键概念: 分别是 state、getter、mutation、action、module;

### vue-loader是什么？使用它的用途有哪些？解析.vue文件的一个加载器，跟template/js/style转换成js模块。
	用途：js可以写es6、style样式可以scss或less、template可以加jade等

### 请说出vue.cli项目中src目录每个文件夹和文件的用法？
	assets文件夹是放静态资源；
	components是放组件；
	router是定义路由相关的配置;
	view视图；
	app.vue是一个应用主组件；
	main.js是入口文件


### template编译
	聊聊你对Vue.js的template编译的理解？简而言之，就是先转化成AST树，再得到的render函数返回VNode（Vue的虚拟DOM节点）
	详情步骤：
		首先，通过compile编译器把template编译成AST语法树（abstract syntax tree 即 源代码的抽象语法结构的树状表现形式），compile是createCompiler的返回值，createCompiler是用以创建编译器的。另外compile还负责合并option。
		然后，AST会经过generate（将AST语法树转化成render funtion字符串的过程）得到render函数，render的返回值是VNode，VNode是Vue的虚拟DOM节点，里面有（标签名、子节点、文本等等）


### Vue 数组的数据更新
	https://www.mmxiaowu.com/article/58481e30d4352863efb55448
	在 Vue 中, 直接用索引设置元素，如 vm.items[0] = {}, 这样是不能更新试图的, 这时候就需要用$set方法
	this.list.$set(0, tmp)
    Vue.set(this.linkList, [index + 1], dealResponseText(str, url))


### 响应式属性和方法
	每个 Vue 实例都会代理其 data 对象里所有的属性。
		var data = { a: 1 }
		var vm = new Vue({
			data: data
		})

		vm.a === data.a // -> true

		// 设置属性也会影响到原始数据
		vm.a = 2
		data.a // -> 2
		// ... 反之亦然
		data.a = 3
		vm.a // -> 3
	即：都可以使vm.xxx这种方式获取和修改实例属性。
	注意：只有这些被代理的属性是响应的。如果在实例创建之后添加新的属性到实例上，它不会触发视图更新。我们将在后面详细讨论响应系统。那么这种情况的话，可以使用VueJs的vm.$xxx的方式来修改实例属性，这同样会触发视图更新，响应式的改变。

### 插值
	单词插值，只有在第一次渲染时候渲染值，之后不会随实例属性值的变化而改变，如：
		<span>单词插值: {{* msg }}</span>
	插入原始HTML，这种方式内容以 HTML 字符串插入，数据绑定将被忽略，如：
		<div>{{{ raw_html }}}</div>
	如果需要复用模板片断，应当使用 partials
	注意： 在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。记住，只对可信内容使用 HTML 插值，永不用于用户提交的内容。

### v-show 和 v-if的选择
	v-if 也是惰性的：如果在初始渲染时条件为假，则什么也不做——在条件第一次变为真时才开始局部编译（编译会被缓存起来）。
	相比之下，v-show 简单得多——元素始终被编译并保留，只是简单地基于 CSS 切换。

### vue 中如何绑定内联样式
    data() {
        return {
            color: '#fff',
            img: '/a.jpg'
        }
    }
    // 写法1:
    <div :style="`color:${color}; background:url(${img});`"></div>
    // 写法2:
    <div :style="{width: '100px', height: '100px', background: 'url('+img+')'}"></div>

### 使用track-by，优化列表循环
	因为 v-for 默认通过数据对象的特征来决定对已有作用域和 DOM 元素的复用程度，这可能导致重新渲染整个列表。但是，如果每个对象都有一个唯一 ID 的属性，便可以使用 track-by 特性给 Vue.js 一个提示，Vue.js 因而能尽可能地复用已有实例。
	例如，假定数据为：
	{
		items: [
				{ _uid: '88f869d', ... },
				{ _uid: '7496c10', ... }
			]
	}
	然后可以这样给出提示：
	<div v-for="item in items" track-by="_uid">
		<!-### content -->
	</div>
	然后在替换数组 items 时，如果 Vue.js 遇到一个包含 _uid: ‘88f869d’ 的新对象，它知道它可以复用这个已有对象的作用域与 DOM 元素。

### prop数据绑定
	prop 默认是单向绑定：当父组件的属性变化时，将传导给子组件，但是反过来不会。这是为了防止子组件无意修改了父组件的状态——这会让应用的数据流难以理解。
	解决办法 : 使用 .sync 或.once 绑定修饰符显式地强制双向或单次绑定
	<!-### 默认为单向绑定 -->
	<child :msg="parentMsg"></child>
	<!-### 双向绑定 -->
	<child :msg.sync="parentMsg"></child>
	<!-### 单次绑定 -->
	<child :msg.once="parentMsg"></child>

### 组件的父链
	子组件可以用 this.$parent 访问它的父组件。根实例的后代可以用 this.$root 访问它。父组件有一个数组 this.$children，包含它所有的子元素。

### Vue和MVVM模式
	MVVM模式即Model-View-ViewModel。
	Vue是以数据为驱动的，Vue自身将DOM和数据进行绑定，一旦创建绑定，DOM和数据将保持同步，每当数据发生变化，DOM会跟着变化。
	ViewModel是Vue的核心，它是Vue的一个实例。Vue实例时作用域某个HTML元素上的，这个HTML元素可以是body，也可以是某个id所指代的元素。
	DOM Listeners和Data Bindings是实现双向绑定的关键。DOM Listeners监听页面所有View层DOM元素的变化，当发生变化，Model层的数据随之变化；Data Bindings监听Model层的数据，当数据发生变化，View层的DOM元素随之变化。

### Vue.js特点
	简洁：页面由HTML模板+Json数据+Vue实例组成
	数据驱动：自动计算属性和追踪依赖的模板表达式
	组件化：用可复用、解耦的组件来构造页面
	轻量：代码量小，不依赖其他库
	快速：精确有效批量DOM更新
	模板友好：可通过npm，bower等多种方式安装，很容易融入


### 一个简化vue的实现
    https://www.w3cplus.com/vue/vue-two-way-binding.html
    Vue的双向绑定原理及实现

    https://segmentfault.com/a/1190000019153289
    一张思维导图辅助你深入了解 Vue | Vue-Router | Vuex 源码架构


### 虚拟dom
    让虚拟DOM和DOM-diff不再成为你的绊脚石
    https://juejin.im/post/5c8e5e4951882545c109ae9c

    总结：
        用JS对象模拟DOM（虚拟DOM）
        把此虚拟DOM转成真实DOM并插入页面中（render）
        如果有事件发生修改了虚拟DOM，比较两棵虚拟DOM树的差异，得到差异对象（diff）
        把差异对象应用到真正的DOM树上（patch）

## 其他

### mode:history
	new Vue({
		mode: "history",//开启history模式保证spa可以和以前的网页一样可以前进和后退
	})

### vue-cli
	vue init webpack projectName
	name description author build vue-router ESLint

### element-ui 
	npm install element-ui -S

	import Vue from 'vue'
	import Element from 'element-ui'

	Vue.use(Element)

	// or
	import {
	Select,
	Button
	// ...
	} from 'element-ui'

	Vue.component(Select.name, Select)
	Vue.component(Button.name, Button)

### 过渡
	vue提供了transition组件，用于给元素添加过渡效果：
	过渡过程：
	v-enter
	v-enter-active
	v-enter-to

	v-leave
	v-leave-active
	v-leave-to


### .sync
    <child :msg.sync='msg'></child>
    <child :msg="msg" @update:msg="msg = $event"></child>
