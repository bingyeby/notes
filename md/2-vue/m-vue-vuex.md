# vuex

## 关于状态控制的几种方式

### “单向数据流”
    new Vue({
        data () { return { count: 0 } }, // state
        template: ` <div>{{ count }}</div> `, // view
        methods: { increment () { this.count++ } } // actions
    })
### 非父子组件的通信
    有时候，非父子关系的两个组件之间也需要通信。在简单的场景下，可以使用一个空的 Vue 实例作为事件总线：
    var bus = new Vue()
    // 触发组件 A 中的事件
    bus.$emit('id-selected', 1)
    // 在组件 B 创建的钩子中监听事件
    bus.$on('id-selected', function (id) {
    // ...
    })
    在复杂的情况下，我们应该考虑使用专门的状态管理模式。

### vuex的简单使用

    <!--测试vuex-->
    <div id="app-vuex" class="outer">
        {{ count }}
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
    </div>

    /**
    * B test with Vuex
    * make sure to call Vue.use(Vuex) if using a module system
    * 先定义，后使用
    */
    Vue.use(Vuex);

    const store = new Vuex.Store({
        state: {
            count: 0
        },
        mutations: {
            increment: state => state.count++,
            decrement: state => state.count--
        }
    });

    new Vue({
        el: '#app-vuex',
        computed: {
            count() {
                return store.state.count;
            }
        },
        methods: {
            increment() {
                store.commit('increment');
            },
            decrement() {
                store.commit('decrement');
            }
        }
    });

## 核心概念
    Vuex 是专门为 Vue.js 设计的状态管理库，以利用 Vue.js 的细粒度数据响应机制来进行高效的状态更新。
    state getter mutation action
    module

### state
    说明
        vuex使用单一状态树（一个对象）就包含了全部的应用级状态；
        一个应用只存在一个store实例；
        单一状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照；
        
    在组件中获取vuex值
        1 在某个组件的计算属性computed中获取 return store.state.count
        2 在整个app中通过new Vue({ store }) 方式从根组件“注入”到每一个子组件中（需调用 Vue.use(Vuex)）
            在某个组件的计算属性中通过return this.$store.state.count来实现
        3 当一个组件需要多个状态值时，无需重复声明为计算属性，可以通过mapState来辅助生成计算属性
            // 在单独构建的版本中辅助函数为 Vuex.mapState
            import { mapState } from 'vuex'
            export default {
                computed: mapState({
                    // 箭头函数可使代码更简练
                    count: state => state.count,

                    // 传字符串参数 'count' 等同于 `state => state.count`
                    countAlias: 'count',

                    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
                    countPlusLocalState (state) {
                        return state.count + this.localCount
                    }
                })
            }

            3.1 当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 mapState 传一个字符串数组。
                computed: mapState([ 'count' ])  // 映射 this.count 为 store.state.count
            3.2 mapState 函数返回的是一个对象，通过扩展运算符将它与局部计算属性混合使用：
                computed: { ...mapState({  }) }


### getter
    Vuex 允许我们在 store 中定义“getter”（可以认为是 store 的计算属性）。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

    Getter 接受 state 作为其第一个参数，其他 getter 作为第二个参数
        const store = new Vuex.Store({
            state: {
                todos: [
                    { id: 1, text: '...', done: true },
                    { id: 2, text: '...', done: false }
                ]
            },
            getters: {
                doneTodos: (state, getters) => { return state.todos.filter(todo => todo.done) }
            }
        })

    Getter 会暴露为 store.getters 对象： store.getters.doneTodos // -> [{ id: 1, text: '...', done: true }]

    我们可以很容易地在任何组件中使用它：return this.$store.getters.doneTodosCount

    你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。
        getters: {
            // ...
            getTodoById: (state) => (id) => {
                return state.todos.find(todo => todo.id === id)
            }
        }
        store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }

