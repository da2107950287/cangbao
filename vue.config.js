module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'assets': '@/assets',
        'views': '@/views',
      }
    },

  },
  devServer: {
    proxy: {
      "/treasurebsg": {
        target: "http://47.111.244.224:81/treasurebsg",
        changeOrigin: true,
        pathRewrite: { '^/treasurebsg': '' }
      },
    }
  }
}