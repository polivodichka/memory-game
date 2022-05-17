const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer');

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../memory-game'),
  assets: 'assets/',
}

module.exports = {

  externals: {
    paths: PATHS
  },

  entry: {
    'index': `${PATHS.src}/scripts.js`, //то же что и './src', вспринимается так же как './src/index.js'
  },

  output: {
    filename: `[name].js`, //`${PATHS.assets}js/[name].[hash].js`,
    path: path.resolve(__dirname, PATHS.dist)
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `[name].css`  //`${PATHS.assets}css/[name].[hash].css`
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: `${PATHS.src}/${PATHS.assets}`, to: `${PATHS.assets}` },
      ],
    }),
    new HtmlWebpackPlugin({
      template: `${PATHS.src}/index.html`,
      filename: 'index.html',
      //publicPath: '../../',
      //inject: false,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true,}
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true,}
          }, 
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          type: 'asset',
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
}