

### www
    官方API文档
    https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/

    BetterScroll：可能是目前最好用的移动端滚动插件 = 对demo的总结
    https://juejin.im/post/59b777015188257e764c716f


### 入门
    垂直滚动，只需要对该容器进行简单的初始化。
    import BScroll from 'better-scroll'

    const options = {
        scrollY: true // 因为scrollY默认为true，其实可以省略
    }

    this.scroll = new BScroll(this.$refs.wrapper, options)
    对于 Vue 中使用 BetterScroll，有一个需要注意的点是，因为在 Vue 模板中列表渲染还没完成时，是没有生成列表 DOM 元素的，所以需要在确保列表渲染完成以后，才能创建 BScroll 实例，因此在 Vue 中，初始化 BScroll 的最佳时机是 mouted 的 nextTick。
    // 在 Vue 中，保证列表渲染完成时，初始化 BScroll
    mounted() {
    setTimeout(() => {
        this.scroll = new BScroll(this.$refs.wrapper, options)
    }, 20)
    },初始化之后，这个 wrapper 容器就能够优雅地滚动了，并且可以通过 BScroll 实例this.scroll使用其提供的 API 方法和事件。


### option
    better-scroll 支持很多参数配置，可以在初始化的时候传入第二个参数，比如：
    let scroll = new BScroll('.wrapper',{
        scrollY: true,
        click: true
    })
    这样就实现了一个纵向可点击的滚动效果。better-scroll 支持的参数非常多，可以修改它们去实现更多的 feature。通常你可以不改这些参数（列出不建议修改的参数），better-scroll 已经为你实现了最佳效果，接下来我们来列举 better-scroll 支持的参数。

    startX number 0 作用：横轴方向初始化位置。
    startY 类型：Number, 默认值：0 作用：纵轴方向初始化位置，见 Demo 。
    click Boolean false 
        better-scroll 默认会阻止浏览器的原生 click 事件。当设置为 true，better-scroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
    tap 类型：Boolean | String 默认值：false 
        作用：因为 better-scroll 会阻止原生的 click 事件，我们可以设置 tap 为 true，它会在区域被点击的时候派发一个 tap 事件，你可以像监听原生事件那样去监听它，如 element.addEventListener('tap', doSomething, false);。如果 tap 设置为字符串, 那么这个字符串就作为自定义事件名称。如 tap: 'myCustomTapEvent'。
    preventDefault 类型：Boolean 默认值：true 
        作用：当事件派发后是否阻止浏览器默认行为。这个值应该设为 true，除非你真的知道你在做什么，通常你可能用到的是 preventDefaultException。
    preventDefaultException 类型：Object 默认值：{ tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/} 
        作用：better-scroll 的实现会阻止原生的滚动，这样也同时阻止了一些原生组件的默认行为。这个时候我们不能对这些元素做 preventDefault，所以我们可以配置 preventDefaultException。默认值 {tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/}表示标签名为 input、textarea、button、select 这些元素的默认行为都不会被阻止。 
        
        备注：这是一个非常有用的配置，它的 key 是 DOM 元素的属性值，value 可以是一个正则表达式。比如我们想配一个 class 名称为 test 的元素，那么配置规则为 {className:/(^|\s)test(\s|$)/}。
    autoBlur(v1.7.0+) 类型：Boolean 默认值：true 作用：在滚动之前会让当前激活的元素（input、textarea）自动失去焦点。

### option2 
    snap 类型：Boolean | Object 默认值：false
        作用：这个配置是为了做 slide 组件用的，默认为 false，如果开启则需要配置一个 Object，例如：
            snap: {
                loop: false,
                threshold: 0.1,
                stepX: 100,
                stepY: 100,
                easing: {
                    style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    fn: function(t) { return t * (2 - t) }
                }
            }   
        注意：loop 为 true 是为了支持横向循环轮播，并不支持纵向。

    pullDownRefresh 类型：Boolean | Object 默认值：false
        作用：这个配置用于做下拉刷新功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启下拉刷新，可以配置顶部下拉的距离（threshold） 来决定刷新时机以及回弹停留的距离（stop），见 Demo 。了解更多的细节可以去看 example 中的 scroll 组件代码。

    pullUpLoad 类型：Boolean | Object 默认值：false
        作用：这个配置用于做上拉加载功能，默认为 false。当设置为 true 或者是一个 Object 的时候，可以开启上拉加载，可以配置离底部距离阈值（threshold）来决定开始加载的时机，见 Demo 。了解更多的细节可以去看 example 中的 scroll 组件代码。


百度地图 1.2

http rfc 
    缓存 cachcontroll 
