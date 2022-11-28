const path = require('path')

const { defineConfig,  } = require('@vue/cli-service')
module.exports = {
 
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: process.env.NODE_ENV === 'production' ? 'dist' : 'devdist',
  transpileDependencies: true,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
          path.join(__dirname, './src/styles/variable.less')
      ]
    },
  },

  devServer: {
    allowedHosts: "all",
    open: false, // 编译完成是否打开网页
    host: '0.0.0.0', // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: 'only', // 开启热加载
    proxy: {
      "vue_admin_api": { //如果接口中有vue_admin-api那么就会匹配到代理上
        target: "http://old.web-jshtml.cn", //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          "^/devApi": '' //如果路径中有devApi就替换为空
        }
      }
    }
  },


}
