
[NodeJS 常用模块推荐](http://blog.csdn.net/zzulp/article/details/8114540)

## node相关

### 静态服务器
    本地开发常常需要搭建临时的服务，第一时间我们会想到用http-server anywhere
    但现在流行修改文件浏览器自动刷新hot socketing（热拔插），如live-reload。
    若想浏览器自动打开项目，用opener。
    live-server实现了三个插件的所有功能

```js
var liveServer = require("live-server");
 
var params = {
    port: 8181, // Set the server port. Defaults to 8080. 
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
    root: "/public", // Set root directory that's being served. Defaults to cwd. 
    open: false, // When false, it won't load your browser by default. 
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore 
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec. 
    mount: [['/components', './node_modules']], // Mount a directory to a route. 
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots 
    middleware: [function(req, res, next) { next(); }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack 
};
liveServer.start(params);
```
```
`--port=NUMBER` - 选择要使用的端口，默认值：PORT env var或8080
`--host=ADDRESS` - 选择要绑定的主机地址，默认值：IP env var或0.0.0.0（“任意地址”）
`--no-browser` - 禁止自动Web浏览器启动
`--browser=BROWSER` - 指定浏览器使用，而不是系统默认
`--quiet | -q` - 禁止记录
`--verbose | -V` - 更多日志记录（记录所有请求，显示所有侦听的IPv4接口等）
`--open=PATH` - 启动浏览器到PATH而不是服务器根目录
`--watch=PATH` - 用逗号分隔的路径来专门监视更改（默认值：观看所有内容）
`--ignore=PATH`- 要忽略的逗号分隔的路径字符串（[anymatch](https://github.com/es128/anymatch) -compatible definition）
`--ignorePattern=RGXP`-文件的正则表达式忽略（即`.*\.jade`）（**不推荐使用**赞成`--ignore`）
`--middleware=PATH` - 导出.js文件的路径导出中间件功能添加; 可以是一个没有路径的名字，也不是引用`middleware`文件夹中捆绑的中间件的扩展名
`--entry-file=PATH` - 提供这个文件（服务器的根相对），以取代丢失的文件（对单页面应用程序有用）
`--mount=ROUTE:PATH` - 在定义的路线下提供路径内容（可能有多个定义）
`--spa` - 将请求从/ abc转换为/＃/ abc（适用于单页面应用程序）
`--wait=MILLISECONDS` - （默认100ms）等待所有更改，然后重新加载
`--htpasswd=PATH` - 启用期待位于PATH的htpasswd文件的http-auth
`--cors` - 为任何来源启用CORS（反映请求源，支持凭证的请求）
`--https=PATH` - 到HTTPS配置模块的路径
`--proxy=ROUTE:URL` - 代理ROUTE到URL的所有请求
`--help | -h` - 显示简短的使用提示和退出
`--version | -v` - 显示版本和退出
```

### 转换相关
#### jsdom
W3C DOM 的 Javascript 实现。

Github 地址： http://github.com/tmpvar/jsdom/issues

#### cheerio
    https://www.cnblogs.com/xiaxuexiaoab/p/7124956.html
    nodejs爬虫笔记(一)---request与cheerio等模块的应用

#### Dox
兼容 Markdown, JSDoc 格式的文档生成器。

Github 地址： https://github.com/visionmedia/dox

#### html2jade
html2jade 模块可以方便的转换现有的 HTML 到 Jade 格式。

#### Jade
Jade 模板引擎，是 express 默认的模板引擎。

Github 地址： https://github.com/visionmedia/jade


#### cheerio
```js
var $ = require("cheerio");
var data='<a class="downbtn" href="http://mov.bn.netease.com/mobilev/2013/1/F/G/S8KTEF7FG.mp4" id="M8KTEKR84" target="_blank">' +
    '<div>11</div>' +
    '<div>12</div>' +
    '<div>13</div>' +
    '</a>';
$.load(data)("div").map(function  (i,n) {
    console.log($(n).text());
});
console.log($.map);
```

#### xls-to-json
```js
node_xj = require("xls-to-json");
node_xj({
	input: "./temp/test.xls", // input xls
	output: "./temp/output.json" // output json
	//sheet: "sheet1", // specific sheetname
}, function (err, result) {
	if (err) {
		console.error(err);
	} else {
		console.log(result);
	}
});
```

#### xml2js
xml2js 基于 sax-js模块，提供简单的 xml 到 Javascript 对象的转换，如需解析 DOM ，jsdom更合适。

使用方法
```js
var fs = require('fs'),
    xml2js = require('xml2js');

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/foo.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result);
        console.log('Done');
    });
});
```

#### node-canvas
NodeJS 的 Canvas 实现，基于 Cairo。可以像浏览器端一样做图片处理：

var Canvas = require('../lib/canvas')
  , Image = Canvas.Image
  , fs = require('fs');

var img = new Image;

img.onerror = function(err){
  throw err;
};

img.onload = function(){
  var w = img.width / 2
    , h = img.height / 2
    , canvas = new Canvas(w, h)
    , ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, w, h, 0, 0, w, h);

  var out = fs.createWriteStream(__dirname + '/crop.jpg');

  var stream = canvas.createJPEGStream({
    bufsize : 2048,
    quality : 80
  });

  stream.pipe(out);
};

