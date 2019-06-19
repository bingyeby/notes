
## css关键字
### text-show
* x-offset y-offset blur color 

### 关于table布局长度设置无效的几个修正特殊样式
table-layout:fixed;// table的布局计算方式
word-break:break-all;// 控制单行过长文字在固定长度下换行

### box-shadow
* inset x-offset y-offset blur-radius spread-radius color
* box-shadow:投影方式 X轴偏移量 Y轴偏移量 阴影模糊半径 阴影扩展半径 阴影颜色
* 阴影扩展半径在阴影模糊半径的外层

### transition
* -property -duration -time-function -delay 
* 针对的属性 持续时间 过渡类型 延迟过渡时间
* 过渡类型有：（ease linear ease-in ease-out ease-in-out cubic-bezier） 

### animation
* animation-name -duration -time-function -delay num direction fill-mode
* num: n infinite
* direction: normal reverse alternate	
* fill-mode: none backwards forwards both	填充模式

### transform
	transform[transform-origin]
		translate(50px,100px);   
		scale();   
		rotate(30deg);   
		skew(30deg,20deg);   
		matrix();

### stylus
	* 说明：后缀.styl，功能上更为强壮
	* 简单使用:
		- $ stylus --compress src
		- $ stylus --css css/example.css css/out.styl CSS转换成styl
		- $ stylus help box-shadow CSS属性的帮助
		- $ stylus --css test.css 输出基本名一致的.styl文件示例  
#### 函数
		-pos(type, args)
			i = 0
			position: unquote(type)
			{args[i]}: args[i + 1] is a 'unit' ? args[i += 1] : 0
			{args[i += 1]}: args[i + 1] is a 'unit' ? args[i += 1] : 0

		absolute()
			-pos('absolute', arguments)

		fixed()
			-pos('fixed', arguments)

		#prompt
			absolute: top 150px left 5px
			width: 200px
			margin-left: -(@width / 2)

		#logo
			fixed: top left
	
	带参数
		border-radius(val)
			-webkit-border-radius: val
			-moz-border-radius: val
			border-radius: val

		button 
			border-radius(5px);
			width: w = 200px
			margin-left: -(w / 2)

	无参数
		border-radius()
			-webkit-border-radius: arguments
			-moz-border-radius: arguments
			border-radius: arguments

	button 
		border-radius: 5px 10px;

#### 其他
	计算（通过@width引用长度）  
	嵌套  
	nib插件 @import 'nib'  
	字面量 @css  
	内置方法：red darken lighten abs ceil floor min max sum  
	其余参数： arguments args...   
	迭代： `for <val-name> [, <key-name>] in <expression>`  


### flexbox

#### 优点
	- 伸缩容易
	- 可以在任何伸缩方向上配置（上下左中右）
	- 控制一线或者折行
	- 在样式层控制视觉展示（无需更改结构就可以改变显示顺序）
	- 由伸缩容器 伸缩项目 伸缩行 主轴 侧轴 概念组成

#### 使用
	- justify-content align-content align-items flex-flow(flex-direction flex-wrap)
	- align-self flex
	- 主轴对齐（justify-content） 伸缩行（align-content） 侧轴对齐（align-items align-self）

#### 附录
	属性	属性值	初始值
	justify-content	flex-start | flex-end | center | space-between |space-around	flex-start
	align-items	flex-start | flex-end | center | baseline | stretch	stretch
	flex-flow	<flex-direction> || <flex-wrap>	
		flex-wrap	nowrap | wrap | wrap-reverse	nowrap
		flex-direction	row | row-reverse | column | column-reverse	row
	align-content	flex-start | flex-end | center | space-between | space-around | stretch	stretch

	align-self	auto | flex-start | flex-end | center | baseline | stretch	auto
	flex	none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]	
		flex-grow	<number>	0
		flex-shrink	<number>	1
		flex-basis	<'width'>	auto
		
	order	<整数>	0

### 清除浮动
	&::after: {
		clear: "both",
		content: "",
		display: "table"
	}
### ellipsis
	{
		'display': 'inline-block',
		'max-width': '250px',
		'overflow': 'hidden',
		'text-overflow': 'ellipsis',
		'white-space': 'nowrap',
		'word-wrap': 'normal'
	}



### css3伪类
	动态伪类
		:link :visited :hover :active
	状态伪类
		:checked :enabled :diabled
	:nth
		:first-child选择某个元素的第一个子元素；
		:last-child选择某个元素的最后一个子元素；
		:nth-child()选择某个元素的一个或多个特定的子元素；
		:nth-last-child()选择某个元素的一个或多个特定的子元素，从这个元素的最后一个子元素开始算；
		:nth-of-type()选择指定的元素；
		:nth-last-of-type()选择指定的元素，从元素的最后一个开始计算；
		:first-of-type选择一个上级元素下的第一个同类子元素；
		:last-of-type选择一个上级元素的最后一个同类子元素；
		:only-child选择的元素是它的父元素的唯一一个了元素；
		:only-of-type选择一个元素是它的上级元素的唯一一个相同类型的子元素；
		:empty选择的元素里面没有任何内容。

	:nth-child
		:nth-child(length);/*参数是具体数字*/
		:nth-child(n);/*参数是n,n从0开始计算*/
		:nth-child(n*length)/*n的倍数选择，n从0开始算*/
		:nth-child(n+length);/*选择大于length后面的元素*/
		:nth-child(-n+length)/*选择小于length前面的元素*/
		:nth-child(n*length+1);/*表示隔几选一*/

	::first-line选择元素的第一行，比如说改变每个段落的第一行文本的样式，我们就可以使用这个
		p::first-line {font-weight:bold;}
	::first-letter选择文本块的第一个字母，除非在同一行里面包含一些其它元素，不过这个主要运用于段落排版上多，比如说首字下沉，
		p::first-letter {font-size: 56px;float:left;margin-right:3px;}
	::before和::after这两个主要用来给元素的前面或后面插入内容，这两个常用"content"配合使用，见过最多的就是清除浮动，
		.clearfix:before,
		.clearfix:after {
			content: ".";
			display: block;
			height: 0;
			visibility: hidden;
		}
		.clearfix:after {clear: both;}
		.clearfix {zoom: 1;}
		当然可以利用他们制作出其他更好的效果
	::selection用来改变浏览网页选中文的默认效果


