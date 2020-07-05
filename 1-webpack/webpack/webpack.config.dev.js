/**
 * Dev mode config
 */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

 
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
 

module.exports = {
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server', // HotModuleReplacementPlugin
    './src/index',
  ],
  output: {
    libraryExport: 'default',
    path: path.resolve(__dirname, 'dist'),
    // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）
    filename: 'bundle.js',
    publicPath: '/',
    chunkFilename: '[name].[chunkhash:5].js',
  },
  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000',
    },
    contentBase: path.join(__dirname, 'dist'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
    alias: {
      src: path.resolve(__dirname, './src'), 
    },
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loaders: 'babel-loader',
        include: path.join(__dirname, 'src'),
        options: {
          plugins: [
            ['import', [{ libraryName: 'antd', style: true }]],
          ],
        },

      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader', 
          },
        ],
      },
      {
        test: /\.less$/,
        include: path.join(__dirname, 'src'),
        use: [
          { loader: 'style-loader' }, // creates style nodes from JS strings
          {
            loader: 'css-loader',
            options: { modules: true, localIdentName: '[local]-[hash:base64:5]' },
          },// translates CSS into CommonJS
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader', options: {  javascriptEnabled: true, },
          } // compiles Less to CSS
        ],
      },
      {
        test: /\.less$/,
        include: path.join(__dirname, 'node_modules'),
        use: [
          { loader: 'style-loader' }, // creates style nodes from JS strings
          { loader: 'css-loader', },// translates CSS into CommonJS
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader', options: { javascriptEnabled: true, },
          } // compiles Less to CSS
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot).*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 3000,
              name: 'fonts/fontawesome/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(svg|png|jpg|gif|ico).*$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 3000,
              name: 'image/[name]-[hash:5].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(pdf)$/,
        loader: 'file-loader', // 'file-loader?name=[path][name].[ext]',
      },
    ],
  },
  plugins: [
 
    new webpack.HotModuleReplacementPlugin(),

 

    // index.html
    new HtmlWebpackPlugin({ // 打包输出HTML
      title: 'CAMS',
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      },
      filename: 'index.html',
      template: 'index.html',
      jsList: Object.keys(dllConfig.entry).map((n) => n + '.dll.js'),
    }),

    // 进度条
    new ProgressBarPlugin(),
  ],
}
