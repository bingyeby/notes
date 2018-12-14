### 相关文章
[webpack之前端性能优化（史上最全，不断更新中。。。）](http://www.cnblogs.com/ssh-007/p/7944491.html)

[webpack代码分割技巧](http://foio.github.io/wepack-code-spliting/)

[webpack学习笔记—优化缓存、合并、懒加载等](https://www.cnblogs.com/yangmin01/p/6290595.html)

[用 webpack 实现持久化缓存](https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/#hash)

[通过DllPlugin DllReferencePlugin 实现依赖包分开打包并注入到代码中](https://www.jianshu.com/p/862c56479456)

[Webpack 性能优化 （一）（使用别名做重定向）](http://www.ituring.com.cn/article/200534)



### webpack核心概念
Manifest  模板热替换  代码分离（code splitting）模板(Modules)

  3.代码分离（code splitting）

  代码分离是将代码分离到不同的bundle中，能够按需加载或者并行加载这些文件。代码分离可以获取更小的bundle,以及控制资源加载优先级，可影响加载时间 
  三种代码分离方法： 
  （1）入口起点：使用entry选项自动分离代码； 
  （2）防止重复：使用commonChunkPlugin去重和分离chunk 
  （3）动态导入：通过模块的内联函数调用来分离代码。


    webpack配置时的一些概念
    Entry
    入口文件是webpack建立依赖图的起点。

    Output
    Output配置告诉webpack怎么处理打包的代码。

    Hot Module Replacement
    热模块替换功能可以在不刷新所有文件的情况下实现单独跟新某个模块。

    Tree Shaking
    去除无用代码，比如某个js文件里的函数并没有被使用，这段函数代码在打包时将会被去掉。

    Code Splitting
    代码拆分，实现的方式有三种

    Entry Points 手动把代码分成多个入口
    Prevent Duplication 使用插件CommonsChunkPlugin提取公共代码块
    Dynamic Imports 用import函数动态动引入模块
    Lazy Loading
    懒加载或者按需加载，属于Code Splitting的一部分

    Loaders
    webpack把所有文件都当成模块对待，但是它只理解Javascript。Loaders把这些webpack不认识的文件转化成模块，以便webpack进行处理。

    plugins
    插件一般用来处理打包模块的编译或代码块相关的工作。

    The Manifest
    webpack manifest文件用来引导所有模块的交互。manifest文件包含了加载和处理模块的逻辑。
    当webpack编译器处理和映射应用代码时，它把模块的详细的信息都记录到了manifest文件中。当模块被打包并运输到浏览器上时，runtime就会根据manifest文件来处理和加载模块。利用manifest就知道从哪里去获取模块代码。

### url loader
为url-loader添加name配置可以使打包后的文件保持原有的格式：

![添加name](../images/urlloader1.png)

```
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path][name].[ext]',// [hash].[ext]
          },
        }],
      },
```

url-loader中单独配置cdn：
```
{
  test:/\.(png|jpe?g|gif)(\?.*)/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 8192,
      name: utils.assetsPath('img/[name].[hash:7].[ext]'),
      publicPath: 'http://baidu.com/',
    },
  }],
}
```

url-loader不能检测到js中的background，所以我们凡是在js中引用的地址，必须在外面先import这张图片，url-loader才会解析并打包

### 自定义一个全局变量 window层级
webpack配置：
```javascript
  // 添加别名设置
  merge(webpackConfig, {
    resolve: {
      alias: {
        src: path.resolve(__dirname, './src'),
        color: path.resolve(__dirname, './src/color'),
      },
    },
  })

  webpackConfig.plugins.push(new webpack.ProvidePlugin({
    color: 'color',
  })

  new webpack.ProvidePlugin({
    color: 'color',
  })
```

color.js代码：
```javascript
module.exports = {
  red: '#090909'
}
```

使用：
```js
let corlorRed = color['red']
```

### webpack打包体积优化，详细分布查看插件 webpack-bundle-analyzer
安装：

```
npm install --save-dev webpack-bundle-analyzer
```

配置：在 项目的 package.json 文件中注入如下命令，以方便运行她(npm run analyz)，默认会打开http://127.0.0.1:8888作为展示。
```
    "analyz": "NODE_ENV=production npm_config_report=true npm run build",
```

使用：
```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


  plugins: [
    new BundleAnalyzerPlugin({
      //  可以是`server`，`static`或`disabled`。
      //  在`server`模式下，分析器将启动HTTP服务器来显示软件包报告。
      //  在“静态”模式下，会生成带有报告的单个HTML文件。
      //  在`disabled`模式下，你可以使用这个插件来将`generateStatsFile`设置为`true`来生成Webpack Stats JSON文件。
      analyzerMode: 'server',
      //  将在“服务器”模式下使用的主机启动HTTP服务器。
      analyzerHost: '127.0.0.1',
      //  将在“服务器”模式下使用的端口启动HTTP服务器。
      analyzerPort: 8888, 
      //  路径捆绑，将在`static`模式下生成的报告文件。
      //  相对于捆绑输出目录。
      reportFilename: 'report.html',
      //  模块大小默认显示在报告中。
      //  应该是`stat`，`parsed`或者`gzip`中的一个。
      //  有关更多信息，请参见“定义”一节。
      defaultSizes: 'parsed',
      //  在默认浏览器中自动打开报告
      openAnalyzer: true,
      //  如果为true，则Webpack Stats JSON文件将在bundle输出目录中生成
      generateStatsFile: false, 
      //  如果`generateStatsFile`为`true`，将会生成Webpack Stats JSON文件的名字。
      //  相对于捆绑输出目录。
      statsFilename: 'stats.json',
      //  stats.toJson（）方法的选项。
      //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
      //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      logLevel: 'info' //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
    }),
  ],

```

效果：

![](../images/2018-12-08-15-34-09.png)


### CommonsChunkPlugin正确打开方式
[CommonsChunkPlugin正确打开方式](https://cnodejs.org/topic/58396960c71e606e36aed1db)

再次打包后的vendor文件hash值改变了，为了解决这个问题:

```js
module.exports = {
	entry: {
		app: './app.js',
		vendor: ['react', 'react-dom', 'moment' /*等等其他的模块*/]
	},
	//其他配置
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor', 'manifest']
        })
	]
}
```

```js
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({name: 'vendor'}),
    new webpack.optimize.CommonsChunkPlugin({name: 'mainifest', chunks: ['vendor']})
  ]
```

打包后，会多出个mainfest文件，但我们需要的vendor的hash值没有改变。
manifest 是 webpack 的 runtime，里面包含了 jsonp 方法的定义和其它 JS 的路径 mapping，因为你改了 app 会导致 runtime 里的路径改变，如果放在 vendor 中，会导致 vendor 无法长缓存。所以多出一个文件。


**Manifest**

webpack中runtime和manifest主要用于管理所有模块的交互，主要是用于连接模块化应用程序的所有代 码。

管理模块交互的流程： 

当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 “Manifest”，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 webpack_require 方法，此方法指向模块标识符(module identifier)。通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。

runtime包含：在模块交互时，连接模块所需的加载和解析逻辑，包括浏览器中已加载模块的连接以及懒加载模块的执行连接。




### resolve.alias 与 module.noParse 的组合
#### 在 Webpack 中使用别名
别名（resolve.alias） 是 Webpack 的一个配置项，它的作用是把用户的一个请求重定向到另一个路径，例如通过修改 webpack.config.js配置文件，加入：

```js
  resolve: {
    alias: {
        moment: "moment/min/moment-with-locales.min.js"
    }
  }
```

这样待打包的脚本中的 require('moment'); 其实就等价于 require('moment/min/moment-with-locales.min.js'); 。通过别名的使用在本例中可以减少几乎一半的时间。

#### 在 Webpack中忽略对已知文件的解析
module.noParse 是 webpack 的另一个很有用的配置项，如果你 确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖。

```js
  module: {
    noParse: [/moment-with-locales/]
  }
```

这样修改，再结合前面重命名的例子，更新后的流程是：
* webpack 检查到 entry.js 文件对 moment的请求；
* 请求被 alias 重定向，转而请求 moment/min/moment-with-locales.min.js；
* noParse 规则中的 /moment-with-locales/一条生效，所以 webpack 就直接把依赖打包进了 bundle.js 。

#### 组合写法

```js
  module: {
    noParse: [path.resolve(node_modules, 'swiper/dist/js/swiper.min.js')],
  },

  resolve: {
    alias: {
      swiper$: path.resolve(node_modules, 'swiper/dist/js/swiper.min.js'),// 开启精准模式(import swiperStyle from 'swiper/dist/css/swiper.min.css')不匹配
    },
  },
```

```js
var webpack = require("webpack");
var path = require('path');
var node_modules = path.resolve(__dirname, 'node_modules');
var pathToReact = path.resolve(node_modules, 'react/dist/react.min.js');
var pathToReactDOM = path.resolve(node_modules, 'react-dom/dist/react-dom.min.js');
...
var HtmlWebpackPlugin = require('html-webpack-plugin');

var deps = [
    'react/dist/react.min.js',
    'react-dom/dist/react-dom.min.js'
];
var config = {
    ...
    resolve:{
        alias:{},
        fallback:path.join(__dirname, "node_modules")
    },
    ...
    module:{
         ...
         noParse:[]   
     }    
}
/*当加载多个压缩文件时，下述方法更优雅简便*/
deps.forEach(function(dep){    
    var depPath = path.resolve(node_modules, dep);
    //path.dep是路径分隔符。
    config.resolve.alias[dep.split(path.dep)[0]] = depPath;    
    config.module.noParse.push(depPath);

});

module.exports = config;
```

### 异步加载 import() 使用方式
```js
    import(/* webpackChunkName: "swiper" */ 'swiper/dist/css/swiper.min.css')
    import(/* webpackChunkName: "swiper" */ 'swiper').then(Swiper => {
      var swiper = new Swiper('.swiper-container', {
        slidesPerView: 3,
        spaceBetween: 30,
        freeMode: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    })
```