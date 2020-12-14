# gRPC-Web Dev Tools

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)


![gRPC-Web Dev Tools](screenshots/store_light_dark.png)
Now supports dark mode.

## Installation

### Chrome

Via the [Chrome Web Store](https://chrome.google.com/webstore/detail/grpc-web-developer-tools/ddamlpimmiapbcopeoifjfmoabdbfbjj) (recommended)

or

  1. build it with `make build`
  1. open the **Extension Management** page by navigating to `chrome://extensions`.
  1. enable **Developer Mode** by clicking the toggle switch next to "Developer mode".
  1. Click the **LOAD UNPACKED** button and select the extension `./build` directory.

### Firefox

Via [Firefox Browser Add-Ons](https://addons.mozilla.org/en-US/firefox/addon/grpc-web-developer-tools/) (recommended)

or

  1. build and package with `make package`
  1. enter `about:debugging` in the URL bar of Firefox
  1. click **This Firefox** > **Load Temporary Add-on...**
  1. select the `grpc-web-devtools.zip` extention file

## Usage

```javascript
const devInterceptors = window.__GRPCWEB_DEVTOOLS__ || (() => {});
const {
  devToolsUnaryInterceptor,
  devToolsStreamInterceptor,
} = devInterceptors();

const opts = {
  unaryInterceptors: [devToolsUnaryInterceptor],
  streamInterceptors: [devToolsStreamInterceptor],
};
const client = new EchoServiceClient('http://myapi.com', null, opts);
```
> NOTE: 
> Requires clients use grpc-web >= 1.2.1
> Requires that your generated client(s) use `protoc-gen-grpc-web` >= 1.2.1
> protoc-gen-grpc-web v1.2.1 is bundled

## Example
 
The example uses `docker-compose` to start a simple gRPC server, JavaScript client and the Envoy proxy for gRPC-Web:

```bash
make example-up
```

Example will be running on [http://localhost:8080](http://localhost:8080)

To stop the example:

```bash
make example-down
```
