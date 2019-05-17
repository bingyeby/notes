    https://juejin.im/post/5a6b05536fb9a01cba42cd08
    使用 SVG 图标: (2) 编写 Webpack plugin

    https://www.jianshu.com/p/108d07de0e01
    Webpack 常见插件原理分析


### webpack 插件在项目中的运用

```js
const MyPlugin = require('myplugin')
const webpack = require('webpack')

webpack({
  ...,
  plugins: [new MyPlugin()]
  ...,
})
```

### webpack 插件定义
符合什么样的条件能作为 webpack 插件呢？一般来说，webpack 插件有以下特点：
* 独立的 JS 模块,暴露相应的函数, 函数原型上的 apply 方法会注入 compiler 对象
* compiler 对象上挂载了相应的 webpack 事件钩子 
* compiler 有 compiler.plugin函数。这个相当于是插件可以进行处理的webpack的运行中的一些任务点，webpack就是完成一个又一个任务而完成整个打包构建过程的。
    任务开始 -> compile -> after-compile -> emit -> after-emit
* 事件钩子的回调函数里能拿到编译后的 compilation 对象，如果是异步钩子还能拿到相应的 callback

```js
function MyPlugin(options) {}
MyPlugin.prototype.apply = function(compiler) { 
  // 2.函数原型上的 apply 方法会注入 compiler 对象{_plugins outputPath ... resolvers parser options context}
  // 3.compiler 对象上挂载了相应的 webpack 事件钩子[emit|compile|compilation...]  
  compiler.plugin('emit', (compilation, callback) => {
    // 4.事件钩子的回调函数里能拿到编译后的 compilation 对象
    ...
  })
}
// 1.独立的 JS 模块，暴露相应的函数
module.exports = MyPlugin
```

### 定义解释
1. 函数的原型上为什么要定义 apply 方法: 通过 plugin.apply() 调用插件的
2. compiler 对象是什么呢？
3. compiler 对象上的事件钩子是怎样的？
4. 事件钩子的回调函数里能拿到的 compilation 对象又是什么呢？
5. 在开发 Plugin 时最常用的两个对象就是 Compiler和 Compilation，它们是 Plugin 和 Webpack 之间的桥梁。

#### compiler 对象
Compiler 对象包含了 Webpack 环境所有的的配置信息，包含 options，loaders，plugins 这些信息，这个对象在 Webpack 启动时候被实例化，它是全局唯一的，可以简单地把它理解为 Webpack 实例；

compiler 即 webpack 的编辑器对象，在调用 webpack 时，会自动初始化 compiler 对象，源码如下：

```js
// webpack/lib/webpack.js
const Compiler = require("./Compiler")

const webpack = (options, callback) => {
  ...
  options = new WebpackOptionsDefaulter().process(options) // 初始化 webpack 各配置参数
  let compiler = new Compiler(options.context)             // 初始化 compiler 对象，这里 options.context 为 process.cwd()
  compiler.options = options                               // 往 compiler 添加初始化参数
  new NodeEnvironmentPlugin().apply(compiler)              // 往 compiler 添加 Node 环境相关方法
  for (const plugin of options.plugins) {
    plugin.apply(compiler);
  }
  ...
}

```

终上，compiler 对象中包含了所有 webpack 可配置的内容，开发插件时，我们可以从 compiler 对象中拿到所有和 webpack 主环境相关的内容。

