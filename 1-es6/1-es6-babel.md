# babel    
## 简介
babel是一个广泛使用的ES6转码器，可以将 ES6 代码转为 ES5 代码，从而在现有环境执行；

### babel的配置文件是.babelrc
    {
        "presets": [],
        "plugins": []
    }
    presets字段设定转码规则，官方提供以下的规则集 es2015 stage-0 stage-1 stage-2 stage-3 react
        # ES2015转码规则
        $ npm install --save-dev babel-preset-es2015
        # react转码规则
        $ npm install --save-dev babel-preset-react
        # ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
        $ npm install --save-dev babel-preset-stage-0
        $ npm install --save-dev babel-preset-stage-1
        $ npm install --save-dev babel-preset-stage-2
        $ npm install --save-dev babel-preset-stage-3

### babel-cli：
    # 转码结果输出到标准输出
    $ babel example.js

    # 转码结果写入一个文件
    # --out-file 或 -o 参数指定输出文件
    $ babel example.js --out-file compiled.js
    # 或者
    $ babel example.js -o compiled.js

    # 整个目录转码
    # --out-dir 或 -d 参数指定输出目录
    $ babel src --out-dir lib
    # 或者
    $ babel src -d lib

    # -s 参数生成source map文件
    $ babel src -d lib -s

### babel-polyfill:
Babel 默认只转换新的 JavaScript 句法（如箭头函数），而不转换新的 API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign String.padStart Array.from）都不会转码。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。
```
$ npm install --save babel-polyfill
```

使用它时需要在你应用程序的入口点顶部或打包配置中引入。

### ESLint：
    用于静态检查代码的语法和风格，安装命令如下。 
        安装
            $ npm install --save-dev eslint babel-eslint
        然后，在项目根目录下，新建一个配置文件.eslintrc，在其中加入parser字段。
            {
                "parser": "babel-eslint",
                "rules": {
                    ...
                }
            }
        再在package.json之中，加入相应的scripts脚本。
            {
                "name": "my-module",
                "scripts": {
                    "lint": "eslint my-files.js"
                },
                "devDependencies": {
                    "babel-eslint": "...",
                    "eslint": "..."
                }
            }

### www
    如何写好.babelrc：Babel的presets和plugins配置解析
    https://excaliburhan.com/post/babel-preset-and-plugins.html
    
    如何区分Babel中的stage-0,stage-1,stage-2以及stage-3（一）
    http://www.cnblogs.com/chris-oil/p/5717544.html

    babel从入门到入门
    http://www.cnblogs.com/gg1234/p/7168750.html

## presets plugins
代码转换以插件的形式出现，插件是小型 JavaScript 程序，它指示 Babel 如何对代码进行转换。你甚至可以编写自己的插件来应用你想要的任何代码转换。

* 要将ES2015+ 语法转换为 ES5，我们可以依赖官方插件，如 @babel/plugin-transform-arrow-functions:
```
npm install --save-dev @babel/plugin-transform-arrow-functions
./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
```
```
    { "plugins": ["@babel/plugin-transform-arrow-functions"] }
```

* 如果想要转换代码中还有其他 ES2015+ 功能。我们可以使用 "preset" 来代替预先设定的一组插件，而不是逐一添加我们想要的所有插件。
```
npm install --save-dev @babel/preset-env
./node_modules/.bin/babel src --out-dir lib --presets=@babel/env
```
```
    {
        "presets": ["@babel/preset-env"]
    }
```

A Babel preset is a shareable list of plugins,也就是一堆plugins的预设，起到方便的作用。如果你不采用presets，完全可以单独引入某个功能，比如以下的设置就会引入编译箭头函数的功能。

如果你的项目需要react或者flow这些语法的编译，请在presets里加入对应的值即可。


### plugins/presets排序
    plugins和presets编译，也许会有相同的功能，或者有联系的功能，按照怎么的顺序进行编译？答案是会按照一定的顺序。
    具体而言，plugins优先于presets进行编译。
        plugins正序进行编译。
        presets逆序进行编译。{presets:["es2015", "stage-0"]}


## babel转译器
为了便于说明，首先我们来定义两个概念。

