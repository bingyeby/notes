const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const lightTheme = require('./src/lightTheme')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

let themeName = 'lightTheme'

module.exports = {
  mode: 'production',
  entry: './src/_index',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: './',
    chunkFilename: '[name].[chunkhash:5].js',
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.css'],
    alias: {
      src: path.resolve(__dirname, './src'),
      darkTheme: path.resolve(__dirname, './src/darkTheme'),
      lightTheme: path.resolve(__dirname, './src/lightTheme'),
    },
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // 比如你要单独把 node_modules 中的官方库文件打包到一起，就可以使用这个缓存组，如想具体到库文件（lodash）为例，就可把test写到具体目录下
        moment: {
          chunks: 'initial',
          test: /moment/,
          name: 'moment',
          priority: 10,// 权重
          enforce: true,
        },
        echarts: {
          chunks: 'initial',
          test: /echarts/,
          name: 'echarts',
          priority: 10,// 权重
          enforce: true,
        },
      },
    },
  },
  // devtool: 'source-map',
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
        use: [MiniCssExtractPlugin.loader, { loader: 'css-loader', }],
        // options: { modules: true, localIdentName: '[path][name]__[local]--[hash:base64:5]' }
        // http://www.ruanyifeng.com/blog/2016/06/css_modules.html
        // https://www.npmjs.com/package/css-loader#modules
        // https://blog.csdn.net/pcaxb/article/details/53896661
        // https://blog.csdn.net/qq_18663357/article/details/54317686
      },
      {
        test: /\.less$/,
        include: path.join(__dirname, 'src'),
        use: [
          { loader: MiniCssExtractPlugin.loader }, // creates style nodes from JS strings
          {
            loader: 'css-loader',
            options: { modules: true, localIdentName: '[local]-[hash:base64:5]' },
          },// translates CSS into CommonJS
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader', options: { modifyVars: lightTheme, javascriptEnabled: true, },
          } // compiles Less to CSS
        ],
      },
      {
        test: /\.less$/,
        include: path.join(__dirname, 'node_modules'),
        use: [
          { loader: MiniCssExtractPlugin.loader }, // creates style nodes from JS strings
          { loader: 'css-loader', },// translates CSS into CommonJS
          { loader: 'postcss-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader', options: { modifyVars: lightTheme, javascriptEnabled: true, },
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
    // new webpack.optimize.OccurenceOrderPlugin(),

    // 提取样式文件
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash:5].css',
      chunkFilename: '[id]-[chunkhash:5].css',
    }),

    // 删除文件
    new CleanWebpackPlugin(),

    // 设置NODE_ENV
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),

    // 设置全局变量
    new webpack.ProvidePlugin({
      color: themeName,
    }),

    // 压缩代码加速
    new ParallelUglifyPlugin({
      cacheDir: '.cache/',
      uglifyJS: {
        output: {
          comments: false,
        },
      },
    }),

    // 拷贝文件
    // new CopyWebpackPlugin([{ from: path.resolve(__dirname, './static.dll'), to: './', },]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, './static'), to: './static', },]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, './src/config.js'), to: './', },]),
    new CopyWebpackPlugin([{ from: path.resolve(__dirname, './src/config.prod.js'), to: './', },]),

    // DllReferencePlugin 但是线上环境dll暂无异步请求方案,使用cacheGroups方案，并行请求js
    // ...[].map(name => {
    //   return new webpack.DllReferencePlugin({
    //     context: __dirname,
    //     manifest: require(`./static.dll/${name}-manifest.json`),
    //   })
    // }),

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
      jsList: ['./config.js'],
    }),

    //  文件分析
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   reportFilename: 'report.html',
    // }),
  ],
}
