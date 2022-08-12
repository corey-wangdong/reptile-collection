const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: path.resolve(__dirname,'../src/index.tsx')
  },
  output:{
    filename:'[name].js',
    path: path.resolve(__dirname,'../dist')
  },
  mode:'development',
  devtool:'eval-cheap-module-source-map',
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'../src')
    },
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  module: {
    rules:[
      {
        test:/\.(jsx|tsx|js)?$/,
        use:'babel-loader',
        exclude:/node_modules/
      },
      {
        test:/\.scss$/,
        use:[
          {
            loader:'style-loader'
          },
          {
            loader:'css-loader',
            options: {
              modules: {
                localIdentName: '[local]--[hash:base64:5]'
              }
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, '../postcss.config.js')
              }
            }
          },
          {
            loader:'sass-loader',
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin({
      filename:'./index.html',
      template:'./public/index.html'
    })
  ],
  devServer:{
    hot: true,
    host: 'local-ip',
    open: true
  }
}