* 转译插件，转译插件是用来转译单一功能的插件，比如transform-es2015-arrow-functions，这个插件只负责转译es2015新增的箭头函数。(plugins)

* 转译器，转译器是一系列转译插件的集合。比如babel-preset-es2015就包含了es2015新增语法的所有转译插件，比如包含transform-es2015-arrow-functions（es2015箭头函数转译插件）、transform-es2015-classes(es2015 class类转译插件)等。(presets)

js规范新增的每个语法都有对应的babel插件，因此babel插件众多。为了便于管理，会把某些插件集合在一起，构成一个转译器。要不然如果我们想转译es2015的语法就要安装一大堆插件了，有了转译器之后我们只需要安装一个转译器就可以了。babel的转译器根据用途的不同也分了不同给的类，这些类非常多，所以babel看起来很混乱。不过大体上babel的转译器分为3类。

* 语法转译器，这些转译器只负责转译js最新的语法，并不负责转译js新增的api和全局对象。这类转译器包括babel-preset-env、babel-preset-es2015、babel-preset-es2016、babel-preset-es2017、babel-preset-latest等，以后肯定还会有新的转译器加入，不过你只要理解转译器就是一堆转译插件的集合就可以了。

* 补丁转译器，这些转译器只负责转译js最新的api和全局对象。比如浏览器不支持String新增的String.padStart方法和Promise全局对象。通过babel-profill转译，我们可以通过其他代码来让浏览器实现类似String.padStart和Promise的功能。

* jsx和flow插件，这类转译器用来转译JSX语法和移除类型声明的，使用Rect的时候你将用到它，转译器名称为babel-preset-react

另外你可以对babel已有的转译器进行改造或者创建新的转译器。如何创建babel转译器可以点这里。
    
### 总结
因为自己对.babelrc文件的设置有点疑问，花了大半天撸了下官方的文档。很多内容是英文的，可能翻译并不准确，希望大家多多指教。
```json
{
	"presets": [
		"es2015",
		"stage-0"
	],
	"plugins": [
		"transform-runtime"
	]
}
```
    
## polyfill | runtime

    实例方法polyfill: babel-polyfill // "foobar".includes("foo")   // 添加到入口文件
    非实例方法的polyfill: babel-plugin-transform-runtime // Object.assign() 
    
	babel的polyfill和runtime的区别
    https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1

### babel-polyfill
    Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。

    babel-polyfill在应用中会模拟一个es2015+的环境，所以使用了babel-polyfill后可以使用内置对象如Promise和WeakMap，静态方法如Array.from和Object.assign，实例方法如Array.prototype.includes，以及generator函数（需要提供babel-plugin-transform-regenerator插件）。总的来说，polyfill修改了全局作用域，浏览器下是window，node下是global。

    babel-polyfill主要由两部分组成，core-js和regenerator runtime。
        core-js：提供了如ES5、ES6、ES7等规范中 中新定义的各种对象、方法的模拟实现。 
        regenerator：提供generator支持，如果应用代码中用到generator、async函数的话用到。

    引入babel-polyfill全量包后文件会变得非常大。

    问题：
        一开始只用了transform-runtime，后来发现有些es6的方法不能用，比如字符串的includes。
        后来又在入口文件加上babel-polyfill，能用了。

    解决：
        polyfill这个英文单词在js babel中的翻译可以说是垫片，本来指的是衣服中的填充物。
        在这里可以说是为了使用某个浏览器或者其他执行环境不支持的函数或者对象能够使用而添加的原型方法，或者第三方库。
        1.我们想要使用es2015的语法中的某些新的对象方法或者数据类型，就需要添加babel-polyfill，例如Array.from方法很多浏览器不支持，你就需要垫片来提高兼容性。
        2.为了在版本低浏览器中能够使用promise，我们需要提前执行一个promise文件，以便能够在全局中使用。
        3.官网是这么说的，那些需要修改内置api才能达成的功能，譬如：扩展String.prototype，给上面增加includes方法，就属于修改内置API的范畴。这类操作就由polyfill提供。

    提示：
        已使用ES2015的一些方法，不意味着你必须要使用babel-polyfill或者runtime plugin。你也许只是想要使用那些是需要用到的垫片(例如Object.assign)，或者那些运行环境不存在需要加载的垫片。
        

