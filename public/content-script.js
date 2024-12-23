// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

// Inject script for grpc-web
let s = document.createElement('script');
s.src = chrome.runtime.getURL('external-script.js');
s.type = 'text/javascript';
(document.head || document.documentElement).appendChild(s);
s.onload = function () {
  this.remove();
};

// Inject script for connect-web
var cs = document.createElement('script');
cs.src = chrome.runtime.getURL('connect-web-interceptor.js');
cs.onload = function () {
  this.remove();
};
(document.head || document.documentElement).appendChild(cs);

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
