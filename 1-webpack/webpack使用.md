### 相关文章
    http://www.cnblogs.com/ssh-007/p/7944491.html
    webpack之前端性能优化(史上最全，不断更新中。。。

    http://foio.github.io/wepack-code-spliting/
    webpack代码分割技巧

    https://www.cnblogs.com/yangmin01/p/6290595.html
    webpack学习笔记—优化缓存、合并、懒加载等

    https://www.cnblogs.com/QH-Jimmy/category/1129698.html
    随笔分类 - webpack源码系列

    https://juejin.im/post/5bd2d2315188252734475575
    webpack 插件总结归类

    https://www.qdfuns.com/article/51786/4fdd5cef4dde185a82b551c6a7471f24.html
    webpack常用优化配置

    https://www.jeffjade.com/2017/08/06/124-webpack-packge-optimization-for-volume/
    Webpack 打包优化之体积篇

### 小点
    https://www.jianshu.com/p/862c56479456
    通过DllPlugin DllReferencePlugin 实现依赖包分开打包并注入到代码中

    https://segmentfault.com/a/1190000012828879
    详解CommonsChunkPlugin的配置和用法
    CommonsChunkPlugin 已经从 webpack v4 legato 中移除 想要了解在最新版本中如何处理 chunk，请查看 SplitChunksPlugin。

    http://www.ituring.com.cn/article/200534
    Webpack 性能优化 (一)(使用别名做重定向) 
    别名 - noparse - external
    resolve: {
        alias: {
            moment: "moment/min/moment-with-locales.min.js"
        }
    }



### webpack核心概念
Manifest  模板热替换  代码分离(code splitting) 模板(Modules)

  3.代码分离(code splitting)

  代码分离是将代码分离到不同的bundle中，能够按需加载或者并行加载这些文件。代码分离可以获取更小的bundle,以及控制资源加载优先级，可影响加载时间 
  三种代码分离方法： 
  (1)入口起点：使用entry选项自动分离代码； 
  (2)防止重复：使用commonChunkPlugin去重和分离chunk 
  (3)动态导入：通过模块的内联函数调用来分离代码。


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
        Entry Points 手动把代码分成多个入口
        Prevent Duplication 使用插件CommonsChunkPlugin提取公共代码块
        Dynamic Imports 用import函数动态动引入模块 (懒加载或者按需加载，属于Code Splitting的一部分)
        
    Loaders
        webpack把所有文件都当成模块对待，但是它只理解Javascript。Loaders把这些webpack不认识的文件转化成模块，以便webpack进行处理。

    plugins
        插件一般用来处理打包模块的编译或代码块相关的工作。

    The Manifest
        webpack manifest文件用来引导所有模块的交互。
        manifest文件包含了加载和处理模块的逻辑。 当webpack编译器处理和映射应用代码时，它把模块的详细的信息都记录到了manifest文件中。
        当模块被打包并运输到浏览器上时，runtime就会根据manifest文件来处理和加载模块。利用manifest就知道从哪里去获取模块代码。


### url-loader的一个使用技巧
为url-loader添加name配置可以使打包后的文件保持原有的格式：

![添加name](../images/urlloader1.png)

```js
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
```js
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

### html-webpack-plugin 
    插件是用于编译 Webpack 项目中的 html 类型的文件
    http://www.luyixian.cn/javascript_show_164940.aspx


### ParallelUglifyPlugin
    http://www.h5w3.com/?p=997
    使用 ParallelUglifyPlugin提高webpack打包速度

```js
const path = require('path');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = {
  plugins: [
    // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
    new ParallelUglifyPlugin({
      // 传递给 UglifyJS 的参数
      uglifyJS: {
        output: {
          // 最紧凑的输出
          beautify: false,
          // 删除所有的注释
          comments: false,
        },
        compress: {
          // 在UglifyJs删除没有用到的代码时不输出警告
          warnings: false,
          // 删除所有的 `console` 语句，可以兼容ie浏览器
          drop_console: true,
          // 内嵌定义了但是只用到一次的变量
          collapse_vars: true,
          // 提取出出现多次但是没有定义成变量去引用的静态值
          reduce_vars: true,
        }
      },
    }),
  ],
};
```

### ProvidePlugin 自定义一个全局变量 window层级
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

### webpack-bundle-analyzer webpack打包体积优化，详细分布查看插件
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
      //  stats.toJson()方法的选项。
      //  例如，您可以使用`source：false`选项排除统计文件中模块的来源。
      //  在这里查看更多选项：https：  //github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
      statsOptions: null,
      logLevel: 'info' //日志级别。可以是'信息'，'警告'，'错误'或'沉默'。
    }),
  ],

