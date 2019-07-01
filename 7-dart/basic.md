
### 基础教程
    https://github.com/RainSilver/DartBasic
    https://www.imooc.com/video/19027
    慕课网教程

    http://dart.goodev.org/guides/language/language-tour
    http://dart.goodev.org/guides/libraries/library-tour
    语法预览 与 核心库预览

    * 其他
    https://me.csdn.net/shanyuu
    
## Dart 核心库

### 预览
    
```dart
// 自定义函数
printInteger(int aNumber) {
  print('The number is $aNumber.'); // 打印
}

// 主函数
main() {
  var number = 42; // 定义变量 并赋值
  printInteger(number); // 调用函数
} 
```

### Dart语法规则
    Dart中所有的变量包括数字、函数和null 都是对象，每一个对象都是一个类的实例，他们都继承于Object
    Dart是强类型语言，但是生明变量时也可以不指定类型，因为Dart可以自动推断，在上面的例子中，变量number就被自动推断为int类型
    Dart支持泛型，如 List<int> 表示集合元素类型为整型、 List<dynamic> 表示元素类型为任何类型
    Dart除了支持我们常见的静态函数(类直接调用)和普通函数(对象调用)外，同时也支持顶级函数如main() 和嵌套函数(函数里面的函数，也叫本地函数)
    与函数类似，Dart也支持顶级变量，同时支持静态变量和实例变量，实例变量也被叫做字段或属性
    和java不同，Dart没有public、protected、private权限修饰符，在Dart里以下划线_开头的标志符表示是私有的
    Dart里面的标志符号由_、字母和数字组成，只能以_或者字母开头
    要注意区分表达式和语句的不同，如var a = 3 + 2; //整体是一个赋值语句，“=”右边部分即"3 + 2"是一个表达式
    Dart工具会向你发出两种类型的提醒：警告和错误。警告代表你的代码可能有问题，但是不会阻止程序的运行；错误分为编译错误和运行错误，前者会阻止程序的运行，后者则会在程序运行使抛出异常！


### 变量
    变量声明有以下几种方式
        var name = 'Bob'; //类型自动推断
        dynamic name = 'Bob';//dynamic表示变量类型不是单一的
        String name = 'Bob';//明确声明变量的类型
        int lineCount;//所有的变量包括数字类型，如果没有初始化，其默认值都是null

    Final and const
        如果你的变量不会发生变化，可以使用final或const来声明。
            一个 final 变量只能赋值一次；
            一个 const 变量是编译时常量,本质上是一个隐式的final
        
        实例常量可以被声明为final，但是不能为const

        const list = [1, 2, 3]; // error
        const list = const [1, 2, 3]; // ok
        const list = const [new DateTime.now(), 2, 3]; // error, because new DateTime.now() is not const
        const list = const [const X(3), 2, 3]; // ok

        final list = [1, 2, 3]; // ok
        final list = const [1, 2, 3]; // ok
        final list = const [new DateTime.now(), 2, 3]; // error, because new DateTime.now() is not const


### 数据类型
    numbers
    strings
    booleans
    lists (also known as arrays)
    sets
    maps

    runes (for expressing Unicode characters in a string)
    symbols

### num

    Dart有两种数字类型int和double
        int的范围取决于平台，Dart VM是64位 ，如果是使用 JavaScript numbers编译为JavaScript，那么其范围是54位； double是64位浮点型数据。
        int和double都是num的子类型，num包含基本操作符如+ - / *，同时也有众多的方法如abs() ceil() floor()等，int里面还有位操作符如>>
    
    //整型不带小数点
    int x = 1;
    int hex = 0xDEADBEEF;

    //带小数点的要声明为double
    double y = 1.1;
    double exponents = 1.42e5;

    //字符串和数字类型的转换
    // String -> int
    var one = int.parse('1');
    // String -> double
    var onePointOne = double.parse('1.1');
    // int -> String
    String oneAsString = 1.toString();
    // double -> String
    String piAsString = 3.14159.toStringAsFixed(2);

    //整型的位运算
    var a = 3 << 1;//6 向左移动一位相当于3*2
    var b = 3 >> 1;//1 向右移一位
    var c = 3 | 1; //3  0011 | 0001 == 0011
    var d = 3 & 1;//1  0011 & 0001 == 0001

    