img.src = __dirname + '/images/squid.png';
Github 地址： https://github.com/LearnBoost/node-canvas


### autoprefixer postcss
```js
var autoprefixer = require('autoprefixer');
var postcss = require('postcss');

var style = ".a{display:flex;align-content:center;flex-flow: row wrap;}";

postcss([autoprefixer({
			browsers: ["Chrome > 26", "Firefox > 27", "ie >= 11"]
		})]).process(style).then(function (result) {
	result.warnings().forEach(function (warn) {
		console.warn(warn.toString());
	});
	console.log(result.css);
});
```

### colors
```js
var colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});
//bold  
//italic  
//underline  
//inverse  
//yellow  
//cyan  
//white  
//magenta  
//green  
//red  
//grey  
//blue  
//rainbow  
//zebra  
//random 

console.log('hello'.green); // outputs green text  
console.log('i like cake and pies'.underline.red);// outputs red underlined text  
console.log('inverse the color'.inverse); // inverses the color  
console.log('OMG Rainbows!'.rainbow); // rainbow (ignores spaces)  

console.log('this is an error'.error);
console.log('this is a warning'.warn);
console.log('this is a debug'.debug);
console.log('this is a help'.help);
console.log('this is a silly'.silly);
console.log('this is a input'.input);
console.log('this is a prompt'.prompt);
console.log('this is a data'.data);
```

### node-sass安装
	去 Release 列表 找到对应的版本
	https://github.com/sass/node-sass/releases/tag/v4.7.2
	https://github.com/sass/node-sass/releases
	Ctrl+F 粘贴，找到那个文件，下载（必要的时候挂代理，浏览器下载通常都比 node 下载更快更稳定），然后文件存到一个稳定的路径，并复制路径
	设置sass路径 set SASS_BINARY_PATH=D:/nodejs/.nodes/win32-x64-57_binding.node
	
	方法一：使用淘宝源
    
    npm config set sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
    npm config set phantomjs_cdnurl=https://npm.taobao.org/mirrors/phantomjs/
    npm config set electron_mirror=https://npm.taobao.org/mirrors/electron/
    npm config set registry=https://registry.npm.taobao.org
    
    这样使用 npm install 安装 node-sass、electron 和 phantomjs 时都能自动从淘宝源上下载。

### 文件操作相关
#### fs-extra
https://github.com/jprichardson/node-fs-extra

Node.js: extra methods for the fs object like copy(), remove(), mkdirs()

```
copy    copySync
    Copy a file or directory. The directory can have contents. Like cp -r.
    await fs.copy('/tmp/myfile', '/tmp/mynewfile', {overwrite, errorOnExist, dereference, preserveTimestamps, filter})

emptyDir        
    Ensures that a directory is empty. Deletes directory contents if the directory is not empty. If the directory does not exist, it is created. The directory itself is not deleted.

ensureFile
    Ensures that the file exists. If the file that is requested to be created is in directories that do not exist, these directories are created. If the file already exists, it is NOT MODIFIED.

    fss.ensureFileSync(__dirname + '/result/test.json') // 允许嵌套

ensureDir
    Ensures that the directory exists. If the directory structure does not exist, it is created. Like mkdir -p.
ensureLink
ensureSymlink
mkdirp
mkdirs
move
outputFile
outputJson
pathExists
readJson
remove
writeJson
```


