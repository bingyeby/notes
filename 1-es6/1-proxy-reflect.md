# 代理(Proxy)和反射(Reflection)

### www
    https://www.w3cplus.com/javascript/es6-proxy-reflect.html
    ES6学习笔记： 代理和反射 (对使用方法有详细的示例)

    https://www.w3cplus.com/javascript/proxy-reflect.html
    代理(Proxy)和反射(Reflection)
    
    https://www.w3cplus.com/vue/vue-proxying.html
    Vue 2.0的学习笔记： Vue中的代理Proxy

### 基础概念
    调用new Proxy()可创建代替其他目标(target)对象的代理，它虚拟化了目标，所以二者看起来功能一致

    代理可以拦截JS引擎内部目标的底层对象操作，这些底层操作被拦截后会触发响应特定操作的陷阱函数

    反射API以Reflect对象的形式出现，对象中方法的默认特性与相同的底层操作一致，而代理可以覆写这些操作，每个代理陷阱对应一个命名和参数都相同的Reflect方法。
    
### 基本语法 Proxy
    // @param {Object} target 用来被代理的对象
    // @param {Object} handler 用来设置代理的对象
    let proxy = new Proxy(target, handler)

    ES6原生提供Proxy构造函数，用来生成Proxy实例。在使用过程当中，Proxy都像上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。
    let proxy = new Proxy({}, {
        get: function(target, property) {
            return property in target ? target[property] : `Error: ${target} object not has ${property} property! `
        }
    })
    let obj = Object.create(proxy) 
    console.log(obj.name)
    // 上面的代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，访问不存在的属性，只会返回undefined。

    注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

    处理器对象handler一共提供了14种可代理操作，每种操作的代号（属性名/方法名）和触发这种操作的方式如下：
        getPrototypeOf：在读取代理对象的原型时触发该操作，比如在执行Object.getPrototypeOf(proxy)时
        setPrototypeOf：在设置代理对象的原型时触发该操作，比如在执行Object.setprototypeOf(proxy, null)时
        isExtensible：在判断一个代理对象是否是可扩展时触发该操作，比如在执行Object.isExtensible(proxy)时
        preventExtensions：在让一个代理对象不可扩展时触发该操作，比如在执行Object.preventExtensions(proxy)时
        getOwnPropertyDescriptor：在获取代理对象某个属性的属性描述时触发该操作，比如在执行Object.getOwnPropertyDescriptor(proxy, 'foo')时

        get：在读取代理对象的某个属性时触发该操作，比如在执行proxy.foo时
        set：在给代理对象的某个赋值时触发该操作，比如在执行proxy.foo = 1时
        has：在判断代理对象是否拥有某个属性时触发该操作，比如在执行'foo' in proxy时
        defineProperty：在定义代理对象某个属性时的属性描述时触发该操作，比如在执行Object.defineProperty(proxy,'foo',{})时
        deleteProperty：在删除代理对象的某个属性时触发该操作，比如在执行delete proxy.foo时
        ownKeys：在获取代理对象的所有属性键时触发该操作，比如在执行Object.getOwnPropertyNames(proxy)时
        apply：在调用一个目标对象为函数的代理对象时触发该操作，比如在执行proxy()时
        construct：在给一个目标对象为构造函数的代理对象构造实例时触发该操作，比如在执行new proxy()时

    Reflect对象拥有对应的可以控制各种元编程任务的静态方法。这些功能和Proxy一一对应。

### 基本语法 Reflect
    Reflect只是一个内置的对象，它提供可拦截JavaScript操作的方法。方法与代理处理程序的方法相同（稍后会介绍）。Reflect不是一个函数对象，因此它是不可构造的。
    new Reflect() // 错误的写法
    Reflect提供了一些静态方法，静态方法是指只能通过对象自身访问的方法：
        apply 
        construct 
        defineProperty 
        deleteProperty
        get getPrototype
        set setPrototype
        has 
        isExtensible 
        preventExtensions 
        ownKeys
        getOwnProperty


### demo：基础
```
let target = {}; 
let proxy = new Proxy(target, {}); 
proxy.name = "proxy"; 
console.log(proxy.name); // => "proxy" 
console.log(target.name); // => "proxy" 

target.name = "target"; 
console.log(proxy.name); // => "target" 
console.log(target.name); // => "target"
```
这个示例中的代理将所有操作直接转发到目标，将"proxy"赋值给proxy.name属性时会在目标上创建name，代理只是简单地将操作转发给目标，它不会储存这个属性。由于proxy.name和target.name引用的都是target.name，因此二者的值相同，从而为target.name设置新值后，proxy.name也一同变化。
    
### demo：监听get、set
```js
let target = {}
let handler = {
    get: function (target, key, receiver) {
        console.log(`Getting ${key}!`)
        return Reflect.get(target, key, receiver)
    },
    set: function (target, key, value, receiver) {
        console.log(`Setting ${key}!`)
        return Reflect.set(target, key, value, receiver)
    }
}
let proxy = new Proxy(target, handler)
console.log(proxy.name)
proxy.name = 'test' 
console.log(proxy.name)
proxy.count = 1 
proxy.count++
console.log(proxy.count)

// Getting name!
// undefined
// Setting name!
// Getting name!
// test
// Setting count!
// Getting count!
// Setting count!
// Getting count!
// 2
```
上面代码对一个空对象架设了一层拦截，重新定义了属性的读取(get)和设置(set)行为。

在上面的示例中，我们看到了target、handler和trap：

1. target代表了被代理的对象。这是你需要控制对其访问的对象。它始终作为Proxy构造器的第一个参数被传入，同时它也会被传入每个trap。
2. handler是一个包含了你想要拦截和处理的操作的对象。它会被作为Proxy构造器的第二个参数传入。它实现了Proxy API(比如：get，set，apply等等)。
3. 一个trap代表了handler中一个被处理的函数。因此，如果要拦截get请求你需要创建一个get的trap。以此类推。

### demo:用deleteProperty陷阱防止删除属性
```js
let target = { name: 'target', value: 42 }

let proxy = new Proxy(target, {
  deleteProperty (trapTarget, key) {
    if (key === 'value') {
      return false
    } else {
      return Reflect.deleteProperty(trapTarget, key)
    }
  },
})

// 尝试删除 proxy.value
console.log('value' in proxy)// => true
let result1 = delete proxy.value
console.log(result1)// => false
console.log('value' in proxy)// => true

// 尝试删除 proxy.name
console.log('name' in proxy)// => true
let result2 = delete proxy.name
console.log(result2)// => true
console.log('name' in proxy)// => false
```

handler.deleteProperty检查key是否为"value"，如果是的话返回false，否则调用Reflect.deleteProperty()方法来使用默认行为。

由于通过代理的操作被捕获，因此value属性无法被删除，但name属性就如期被删除了。

如果希望保护属性不被删除，而且在严格模式下不抛出错误，那么这个方法非常实用。
```
let target = { value: 42 } 
Object.defineProperty(target, "name", { configurable: false });
let result2 = delete target.name; // 严格模式下报错
```