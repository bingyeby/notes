### 使用babel-node
    1. 安装 "@babel/node": "^7.16.0",  "@babel/preset-env": "^7.16.0",
    2. 添加配置文件
    3. 执行 npx babel-node  ./src/jijin/index.es.js

### 示例文件:
```js
// babel.config.js 
module.exports = {
  'presets': ['@babel/preset-env'],
}

```

```js
// D:\00\node.crawler\src\util\index.js
const _ = require('lodash')
const fss = require('fs-extra')

const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent) //设置字符

/*
* 异步map
* */
async function asyncMap(array, callback) {
  let arr = []
  for (let index = 0; index < array.length; index++) {
    arr.push(await callback(array[index], index, array))
  }
  return [arr]
}

module.exports = {
  asyncMap,
  asyncEach,
  delay,
}
```

```js
//  D:\00\node.crawler\src\jijin\index.es.js
import * as util from '../util/index.js'

util.urlResponse('http://fund.eastmoney.com/pingzhongdata/002190.js?v=20211105150850', {
  charset: 'utf-8',
}).then((res) => {
  let a = eval(`${res}; global.Data_fundSharesPositions  = Data_fundSharesPositions `)
//   无法在Node.js ES6中使用eval创建变量(Fail to create variable using eval in Node.js ES6)

  console.log(`global.Data_fundSharesPositions`, global.Data_fundSharesPositions)
})
```