#### copy
复制除node_modules之外的文件

```js
var copy = require('copy');

var testDir = 'F:\\practice';

copy(['F:/practice/**/*', '!F:/practice/node_modules', '!F:/practice/node_modules/**', '!F:/practice/**/node_modules', '!F:/practice/**/node_modules/**'],
	'F:\\practice-temp',
	function (err, files) {
	if (err)
		throw err;
	// `files` is an array of the files that were copied
});
```

#### mkdirp
多层次创建文件夹
```js
var mkdirp = require('mkdirp');
    
mkdirp('./tmp/foo/bar/baz', function (err) {
    if (err) console.error(err)
    else console.log('pow!')
});
```

#### Glob
https://github.com/isaacs/node-glob

https://www.cnblogs.com/liulangmao/p/4552339.html

https://www.helplib.com/GitHub/article_45503

glob工具基于javascript.它使用了 minimatch 库来进行匹配

npm install glob

```js
var glob = require("glob")

// options 是可选的
glob("**/*.js", options, function (er, files) {
  // files 是匹配到的文件的数组.
  // 如果 options中`nonull` 选项被设置为true, 而且没有找到任何文件,那么files就是glob规则本身,而不是空数组
  // er是当寻找的过程中遇的错误
})

//*:匹配路径中某部分:0个或多个字符
glob("js/*.js",function (er, files) {
    console.log(files)
})
```
```
*  匹配该路径段中0个或多个任意字符 "js/*.js"
** 和 * 一样,可以匹配任何内容,但**不仅匹配路径中的某一段,而且可以匹配 'a/b/c' 这样带有'/'的内容,所以,它还可以匹配子文件夹下的文件. 
?  匹配该路径段中1个任意字符 "js/?.js"
[...] 匹配该路径段中在指定范围内字符,不能组合,只能是其中一个字符 "js/a[0-3].js"
*(pattern|pattern|pattern)  匹配括号中多个模型的0个或多个或任意个的组合 "js/*(a|a1|b).js"  js中ab.js,a.js,a1.js,b.js

!(pattern|pattern|pattern)  匹配不包含任何模型 "js/!(a|b).js"
    "js/!(a|b).js"
        获取js目录下名字中不包含a,也不包含b的所有文件.
        带有a或者b的,都排除.需要注意的是,它并非是*(a|b)的取反
?(pattern|pattern|pattern) : 匹配多个模型中的0个或1个[精确匹配模型,不可以组合]
    "js/?(a|a2|b).js"
        获取js文件夹中a.js,a2.js,b.js
        它和 *(pattern|pattern|pattern) 的区别是,不可以组合,必须完全匹配
+(pattern|pattern|pattern) : 匹配多个模型中的1个或多个
    "js/+(a|a1|b).js"
        获取js目录下a.js,a1.js,b.js,或者a,a1,b这几个字符的组合的js,比如ab.js
        它和 *(pattern|pattern|pattern) 的区别是,至少有一个,为空不匹配
@(pattern|pat*|pat?erN)  : 匹配多个模型中的1个
    精确匹配模型,不可以组合.
    和?的区别就是不可以为空.必须要是其中的一个.

```
```js
//  不包含node_modules
glob('**',{ignore:'node_modules/**'}, (er, files) => {
    console.log(` n`, files);
})
```

### node npm 基础配置相关
#### n (不支持win)
npm install -g n

n stable

n v8.9.1 

#### nvm
安装最新的node版本

```
nvm ls-remote

nvm install latest // 下载最新的 node 版本 v7.2.0
nvm install 4.4.4 // 安装不同版本
nvm install 6.2.0 32 // 默认是64位，32位需指定
nvm uninstall 6.2.0 // 卸载对应的版本
nvm list // 查看已安装的 node 版本
```

