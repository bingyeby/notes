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
    用于命令行转码 $ babel example.js -o compiled.js

### babel-polyfill:
    Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。
    举例来说，ES6 在Array对象上新增了Array.from方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。
    $ npm install --save babel-polyfill

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

## presets plugins
### presets 预设
    如果你的项目需要react或者flow这些语法的编译，请在presets里加入对应的值即可。
    使用的时候需要安装对应的插件，对应babel-preset-xxx，例如下面的配置，需要npm install babel-preset-es2015。
    {
        "presets": ["es2015"]
    }

### plugins	
    presets，也就是一堆plugins的预设，起到方便的作用。如果你不采用presets，完全可以单独引入某个功能，比如以下的设置就会引入编译箭头函数的功能。
    {
        "plugins": ["transform-es2015-arrow-functions"]
    }
    那么，还有一些方法是presets中不提供的，这时候就需要单独引入了，介绍几个常见的插件。

#### babel-plugin-transform-runtime
    不用这plugin的话，babel会为每一个转换后的文件（在webpack这就是每一个chunk了）都添加一些辅助的方法（仅在需要的情况下）；
    而如果用了这个plugin，babel会把这些辅助的方法都集中到一个文件里统一加载统一管理，算是一个减少冗余，增强性能的优化项吧，用不用也看自己需要了；
    如不用的话，前面也不需要安装babel-plugin-transform-runtime和babel-runtime了。
    {
        "plugins": ["transform-runtime", options]
    }

    主要有以下options选择。
        helpers: boolean，默认true 使用babel的helper函数。
        polyfill: boolean，默认true 使用babel的polyfill，但是不能完全取代babel-polyfill。
        regenerator: boolean，默认true 使用babel的regenerator。
        moduleName: string，默认babel-runtime 使用对应module处理。

    这里的options一般不用自己设置，用默认的即可。这个插件最大的作用主要有几下几点：
    1.解决编译中产生的重复的工具函数，减小代码体积
    2.非实例方法的poly-fill，如Object.assign，但是实例方法不支持，如"foobar".includes("foo")，这时候需要单独引入babel-polyfill

### plugins/presets排序
    plugins和presets编译，也许会有相同的功能，或者有联系的功能，按照怎么的顺序进行编译？答案是会按照一定的顺序。
    具体而言，plugins优先于presets进行编译。
        plugins按照数组的index增序(从数组第一个到最后一个)进行编译。
        presets按照数组的index倒序(从数组最后一个到第一个)进行编译。因为作者认为大部分会把presets写成["es2015", "stage-0"]。具体细节可以看这个。

### 总结
    因为自己对.babelrc文件的设置有点疑问，花了大半天撸了下官方的文档。很多内容是英文的，可能翻译并不准确，希望大家多多指教。
    {
        "presets": [
            "es2015",
            "stage-0"
        ],
        "plugins": ["transform-runtime"]
    }
****
    实例方法polyfill: babel-polyfill // "foobar".includes("foo")   // 添加到入口文件
    非实例方法的polyfill: babel-plugin-transform-runtime // Object.assign() 

    
## polyfill | runtime
	babel的polyfill和runtime的区别
    https://segmentfault.com/q/1010000005596587?from=singlemessage&isappinstalled=1

### babel-polyfill 使用场景
    Babel 默认只转换新的 JavaScript 语法，而不转换新的 API。例如，Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise 等全局对象，以及一些定义在全局对象上的方法（比如 Object.assign）都不会转译。如果想使用这些新的对象和方法，必须使用 babel-polyfill，为当前环境提供一个垫片。

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
        
### babel-plugin-transform-runtime 使用场景
    Babel 转译后的代码要实现源代码同样的功能需要借助一些帮助函数，例如，{ [name]: 'JavaScript' } 转译后的代码如下所示：
        'use strict';
        function _defineProperty(obj, key, value) {
            if (key in obj) {
                Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
                });
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
        
### 思考：
#### babel-runtime 为什么适合 JavaScript 库和工具包的实现？
    1.避免 babel 编译的工具函数在每个模块里重复出现，减小库和工具包的体积；
    2.在没有使用 babel-runtime 之前，库和工具包一般不会直接引入 polyfill。否则像 Promise 这样的全局对象会污染全局命名空间，这就要求库的使用者自己提供 polyfill。这些 polyfill 一般在库和工具的使用说明中会提到，比如很多库都会有要求提供 es5 的 polyfill。在使用 babel-runtime 后，库和工具只要在 package.json 中增加依赖 babel-runtime，交给 babel-runtime 去引入 polyfill 就行了；

