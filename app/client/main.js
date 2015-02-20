'use strict';

var jsonHeaders = { "Content-Type": "application/json" };

var xhr = require('xhr')
var traceviewify = require('traceviewify');

var profUrlEl = document.getElementById('cpuprofile-url');
var profBtnEl = document.getElementById('cpuprofile-btn');

profBtnEl.onclick = onloadProfile;

function logError(err) {
  console.error(err);
}

function onloadedProfile(err, res, body) {
  if (err) return console.error(err);
  try {
    var cpuprofile = JSON.parse(res.body);
    processCpuProfile(cpuprofile);
  } catch (e) {
    logError(new Error('Invalid cpuprofile: ' + e.message));
  }
}

function onloadProfile(e) {
  var url = profUrlEl.value;
  console.log('loading profile from', url);
  xhr({ uri: url, headers: jsonHeaders }, onloadedProfile);
}

function processCpuProfile(cpuprofile) {
  var traceview = traceviewify(cpuprofile);
}