```
解决 nvm 下载慢的问题
在程序安装目录下找到 settings.txt，添加下面两行。
root: C:\Program Files\nvm
path: C:\Program Files\nodejs
+ node_mirror: https://npm.taobao.org/mirrors/node/
+ npm_mirror: https://npm.taobao.org/mirrors/npm/
```

Node版本管理器--nvm，可以运行在多种操作系统上。nvm for windows 是使用go语言编写的软件。 我电脑使用的是Windows操作系统，所以我要记录下在此操作系统上nvm的安装和使用。
https://blog.csdn.net/sinat_38334334/article/details/80013648


#### nrm
    查看npm源地址，在终端输入以下命令

    npm config list

    会看到官方的npm源

    metrics-registry = "https://registry.npmjs.org/"

    国内常用的镜像地址如淘宝npm：https://registry.npm.taobao.org/

    修改registry地址

    npm set registry https://registry.npm.taobao.org/

    删掉它

    npm config rm registry

    nrm是专门用来管理和快速切换私人配置的registry

    建议全局安装

    npm install nrm -g --save

    nrm有一些默认配置，用nrm ls命令查看默认配置，带*号即为当前使用的配置

    nrm ls

    也可以直接输入以下命令查看当前使用的是哪个源

    nrm current

    切到源http://r.cnpmjs.org/，命令：nrm use 源的别名，即

    nrm use cnpm

    执行成功提示

    Registry has been set to: http://r.cnpmjs.org/
    用nrm add 命令添加公司私有npm源，如http://registry.npm.360.org(随便写的)，起个别名叫qihoo

    nrm add qihoo http://registry.npm.360.org

    测试: nrm test npm

    输出:npm ---- 1547ms

    删除

    nrm del qihoo 


#### es-checker
使用es-checker工具包查看Node 对 ES6 新特性 支持情况

npm install -g es-checker

es-checker


#### npm-check
npm 是node下的包管理工具，给我们提供了强大的包管理功能，简化了项目的代码部署过程。但是，npm也不是尽善尽美，批量更新时便很捉急。 npm-check便应运而生。

npm-check是一个npm包更新工具。它还可以检查项目的npm依赖包是否有更新，缺失，错误以及未使用等情况。其 几大主要优势如下：

1. 提供图形化界面，还有emoji
2. 批量更新依赖包，还兼职检测包使用情况
3. 项目下更新支持自动检测包的 "dependencies" 和"devDependencies"并更新"package.json"信息

```
> npm install -g npm-check //全局安装。项目下安装可自行选择
> npm install npm-check    //项目下安装，项目根目录执行

> npm-check  // （1）查看包更新信息，会有小黄脸提示你包的相关情况（需更新，缺失，错误以及未使用等）
> npm-check -u //-update （2）更新包。分类别展示，使用空格选择包，然后enter开始更新。自动更新package.json内的相关包信息
```


### 每次修改代码后会自动重启 调试
#### supervisor

$ npm install -g supervisor

$ supervisor app.js


#### node-dev [node-dev](https://github.com/fgnass/node-dev)
Node-dev is a development tool for Node.js that automatically restarts the node process when a file is modified.

通过 node-notifier 支持桌面提醒

#### nodemon
```
$ npm install nodemon -g
$ nodemon httptest.js
```
```
$ npm install nodemon --save-dev
$ ./node_modules/.bin/nodemon httptest.js
```
```
$ npm install nodemon --save-dev

{
  "scripts": {
    "dev": "nodemon httptest.js"
  }
}

npm run dev  // 会自动去当前项目的 node_modules/.bin 下找可执行文件来执行对应的命令。
```

#### npx (内置)
npx 是个很方便的 cli 工具，能够直接运行安装在项目下 node_modules/.bin 的工具，很多时候我们不需要全局安装太多 cli 工具，就可以只全局安装一个 npx ，当需要用到某些 cli 工具的时候，直接安装到项目下，然后通过 npx 来执行。

比如上面的 nodemon ，如果安装到项目下的话，就可以通过以下指令来运行

$ npx nodemon httptest.js

#### inspector-proxy
除了使用 vscode 进行 debug 之外，我们还可以使用 chrome 的 devtool 来进行 debug，可以先安装一下 inspector-proxy

$ npm install inspector-proxy --save-dev
然后使用 npx 来执行一下

