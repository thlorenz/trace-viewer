'use strict';

var jsonHeaders = { "Content-Type": "application/json" };

var xhr = require('xhr')
var traceviewify = require('traceviewify');

var profUrlEl, profBtnEl, actionsEl, timelineViewEl;

function reportError(err, type) {
  console.error(type, err);
  /* global alert*/
  if (!tv.ui || !tv.ui.Overlay) 
    return alert(type + '\n  ' + err.toString());

  var overlay = new tv.ui.Overlay();
  overlay.textContent = tv.normalizeException(err).message;
  overlay.title = type;
  overlay.visible = true;
}

function onloadedProfile(err, res, body) {
  if (err) return reportError(err, 'Loading error');
  if (res.statusCode !== 200) 
    return reportError(res.statusCode + ': ' + res.rawRequest.statusText, 'Loading error');

  var cpuprofile;
  try {
    cpuprofile = JSON.parse(res.body);
  } catch (e) {
    return reportError(new Error('Invalid cpuprofile: ' + e.message), 'JSON parse error');
  }
  processCpuProfile(cpuprofile);
}

function onloadProfile(e) {
  var url = profUrlEl.value;
  xhr({ uri: url, headers: jsonHeaders }, onloadedProfile);
}

function processCpuProfile(cpuprofile) {
  var trace;
  try {
    trace = traceviewify(cpuprofile);
  } catch(e) {
    return reportError(e,'Conversion error');
  }
  createViewFromTrace(trace);
}

// functionality adapted from ./examples/trace_viewer.html
function createViewFromTrace(trace) {
  /*global tv*/
  var traces = [ trace ];
  var m = new tv.c.TraceModel();
  var p = m.importTracesWithProgressDialog(traces, true);
  p.then(
    function onsuccess() {
      timelineViewEl.model = m;
      timelineViewEl.tabIndex = 1;
      if (timelineViewEl.timeline)
        timelineViewEl.timeline.focusElement = timelineViewEl;
      timelineViewEl.viewTitle = '';
    },
    function onerror(err) {
      reportError(err, 'Import error');
    });
}

function onload() {
  actionsEl = document.getElementById('actions');
  profUrlEl = document.getElementById('cpuprofile-url');
  profBtnEl = document.getElementById('cpuprofile-btn');
  profBtnEl.onclick = onloadProfile;

  timelineViewEl = document.querySelector('x-timeline-view');
  tv.b.ui.decorate(timelineViewEl, tv.TraceViewer);
  timelineViewEl.leftControls.appendChild(actionsEl);

}

window.addEventListener('load', onload);
