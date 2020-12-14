// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.
/* global chrome */

const kMessageSource = "__GRPCWEB_DEVTOOLS__";

let port;

function injectors(msgSource) {

  const MethodType = {
    UNARY: 'unary',
    SERVER_STREAMING: 'server_streaming'
  };

  const requestMethodName = (req) => req?.getMethodDescriptor().name ?? 'Unknown'

  const postMessage = (type, name, reqMsg, resMsg, error) => {
    const request = reqMsg?.toObject();
    const response = error ? undefined : resMsg?.toObject();
    error = error ? (({code, message}) => ({ code, message }))(error) : error;
    const msg = {
      source: msgSource,
      methodType: type,
      method: name,
      request,
      response,
      error
    };
    window.postMessage(msg, '*');
  }

  class DevToolsUnaryInterceptor {
    type = MethodType.UNARY;

    postResponse = (name, req, res) => {
      postMessage(this.type, name, req?.getRequestMessage(), res?.getResponseMessage());
      return res;
    }

    postError = (name, req, error) => {
      if (error.code === 0) return error;
      postMessage(this.type, name, req?.getRequestMessage(), undefined, error);
      return error;
    }

    intercept = (request, invoker) => {
      const name = requestMethodName(request);
      return invoker(request)
        .then((response) => this.postResponse(name, request, response))
        .catch((error) => { throw this.postError(name, request, error) });
    }
  }

  class DevToolsStreamInterceptor {

    intercept(request, invoker) {

      class InterceptedStream {
        type = MethodType.SERVER_STREAMING;
        name;
        stream;

        constructor(request, invoker) {
          this.name = requestMethodName(request);
          this.stream = invoker(this.postStreamRequest(request));
        };

        postStreamRequest = (req) => {
          postMessage(this.type, this.name, req?.getRequestMessage());
          return req;
        }

        postStreamData = (data) => {
          postMessage(this.type, this.name, undefined, data);
          return data;
        }

        postStreamError = (error) => {
          if (error.code === 0) return error;
          postMessage(this.type, this.name, undefined, undefined, error);
          return error;
        }

        postStreamStatus = (status) => {
          if (status.code !== 0) return status;
          // FIXME: this is a semi-ugly hack. We add
          //  toObject() => 'EOF' to the status object
          //  to mimic an reqMes and make postMessage
          //  happy. In the future, maybe status could
          //  be handled properly.
          status.toObject = () => 'EOF';
          return this.postStreamData(status);
        }

        on = (eventType, callback) => {
          if (eventType === 'data') {
            const dataCallback = (data) => {
              callback(this.postStreamData(data));
            }
            this.stream.on(eventType, dataCallback);
          } else if (eventType === 'error') {
            const errorCallback = (error) => {
              callback(this.postStreamError(error));
            }
            this.stream.on('error', errorCallback);
          } else if (eventType === 'metadata') {
            this.stream.on('metadata', callback);
          } else if (eventType === 'status') {
            const statusCallback = (status) => {
              callback(this.postStreamStatus(status));
            }
            this.stream.on('status', statusCallback);
          } else if (eventType === 'end') {
            this.stream.on('end', callback);
          }
          return this;
        };

        removeListener(eventType, callback) {
        }

        cancel() {
        }
      }

      return new InterceptedStream(request, invoker);
    };
  }

  return {
    // this is how it should work
    devToolsUnaryInterceptor: new DevToolsUnaryInterceptor(),
    devToolsStreamInterceptor: new DevToolsStreamInterceptor(),
  };
}

const injectContent = `window.__GRPCWEB_DEVTOOLS__ = () => ${injectors}("${kMessageSource}");`

let s = document.createElement('script');
s.type = 'text/javascript';
const scriptNode = document.createTextNode(injectContent);
s.appendChild(scriptNode);
(document.head || document.documentElement).appendChild(s);
s.parentNode.removeChild(s);

function setupPortIfNeeded() {
  if (!port && chrome?.runtime) {
    port = chrome.runtime.connect(null, {name: "content"});
    port.postMessage({action: "init"});
    port.onDisconnect.addListener(handleDisconnect);
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
  if (
    event.source === window &&
    event?.data.source === kMessageSource
  ) {
    sendGRPCNetworkCall(event.data);
  }
}

function handleDisconnect() {
  port = null;
  window.removeEventListener("message", handleMessageEvent, false);
}

window.addEventListener("message", handleMessageEvent, false);