$ npx inspector-proxy ./httptest.js
然后可以看到控制台会输出

```
➜  demo git:(master) ✗ npx inspector-proxy ./httptest.js
Debugger listening on ws://127.0.0.1:5858/5b737da9-f779-44db-9a18-a5b6e91d7a67
For help see https://nodejs.org/en/docs/inspector
server listening in 3000
5858 opened

proxy url: chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/__ws_proxy__
```

拷贝一下 proxy url 后面那串链接并且在 chrome 上打开就可以 debug 了，可以直接在 chrome devtool 的 sources 上对代码进行断点调试。

如果要搭配 nodemon 则可以这么写，文件更改重启之后，只要在 chrome 上点一下 reconnect 即可继续 debug

$ npx nodemon --exec 'inspector-proxy ./httptest.js'


https://www.cnblogs.com/luoguixin/p/6346620.html



### cluster & forever
虽然 nodejs 原生已经提供了 cluster 模块，大部分情况下可以满足我们的基本需求，但这两个模块 cluster 和 forever 都提供了更强大的功能。

cluster 及 forever 都能让你的 nodejs 应用的管理更加方便，比如启动、重启、停止你的应用。

他们也都可以保证应用的稳定性，如果你的 nodejs 程序存在错误而使进程关闭了，cluster 或 forever 都能自动重启他们，以保证 nodejs 应用零宕机。

Github 地址：
https://github.com/nodejitsu/forever
https://github.com/LearnBoost/cluster


### node_redis
是为 NodeJS 而写的 Redis client，它支持所有 Redis 命令。

使用方法：

```js
var redis = require("redis"),
    client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

client.set("string key", "string val", redis.print);
client.hset("hash key", "hashtest 1", "some value", redis.print);
client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
client.hkeys("hash key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
});
```

Github 地址： https://github.com/mranney/node_redis

### mailer

NodeJS 邮件发送模块，支持定制基于 Mustache 的模板正文。

使用方法

  var email = require("../lib/node_mailer");

  for(var i = 0; i < 10; i++){

```js
email.send({
  host : "localhost",              // smtp server hostname
  port : "25",                     // smtp server port
  ssl: true,                        // for SSL support - REQUIRES NODE v0.3.x OR HIGHER
  domain : "localhost",            // domain used by client to identify itself to server
  to : "marak.squires@gmail.com",
  from : "obama@whitehouse.gov",
  subject : "node_mailer test email",
  body: "Hello! This is a test of the node_mailer.",
  authentication : "login",        // auth login is supported; anything else is no auth
  username : "my_username",        // username
  password : "my_password"         // password
},
function(err, result){
  if(err){ console.log(err); }
});
```
  }
Github 地址: https://github.com/Marak/node_mailer


### Nide
nide is a web-based IDE for node.js. It’s designed with simplicity and ease-of-use in mind. nide was initially developed as part of the Node Knockout 48 hour coding competition.

First, install nide with:

sudo npm install -g nide
On a new or existing directory, use the following command to setup a new nide project:

nide init
This command will setup a .nide directory, automatically add it to your .npmignore and .gitignore files, and start the nide server on port 8123. Fire up your web browser at localhost:8123 to use nide. If a directory is already a nide project, you can run nide simply by using:

nide

[Beautiful IDE for Node.js ](http://coreh.github.com/nide/

### 单元测试
[单元测试](https://wanghx.cn/blog/progressive/lesson1.html#单元测试)




### dotenv:从文件加载环境变量
	使用dotenv，我们只需要将程序的环境变量配置写在.env文件中 DB_HOST=localhost
	在Node.js程序启动时运行	require('dotenv').config()
	接着，我们就可以在接下来的程序中方便地使用环境变量了 process.env.DB_HOST
	https://segmentfault.com/a/1190000012826888
	
	
### 批量导入
	require-directory	下载使用量更大 最近更新较久远
	require-dir	
	

### 镜像配置
   为中国内地的Node.js开发者准备的镜像配置，大大提高node模块安装速度。
    https://www.npmjs.com/package/mirror-config-china

### 查看对版本的支持
    https://kangax.github.io/compat-table/es6/