const fs = require('fs');
const https = require('https');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Your CRA server URL and port
const target = 'http://localhost:3000'; 

// Proxy middleware options
const proxyMiddleware = createProxyMiddleware({
  target,
  changeOrigin: true,
  ws: true, // proxy websockets if you use them
  logLevel: 'debug'
});

app.use(proxyMiddleware);

// HTTPS options
const httpsOptions = {
  key: fs.readFileSync('../localhost-key.pem'),
  cert: fs.readFileSync('../localhost.pem')
};

https.createServer(httpsOptions, app).listen(443, () => {
  console.log('HTTPS proxy running on https://localhost');
});