### string
    //字符串的写法有以下三种,当然也可以嵌套
    var s1 = 'ssss1';
    var s2 = "sssss2";
    //三个 ' 或 " 来定义多行的String 类型
    var s3 = ''' 
    ssss
    3333
    ''';

    //字符串内嵌入变量 嵌入表达式 $variableName (or ${expression})
    var s4 = "s4---$s1";//s4---ssss1 

    //拼接字符串
    var s5 = 'dd''ff'
    "ee";
    //上面的方法等价于
    var s6 = 'dd' + 'ff' + "ee"; 

    //可以通过加前缀r的方式，创建一个"raw"(原始)的字符串
    //说白了 就是让字符串内的任何表达式、语法失效，原样输出
    var s7 = r"In a raw string, even \n isn't special.${3+3}";
    //In a raw string, even \n isn't special.${3+3}

### Booleans
    Dart是强布尔类型检查，只有当值是true是才为真，其他都是false，声明时用bool


### Lists 
    var list = [1, 2, 3];//分析器自动推断list为List<int>,所以里面不能加入其他类型的元素
    print(list.length);//3
    list[1] = 11;
    print(list.toString());//[1, 11, 3]
    var constantList = const [1, 2, 3];
    // constantList[1] = 1; //因为前面的赋值使用了const 所以这句会报错. 
    constantList= [5];//这样可以



### sets
    Set是一种无序的内容不能重复的集合。

    var halogens = {'fluorine', 'chlorine', 'bromine', 'iodine', 'astatine'};//自动推断 Set<String>

    //空集合的创建
    var names = <String>{};
    // Set<String> names = {}; // This works, too.
    // var names = {}; //这样创建的是一个map,不是set

    names..add('fluorine');
    names.addAll(halogens);

    final constantSet = const {
    'fluorine',
    'chlorine',
    'bromine',
    };
    // constantSet.add('helium'); // Uncommenting this causes an error.
        

### Maps
    map是一个包含key和value的对象，key不能重复

    var gifts = {
        'first': 'partridge',
        'second': 'turtledoves',
        'fifth': 'golden rings'
    };

    var nobleGases = {
        2: 'helium',
        10: 'neon',
        18: 'argon',
    };

    var gifts2 = new Map();
    gifts['first'] = 'partridge';
    gifts['second'] = 'turtledoves';
    gifts['fifth'] = 'golden rings';

    var nobleGases2 = new Map();
    nobleGases[2] = 'helium';
    nobleGases[10] = 'neon';
    nobleGases[18] = 'argon';

    //获取value
    print(gifts2['first']);// partridge;
    print(gifts2.length);// 3


### Runes
    Dart 中 使用runes 来获取UTF-32字符集的字符。String的 codeUnitAt and codeUnit属性可以获取UTF-16字符集的字符

    var clapping = '\u{1f44f}';
    print(clapping);
    print(clapping.codeUnits);
    print(clapping.runes.toList());

    Runes input = new Runes('\u2665  \u{1f605}  \u{1f60e}  \u{1f47b}  \u{1f596}  \u{1f44d}');
    print(new String.fromCharCodes(input));


