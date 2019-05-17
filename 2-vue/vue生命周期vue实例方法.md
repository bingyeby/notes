### 一个简化vue的实现
    https://www.w3cplus.com/vue/vue-two-way-binding.html
    Vue的双向绑定原理及实现

    https://segmentfault.com/a/1190000019153289
    一张思维导图辅助你深入了解 Vue | Vue-Router | Vuex 源码架构

### mvvm模型
           -------------------
    view   |  dom listeners  |     model
           | data bingdings  |
           -------------------
    dom         VUe             plain js object

### vue 实例
    每个Vue的应用都是通过Vue()函数创建一个新的Vue实例开始的。创建了一个Vue实例，其实就创建了一个ViewModel。
    在vue的实例中，可以插入挂载元素 数据选项，还可以插入模板 方法 生命周期钩子...
        new Vue({})
        挂载元素  el:"#app"
        设置数据    data:{}
        模板渲染    {{title}}
        filters、computed、methods和watch

### vue实例参数（Vue.js的组件可以理解为预先定义好了行为的ViewModel类。一个组件可以预定义很多选项，但最核心的是以下几个）
#### 基础：
    模板template：
    初始数据data：一个组件的初始数据状态。对于可复用的组件来说，这通常是私有的状态。
    接受的外部参数：
        props：组件之间通过参数来进行数据的传递和共享。参数默认是单向绑定（由上至下），但也可以显式地声明为双向绑定
        propsData 
#### 其他：
    el render  |  computed methods watch
    私有资源：Vue.js当中将用户自定义的指令、过滤器、组件等统称为资源。由于全局注册资源容易导致命名冲突，一个组件可以声明自己的私有资源。私有资源只有该组件和它的子组件可以调用。

#### 生命周期：beforeCreate create beforeMount mount ...
    beforeCreate：在实例初始化之后，数据观测（Data Observer）和event/watcher事件配置之前被调用
    create：实例已经创建完成之后被调用。在这一步，实例已完成以下的配置：数据(Data Observer)、属性和方法的运算，watch/event事件回调。然而，挂载阶段还没开始，$el属性目前不可见
    beforeMount：在挂载开始之前被调用：相关的render函数首次被调用
    mounted：el被新创建的vm.$el替换，并挂载到实例上去之后调用该钩子。如果root实例挂载了一个文档内元素，当mounted被调用时vm.$el也在文档内
    beforeUpdate：数据更新时调用，发生在虚拟DOM重新渲染和打补丁之前。你可以在这个钩子中进一步地更改状态，这不会触发附加的重渲染过程
    updated：由于数据更改导致虚拟DOM重新渲染和打补丁，在这之后会调用该钩子。当这个钩子被调用时，组件DOM已经更新，所以你现在可以执行依赖于DOM的操作。然而在大多数情况下，你应该避免在此期间更改状态，因为这可能会导致更新无限循环。该钩子在服务器端渲染期间不被调用
    beforeDestroy：实例销毁之前调用。在这一步，实例仍然完全可用
    destroyed：Vue实例销毁后调用。调用后，Vue实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。该钩子在服务器端渲染期间不被调用

### vue实例属性
    vm.$data      Vue实例观察的数据对象，vue实例代理了对其data对象的访问
    vm.$el        vue实例使用的根DOM元素
    vm.$option    用于当前vue实例的初始化选项 $options属性，它包含了数据、计算属性和方法等等
    vm.$parent    父实例
    vm.$children  
    vm.$root
    vm.$slots     用来访问被slot分发的内容，每个具名slot有其相应的属性[slot="foo"中的内容将会在app.$slots.foo中被找到]
    vm.$scopedSlots
    vm.$refs      包含了所有拥有ref注册的子组件
    vm.$isServe   当前vue实例是否运行与服务器

### vue实例方法
    事件 .$on .$off .$once .$emit
    数据 .$watch .$set .$delete [Vue.set Vue.delete]
    生命周期 
        vm.$mount      如果vue实例没有收到el设置，则处于未挂载状态，没有关联的DOM元素；可以使用app.$mount("#app")手动挂载一个未挂载的实例
        vm.$forceUpdate 使vue实例重新渲染，仅仅影响实例本身和插入插槽内容的额子组件
        vm.$nextTick   将回调延迟到下次DOM更新循环之后执行。在修改数据之后使用
        vm.$destroy    完全销毁一个vue实例（清理与其他实例的连接 解绑其它全部指令和事件监听器）

### 十个全局API和六个全局配置的API  [Vue构造函数静态方法]
    十个全局API：
        Vue.extend：使用基础Vue构造器，创建一个“子类”。参数是一个包含组件选项的对象
        Vue.nextTick：在下次DOM更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的DOM
        Vue.set：设置对象的属性。如果对象是响应式的，确保属性被创建后也是响应式的，同时触发视图更新。这个方法主要用于避开Vue不能检测属性被添加的限制
        Vue.delete：删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开Vue不能检测到属性被删除的限制，但是你应该很少会使用它
        Vue.directive：注册或获取全局指令
        Vue.filter：注册或获取全局过滤器
        Vue.component：注册或获取全局组件。注册还会自动使用给定的id设置组件的名称
        Vue.use：安装Vue.js插件
        Vue.mixin：全局注册一个混合，影响注册之后所有创建的每个Vue实例
        Vue.compile：在render函数中编译模板字符串。只在独立构建时有效

    六个全局Vue.config的API是：
        Vue.config.silent = true： 取消Vue所有的日志与警告
        Vue.config.optionMergeStrategies.methods：自定义合并策略的选项
        Vue.config.devtools = true：配置是否允许vue-devtools检查代码
        Vue.config.errorHandler = function(err, vm){}：指定组件的渲染和观察期间未捕获错误的处理函数
        Vue.config.ignoredElements = ['my-custom-web-component','another-web-component']：忽略在Vue之外的自定义元素
        Vue.config.keyCodes：给v-on自定义键位别名

### 图片
![](../images/Vue-api.png)
![](../images/Vue-propertype-methods.png)
![](../images/vue-instances-and-life-cycles-12.png)
![](../images/vue-instances-and-life-cycles-8.png)


