
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
* 独立的 JS 模块，暴露相应的函数
* 函数原型上的 apply 方法会注入 compiler 对象
* compiler 对象上挂载了相应的 webpack 事件钩子
* 事件钩子的回调函数里能拿到编译后的 compilation 对象，如果是异步钩子还能拿到相应的 callback

```js
function MyPlugin(options) {}
// 2.函数原型上的 apply 方法会注入 compiler 对象
MyPlugin.prototype.apply = function(compiler) {
  // 3.compiler 对象上挂载了相应的 webpack 事件钩子 4.事件钩子的回调函数里能拿到编译后的 compilation 对象
  compiler.plugin('emit', (compilation, callback) => {
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

#### compiler 对象
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

一个编译对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。

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

#### tapable 库
再介绍完 compiler 对象和 compilation 对象后，不得不提的是 tapable 这个库，这个库暴露了所有和事件相关的 pub/sub 的方法。而且函数 Compiler 以及函数 Compilation 都继承自 Tapable。

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


