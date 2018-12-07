

## loader使用
### url loader
为url-loader添加name配置可以使打包后的文件保持原有的格式：

![添加name](../images/urlloader1.png)

```
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: '[path][name].[ext]',// [hash].[ext]
          },
        }],
      },
```
