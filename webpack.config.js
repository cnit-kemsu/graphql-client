import fs from 'fs';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DuplicatesPlugin } from 'inspectpack/plugin';

export default {
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

  mode: 'development'

  // devServer: {
  //   port: 3000,
  //   proxy: {
  //     '/api': 'http://localhost:8080/graphql'
  //   }
  // }
};