#### 其他
    疑问：像 antd@2.x 这样的库使用了 babel-runtime，在实际项目中使用 antd@2.x，我们需要引入 babel-polyfill。但全部 polyfill 打包压缩下来也有 80kb 左右，其中很多 polyfill 是没有用到的，如何减少体积呢？手工一个个引入使用到的 polyfill，似乎维护成本太高！

    NOTE - Production vs. development dependencies
    In most cases, you should install babel-plugin-transform-runtime as a development dependency (with --save-dev).
    npm install --save-dev babel-plugin-transform-runtime
    and babel-runtime as a production dependency (with --save).
    npm install --save babel-runtime
    The transformation plugin is typically used only in development, but the runtime itself will be depended on by your deployed/published code. See the examples below for more details.

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
        在用npm下载的babel-polyfill文件中找到dist/polyfill.js文件。这个需要你在babel编译代码之前引入。你可以把它添加到你的编译文件最前面或者用<script>标签放到最前面。  

# ES6总结
    一、新的变量声明方式 let/const
    二、 箭头函数的使用 那就是箭头函数中，没有this。如果你在箭头函数中使用了this，那么该this一定就是外层的this。
    三、模板字符串
    四、 解析结构
    五、 函数默认参数
    六、 展开运算符 在ES6中用...来表示展开运算符，它可以将数组方法或者对象进行展开
    七、对象字面量 与 class



## 字符串
### str.codePointAt(0)
    JavaScript内部，字符以UTF-16的格式储存，每个字符固定为2个字节。对于那些需要4个字节储存的字符（Unicode码点大于0xFFFF的字符），JavaScript会认为它们是两个字符。
    var s = "𠮷";
    s.length // 2
    s.charAt(0) // ''
    s.charAt(1) // ''
    s.charCodeAt(0) // 55362
    s.charCodeAt(1) // 57271
    上面代码中，汉字“𠮷”（注意，这个字不是“吉祥”的“吉”）的码点是0x20BB7，UTF-16编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存。对于这种4个字节的字符，JavaScript不能正确处理，字符串长度会误判为2，而且charAt方法无法读取整个字符，charCodeAt方法只能分别返回前两个字节和后两个字节的值。

    ES6提供了codePointAt方法，能够正确处理4个字节储存的字符，返回一个字符的码点。
    var s = '𠮷a';
    s.codePointAt(0) // 134071
    s.codePointAt(1) // 57271
    s.codePointAt(2) // 97

    你可能注意到了，codePointAt方法的参数，仍然是不正确的。比如，上面代码中，字符a在字符串s的正确位置序号应该是1，但是必须向codePointAt方法传入2。解决这个问题的一个办法是使用for...of循环，因为它会正确识别32位的UTF-16字符。
    var s = '𠮷a';
    for (let ch of s) {
        console.log(ch.codePointAt(0).toString(16));
    }
    // 20bb7
    // 61
    
    **ES6为字符串添加了遍历器接口（详见《Iterator》一章），使得字符串可以被for...of循环遍历。**
    

### String.fromCodePoint()
    ES6提供了String.fromCodePoint方法，可以识别大于0xFFFF的字符，弥补了String.fromCharCode方法的不足。在作用上，正好与codePointAt方法相反。
    String.fromCodePoint(0x20BB7) // "𠮷"
    String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y' // true

### str.at(0)
    ES5 对字符串对象提供charAt方法，返回字符串给定位置的字符。该方法不能识别码点大于0xFFFF的字符。
    'abc'.charAt(0) // "a"
    '𠮷'.charAt(0) // "\uD842"

    字符串实例的at方法，可以识别 Unicode 编号大于0xFFFF的字符，返回正确的字符。
    'abc'.at(0) // "a"
    '𠮷'.at(0) // "𠮷"

### includes(), startsWith(), endsWith()
    indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6又提供了三种新方法。
    includes()：返回布尔值，表示是否找到了参数字符串。
    startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
    endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。

    var s = 'Hello world!';
    s.startsWith('Hello') // true
    s.endsWith('!') // true
    s.includes('o') // true
    这三个方法都支持第二个参数，表示开始搜索的位置。
    s.startsWith('world', 6) // true
    s.endsWith('Hello', 5) // true
    s.includes('Hello', 6) // false

### str.repeat(n)
    小数、字符串会转化为整数；
    负数、Infinity则会报错；
    NaN、""、"str"等同于0
