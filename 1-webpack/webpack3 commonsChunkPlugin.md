
### [webpack3] CommonsChunkPlugin正确打开方式 
#### 参考
[用 webpack 实现持久化缓存](https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/#hash)

[基于webpack4[.3+]构建可预测的持久化缓存方案](https://segmentfault.com/a/1190000016355127)

[CommonsChunkPlugin](https://webpack.docschina.org/plugins/commons-chunk-plugin/)

[详解CommonsChunkPlugin的配置和用法](https://segmentfault.com/a/1190000012828879)

[CommonsChunkPlugin正确打开方式](https://cnodejs.org/topic/58396960c71e606e36aed1db)

[webpack代码分割技巧](http://foio.github.io/wepack-code-spliting/)

#### 基础配置
```json
{
  name: string, // or
  names: string[],
  // 这是 common chunk 的名称。已经存在的 chunk 可以通过传入一个已存在的 chunk 名称而被选择。
  // 如果一个字符串数组被传入，这相当于插件针对每个 chunk 名被多次调用
  // 如果该选项被忽略，同时 `options.async` 或者 `options.children` 被设置，所有的 chunk 都会被使用，
  // 否则 `options.filename` 会用于作为 chunk 名。
  // When using `options.async` to create common chunks from other async chunks you must specify an entry-point
  // chunk name here instead of omitting the `option.name`.

  filename: string,
  // common chunk 的文件名模板。可以包含与 `output.filename` 相同的占位符。
  // 如果被忽略，原本的文件名不会被修改(通常是 `output.filename` 或者 `output.chunkFilename`)。
  // This option is not permitted if you're using `options.async` as well, see below for more details.

  minChunks: number|Infinity|function(module, count) => boolean,
  // 在传入  公共chunk(commons chunk) 之前所需要包含的最少数量的 chunks 。
  // 数量必须大于等于2，或者少于等于 chunks的数量
  // 传入 `Infinity` 会马上生成 公共chunk，但里面没有模块。
  // 你可以传入一个 `function` ，以添加定制的逻辑（默认是 chunk 的数量）

  chunks: string[],
  // 通过 chunk name 去选择 chunks 的来源。chunk 必须是  公共chunk 的子模块。
  // 如果被忽略，所有的，所有的 入口chunk (entry chunk) 都会被选择。c

  children: boolean,
  // 如果设置为 `true`，所有公共 chunk 的子模块都会被选择

  deepChildren: boolean,
  // 如果设置为 `true`，所有公共 chunk 的后代模块都会被选择

  async: boolean|string,
  // 如果设置为 `true`，一个异步的  公共chunk 会作为 `options.name` 的子模块，和 `options.chunks` 的兄弟模块被创建。
  // 它会与 `options.chunks` 并行被加载。
  // Instead of using `option.filename`, it is possible to change the name of the output file by providing
  // the desired string here instead of `true`.

  minSize: number,
  // 在 公共chunk 被创建立之前，所有 公共模块 (common module) 的最少大小。
}
```

#### 1. 公共chunk 用于 入口chunk (entry chunk)
生成一个额外的 chunk 包含入口chunk 的公共模块。
```js
new webpack.optimize.CommonsChunkPlugin('common.js'), // 默认会把所有入口节点的公共代码提取出来,生成一个common.js
```
```js
new webpack.optimize.CommonsChunkPlugin({
  name: 'commons', // (公共 chunk(commnon chunk) 的名称)
  filename: 'commons.js', // (公共chunk 的文件名)  filename: '[name].[chunkhash].js' => commons.xxx.js
  // minChunks: 3, // (模块必须被3个 入口chunk 共享)
  // chunks: ["pageA", "pageB"], // (只使用这些 入口chunk)
});
```

你必须在 入口chunk 之前加载生成的这个 公共chunk:
```html
<script src="vendor.js" charset="utf-8"></script>
<script src="app.js" charset="utf-8"></script>
```

#### 2. 单独分离出第三方库、webpack运行文件  
1. 有选择的提取公共代码, 将代码拆分成公共代码和应用代码
```js
{
  entry: {
    app: './entry',
    vendor: ['jquery', 'other-lib'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', })
  ]
}
```

2. 再次打包后的vendor文件hash值改变了，为了解决这个问题,加入runtime:
```js
module.exports = {
	entry: {
		app: './app.js',
		vendor: ['react', 'react-dom', 'moment' /*等等其他的模块*/]
	},
	//其他配置
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({ names: ['vendor', 'runtime'] }) 
	]
}
```

或者:
```js
[
  new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor','runtime'],
      filename: '[name].js'
  }),
]
//  等价于
[
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].js'
  }),
  new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      filename: '[name].js',
      chunks: ['vendor']
  }),
]
```

打包后，会多出个runtime文件，但我们需要的vendor的hash值没有改变。 里面包含了 jsonp 方法的定义和其它 JS 的路径 mapping，因为你改了 app 会导致 runtime 里的路径改变，如果放在 vendor 中，会导致 vendor 无法长缓存。所以多出一个文件。

webpack中runtime和manifest主要用于管理所有模块的交互，主要是用于连接模块化应用程序的所有代码。

管理模块交互的流程： 
* 当编译器(compiler)开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 “Manifest”，当完成打包并发送到浏览器时，会在运行时通过 Manifest 来解析和加载模块。
* 无论你选择哪种模块语法，那些 import 或 require 语句现在都已经转换为 webpack_require 方法，此方法指向模块标识符(module identifier)。
* 通过使用 manifest 中的数据，runtime 将能够查询模块标识符，检索出背后对应的模块。

runtime包含：
* 功能:在模块交互时，连接模块所需的加载和解析逻辑，包括浏览器中已加载模块的连接以及懒加载模块的执行连接。
* 文件:webpackJsonp  __webpack_require__  异步 chunk 加载函数  对 ES6 Modules 的默认导出（export default）做处理 

#### 单独分离出 第三方库、自定义公共模块、webpack运行文件
1. 第一种方法minChunks设为Infinity，修改webpack配置文件如下：
```js
{
  entry: {
      first: './src/first.js',
      second: './src/second.js',
      vendor: Object.keys(packagejson.dependencies)// 获取生产环境依赖的库
  },
  output: {
      path: path.resolve(__dirname,'./dist'),
      filename: '[name].js'
  },
  plugins:[
      new webpack.optimize.CommonsChunkPlugin({
          name: ['vendor','runtime'],
          filename: '[name].js',
          minChunks: Infinity // Infinity：只有当入口文件（entry chunks） >= 3 才生效，用来在第三方库中分离自定义的公共模块
      }),
      new webpack.optimize.CommonsChunkPlugin({
          name: 'common',
          filename: '[name].js',
          chunks: ['first','second']// 从first.js和second.js中抽取commons chunk
      }),
  ]
}
```

2. 第二种方法把它们分离开来，就是利用minChunks作为函数的时候，说一下minChunks作为函数两个参数的含义： 
* module：当前chunk及其包含的模块
* count：当前chunk及其包含的模块被引用的次数
```js
{
  entry: {
      first: './src/first.js',
      second: './src/second.js',
      //vendor: Object.keys(packagejson.dependencies)//获取生产环境依赖的库
  },
  output: {
      path: path.resolve(__dirname,'./dist'),
      filename: '[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: '[name].js',
        minChunks: function (module,count) {
            console.log(module.resource,`引用次数${count}`);
            //"有正在处理文件" + "这个文件是 .js 后缀" + "这个文件是在 node_modules 中"
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(path.join(__dirname, './node_modules')) === 0
            )
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime',
        filename: '[name].js',
        chunks: ['vendor']
    }),
  ]
}
```

#### 将公共模块打包进父 chunk 
使用代码拆分功能，一个 chunk 的多个子 chunk 会有公共的依赖。为了防止重复，可以将这些公共模块移入父 chunk。这会减少总体的大小，但会对首次加载时间产生不良影响。如果预期到用户需要下载许多兄弟 chunks（例如，入口 trunk 的子 chunk），那这对改善加载时间将非常有用。
```js
new webpack.optimize.CommonsChunkPlugin({
  // names: ["app", "subPageA"] // (选择 chunks，或者忽略该项设置以选择全部 chunks)
  children: true, // (选择所有被选 chunks 的子 chunks)
  // minChunks: 3, // (在提取之前需要至少三个子 chunk 共享这个模块)
});
```


### 缓存之稳定 moduleid chunckid
[用 webpack 实现持久化缓存](https://sebastianblade.com/using-webpack-to-achieve-long-term-cache/#webpack)

[基于 webpack 的持久化缓存方案](https://github.com/pigcan/blog/issues/9)
* 对脚本文件应用 [chunkhash] 对 extractTextPlugin 应用的的文件应用 [contenthash]；
* 使用 CommonsChunkPlugin 合理抽出公共库 vendor（包含社区工具库这些 如 lodash）, 如果必要也可以抽取业务公共库 common(公共部分的业务逻辑)，以及 webpack的 runtime；
* 在开发环境下使用 NamedModulesPlugin 来固化 module id，在生产环境下使用 HashedModuleIdsPlugin 来固化 module id
* 使用 NamedChunksPlugin 来固化 runtime 内以及在使用动态加载时分离出的 chunk 的 chunk id。

[详解多页应用 Webpack4 配置优化与踩坑记录](https://www.jb51.net/article/148946.htm)
#### 如何生成稳定ModuleId

稍微了解过 webpack 运行机制的同学会知道，项目工程中加载的 module，webpack 会为其分配一个 moduleId，映射对应的模块。且该标识会出现在构建之后的代码中

模块的 ID 是 webpack 根据依赖的收集顺序递增的正整数，这种 ID 分配方式不太稳定，因为修改一个被依赖较多的模块，依赖这个模块的 chunks 内容均会跟着模块的新 ID 一起改变，但实际上我们只想让用户下载有真正改动的 chunk，而不是所有依赖这个新模块的 chunk 都重新更新。

一旦工程中模块有增删或者顺序变化，moduleId 就会发生变化，进而可能影响所有 chunk 的 content hash 值。只是因为 moduleId 变化就导致缓存失效，这肯定不是我们想要的结果。

在 webpack4 以前，通过[ NamedModulesPlugin | HashedModuleIdsPlugin ]插件，我们可以将模块的路径映射成 hash 值，来替代 moduleId，因为模块路径是基本不变的，故而 hash 值也基本不变。

1. NamedModulesPlugin 
    这个模块可以将依赖模块的正整数 ID 替换为相对路径（如：将 4 替换为 ./node_modules/es6-promise/dist/es6-promise.js）。
    
2. HashedModuleIdsPlugin 
    这是 NamedModulesPlugin 的进阶模块，它在其基础上对模块路径进行 MD5 摘要，不仅可以实现持久化缓存，同时还避免了它引起的两个问题（文件增大，路径泄露）。用 HashedModuleIdsPlugin 可以轻松地实现 chunkhash 的稳定化！

3. NamedModulesPlugin 适合在开发环境，而在生产环境下请使用 HashedModuleIdsPlugin。

**但在 webpack4 中，只需要optimization的配置项中设置 moduleIds 为 hashed 即可。**

样例问题:
* 只修改了 home/index.js 的代码，但在最终的构建结果中，vendor.js 的文件指纹也被修改了

原因有两个:
* webpack runtime (运行时) 中包含 chunks ID 及其对应 chunkhash 的对象，但 runtime 被集成到 vendor.js 中。
* entry 内容修改后，由于 webpack 的依赖收集规则导致构建产生的 entry chunk 对应的 ID 发生变化，webpack runtime 也因此被改变。

解决办法:
* 使用 CommonsChunkPlugin 继续将webpack runtime抽离出来
* 使用HashedModuleIdsPlugin代替原有的ModuleId根据依赖的收集顺序递增的正整数生成规则。

#### 如何生成稳定的ChunkId 
除了 moduleId，我们知道分离出的 chunk 也有其 chunkId。同样的，chunkId 也有因其 chunkId 发生变化而导致缓存失效的问题。由于manifest与打出的 chunk 包中有chunkId相关数据，所以一旦如“增删页面”这样的操作导致 chunkId 发生变化，可能会影响很多的 chunk 缓存失效。

Webpack是根据模块的顺序递增chunkid，源代码中的applyChunkIds函数,所以官方有提供NamedChunksPlugin插件来根据文件名来稳定你的chunkid

webpackJsonp有三个参数，每次有新的entry加入说明资源数增加了，Chunk数量也会跟着增加。ChunkId也会递增

在生产环境中的Webpack配置添加plugin: NamedChunksPlugin
```js
// 使用模块名称作为chunkid,替换掉原本的使用递增id来作为chunkid导致的[新增entry模块,其他模块的hash发生抖动,导致客户端长效缓存失效 !!!
new webpack.NamedChunksPlugin((chunk) => {
  // 解决异步模块打包的问题
  if (chunk.name) {
    return chunk.name;
  }
  return chunk.modules.map(m => path.relative(m.context, m.request)).join("_");
})
```

在 webpack4 以前，通过增加NamedChunksPlugin，使用 chunkName 来替换 chunkId，实现固化 chunkId，保持缓存的能力。在 webpack4 中，只需在optimization的配置项中设置 namedChunks 为 true 即可。

### [webpack4] optimization.splitChunks optimization.runtimeChunk
https://www.jb51.net/article/148946.htm