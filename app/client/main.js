'use strict';

var xhr = require('xhr')
var traceviewify = require('traceviewify');

var profUrlEl = document.getElementById('cpuprofile-url');
var profBtnEl = document.getElementById('cpuprofile-btn');

profBtnEl.onclick = onloadProfile;

function onloadProfile(e) {
  var url = profUrlEl.value;
  console.log('loading profile from', url);
}
