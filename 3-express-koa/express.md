
[NodeJS 常用模块推荐](http://blog.csdn.net/zzulp/article/details/8114540)

## node相关
### 转换相关
#### jsdom
W3C DOM 的 Javascript 实现。

Github 地址： http://github.com/tmpvar/jsdom/issues

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


### 文件操作相关
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


### node npm 基础配置相关
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

#### npx
npx 是个很方便的 cli 工具，能够直接运行安装在项目下 node_modules/.bin 的工具，很多时候我们不需要全局安装太多 cli 工具，就可以只全局安装一个 npx ，当需要用到某些 cli 工具的时候，直接安装到项目下，然后通过 npx 来执行。

比如上面的 nodemon ，如果安装到项目下的话，就可以通过以下指令来运行

$ npx nodemon httptest.js

#### chrome
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




## express
### 安装
    安装命令中的 “-g” 表示全局(global)
    express的版本不是通常的 “-v” 来查看，而是 “-V”
    安装express项目的命令如下
        express -e nodejs-product
        -e, --ejs add ejs engine support 
        -J, --jshtml add jshtml engine support (defaults to jade)


### forever
    虚拟机一关node服务就关了，不过forever可以让node服务不停止：
    forever是一个简单的命令式nodejs的守护进程，能够启动，停止，重启App应用。
    forever完全基于命令行操作，在forever进程之下，创建node的子进程，通过monitor监控node子进程的运行情况，一旦文件更新，或者进程挂掉，forever会自动重启node服务器，确保应用正常运行。

### API
```javascript
app.set('port', process.env.PORT || 3000)
app.get('port')

app.render(view, [options], callback) 渲染 view, callback 用来处理返回的渲染后的字符串。

app.use([path], function) 使用中间件 function,可选参数path默认为"/"。使用 app.use() “定义的”中间件的顺序非常重要，它们将会顺序执行，use的先后顺序决定了中间件的优先级(经常有搞错顺序的时候);

app.engine(ext, callback) 注册模板引擎的 callback 用来处理ext扩展名的文件。

app.use(express.static(__dirname + '/public'));
```


### How do I use HTML as the view engine in Express?
    https://stackoverflow.com/questions/17911228/how-do-i-use-html-as-the-view-engine-in-express
    
    To make the render engine accept html instead of jade you can follow the following steps;
    
    1.Install consolidate and swig to your directory.
        npm install consolidate
        npm install swig
    
    2.add following lines to your app.js file
        var cons = require('consolidate');
        // view engine setup
        app.engine('html', cons.swig)
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'html');
    
    3.add your view templates as .html inside “views” folder. Restart you node server and start the app in the browser.
    Though this will render html without any issue, I would recommend you to use JADE by learning it. Jade is an amazing template engine and learning this will help you achieve better design & scalability.

MongoDB语法与现有关系型数据库SQL语法比较
    https://www.cnblogs.com/java-spring/p/9488200.html

