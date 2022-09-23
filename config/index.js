'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    hot: true,
    disableHostCheck:true,
    proxyTable: {
      '/api': {
        target: 'https://vip-dev.yaozh.com/api/',
        changeOrigin: true,
        secure: false,  // 证书免校验
        pathRewrite: {
          '^/api': '/'
        }
      },
      '/pat': {
          target: 'https://patapi-dev.yaozh.com',
        changeOrigin: true,
        pathRewrite: {
          '^/pat': ''
        },
      },
       '/lineat': {
        target: 'https://patapi.yaozh.com',
       changeOrigin: true,
       pathRewrite: {
         '^/lineat': ''
       }
      },
      // '/mlw': {
      //   // target: 'http://114.55.238.18:8081/mlw',
      //   target: 'http://felog.yaozh.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/mlw': '/'
      //   }
      // }
    },
    // Various Dev Server settings
    host: '0.0.0.0', // can be overwritten by process.env.HOST 可选0.0.0.0 或 localhost
    useLocalIp: true,
    port: 8082, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: false,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    // devtool: 'cheap-module-eval-source-map',
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */
    // 不生成调试用的map文件
    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    //压缩文件大小
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