#### compilation 对象
    compilation 对象代表了一次单一的版本构建和生成资源。
        当运行 webpack 时，每当检测到一个文件变化，一次新的编译将被创建，从而生成一组新的编译资源。

    它继承于compiler，所以能拿到一切compiler的内容（所以你也会看到webpack的options），而且也有plugin函数来接入任务点。
        assets部份重要是因为如果你想借助webpack帮你生成文件
        compilation.getStats()这个函数也相当重要，能得到生产文件以及chunkhash

    一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。

    Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。当 Webpack 以开发模式运行时，每当检测到一个文件变化，一次新的 Compilation 将被创建。Compilation 对象也提供了很多事件回调供插件做扩展。通过 Compilation 也能读取到 Compiler 对象。

    结合源码来理解下上面这段话，首先 webpack 在每次执行时会调用 compiler.run() ([源码位置](https://github.com/webpack/webpack/blob/e7c8fa414b718ac98d94a96e2553faceabfbc92f/lib/webpack.js#L58))，接着追踪 [onCompiled](https://github.com/webpack/webpack/blob/3a5fda909f2ecf911c73429cb4770948dbd31d24/lib/Compiler.js#L163) 函数传入的 compilation 参数，可以发现 compilation 来自构造函数 Compilation。

```js
// webpack/lib/Compiler.js
const Compilation = require("./Compilation");

newCompilation(params) {
  const compilation = new Compilation(this);
  ...
  return compilation;
}
```

    Compiler Compilation 区别:
        Compiler 代表了整个 Webpack 从启动到关闭的生命周期
        Compilation 只是代表了一次新的编译。



#### tapable 库
    https://www.jianshu.com/p/273e1c9904d2
    Webpack 核心模块 tapable 解析

    https://juejin.im/post/5beb8875e51d455e5c4dd83f
    tapable 与 webpack 一个简单的plugin

    再介绍完 compiler 对象和 compilation 对象后，不得不提的是 tapable 这个库，这个库暴露了所有和事件相关的 pub/sub 的方法。而且函数 Compiler 以及函数 Compilation 都继承自 Tapable。

    Webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。

    Webpack 通过 Tapable 来组织这条复杂的生产线。 Webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 Webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。

    Tapable提供了很多类型的hook，分为同步和异步两大类(异步中又区分异步并行和异步串行)，而根据事件执行的终止条件的不同，由衍生出 Bail/Waterfall/Loop 类型。

    Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 tapable

    实现事件流机制的 “钩子” 大方向可以分为两个类别，“同步” 和 “异步”，“异步” 又分为两个类别，“并行” 和 “串行”，而 “同步” 的钩子都是串行的

    这些 “钩子” 的真正作用就是将通过配置文件读取的插件与插件、加载器与加载器之间进行连接，“并行” 或 “串行” 执行

    注册事件的方法 tab、tapSync、tapPromise 和触发事件的方法 call、callAsync、promise 都是通过 compile 方法快速编译出来的


```js
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook, 
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require("tapable");
```


#### 事件钩子
事件钩子其实就是类似 MVVM 框架的生命周期函数，在特定阶段能做特殊的逻辑处理。了解一些常见的事件钩子是写 webpack 插件的前置条件，下面列举些常见的事件钩子以及作用：
| 钩子            | 作用                       | 参数              | 类型  |
| --------------- | -------------------------- | ----------------- | ----- |
| after-plugins   | 设置完一组初始化插件之后   | compiler          | sync  |
| after-resolvers | 设置完 resolvers 之后      | compiler          | sync  |
| run             | 在读取记录之前             | compiler          | async |
| compile         | 在创建新 compilation 之前  | compilationParams | sync  |
| compilation     | compilation 创建完成       | compilation       | sync  |
| emit            | 在生成资源并输出到目录之前 | compilation       | async |
| after-emit      | 在生成资源并输出到目录之后 | compilation       | async |
| done            | 完成编译                   | stats             | sync  |

#### 插件流程浅析
拿 emit 钩子为例，下面分析下插件调用源码：

```js
compiler.plugin('emit', (compilation, callback) => {
  // 在生成资源并输出到目录之前完成某些逻辑
})
```

#### demo
es6:
```js
class AnalyzeWebpackPlugin {
  constructor(opts = { filename: 'analyze.html' }) {
    this.opts = opts
  }

  apply(compiler) {
    const self = this
    compiler.plugin("emit", function (compilation, callback) {
      let stats = compilation.getStats().toJson({ chunkModules: true }) // 获取各个模块的状态
      let stringifiedStats = JSON.stringify(stats)
      // 服务端渲染
      let html = `<!doctype html>
          <meta charset="UTF-8">
          <title>AnalyzeWebpackPlugin</title>
          <style>${cssString}</style>
          <div id="App"></div>
          <script>window.stats = ${stringifiedStats};</script>
          <script>${jsString}</script>
      `
      compilation.assets[`${self.opts.filename}`] = { // 生成文件路径
        source: () => html,
        size: () => html.length
      }
      callback()
    })
  }
}
```

es5:
```js
//  定义
function HelloWorldPlugin(options) {
  // Setup the plugin instance with options...
}

HelloWorldPlugin.prototype.apply = function(compiler) {
  compiler.plugin('done', function() {
    console.log('Hello World!'); 
  });
};

module.exports = HelloWorldPlugin;

// 使用  
var HelloWorldPlugin = require('hello-world');

var webpackConfig = {
  // ... config settings here ...
  plugins: [
    new HelloWorldPlugin({options: true})
  ]
};
```


### 引用
> [探寻 webpack 插件机制](https://www.cnblogs.com/MuYunyun/p/8875908.html)
> 


### webpack 3, 4 插件写法不同
https://react.ctolib.com/article/wiki/108661
webpack 3, 4 插件写法不同

```js
class BasicPlugin{
  // 在构造函数中获取用户给该插件传入的配置
  constructor(options){
  }
  // Webpack 会调用 BasicPlugin 实例的 apply 方法给插件实例传入 compiler 对象
  apply(compiler){
    const onEmit = (compilation, callback) => {
      callback()
    }
    // 检测是否是webpack4
    if (compiler.hooks) {
      // 注册emit事件的监听函数 webpack4
      compiler.hooks.emit.tapAsync(this.constructor.name, onEmit)
    } else {
      // 注册emit事件的监听函数 webpack3及之前
      compiler.plugin('emit', onEmit)
    }
  }
}
// 导出 Plugin
module.exports = BasicPlugin;
```