### babel-plugin-transform-runtime 统一管理辅助方法
babel-plugin-transform-runtime主要做了一下三件事：
* 当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator （使用 regenerator 运行时而不会污染当前环境） 。
* 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件（实现polyfill的功能且无全局污染，但是实例方法无法正常使用，如 “foobar”.includes(“foo”) ）。
* 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替（提取babel转换语法的代码）。

不需要额外的配置就是使用默认配置，这样就可以。所以babel-plugin-transform-runtime不会污染全局环境，一般用在webpack打包的node中。正是因为此，transform-runtime被广泛用于第三方库中。

安装babel-plugin-transform-runtime会默认安装babel-runtime（所有的帮助函数都在这个包中）。

#### 举例说明
Babel 转译后的代码要实现源代码同样的功能需要借助一些帮助函数，例如，{ [name]: 'JavaScript' } 转译后的代码如下所示：
    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
        } else {
            obj[key] = value;
        }
        return obj;
    }
    var obj = _defineProperty({}, 'name', 'JavaScript');

类似上面的帮助函数 _defineProperty 可能会重复出现在一些模块里，导致编译后的代码体积变大。Babel 为了解决这个问题，提供了单独的包 babel-runtime 供编译模块复用工具函数。

启用插件 babel-plugin-transform-runtime 后，Babel 就会使用 babel-runtime 下的工具函数，转译代码如下：
    'use strict';
    // 之前的 _defineProperty 函数已经作为公共模块 `babel-runtime/helpers/defineProperty` 使用
    var _defineProperty2 = require('babel-runtime/helpers/defineProperty');
    var _defineProperty3 = _interopRequireDefault(_defineProperty2);
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    var obj = (0, _defineProperty3.default)({}, 'name', 'JavaScript');

    不用这plugin的话，babel会为每一个转换后的文件（在webpack这就是每一个chunk了）都添加一些辅助的方法（仅在需要的情况下）；
    而如果用了这个plugin，babel会把这些辅助的方法都集中到一个文件里统一加载统一管理，算是一个减少冗余，增强性能的优化项吧，用不用也看自己需要了；
    如不用的话，前面也不需要安装babel-plugin-transform-runtime和babel-runtime了。

#### 配置
    {
        "plugins": ["transform-runtime", options]
    }
    主要有以下options选择。
        helpers: boolean，默认true 使用babel的helper函数。
        polyfill: boolean，默认true 使用babel的polyfill，但是不能完全取代babel-polyfill。
        regenerator: boolean，默认true 使用babel的regenerator。
        moduleName: string，默认babel-runtime 使用对应module处理。
        
    这里的options一般不用自己设置，用默认的即可。
#### 总结
    这个插件最大的作用主要有几下几点：
    1.解决编译中产生的重复的工具函数，减小代码体积
    2.非实例方法的poly-fill，如Object.assign，但是实例方法不支持，如"foobar".includes("foo")，这时候需要单独引入babel-polyfill

### babel-plugin-transform-runtime 自动引用 polyfill
    除此之外，babel 还为源代码的非实例方法（Object.assign）和 babel-runtime/helps 下的工具函数自动引用了 polyfill。这样可以避免污染全局命名空间，非常适合于 JavaScript 库和工具包的实现。
    例如 const obj = {}, Object.assign(obj, { age: 30 }); 转译后的代码如下所示：
        'use strict';
        // 使用了 core-js 提供的 assign
        var _assign = require('babel-runtime/core-js/object/assign');
        var _assign2 = _interopRequireDefault(_assign);
        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
        var obj = {};
        (0, _assign2.default)(obj, {
            age: 30
        });
        