### 换行
	word-wrap： 决定句尾放不下单词时，单词是否换行
	word-break: 决定单词内该怎么换行
	平文本可以配合white-space: pre-wrap来解决多空格压缩显示问题
	富文本采用的解决方案是对空格进行间隔html转义，这种方法更灵活，可以适应不同的场景，也适用于平文本。


### CSS多行文字超出隐藏加省略号
	1:
	h2 {
		display: block;
		display: -webkit-box;
		max-width: 400px;
		height: 109.2px;
		margin: 0 auto;
		font-size: 26px;
		line-height: 1.4;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	2:
	p {
		position:relative;
		line-height:20px;
		max-height:40px;
		overflow:hidden;
	}
	p::after {
		content: "\02026";      // '...'
		position:absolute;
		bottom:0;
		right:0;
		padding-left:40px;
		background:-webkit-linear-gradient(left,transparent,#fff 55%);
		background:-o-linear-gradient(right,transparent,#fff 55%);
		background:-moz-linear-gradient(right,transparent,#fff 55%);
		background:linear-gradient(to right,transparent,#fff 55%);
	}

	适用范围：
	该方法适用范围广，但文字未超出行的情况下也会出现省略号,可结合js优化该方法。

	注：
	将height设置为line-height的整数倍，防止超出的文字露出。
	给p::after添加渐变背景可避免文字只显示一半。
由于ie6-7不显示content内容，所以要添加标签兼容ie6-7（如：<span>…<span/>）；兼容ie8需要将::after替换成:after。


### 响应式布局的写法
	@media screen and (min-width:600px){}
	@media screen and (max-width: 900px){}
	@media screen and (min-width: 600px) and (max-width:900px){}
	还有一种是iphone的写法：
	@media screen and (max-device-width:480px)




## 其他
### 关于$.proxy的使用
	使用$.proxy函数。
		jQuery.proxy(),接受一个函数，然后返回一个新函数，并且这个新函数始终保持了特定的上下文(context )语境。
	有两种语法：
		jQuery.proxy( function, context )
			function将要改变上下文语境的函数。
			context函数的上下文语境(`this`)会被设置成这个 object 对象。

		jQuery.proxy( context, name )
			context函数的上下文语境会被设置成这个 object 对象。
			name将要改变上下文语境的函数名(这个函数必须是前一个参数 ‘context’ **对象的属性)
	在某些情况下，我们调用Javascript函数时候，this指针并不一定是我们所期望的那个。例如：
		$('#myElement').click(function() {
			var that = this;   //设置一个变量，指向这个需要的this
			setTimeout(function() {
				$(that).addClass('aNewClass'); // 这个this指向的是settimeout函数内部，而非之前的html元素
			}, 1000);
		});	
	上面的例子使用这种方式就可以修改成：
		$('#myElement').click(function() {
			setTimeout($.proxy(function() {
				$(this).addClass('aNewClass');  
			}, this), 1000);
		});

### iframe的优缺点？
	iframe也称作嵌入式框架，嵌入式框架和框架网页类似，它可以把一个网页的框架和内容嵌入在现有的网页中。
	优点：
		解决加载缓慢的第三方内容如图标和广告等的加载问题
		Security sandbox
		并行加载脚本
		方便制作导航栏
	缺点：
		iframe会阻塞主页面的Onload事件
		即时内容为空，加载也需要时间
		没有语意


### git设置点
	git config --global alias.st status //配置别名
	ssh-keygen -t rsa -C "${YourEmail}"  //复制生成的ssh-key pub，添加到github或bitbucket等网站相应的接口。
	git config --global credential.helper store 
  
### vim选择
http://www.jianshu.com/p/4b07b7173910

```
0 ^ $ 
	移动到行首尾 
	"1$"表示当前行的行尾，"2$"表示当前行的下一行的行尾。
v
	字符选择，将光标经过的字符选择
V
	行选择，将光标经过的行选择
[Ctrl]+v
	矩形选择，可以用矩形的方式选择数据
y
	将选中地方复制起来
d
	将选中地方删除
.
	命令会记住上一次的操作
注释代码 ^ cc v j j j j I
:set number
```


### Content-Type 的几大类型：
	application/x-www-form-urlencoded: 最普遍的上传方式，数据格式类似 key1=val1&key2=val2application/json: json格式，数据格式类似于{‘key1’:‘val1’,‘key2’:‘val2’}）multipart/form-data: 文件上传的时候需要设置text/xml: 很少用了


	[linux环境下安装nginx教程](https://jingyan.baidu.com/article/1974b2898f5eadf4b1f774de.html)