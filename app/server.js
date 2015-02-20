'use strict';

var PORT = 9000;
var fs = require('fs');
var path = require('path');
var http = require('http');
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

function serveError (res, err) {
  console.error(err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(err.toString());
}

function serveIndex (res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  fs.createReadStream(path.join(client, 'index.html')).pipe(res); 
}

function serveBundle (res) {
  res.writeHead(200, { 'Content-Type': 'application/javascript' });
  fs.createReadStream(path.join(client, 'bundle.js')).pipe(res); 
}

function serveCss (res) {
  res.writeHead(200, { 'Content-Type': 'text/css' });
  fs.createReadStream(path.join(client, 'index.css')).pipe(res); 
}

function serveCpuProfile (res) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  fs.createReadStream(path.join(fixtures, 'fibonacci.cpuprofile')).pipe(res); 
}

function onRequest(req, res) {
  console.error('%s %s', req.method, req.url);

  if (req.url === '/') return serveIndex(res);
  if (req.url === '/bundle.js') return serveBundle(res);
  if (req.url === '/index.css') return serveCss(res);
  if (req.url === '/cpuprofile') return serveCpuProfile(res);

  res.writeHead(404);
  res.end();
}

function onListening() {
  console.error('HTTP server listening on port', PORT);
}
