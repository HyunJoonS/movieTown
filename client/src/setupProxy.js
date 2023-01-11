const { createProxyMiddleware } = require("http-proxy-middleware");
const server_port = 8001
module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api/", {
      target: "http://localhost:"+server_port,
      changeOrigin: true,
    })
  );
};