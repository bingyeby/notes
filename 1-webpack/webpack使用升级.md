### babel-plugin-import 插件 的使用
    babel-plugin-import   是一款 babel 插件，它会在编译过程中将 import 的写法自动转换为按需引入的方式
    
    npm i babel-plugin-import
    
    // 在 .babelrc 或 babel-loader 中添加插件配置
    "plugins": [
        ["import", { "libraryName": "vant", "libraryDirectory": "es", "style": true }]
    ]

    // 使用
    import { Button, Cell } from 'vant';
    Vue.use(Button);


    // babel-plugin-import配置babel按需引入antd模块
    "plugins": [
        ['import', { libraryName:'antd', style:true }],
    ]

    // 效果
    import { Button } from 'antd';
    ReactDOM.render(<Button>xxxx</Button>);
    
        ↓ ↓ ↓ ↓ ↓ ↓
    
    var _button = require('antd/lib/button');
    require('antd/lib/button/style');
    ReactDOM.render(<_button>xxxx</_button>);


### babel6的babel-plugin-add-module-exports插件
    在 babel 5 时代， export default {}; 
    除了会被转译成 exports.default = {};
    还会加一句 module.exports = exports.default，这样就是楼主想要的整个模块，但在 babel6 时代做了一个区分，后面这句不再添加。
    这是为什么呢？在我看来，主要是为了区分 commonJS 和 es6 的模块定义，也就是 commonJS的 require 和 module.exports 搭配使用，而 import 则是和 export 搭配使用，因为在 babel 中，虽然是输出到 exports.default上，但 import 也会对应的默认去拿 default 下的模块，相当于 require(xxx)[‘default’]。
    如果楼主非想要回到 babel5 时候的表现的话，babel6 有一个 plugin 可以做到。
    https://www.npmjs.com/package/babel-plugin-add-module-exports    

    npm install babel-plugin-add-module-exports --save-dev

    "plugins": ["add-module-exports"]