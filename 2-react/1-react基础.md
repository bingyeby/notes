### 正确地使用状态
    关于 setState() 这里有三件事情需要知道
#### 不要直接更新状态
    例如，此代码不会重新渲染组件： 
        this.state.comment = 'Hello'; // Wrong
    应当使用 setState(): 
        this.setState({comment: 'Hello'}); // Correct
    构造函数是唯一能够初始化 this.state 的地方。
#### 状态更新可能是异步的
    this.props 和 this.state 可能是异步更新的，你不应该依靠它们的值来计算下一个状态。
    React 可以将多个setState() 调用合并成一个调用来提高性能。
    此代码可能无法更新计数器：
    // Wrong
    this.setState({
        counter: this.state.counter + this.props.increment,
    });
    要修复它，请使用第二种形式的 setState() 来接受一个函数而不是一个对象。 该函数将接收先前的状态作为第一个参数，将此次更新被应用时的props做为第二个参数：
    // Correct
    this.setState((prevState, props) => ({
        counter: prevState.counter + props.increment
    }));
#### 状态更新合并
    组件状态可能包含一些独立的变量,你可以调用 setState() 独立地更新它们：
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            comments: []
        };
    }
    componentDidMount() {
        fetchPosts().then(response => {
            this.setState({ posts: response.posts });
        });
        fetchComments().then(response => {
            this.setState({ comments: response.comments });
        });
    }
    这里的合并是浅合并，也就是说this.setState({comments})完整保留了this.state.posts，但完全替换了this.state.comments。


### 事件处理
    需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)
    <button onClick={activateLasers}> Activate Lasers </button>

    1.不能使用返回 false 的方式阻止默认行为。你必须明确的使用 preventDefault。
        handleClick(e) {
            e.preventDefault();
            console.log('The link was clicked.');
        }
        e 是一个合成事件。React 根据 W3C spec 来定义这些合成事件，所以你不需要担心跨浏览器的兼容性问题。查看 SyntheticEvent 参考指南来了解更多。
        使用 React 的时候通常你不需要使用 addEventListener 为一个已创建的 DOM 元素添加监听器。你仅仅需要在这个元素初始渲染的时候提供一个监听器。
    2.this
        必须谨慎对待 JSX 回调函数中的 this，类的方法默认是不会绑定 this 的。如果你忘记绑定 this.handleClick 并把它传入 onClick, 当你调用这个函数的时候 this 的值会是 undefined。
        这并不是 React 的特殊行为；它是函数如何在 JavaScript 中运行的一部分。通常情况下，如果你没有在方法后面添加 () ，例如 onClick={this.handleClick}，你应该为这个方法绑定 this。
        如果使用 bind 让你很烦，这里有两种方式可以解决。如果你正在使用实验性的属性初始化器语法，你可以使用属性初始化器来正确的绑定回调函数：
    3. 向事件处理程序传递参数
        <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
        <button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
        上述两种方式是等价的，分别通过 arrow functions 和 Function.prototype.bind 来为事件处理函数传递参数。
        上面两个例子中，参数 e 作为 React 事件对象将会被作为第二个参数进行传递。通过箭头函数的方式，事件对象必须显式的进行传递，但是通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。
        值得注意的是，通过 bind 方式向监听函数传参，在类组件中定义的监听函数，事件对象 e 要排在所传递参数的后面


####  demo [thishandleClick.bind(this)]
    class Toggle extends React.Component {
      constructor(props) {
        super(props);
        this.state = {isToggleOn: true};

        // This binding is necessary to make `this` work in the callback
        this.handleClick = this.handleClick.bind(this);
      }

      handleClick() {
        this.setState(prevState => ({
          isToggleOn: !prevState.isToggleOn
        }));
      }

      render() {
        return (
          <button onClick={this.handleClick}>
            {this.state.isToggleOn ? 'ON' : 'OFF'}
          </button>
        );
      }
    }

    ReactDOM.render(
      <Toggle />,
      document.getElementById('root')
    );

#### demo [属性初始化器语法]
    // https://babeljs.io/docs/plugins/transform-class-properties/
    class LoggingButton extends React.Component {
      // This syntax ensures `this` is bound within handleClick.
      // Warning: this is *experimental* syntax.
      handleClick = () => {
        console.log('this is:', this);
      }

      render() {
        return (
          <button onClick={this.handleClick}>
            Click me
          </button>
        );
      }
    }

#### demo [传递参数]
    class Popper extends React.Component{
        constructor(){
            super();
            this.state = {name:'Hello world!'};
        }

        preventPop(name, e){    //事件对象e要放在最后
            e.preventDefault();
            alert(name);
        }

        render(){
            return (
                <div>
                    <p>hello</p>
                    {/* Pass params via bind() method. */}
                    <a href="https://reactjs.org" onClick={this.preventPop.bind(this,this.state.name)}>Click</a>
                </div>
            );
        }
    }

