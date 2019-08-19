import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { DuplicatesPlugin } from 'inspectpack/plugin';

export default {
  mode: 'development',
  devtool: 'inline-source-map',
  target: 'web',

  entry: './example/public/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          'src',
          'node_modules/@kemsu',
          'example/public',
        ].map(incl => path.resolve(__dirname, incl)),
        loader: 'babel-loader',
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './example/public/index.html'
    }),
    new DuplicatesPlugin({})
  ],

  optimization: {
    namedChunks: true,
    namedModules: false,
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

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@lib': path.resolve(__dirname, 'src/lib/')
    }
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8080/graphql'
    }
  }
};