```

效果：

![](../images/2018-12-08-15-34-09.png)

### 使用DllPlugin和DllReferencePlugin分割代码
将常用的库文件打包到dll包中，然后在webpack配置中引用。业务代码的可以像往常一样使用require引入依赖模块，比如require('react'), webpack打包业务代码时会首先查找该模块是否已经包含在dll中了，只有dll中没有该模块时，webpack才将其打包到业务chunk中。

首先我们使用DllPlugin将常用的库打包在一起：
```js
var webpack = require('webpack');
module.exports = {
  entry: {
    vendor: ['lodash','react'],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: 'build/',
  },
  plugins: [new webpack.DllPlugin({
    name: '[name]_lib',
    path: './[name]-manifest.json',
  })]
};
```

该配置会产生两个文件，模块库文件：vender.[chunkhash].js和模块映射文件：vender-menifest.json。其中vender-menifest.json标明了模块路径和模块ID（由webpack产生）的映射关系

在业务代码的webpack配置文件中使用DllReferencePlugin插件引用模块映射文件：vender-menifest.json后，我们可以正常的通过require引入依赖的模块，如果在vender-menifest.json中找到依赖模块的路径映射信息，webpack会直接使用dll包中的该依赖模块，否则将该依赖模块打包到业务chunk中。

```js
var webpack = require('webpack');
module.exports = {
  entry: {
    app: ['./app'],
  },
  output: {
    filename: '[name].[chunkhash].js',
    path: 'build/',
  },
  plugins: [
    new webpack.DllReferencePlugin({ context: '.', manifest: require('./vendor-manifest.json'), })
  ]
};
```

由于依赖的模块都在dll包中，所以例子中app打包后的chunk很小。

相比于CommonChunkPlugin，使用DllReferencePlugin分割代码有两个明显的好处：
* 由于dll包和业务chunk包是分开进行打包的，每一次修改代码时只需要对业务chunk重新打包，webpack的编译速度得到极大的提升，因此相比于CommonChunkPlugin，DllPlugin进行代码分割可以显著的提升开发效率。
* 使用DllPlugin进行代码分割，dll包和业务chunk相互独立，其chunkhash互不影响，dll包很少变动，因此可以更充分的利用浏览器的缓存系统。而使用CommonChunk打包出的代码，由于公有chunk中包含了webpack的runtime(运行时)，公有chunk和业务chunk的chunkhash会互相影响，必须将runtime单独提取出来，才能对公有chunk充分地使用浏览器的缓存。

## loader
### react-hot-loader
    当应用程序足够短小、状态少、入口单一的时候， 使用webpack-dev-server 中默认的hot 服务器就够了。
    但是随着应用程序越来越庞大，状态越来越多的时候，这个时候就要使用react-hot-loader了
    react-hot-loader 是对 webpack 的热加载进行了改进，支持 react 组件状态不丢失。

    https://blog.csdn.net/chiuwingyan/article/details/80803303
    https://www.html.cn/doc/webpack2/guides/hmr-react/
    Hot-Module-Replacement react-hot-loader


### svg-sprite-loader
    手摸手，带你优雅的使用 icon
    https://juejin.im/post/59bb864b5188257e7a427c09


### 如何使用expose-loader 解决第三方库的插件依赖问题
    https://blog.csdn.net/lizixiang1993/article/details/52193724


## 总结

### resolve.alias 与 module.noParse 的组合
#### 在 Webpack 中使用别名
别名(resolve.alias) 是 Webpack 的一个配置项，它的作用是把用户的一个请求重定向到另一个路径，例如通过修改 webpack.config.js配置文件，加入：

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

### chunkhash contenthash
* hash 是 build-specific ，即每次编译都不同——适用于开发阶段
* chunkhash 是 chunk-specific, 是根据每个 chunk 的内容计算出的 hash, 适用于生产
* contenthash:extract-text-plugin 为抽离出来的内容提供了 contenthash 即： new ExtractTextPlugin('[name]-[contenthash].css')

建议
* 在生产环境，要把文件名改成'[name].[chunkhash]'，最大限度的利用浏览器缓存。
* 不要在开发环境使用 [chunkhash]/[hash]/[contenthash]，因为不需要在开发环境做持久缓存，而且这样会增加编译时间，开发环境用 [name] 就可以了。

### require.context()
可以使用require.context（）函数创建自己的上下文。 它允许您传入一个目录进行搜索，一个标志指示是否应该搜索子目录，还有一个正则表达式来匹配文件。

```js
let contexts = require.context('.', false, /\.vue$/)  
contexts.keys().forEach(component => {
  let componentEntity = contexts(component).default
  // 使用内置的组件名称 进行全局组件注册
  Vue.component(componentEntity.name, componentEntity)
})
```

### babel-plugin-import 插件 的使用
babel-plugin-import   是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式
```bash
# 安装 babel-plugin-import 插件
npm i babel-plugin-import -D
```
```js
// 在 .babelrc 或 babel-loader 中添加插件配置
// 注意：webpack 1 无需设置 libraryDirectory
{
  "plugins": [
    ["import", {
      "libraryName": "vant",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}
```

### plugin
    用于修改行为
        define-plugin：定义环境变量，在4-7区分环境中有介绍。
        context-replacement-plugin：修改 require 语句在寻找文件时的默认行为。
        ignore-plugin：用于忽略部分文件。

        provide-plugin：从环境中提供的全局变量中加载模块，而不用导入对应的文件。
        web-webpack-plugin：方便的为单页应用输出 HTML，比 html-webpack-plugin 好用。

    用于优化
        commons-chunk-plugin：提取公共代码 
        extract-text-webpack-plugin：提取 JavaScript 中的 CSS 代码到单独的文件中 

        prepack-webpack-plugin：通过 Facebook 的 Prepack 优化输出的 JavaScript 代码性能 
        uglifyjs-webpack-plugin：通过 UglifyES 压缩 ES6 代码 
        dll-plugin：借鉴 DDL 的思想大幅度提升构建速度，在4-2使用 DllPlugin中有介绍。

        webpack-parallel-uglify-plugin：多进程执行 UglifyJS 代码压缩，提升构建速度。

        imagemin-webpack-plugin：压缩图片文件。
        webpack-spritesmith：用插件制作雪碧图。
        ModuleConcatenationPlugin：开启 Webpack Scope Hoisting 功能，在4-14开启 ScopeHoisting中有介绍。
        
        hot-module-replacement-plugin：开启模块热替换功能。


    NpmInstallWebpackPlugin 
        automatically to install & save missing dependencies while you work!

    BabelMinifyWebpackPlugin
        一个用于babel-minify的 webpack 插件 - 基于 babel 的 minifier


    UglifyJsPlugin
        new webpack.optimize.UglifyJsPlugin()


    ProvidePlugin
        自动加载模块，而不必到处 import 或 require 。
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        });

    在生产版本的配置中添加这些插件：

    DefinePlugin 
        定义环境变量,创建一个在编译时可以配置的全局常量
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),

### plugin webpack4
    mini-css-extract-plugin
        如果当前项目是webpack3.x版本，使用extract-text-webpack-plugin；
        如果当前项目是webpack4.x版本（但已有extract-text-webpack-plugin配置），可以继续用extract-text-webpack-plugin，但必须用对应的beta版本，且这个beta版本不支持生成hash；
        如果当前项目是webpack4.x版本且是新项目，使用mini-css-extract-plugin。



### loader
    转换文件
        raw-loader：把文本文件的内容加载到代码中去，在 3-20加载SVG 中有介绍。
        file-loader：把文件输出到一个文件夹中，在代码中通过相对 URL 去引用输出的文件，在 3-19加载图片、3-20加载 SVG、4-9 CDN 加速 中有介绍。
        url-loader：和 file-loader 类似，但是能在文件很小的情况下以 base64 的方式把文件内容注入到代码中去，在 3-19加载图片、3-20加载 SVG 中有介绍。
        source-map-loader：加载额外的 Source Map 文件，以方便断点调试，在 3-21加载 Source Map 中有介绍。
        svg-inline-loader：把压缩后的 SVG 内容注入到代码中，在 3-20加载 SVG 中有介绍。
        node-loader：加载 Node.js 原生模块 .node 文件。
        image-loader：加载并且压缩图片文件。
        json-loader：加载 JSON 文件。
        yaml-loader：加载 YAML 文件。


    转换样式文件
        css-loader：加载 CSS，支持模块化、压缩、文件导入等特性。
        style-loader：把 CSS 代码注入到 JavaScript 中，通过 DOM 操作去加载 CSS。
        sass-loader：把 SCSS/SASS 代码转换成 CSS，在3-4使用 SCSS 语言中有介绍。
        postcss-loader：扩展 CSS 语法，使用下一代 CSS，在3-5使用 PostCSS中有介绍。
        less-loader：把 Less 代码转换成 CSS 代码。
        stylus-loader：把 Stylus 代码转换成 CSS 代码。