#### 
    'x'.repeat(3) // "xxx"
    'hello'.repeat(2) // "hellohello"
    'na'.repeat(0) // ""
    'na'.repeat(2.9) // "nana"
    'na'.repeat(-0.9) // ""
    'na'.repeat(NaN) // ""  
    'na'.repeat('na') // ""
    "a".repeat("") // ""
    'na'.repeat('3') // "nanana"

### padStart() padEnd()
    padStart()用于头部补全，padEnd()用于尾部补全。

### 字符串模板
    模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中
    模板字符串中通过${}嵌入变量；{}中可以写入js表达式、引用对象属性、调用函数
    `${x} + ${y * 2} = ${x + y * 2}`
    `foo ${fn()} bar`
    模板字符串紧跟在一个函数名称的后面，该函数将被调用来处理此字符串模板（称为标签模板功能 tagged template）

## 数组
### 扩展运算符的应用
    合并数组 [1,2,...arr1,...arr2]
    与解构赋值结合 const [first, ...rest] = [1, 2, 3, 4, 5];
    将字符串转换为真正的数组 [...'hello'] 可以正确识别32Unicode字符 [...str].reverse().join('')
    任何Iterator接口的对象，都可以通过扩展符转换为数组  [...document.querySelectorAll('div')]
        Map Set Generator函数
            var go = function*(){ yield 1; yield 2; yield 3; };
            [...go()] // [1, 2, 3]
        对没有iterator接口的对象使用扩展运算符将会报错
    函数的返回值 

### API:from of find findIndex includes fill entries keys values
    Array.from() 用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）
    Array.of() 用于将一组值，转换为数组。Array.of(3, 11, 8) // [3,11,8]
    arr.copyWithin(target, start = 0, end = this.length) 数组实例的copyWithin方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。
    arr.find(fn) 
    arr.findIndex(fn) 
        [NaN].indexOf(NaN) // -1
        [NaN].findIndex(y => Object.is(NaN, y)) // 0
    arr.includes() [1, 2, NaN].includes(NaN) // true
    arr.fill()
    arr.entries() arr.keys() arr.values()


## Promise
### 基础知识
    Promise对象有以下两个特点。
    （1）对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。
    （2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。
### 基础语法
    Promise.prototype.then()
    Promise.prototype.catch()
    Promise.all()
    Promise.race()
    Promise.resolve()
    Promise.reject()



### 两个有用的附加方法
#### done()
    Promise对象的回调链，不管以then方法或catch方法结尾，要是最后一个方法抛出错误，都有可能无法捕捉到（因为Promise内部的错误不会冒泡到全局）。因此，我们可以提供一个done方法，总是处于回调链的尾端，保证抛出任何可能出现的错误。
    Promise.prototype.done = function (onFulfilled, onRejected) {
        this.then(onFulfilled, onRejected)
            .catch(function (reason) {
                // 抛出一个全局错误
                setTimeout(() => { throw reason }, 0);
            });
    };
#### finally()
    finally方法用于指定不管Promise对象最后状态如何，都会执行的操作。它与done方法的最大区别，它接受一个普通的回调函数作为参数，该函数不管怎样都必须执行。
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        return this.then(
            value  => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => { throw reason })
        );
    };




## bluebird
#### 安装
    npm install bluebird

#### Promise.try()
    原文：
    http://cryto.net/~joepie91/blog/2016/05/11/what-is-promise-try-and-why-does-it-matter/
    翻译：
    http://www.zcfy.cc/article/what-is-promise-try-and-why-does-it-matter-joepie91-s-ramblings-385.html
    [译] 什么是Promise.try，它为何重要？
    以上的代码看起来似乎是多余的。但实际上它有以下几个优点：
    1.更好的错误处理 同步代码中的异常不论出现在何处都会以rejection的形式向Promise链后端传递。
    2.更好的兼容性 你可以始终使用你自己喜欢的Promise实现，而不用担心第三方代码在使用哪个。
    3.更好的代码阅读体验 所有的代码在水平方向上将处于同一个缩进层级，这将使你阅读代码变得更容易。

    http://ricostacruz.com/cheatsheets/bluebird.html
    bluebird.js cheatsheet
	

    https://github.com/xieranmaya/blog/issues/3
    剖析Promise内部结构，一步一步实现一个完整的、能通过所有Test case的Promise类 （其他：性能 停止一个promise链 .done 最佳实战）

