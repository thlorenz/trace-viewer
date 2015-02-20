'use strict';

var PORT = 9000;
var fs = require('fs');
var path = require('path');
var http = require('http');
var root = path.join(__dirname, '..');
var client = path.join(__dirname, 'client');
var fixtures = path.join(__dirname, 'fixtures');

var server = http.createServer();

server
  .on('request', onRequest)
  .on('listening', onListening)
  .listen(PORT);

process.on('SIGTERM', onSIGTERM);

function onSIGTERM() {
  console.log('Caught SIGTERM, shutting down.');
  server.close();
  process.exit(0);
}

console.error('pid', process.pid);

function getContentType(url) {
  var ext = path.extname(url).slice(1);
  switch(ext) {
    case 'html' : return 'text/html';
    case 'css'  : return 'text/css';
    case 'js'   : return 'application/javascript';
    case 'json' : return 'application/json';
    case 'map'  : return 'application/map';
    default     : console.error('Unknown extension for ' + url); return '';
  }
}
function serveError(res, err) {
  console.error(err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(err.toString());
}

function serveHtml(res, fullPath) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream(fullPath).pipe(res); 
}

function serveJavaScript(res, fullPath) {
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  fs.createReadStream(fullPath).pipe(res); 
}

function serveIndex(res) {
  serveHtml(res, path.join(client, 'index.html'));
}

function serveBundle(res) {
  serveJavaScript(res, path.join(client, 'bundle.js'));
}

function serveCss(res) {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  fs.createReadStream(path.join(client, 'index.css')).pipe(res); 
}

function serveCpuProfile(res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  fs.createReadStream(path.join(fixtures, 'fibonacci.cpuprofile')).pipe(res); 
}

function serveComponent(res, url) {
  res.writeHead(200, { 'Content-Type': getContentType(url) });
  fs.createReadStream(path.join(root, 'third_party', url)).pipe(res); 
}

function serveTrace_Viewer(res, url) {
  res.writeHead(200, { 'Content-Type': getContentType(url) });
  fs.createReadStream(path.join(root, 'trace_viewer', url)).pipe(res); 
}

function onRequest(req, res) {
  console.error('%s %s', req.method, req.url);

  if (req.url === '/') return serveIndex(res);
  if (req.url === '/bundle.js') return serveBundle(res);
  if (req.url === '/index.css') return serveCss(res);
  if (req.url === '/cpuprofile') return serveCpuProfile(res);

  // traceviewer/polymer deps
  if (req.url === '/trace_viewer.html') 
    return serveHtml(res, path.join(root, 'trace_viewer/trace_viewer.html'));
  if (req.url === '/gl-matrix-min.js')
    return serveJavaScript(res, path.join(root, 'third_party', 'gl-matrix', 'dist', 'gl-matrix-min.js'));
  if (req.url === '/d3.min.js')
    return serveJavaScript(res, path.join(root, 'third_party', 'd3', 'd3.min.js'));
  if (req.url === '/jszip.min.js')
    return serveJavaScript(res, path.join(root, 'third_party', 'jszip', 'jszip.min.js'));

  if (/^\/(base|core|extras)/.test(req.url)) return serveTrace_Viewer(res, req.url);
  if (/^\/components/.test(req.url)) return serveComponent(res, req.url);

  console.error('Could not find', req.url);
  res.writeHead(404);
  res.end();
}

function onListening() {
  console.error('HTTP server listening on port', PORT);
}