### 条件渲染
    在 React 中，你可以创建不同的组件来封装各种你需要的行为。然后还可以根据应用的状态变化只渲染其中的一部分。
    1. if(a){return <A/>}else if(b){return <B/>}else{return null}
    2. 与运算符 &&
        <div>
            <h1>Hello!</h1>
            {unreadMessages.length > 0 && <h2> You have {unreadMessages.length} unread messages. </h2> }
        </div>
    3. 三目运算符
        render() {
            const isLoggedIn = this.state.isLoggedIn;
            return (
                <div>
                    The user is <b>{isLoggedIn ? 'currently' : 'not'}</b> logged in.
                </div>
            );
        }
        render() {
            const isLoggedIn = this.state.isLoggedIn;
            return ( <div> {
                isLoggedIn 
                ? ( <LogoutButton onClick={this.handleLogoutClick} /> ) 
                : ( <LoginButton onClick={this.handleLoginClick} /> )
            } </div> );
        }

### 列表渲染 [map]
    需要注意给每个列表元素分配一个 key ： 数组元素中使用的key在其兄弟之间应该是独一无二的。然而，它们不需要是全局唯一的。当我们生成两个不同的数组时，我们可以使用相同的键
    有时渲染不需要外层包裹时，可以通过立即函数直接返回一个数组：[<td>,<td>]
    numbers.map((number) => <li key={number.toString()}> {number} </li>) // 
    todos.map((todo) => <li key={todo.id}> {todo.text} </li> ); // 数据的id作为元素的key
    todos.map((todo, index) =>  <li key={index}> {todo.text} </li> ); // Only do this if items have no stable IDs
    

### Refs & DOM
    Refs 提供了一种访问在 render 方法中创建的 DOM 节点或 React 元素的方式。
    在典型的 React 数据流中, 属性（props）是父组件与子代交互的唯一方式。要修改子组件，你需要使用新的 props 重新渲染它。但是，某些情况下你需要在典型数据流外强制修改子代。要修改的子代可以是 React 组件实例，也可以是 DOM 元素。对于这两种情况，React 提供了解决办法。

    下面是几个适合使用 refs 的情况：
        处理焦点、文本选择或媒体控制。
        触发强制动画。
        集成第三方 DOM 库

    demo:为 DOM 元素添加 Ref
        <input type="text" ref={(input) => { this.textInput = input; }} />
        this.textInput.focus();

    demo:为类组件添加 Ref
        constructor(props) {
            super(props);
            this.myRef = React.createRef();
        }
        render() {
            return <div ref={this.myRef} />;
        }

    你不能在函数式组件上使用 ref 属性，因为它们没有实例;
    如果你想使用 ref，就像你想使用生命周期方法或者 state 一样，应该将其转换为 class 组件;
    但是，你可以在函数式组件内部使用 ref，只要它指向一个 DOM 元素或者 class 组件;
    


### 为什么 ReactJS 不适合复杂的前端项目？

https://www.jianshu.com/p/2514e215589b

问题一：ReactJS组件难以在复杂交互页面中复用

问题二：ReactJS的虚拟DOM 算法又慢又不准

    ReactJS的页面渲染算法是虚拟DOM差量算法。
    
        开发者需要提供 render 函数，根据 props 和 state 生成虚拟 DOM。
        然后 ReactJS 框架根据 render 返回的虚拟 DOM 创建相同结构的真实 DOM.
        每当 state 更改时，ReacJS 框架重新调用 render 函数，获取新的虚拟 DOM 。
        然后，框架会比较上次生成的虚拟 DOM 和新的虚拟 DOM 有哪些差异，然后把差异应用到真实DOM上。

    这样做有两大缺点：

        每次 state 更改，render 函数都要生成完整的虚拟 DOM. 哪怕 state 改动很小，render函数也会完整计算一遍。如果 render 函数很复杂，这个过程就白白浪费了很多计算资源。

        ReactJS框架比较虚拟DOM差异的过程，既慢又容易出错。比如，假如你想要在某个 <ul> 列表的顶部插入一项 <li> ，那么ReactJS框架会误以为你修改了 <ul> 的每一项 <li>，然后在尾部插入了一个 <li>。

    这是因为 ReactJS收到的新旧两个虚拟DOM之间相互独立，ReactJS并不知道数据源发生了什么操作，只能根据新旧两个虚拟DOM来猜测需要执行的操作。
    
    自动的猜测算法既不准又慢，必须要前端开发者手动提供 key 属性、shouldComponentUpdate 方法、componentDidUpdate 方法或者 componentWillUpdate 等方法才能帮助 ReactJS 框架猜对。


问题三：ReactJS的HTML模板功能既不完备、也不健壮

问题四：ReactJS与服务器通信时需要复杂的异步编程


### 你需要Mobx还是Redux？
[你需要Mobx还是Redux？](http://blog.codingplayboy.com/2018/02/11/mobx-vs-redux/#i-2)
使用mobx开发高性能react应用 http://foio.github.io/mobx-react/