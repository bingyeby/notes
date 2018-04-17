## 小技巧
### 利用数组解构来实现值的互换
    let a = 'world', b = 'hello'
    [a, b] = [b, a]
    console.log(a) // -> hello
    console.log(b) // -> world

### 展开符...实现数组的拼接
    const one = ['a', 'b', 'c']
    const two = ['d', 'e', 'f']
    const three = ['g', 'h', 'i']

    const result = [...one, ...two, ...three]

### 命名参数
    const getStuffAwesome = ({id, name, force, verbose}) => {
        ...do stuff
    }
    // 完美
    getStuffAwesome({ id: 150, force: true, verbose: true })

### Async/Await结合数组解构
    const [user, account] = await Promise.all([
        fetch('/user'),
        fetch('/account')
    ])



