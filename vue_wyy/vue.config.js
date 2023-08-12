module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        assets: "@/assets",
        common: "@/common",
        components: "@/components",
        network: "@/network",
        views: "@/views",
        plugins: "@/plugins",
      },
    },
  },
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
  },
};
