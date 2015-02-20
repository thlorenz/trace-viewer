## Getting Started

### Running Standalone App

- this app loads `cpuprofile`s from a provided url, converts it to trace-viewer format and then displays the
  visualization
- there are two parts to getting started

#### Generating the Bundle

```sh
npm run bundle
```

In case you want to want to hack on the client side run:

```sh
npm run watch
```

#### Starting the Server

```sh
npm start
```

Open [localhost:9000](http://localhost:9000) and click the *Load* button. The URL entered by default points to our dev
server which provides the sample `cpuprofile`.

Obviously the idea is to point this at any url, i.e. a node app we are inspecting.

### Starting Trace Viewer DevServer and Opening Example Page

```sh
./run_dev_server
```

Open [examples/trace_viewer.html](http://localhost:8003/examples/trace_viewer.html).

### Investigating Example

Select an interesting example in dropdown on left, i.e one of the below:

- **Perf Sampling Trace** doesn't have very interesting timelines, but clicking on any of the links on the left reveals
  a nice sunburst view in the bottom. Sunbursts are only shown if `stackFrames` are included as part of the `traceview.json`
  file
- **Traceviewify** another example showing nice timeline and sunburst. This was generated with
  [traceviewify](https://github.com/thlorenz/traceviewify) from a running io.js app
- **Simple Trace** another trace with timeline and samples

### chrome://inspect

Another interesting aspect to play with is [chrome://inspect](chrome://inspect/?browser-inspector=http://localhost:8003/examples/chrome_inspect_test_shell.html#pages)

- click *inspect* on any of the pages to launch DevTools on it
- the other tabs on the left are also interesting
