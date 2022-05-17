const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf')


module.exports = merge(baseWebpackConfig, {
    mode: 'development',
    devtool: 'eval-cheap-module-source-map',
    //devtool: 'inline-source-map',
    devServer: {
        port: 8081,
        static: {
            watch: true,
            directory: '**/*.html',
        },
        //historyApiFallback: {
        //    rewrites: [
        //      { from: /^\/$/, to: '/pages/main/index.html' },
        //      { from: /^\/pets/, to: '/pages/pets/index.html' },
        //      { from: /^\/main/, to: '/pages/main/index.html' },
        //    ],
        //  },
        //watchFiles: ['dist/pages/**/index.html'],
    },
    plugins:[
        new webpack.SourceMapDevToolPlugin({
            filename:'[file].map'
        })
    ]
})
