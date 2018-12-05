### 安装
    安装命令中的 “-g” 表示全局(global)
    express的版本不是通常的 “-v” 来查看，而是 “-V”
    安装express项目的命令如下
        express -e nodejs-product
        -e, --ejs add ejs engine support 
        -J, --jshtml add jshtml engine support (defaults to jade)

### Node的小基友supervisor　　
　　每次修改代码后会自动重启。懒程序员就指望这种省事省力的工具活着了:)
　　安装：npm install -g supervisor
　　执行：supervisor app.js

### forever
    虚拟机一关node服务就关了，不过forever可以让node服务不停止：
    forever是一个简单的命令式nodejs的守护进程，能够启动，停止，重启App应用。
    forever完全基于命令行操作，在forever进程之下，创建node的子进程，通过monitor监控node子进程的运行情况，一旦文件更新，或者进程挂掉，forever会自动重启node服务器，确保应用正常运行。

### API
    app.set('port', process.env.PORT || 3000)
    app.get('port')

    app.render(view, [options], callback) 渲染 view, callback 用来处理返回的渲染后的字符串。

    app.use([path], function) 使用中间件 function,可选参数path默认为"/"。使用 app.use() “定义的”中间件的顺序非常重要，它们将会顺序执行，use的先后顺序决定了中间件的优先级(经常有搞错顺序的时候);
    
    app.engine(ext, callback) 注册模板引擎的 callback 用来处理ext扩展名的文件。

    app.use(express.static(__dirname + '/public'));


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