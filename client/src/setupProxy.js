const { createProxyMiddleware } = require('http-proxy-middleware');

const authProxy = {
  target: 'http://localhost:8000',
  changeOrigin: true,
};
const apiProxy = {
  target: 'http://localhost:8000',
  changeOrigin: true,
};

module.exports = function (app) {
  app.use('/auth', createProxyMiddleware(authProxy));

  app.use('/api', createProxyMiddleware(apiProxy));
};