#### mapGetters 辅助函数

    mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([ 'doneTodosCount', 'anotherGetter', // ... ])
        }
    如果你想将一个 getter 属性另取一个名字，使用对象形式：
        mapGetters({ doneCount: 'doneTodosCount' }) // 映射 `this.doneCount` 为 `store.getters.doneTodosCount`


### mutation
    更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。

    Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的 事件类型 (type) 和 一个 回调函数 (handler)。
        const store = new Vuex.Store({
            state: {
                count: 1
            },
            mutations: {
                increment (state,other) { // 变更状态 typeName : function handler(state){}
                    state.count++
                }
            }
        })
        store.commit('increment',other) // other:额外的参数

    提交 mutation 的另一种方式是直接使用包含 type 属性的对象：
        mutations: {
            increment (state, payload) {
                state.count += payload.amount
            }
        }
        当使用对象风格的提交方式，整个对象都作为载荷传给 mutation 函数，因此 handler 保持不变：
        store.commit({
            type: 'increment',
            amount: 10
        })
#### 使用常量替代 Mutation 事件类型
    使用常量替代 mutation 事件类型在各种 Flux 实现中是很常见的模式。这样可以使 linter 之类的工具发挥作用，同时把这些常量放在单独的文件中可以让你的代码合作者对整个 app 包含的 mutation 一目了然：
    // mutation-types.js
    export const SOME_MUTATION = 'SOME_MUTATION'

    import { SOME_MUTATION } from './mutation-types'
    const store = new Vuex.Store({
        state: { ... },
        mutations: {
           [SOME_MUTATION] (state) { }
        }
    })
    // 我们可以使用 ES2015 风格的计算属性命名功能来使用一个常量作为函数名


#### Mutation 必须是同步函数
    实质上任何在回调函数中进行的状态的改变都是不可追踪的
#### 在组件中提交 Mutation
    可以在组件中使用 this.$store.commit('xxx') 提交 mutation，或者使用 mapMutations 辅助函数将组件中的 methods 映射为 store.commit 调用（需要在根节点注入 store）
        import { mapMutations } from 'vuex'
        export default {
            // ...
            methods: {
                ...mapMutations([ 'increment', 'incrementBy' ]),
                    // 将 `this.increment()` 映射为 `this.$store.commit('increment')`
                    // `mapMutations` 也支持载荷：
                    // 将 `this.incrementBy(amount)` 映射为 `this.$store.commit('incrementBy', amount)`
                ...mapMutations({ add: 'increment' })
                    // 将 `this.add()` 映射为 `this.$store.commit('increment')`
            }
        }


### Action
    Action 类似于 mutation，不同在于：
        Action 提交的是 mutation，而不是直接变更状态。
        Action 可以包含任意异步操作。

    注册一个简单的 action：
        const store = new Vuex.Store({
            state: { count: 0 },
            mutations: {
                increment (state) { state.count++ }
            },
            actions: {
                increment (context) { context.commit('increment') }
            }
        })
        
        解构简化代码
        actions: {
            increment ({ commit }) { commit('increment') }
        }

        参数context : 
            与 store 实例具有相同方法和属性；
            可以通过context.commit 提交一个 mutation，
            可以通过context.state、context.getters 来获取 state 和 getters。
    
    分发action
        Action 通过 store.dispatch 方法触发：
            store.dispatch('increment') // 触发
            store.dispatch('incrementAsync', { amount: 10 }) // 以载荷形式分发
            store.dispatch({ type: 'incrementAsync', amount: 10 }) // 以对象形式分发

#### 调用异步 API 和分发多重 mutation：
    actions: {
        checkout ({ commit, state }, products) {
            // 把当前购物车的物品备份起来
            const savedCartItems = [...state.cart.added]
            // 发出结账请求，然后乐观地清空购物车
            commit(types.CHECKOUT_REQUEST)
            // 购物 API 接受一个成功回调和一个失败回调
            shop.buyProducts( 
                products,
                () => commit(types.CHECKOUT_SUCCESS),
                () => commit(types.CHECKOUT_FAILURE, savedCartItems)
            ) // 成功操作 // 失败操作
        }
    }

#### 在组件中分发 Action

    你在组件中使用 this.$store.dispatch('xxx') 分发 action，或者使用 mapActions 辅助函数将组件的 methods 映射为 store.dispatch 调用（需要先在根节点注入 store）：

    import { mapActions } from 'vuex'
    export default {
        // ...
        methods: {
            ...mapActions([ 'increment', 'incrementBy' ]),
                // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
                // `mapActions` 也支持载荷：
                // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
            ...mapActions({ add: 'increment' })
                // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
        }
    }
#### 组合 Action
    Action 通常是异步的，那么如何知道 action 什么时候结束呢？更重要的是，我们如何才能组合多个 action，以处理更加复杂的异步流程？

    首先，你需要明白 store.dispatch 可以处理被触发的 action 的处理函数返回的 Promise，并且 store.dispatch 仍旧返回 Promise：
        actions: {
            actionA ({ commit }) {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        commit('someMutation')
                        resolve()
                    }, 1000)
                })
            }
        }
        现在你可以：
            store.dispatch('actionA').then(() => { })
        在另外一个 action 中也可以：
            actions: {
                actionB ({ dispatch, commit }) {
                    return dispatch('actionA').then(() => {
                        commit('someOtherMutation')
                    })
                }
            }

        最后，如果我们利用 async / await，我们可以如下组合 action：
        // 假设 getData() 和 getOtherData() 返回的是 Promise
        actions: {
            async actionA ({ commit }) {
                commit('gotData', await getData())
            },
            async actionB ({ dispatch, commit }) {
                await dispatch('actionA') // 等待 actionA 完成
                commit('gotOtherData', await getOtherData())
            }
        }
    一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。





## 总结
### 项目结构:
    Vuex 并不限制你的代码结构。但是，它规定了一些需要遵守的规则：
        1. 应用层级的状态应该集中到单个 store 对象中。
        2. 提交 mutation 是更改状态的唯一方法，并且这个过程是同步的。
        3. 异步逻辑都应该封装到 action 里面。
    只要你遵守以上规则，如何组织代码随你便。如果你的 store 文件太大，只需将 action、mutation 和 getter 分割到单独的文件。


### 严格模式
    const store = new Vuex.Store({ strict: true })
    在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
    不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。
    const store = new Vuex.Store({ strict: process.env.NODE_ENV !== 'production' })

### 应用小结
    
