import fs from 'fs';
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DuplicatesPlugin } from 'inspectpack/plugin';

export default {
  devtool: 'inline-source-map',
  mode: 'development',
  cache: true,

  target: 'web',

  entry: [
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr&reload=true',
    './test/app.js'
  ],
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
          'src',
          'node_modules/@kemsu',
          'test'
        ].map(_ => path.resolve(__dirname, _)),
        loader: 'babel-loader',
        options: fs.readFileSync('.babelrc') |> JSON.parse
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'graphql-client',
      template: './test/index.html'
    }),
    new DuplicatesPlugin({}),
  ],

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
  }
};