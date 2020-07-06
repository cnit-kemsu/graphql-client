import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

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
    })
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
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@classes': path.resolve(__dirname, 'src/classes/')
    }
  },

  devServer: {
    port: 3000,
    historyApiFallback: true,
    proxy: {
      '/graphql': 'http://localhost:8080/graphql'
    }
  }
};