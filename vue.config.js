module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        'components': '@/components',
        'assets': '@/assets',
        'utils':'@/utils',
        'views': '@/views',
        'vue$': 'vue/dist/vue.esm.js' 
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