### babel-runtime 为什么适合 JavaScript 库和工具包的实现？
    1.避免 babel 编译的工具函数在每个模块里重复出现，减小库和工具包的体积；
    2.在没有使用 babel-runtime 之前，库和工具包一般不会直接引入 polyfill。否则像 Promise 这样的全局对象会污染全局命名空间，这就要求库的使用者自己提供 polyfill。这些 polyfill 一般在库和工具的使用说明中会提到，比如很多库都会有要求提供 es5 的 polyfill。在使用 babel-runtime 后，库和工具只要在 package.json 中增加依赖 babel-runtime，交给 babel-runtime 去引入 polyfill 就行了；

###  babel-plugin-transform-runtime and babel-runtime
    疑问：像 antd@2.x 这样的库使用了 babel-runtime，在实际项目中使用 antd@2.x，我们需要引入 babel-polyfill。但全部 polyfill 打包压缩下来也有 80kb 左右，其中很多 polyfill 是没有用到的，如何减少体积呢？手工一个个引入使用到的 polyfill，似乎维护成本太高！

    NOTE - Production vs. development dependencies

    In most cases, you should install babel-plugin-transform-runtime as a development dependency (with --save-dev). and babel-runtime as a production dependency (with --save).

    npm install --save-dev babel-plugin-transform-runtime 
    npm install --save babel-runtime
    
    The transformation plugin is typically used only in development, but the runtime itself will be depended on by your deployed/published code. See the examples below for more details.


    babel编译es6到es5的过程中，babel-plugin-transform-runtime这个插件会自动polyfill es5不支持的特性，这些polyfill包就是在babel-runtime这个包里，所以babel-runtime需要安装在dependency而不是devDependency

    一个是转化的包（插件），一个是充满polyfill的包。



## 其他

### 怎样设置babel-polyfill
https://segmentfault.com/a/1190000008706628

npm install --save babel-polyfill

    在Node/Browserify/webpack中使用
        要使用垫片你需要在应用开头的入口引入。
        require("babel-polyfill")
        如果你的英文入口使用ES6 import语法，你应该在入口的开头替代导入垫片，以保证他是最先加载的：
        import 'babel-polyfill'
        
    在webpack.config.js中加入babel-polyfill到你的入口数组：
        module.exports = {
            entry:["babel-polyfill","./app/js"]
        }

    在浏览器中使用
        在用npm下载的babel-polyfill文件中找到dist/polyfill.js文件。这个需要你在babel编译代码之前引入。你可以把它添加到你的编译文件最前面或者用`<script>`标签放到最前面。  


##  Babel version 7

升级到Babel 7的经验 https://segmentfault.com/a/1190000016541105

Babel 7 于今天发布  2018-09-02  https://www.w3ctech.com/topic/2150 

使用 webpack 4 和 Babel 7 配置 Vue.js 工程模板 https://segmentfault.com/a/1190000015247255

* Babel 团队会通过使用 “scoped” packages 的方式，来给自己的 babel package name 加上 @babel 命名空间（详情），这样以便于区分官方 package 以及 非官方 package，所以 babel-core 会变成 @babel/core
* [es2015 插件 -> env 插件] 移除（并且停止发布）所有与 yearly 有关的 presets（preset-es2015 等）（详情）。@babel/preset-env 会取代这些 presets，这是因为 @babel/preset-env 囊括了所有 yearly presets 的功能，而且 @babel/preset-env 还具备了针对特定浏览器进行“因材施教”的能力
* [stage -> proposal] 放弃 Stage presets（@babel/preset-stage-0 等），选择支持单个 proposal。相似的地方还有，会默认移除 @babel/polyfill 对 proposals 支持（详情）。
* 为了让你更方便的升级到Babel 7，官方提供了一个工具babel-upgrade


#### 样例
```
{
    "presets": [
        [ "@babel/preset-env", { "modules": false } ],
        "@babel/preset-react"
    ],
    "plugins": ["@babel/proposal-class-properties"]
}
```
因为我们经常需要将React组件类中的方法的this绑定到组件本身

如果不用箭头函数，我们就需要使用bind将函数一个个绑定好，但如果可以使用箭头函数在class字段中直接绑定的话，就非常方便了. 这样，箭头函数被当作成class的属性来看待，this也不会指向undefined。

