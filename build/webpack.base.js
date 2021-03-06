/**
 * @file 基础配置
 * @author atom-yang
 */

/* eslint-env node */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {
  ROOT,
  OUTPUT_PATH,
  isProdMode,
  ENTRIES,
  PAGES,
  getLessVariables
} = require('./util');

const copies = [];

const baseConfig = {
  entry: ENTRIES,
  output: {
    path: OUTPUT_PATH
  },
  resolve: {
    modules: [path.resolve(ROOT, 'src'), path.resolve(ROOT, 'node_modules')],
    extensions: ['.jsx', '.js'],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      '@src': path.resolve(__dirname, '../src'),
      '@public': path.resolve(__dirname, '../public'),
      '@img': path.resolve(__dirname, '../public', 'img'),
      '@components': path.resolve(__dirname, '../src', 'components'),
      '@pages': path.resolve(__dirname, '../src', 'pages'),
      '@routes': path.resolve(__dirname, '../src', 'routes'),
      '@utils': path.resolve(__dirname, '../src', 'utils')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.less$/,
        use: [
          isProdMode ? MiniCssExtractPlugin.loader : 'style-loader', // style-loader works for hot refresh style
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: {},
              globalVars: getLessVariables(
                path.resolve(ROOT, 'src/style/globalVariables.less')
              )
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/img/[name]-[hash:5].[ext]',
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|ttf|eot|svg)(#.+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'static/fonts/[name].[ext]',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ...PAGES.map(({ name, config }) => {
      let chunks = [name];
      const filename = path.resolve(OUTPUT_PATH, config.name || `${name}.html`);
      if (isProdMode) {
        const runtime = `runtime.${name}`;
        chunks = [runtime, 'vendors', name];
      }
      return new HtmlWebpackPlugin({
        template: path.resolve(ROOT, './template.ejs'),
        filename,
        chunks,
        name,
        title: config.title,
        minify: {
          //压缩HTML文件
          removeComments: true, //移除HTML中的注释
          collapseWhitespace: false //删除空白符与换行符
        },
        favicon: './public/img/favicon.ico'
      });
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new CopyWebpackPlugin(copies),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.LOCALE': JSON.stringify(process.env.LOCALE || 'zh')
    })
  ]
};

module.exports = baseConfig;
