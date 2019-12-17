### loader
    loader是文件加载器，能够加载资源文件，并对这些文件进行一些处理，诸如编译、压缩等，最终一起打包到指定的文件中
        处理一个文件可以使用多个loader，loader的执行顺序是和本身的顺序是相反的，即最后一个loader最先执行，第一个loader最后执行。
        第一个执行的loader接收源文件内容作为参数，其他loader接收前一个执行的loader的返回值作为参数。最后执行的loader会返回此模块的JavaScript源码

```js
module.exports = function (src) {
 if (src) {
  console.log('--- reverse-loader input:', src)
  src = src.split('').reverse().join('')
  console.log('--- reverse-loader output:', src)
 }
 return src;
}
```
```json
 module: {
  rules: [
   ...,
   {
    test: /\.txt$/,
    use: [
     './loader/uppercase-loader.js',
     './loader/reverse-loader.js'
    ]
   }
  ]
 }
```
处理一个文件可以使用多个loader，loader的执行顺序是和本身的顺序是相反的

资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw，loader 可以接收原始的 Buffer。