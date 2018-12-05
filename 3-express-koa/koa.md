### 基础
    Koa 依赖 node v7.6.0 或 ES2015及更高版本和 async 方法支持.
    你可以使用自己喜欢的版本管理器快速安装支持的 node 版本：
        $ nvm install 7
        $ npm i koa
        $ node my-koa-app.js


### 入门
    const koa=require("koa")
    const route =require("koa-route");
    const static= require("koa-static");

    app.use(async ctx => {
        ctx.body = 'Hello World';
    });

    server.listen(8080) // 端口

    server.use(route.get("re"),async (ctx.next) => {
        ctx.request.query.parma
    });

    server.use(route.get("/reg/:user/:pass"),async (ctx,user,pass,next)={
        ctx.request
        ctx.response
        console.log(user,pass);
    });

    // 静态文件
    server.use(static("./www"));

### 中间件的级联关系
    Koa中间件之间为级联关系
#### demo1
    const Koa = require('koa');
    const app = new Koa();

    // x-response-time
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        ctx.set('X-Response-Time', `${ms}ms`);
    });

    // logger
    app.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${ctx.method} ${ctx.url} - ${ms}`);
    });

    // response
    app.use(async ctx => {
        ctx.body = 'Hello World';
    });

    app.listen(3000);

#### demo2
    server.use(async (){
        let startTime=new Date().getTime();
        next()
        ll(new Date().getTime() - startTime)
    })

    server.use(async (ctx,next)=>{
        try {
            await next()
        } catch (e) {
            ctx.response.body="404"
        }
    })


### 常用API
    app.use(function) 将给定的中间件方法添加到此应用程序

    app.listen(...) 

    app.context ctx的原型，可以通过编辑 app.context 为 ctx 添加其他属性。这对于将 ctx 添加到整个应用程序中使用的属性或方法非常有用，这可能会更加有效（不需要中间件）和/或 更简单（更少的 require()），而更多地依赖于ctx，这可以被认为是一种反模式。
        例如，要从ctx 添加对数据库的引用：
        app.context.db = db();
        app.use(async ctx => {
            console.log(ctx.db);
        });

    ctx.request

    ctx.res response对象 res.statusCode res.writeHead() res.write() res.end()
    ctx.response

    ctx.state 推荐的命名空间，用于通过中间件传递信息和你的前端视图
        ctx.state.user = await User.find(id);

    ctx.app 应用程序实例

    ctx.cookies.get(name,[options])
    ctx.cookies.set(name,value,[options]) 
        maxAge 一个数字表示从 Date.now() 得到的毫秒数
        signed cookie 签名值
        expires cookie 过期的 Date
        path cookie 路径, 默认是'/'
        domain cookie 域名
        secure 安全 cookie
        httpOnly 服务器可访问 cookie, 默认是 true
        overwrite 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。

    


### koa-router
    // 大项目koa-router 小项目koa-route
    const router = require("koa-router")
    r1 = router();
    server.use(r1.routes())
    r1.get("/a/:user/:pass",async (ctx,next)=>{
        ctx.params
    })



###  实现一个中间件
    OAuth token

    https://www.zhihu.com/question/35085930
    老师给你看看验证码的前世今生
