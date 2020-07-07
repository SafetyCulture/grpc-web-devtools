// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

const injectContent = `
window.__GRPCWEB_DEVTOOLS__ = function (clients) {
  if (clients.constructor !== Array) {
    return
  }
  var messageToJs = function (message) {
    if (message.toObject) {
      return message.toObject();
    }

    return message.toJSON();
  }
  const postType = "__GRPCWEB_DEVTOOLS__";
  var StreamInterceptor = function (method, request, stream) {
    this._callbacks = {};
    const methodType = "server_streaming";
    window.postMessage({
      type: postType,
      method,
      methodType,
      request: messageToJs(request),
    });
    stream.on('data', response => {
      window.postMessage({
        type: postType,
        method,
        methodType,
        response: messageToJs(response),
      });
      if (!!this._callbacks['data']) {
        this._callbacks['data'](response);
      }
    });
    stream.on('status', status => {
      if (status.code === 0) {
        window.postMessage({
          type: postType,
          method,
          methodType,
          response: "EOF",
        });
      }
      if (!!this._callbacks['status']) {
        this._callbacks['status'](status);
      }
    });
    stream.on('error', error => {
      if (error.code !== 0) {
        window.postMessage({
          type: postType,
          method,
          methodType,
          error: {
            code: error.code,
            message: error.message,
          },
        });
      }
      if (!!this._callbacks['error']) {
        this._callbacks['error'](error);
      }
    });
    this._stream = stream;
  }
  StreamInterceptor.prototype.on = function (type, callback) {
    this._callbacks[type] = callback;
    return this;
  }
  StreamInterceptor.prototype.cancel = function () {
    this._stream.cancel()
  }
  clients.map(client => {
    client.client_.rpcCall_ = client.client_.rpcCall;
    client.client_.rpcCall2 = function (method, request, metadata, methodInfo, callback) {
      var posted = false;
      var newCallback = function (err, response) {
        if (!posted) {
          window.postMessage({
            type: postType,
            method,
            methodType: "unary",
            request: messageToJs(request),
            response: err ? undefined : messageToJs(response),
            error: err || undefined,
          }, "*")
          posted = true;
        }
        callback(err, response)
      }
      return this.rpcCall_(method, request, metadata, methodInfo, newCallback);
    }
    client.client_.rpcCall = client.client_.rpcCall2;
    client.client_.unaryCall = function (method, request, metadata, methodInfo) {
      return new Promise((resolve, reject) => {
        this.rpcCall2(method, request, metadata, methodInfo, function (error, response) {
          error ? reject(error) : resolve(response);
        });
      });
    };
    client.client_.serverStreaming_ = client.client_.serverStreaming;
    client.client_.serverStreaming2 = function (method, request, metadata, methodInfo) {
      var stream = client.client_.serverStreaming_(method, request, metadata, methodInfo);
      var si = new StreamInterceptor(method, request, stream);
      return si;
    }
    client.client_.serverStreaming = client.client_.serverStreaming2;
  })
}
`

let s = document.createElement('script');
s.type = 'text/javascript';
const scriptNode = document.createTextNode(injectContent);
s.appendChild(scriptNode);
(document.head || document.documentElement).appendChild(s);
s.parentNode.removeChild(s);

var port;

function setupPortIfNeeded() {
  if (!port && chrome && chrome.runtime) {
    port = chrome.runtime.connect(null, { name: "content" });
    port.postMessage({ action: "init" });
    port.onDisconnect.addListener(() => {
      port = null;
      window.removeEventListener("message", handleMessageEvent, false);
    });
  }
}

function sendGRPCNetworkCall(data) {
  setupPortIfNeeded();
  if (port) {
    port.postMessage({
      action: "gRPCNetworkCall",
      target: "panel",
      data,
    });
  }
}

function handleMessageEvent(event) {
  if (event.source != window) return;
  if (event.data.type && event.data.type == "__GRPCWEB_DEVTOOLS__") {
    sendGRPCNetworkCall(event.data);
  }
}

window.addEventListener("message", handleMessageEvent, false);
