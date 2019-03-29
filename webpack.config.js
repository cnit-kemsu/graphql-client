const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DuplicatesPlugin } = require('inspectpack/plugin');

module.exports = {
  devtool: 'inline-source-map',
  target: 'web',
  entry: './test/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'test'),
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@implicit')
        ],
        loader: 'babel-loader',
        options: JSON.parse(fs.readFileSync('.babelrc'))
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'graphql-client',
      template: './test/index.html'
    }),
    new DuplicatesPlugin({})
  ],
  cache: true,

  optimization: {
    namedChunks: true,
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  },

  devServer: {
    port: 3000
  }
};