### Symbols
    symbol字面量是编译时常量，在标识符前面加#。如果是动态确定，则使用Symbol构造函数，通过new来实例化.
     print(#s == new Symbol('s'));//true


### 函数
#### 基础
```dart
//下面的函数省略bool也可以，但是不建议那样做
bool isNoble(int atomicNumber) {
    return _nobleGases[atomicNumber] != null;
}
//如果函数只有一条语句或表达式，可以采用简略的形式
//bool isNoble(int atomicNumber) => _nobleGases[atomicNumber] != null;
// => expr 也可以写成 { return expr; }的样式
```


    可选参数
    函数的参数有两种类型：必传、可省略，即调用函数时前者必须传，后者可以不传。可选参数可以是命名参数或位置参数，两者不可同时存在。
    1. 可选参数无论是在声明的时候还是传参的时候，都只能放到最后面
    2. 多个可选命名参数之间，在传参时可以不按照声明的顺序，只要指定名称就行

    /*
    命名参数
	bold 和 hidden是可选的参数  用{}指定可选参数的名称，
	调用时使用paramName: value的形式传参
    */
    void enableFlags(bool b1,{bool bold, bool hidden}) {
        print(b1);
        print(bold);
        print(hidden);
	}
   enableFlags(true, hidden: false);//true null false	
   bool flag = true;
   enableFlags(true, hidden: false, bold:flag);//true true false 后面两个可以打乱顺序


    /*
        位置参数
        device是可选的参数，用[]标识可选参数的位置
    */
    String say(String from, String msg, [String device]) {
        var result = '$from says $msg';
        if (device != null) {
            result = '$result with a $device';
        }
        return result;
    }

    say('Bob', 'Howdy')；//Bob says Howdy
    say('Bob', 'Howdy', 'smoke signal')//Bob says Howdy with a smoke signal


    可以为可选参数设置默认值，如果不设置默认为null
    /// Sets the [bold] and [hidden] flags ...
    void enableFlags({bool bold = false, bool hidden = false}) {
        // ...
    }

    // bold will be true; hidden will be false.
    enableFlags(bold: true);


    String say(String from, String msg, [String device = 'carrier pigeon', String mood]) {
        var result = '$from says $msg';
        if (device != null) {
            result = '$result with a $device';
        }
        if (mood != null) {
            result = '$result (in a $mood mood)';
        }
        return result;
    }
    say('Bob', 'Howdy')；//Bob says Howdy with a carrier pigeon


    void doStuff({List<int> list = const [1, 2, 3],
    Map<String, String> gifts = const { 'first': 'paper'}}) {
        print('list:  $list');
        print('gifts: $gifts');
    }
    doStuff();//list:  [1, 2, 3]     gifts: {first: paper}

#### 主函数
    每一个程序都要有一个主函数，它是app的入口，无返回值，有一个List<String>类型的可选参数。
    下面是一个web app的主函数：
    void main() {
        querySelector('#sample_text_id')//获取页面上的button对象
            ..text = 'Click me!'//设置文本
            ..onClick.listen(reverseText);//设置监听
    }
    注：..是一种级联操作符，它返回调用者本身，这样就可以连续调用同一个对象上的多个方法，实现链式操作！

    下面是一个带参的主函数，需要命令行操作：
    // Run the app like this: dart args.dart 1 test
    //运行程序：dart args.dart 1 test
    //args.dart是程序文件名 1 test是参数
    void main(List<String> arguments) {
        print(arguments.length);//2
        print(int.parse(arguments[0]));//1
        print(arguments[1]);//test
    }

#### 函数对象
    函数可以作为一个参数
    void printElement(int element) {
       print(element);
    }

    var list = [1, 2, 3];

    // Pass printElement as a parameter.
    list.forEach(printElement);// 1  2  3

    函数可以赋值给一个变量
    var loudify = (msg) => '!!! ${msg.toUpperCase()} !!!';
    print(loudify('hello'));//!!! HELLO !!!



#### 匿名函数
    大多数函数都有名字，如main()，没有名字的函数被称为匿名函数，有时也叫做闭包或lambda
    var list = ['apples', 'bananas', 'oranges'];
    list.forEach((item) {
        print('${list.indexOf(item)}: $item');
    });
    //上面的函数可以改写为箭头函数
    list.forEach( (item) => print('${list.indexOf(item)}: $item'));
    //0: apples    1: bananas     2: oranges


#### 作用域
    内层的函数可以访问外层函数的变量，反之则不行
    bool topLevel = true;

    void main() {
        var insideMain = true;

        void myFunction() {
            var insideFunction = true;

            void nestedFunction() {
                var insideNestedFunction = true;

                assert(topLevel);
                assert(insideMain);
                assert(insideFunction);
                assert(insideNestedFunction);
            }
        }
    }


#### 闭包
    /// Returns a function that adds [addBy] to the
    /// function's argument.
    Function makeAdder(num addBy) {
       return (num i) => addBy + i;
    }

    void main() {
        // Create a function that adds 2.
        var add2 = makeAdder(2);

        // Create a function that adds 4.
        var add4 = makeAdder(4);

        assert(add2(3) == 5);
        assert(add4(3) == 7);
    }