这个特性就需要babel-plugin-transform-class-properties来转译，这个插件在原来是包含在stage-2里面的，现在，就需要单独引入。
```
class Bork {
    boundFunction = () => {
        return this.state;
    }
}
```


### other

If you are using Babel version 7 you will need to run npm install @babel/preset-env and have "presets": ["@babel/preset-env"] in your configuration.

babel 7 中说明删除提案polyfill @babel/polyfill 结合 @babel/runtime-corejs2 + @babel/plugin-transform-runtime 插件使用


### babel-preset-es2015 -> babel-preset-env
babel-preset-env https://segmentfault.com/a/1190000011639765

babel preset将基于你的实际浏览器及运行环境，自动的确定babel插件及polyfills，转译ES2015及此版本以上的语言， 在没有配置项的情况下，babel-preset-env表现的同babel-preset-latest一样(或者可以说同babel-preset-es2015, babel-preset-es2016, and babel-preset-es2017结合到一起，表现的一致)

npm install babel-preset-env --save-dev
```
{
    "presets": ["env"]
}
```

你也可以通过配置polyfills和transforms来支持你所需要支持的浏览器，仅配置需要支持的语法来使你的打包文件更轻量级。

下面的例子，包括polyfills和代码，针对各个浏览器的最新的两个版本，以及safari的版本7及以上，针对以上两个条件的兼容情况进行代码转译。我们根据browserslist来分析具体的支持情况，所以，你可以用任何有效的browserslist查询格式来配置选项。
```
{
  "presets": [
    ["env", {
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7"]
      }
    }]
  ]
}
```

相同的，如果你的运行环境使node.js，你页可以配置babel-preset-env来支持一个特殊的node版本
```
{
  "presets": [
    ["env", {
      "targets": {
        "node": "6.10"
      }
    }]
  ]
}
```

为了更佳的方便，可以使用"node": "current"根据你运行时的node.js版本,挑选需要的polyfills和transforms来支持。
```
{
  "presets": [
    ["env", {
      "targets": {
        "node": "current"
      }
    }]
  ]
}
```

### 以下下官方给我们提供的自带的presets:
    @babel/preset-env
        包含如下标准：
            @babel/preset-es2015，@babel/preset-es2016和@babel/preset-es2017
            
            ES3
                member-expression-literals
                property-literals
                reserved-words
            ES5
                property-mutators
            ES2015
                arrow-functions
                block-scoped-functions
                block-scoping
                classes
                computed-properties
                destructuring
                duplicate-keys
                for-of
                function-name
                instanceof
                literals
                new-target
                object-super
                parameters
                shorthand-properties
                spread
                sticky-regex
                template-literals
                typeof-symbol
                unicode-regex
            ES2016
                exponentiation-operator
            ES2017
                async-to-generator

    babel7已废弃:
    @babel/preset-stage-0
    @babel/preset-stage-1
    @babel/preset-stage-2 
    @babel/preset-stage-3

    As of Babel v7, all of the stage-x presets have been deprecated. 
    
    For a more automatic migration, we have updated babel-upgrade to do this for you (you can run npx babel-upgrade).

    If you want the same configuration as before:
    {
        "plugins": [
            // Stage 0
            "@babel/plugin-proposal-function-bind",
        
            // Stage 1
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-logical-assignment-operators",
            ["@babel/plugin-proposal-optional-chaining", { "loose": false }],
            ["@babel/plugin-proposal-pipeline-operator", { "proposal": "minimal" }],
            ["@babel/plugin-proposal-nullish-coalescing-operator", { "loose": false }],
            "@babel/plugin-proposal-do-expressions",
        
            // Stage 2
            ["@babel/plugin-proposal-decorators", { "legacy": true }], //解析装饰器
            "@babel/plugin-proposal-function-sent",
            "@babel/plugin-proposal-export-namespace-from",
            "@babel/plugin-proposal-numeric-separator",
            "@babel/plugin-proposal-throw-expressions",
        
            // Stage 3
            "@babel/plugin-syntax-dynamic-import",
            "@babel/plugin-syntax-import-meta",
            ["@babel/plugin-proposal-class-properties", { "loose": false }],
            "@babel/plugin-proposal-json-strings"
        ]
    }


    { "presets": [ "@babel/preset-env", "@babel/preset-stage-0" ], }
    这种写法在babel7中是不支持的,如果需要使用preset-stage-0,则安装babel-upgrade并执行 npx babel-upgrade --write --install 
    会重写.babelrlc文件,并自动安装相应的plugin:

```
    Updating .babelrc config at .babelrc
Index: .babelrc
===================================================================
--- .babelrc    Before Upgrade
+++ .babelrc    After Upgrade
@@ -1,9 +1,34 @@
 {
   "presets": [
-    "@babel/preset-env",
-    "@babel/preset-stage-0"
+    "@babel/preset-env"
   ],
   "plugins": [
+    "@babel/plugin-transform-runtime",
.
.
.
+    "@babel/plugin-proposal-function-bind"
   ]
 }
\ No newline at end of file


Updating closest package.json dependencies
Index: D:\01\practice\webpack\demo-0\package.json
===================================================================
--- D:\01\practice\webpack\demo-0\package.json  Before Upgrade
+++ D:\01\practice\webpack\demo-0\package.json  After Upgrade
@@ -10,18 +10,32 @@
   "license": "ISC",
   "devDependencies": {
     "@babel/cli": "^7.2.3",
     "@babel/core": "^7.2.2",
-    "@babel/plugin-proposal-class-properties": "^7.2.3",
.
.
.
     "@babel/runtime": "^7.2.0"
   }


Installing new dependencies

```

### 按需加载 babel-plugin-import
    https://github.com/ant-design/babel-plugin-import

    如果你在开发环境的控制台看到下面的提示，那么你可能使用了 import { Button } from 'antd'; 的写法引入了 antd 下所有的模块，这会影响应用的网络性能。

    You are using a whole package of antd, please use https://www.npmjs.com/package/babel-plugin-import to reduce app bundle size.
    控制台警告

    可以通过以下的写法来按需加载组件。

    import Button from 'antd/lib/button';
    import 'antd/lib/button/style'; // 或者 antd/lib/button/style/css 加载 css 文件
    antd/es/button 可以加载 ES 版本的模块，方便进一步 Tree Shake.

    如果你使用了 babel，那么可以使用 babel-plugin-import 来进行按需加载，加入这个插件后。你可以仍然这么写：

    import { Button } from 'antd';
    插件会帮你转换成 antd/lib/xxx 的写法。另外此插件配合 style 属性可以做到模块样式的按需自动加载。

    注意，babel-plugin-import 的 style 属性除了引入对应组件的样式，也会引入一些必要的全局样式。如果你不需要它们，建议不要使用此属性。你可以 import 'antd/dist/antd.css' 手动引入，并覆盖全局样式。


### babel7 基础使用
    https://www.jianshu.com/p/28878eacc613
    npm i -D @babel/cli @babel/core
    npx babel 01.js -o 01_trans.js

    npm i -S @babel/preset-env  用来转换高级语法到es5或者以下的语法的
    npm i -S @babel/polyfill    
        babel仅仅只能转换高级语法而已，而高级语法新增的一些函数是无能为力的，这是浏览器内核不支持，那么babel也没办法了
        比如说es6的一些数组新函数 filter foreach reduce等等低级浏览器该不支持
        为了让一段js代码在各个浏览器上都输出相同的结果，polyfill提供这样的方法让各个浏览器对于js的兼容性处在同一个水准上
        安装完成之后直接在转换后的文件（是转换成低价语法的文件）中引用一段代码 require('@babel/polyfill');

    npm i --S @babel/runtime @babel/plugin-transform-runtime
        @babel/runtime 就是用于提出来公共的包，但是提出来之后，代码并不会自己会引用这些包啊
        @babel/plugin-transform-runtime 所以我们需要这个包来自动引用公共函数
            @babel/runtime不需要配置，由@babel/plugin-transform-runtime引用，所以只需要配置plugin
            "plugins": [ "transform-runtime", ]

    npm i -S @babel/preset-react   用来转换react
    npm i -D @babel/plugin-proposal-class-properties    

    "presets": ["@babel/preset-env", "@babel/preset-react"]