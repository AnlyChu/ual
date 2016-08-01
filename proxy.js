// var http = require('http'),
// 	httpProxy = require('http-proxy');
//
//
// // 新建一个代理 Proxy Server 对象
// var proxy = httpProxy.createProxyServer({});
//
//
// // 捕获异常
// proxy.on('error', function(err, req, res) {
// 	res.writeHead(500, {
// 		'Content-Type': 'text/plain'
// 	});
// 	res.end('Something went wrong. And we are reporting a custom error message.');
// });
//
// // 另外新建一个 HTTP 80 端口的服务器，也就是常规 Node 创建 HTTP 服务器的方法。
// // 在每次请求中，调用 proxy.web(req, res config) 方法进行请求分发Create your custom server and just call `proxy.web()` to proxy
// // a web request to the target passed in the options
// // also you can use `proxy.ws()` to proxy a websockets request
// //
//
// var server = require('http').createServer(function(req, res) {
// 	// You can define here your custom logic to handle the request
// 	// and then proxy the request.
// 	// var host = req.url;
// 	// host = req.parse(host);
// 	// host = host.host;
//
// 	var local = "http://localhost:8088";
// 	var test_server="http://172.18.21.65:10080";
//
//
// 	// #121.41.75.25 #120.55.99.137
//
// 	var target = req.url.indexOf("v1") == -1 ? local : test_server;
//
// 	//console.log("host:" + req.headers.host);
// 	//console.log("client ip:" + (req.headers['x-forwarded-for'] || req.connection.remoteAddress));
//
// 	proxy.web(req, res, {
// 		target: target
// 	});
// });
//
// console.log("listening on port 8088")
// server.listen(8088);


var path = require('path');
var jsonServer = require('json-mock-kuitos');
var webpack = require('webpack');
var config = require('./webpack.config');
var app = jsonServer.create();
var compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    stats: {
        colors: true
    },
    publicPath: '/src/dist/webpack'
}));
app.use(require('webpack-hot-middleware')(compiler));

// var apiPrefix = '';
// var filename = process.cwd() + '/mock/db.json';
var proxyHost = '172.18.21.106';
var proxyPort = '';

app.use(jsonServer.defaults({static: process.cwd() + '/'}));
// app.use(jsonServer.router(apiPrefix, filename));
app.use(jsonServer.NON_STATIC_FILE, jsonServer.proxy(proxyHost, proxyPort));

app.listen(3000, 'localhost', function (err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Listening at http://localhost:3000');
});