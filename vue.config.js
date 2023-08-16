// const { defineConfig } = require('@vue/cli-service')
let proxyObj = {}
proxyObj['/'] = {
  ws: false,
  target: 'http://localhost:8081',
  changeOrigin: true,
  pathRewrite: {
    '^/': ''
  }
}
// module.exports = defineConfig({
//   transpileDependencies: true
// })
module.exports = {
  devServer: {
    host: 'localhost',
    port: 8080,
    proxy: proxyObj
  },
}