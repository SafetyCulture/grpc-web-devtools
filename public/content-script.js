// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

let s = document.createElement('script');
s.type = 'text/javascript';
s.src = chrome.extension.getURL('inject.js');
s.onload = function () {
  this.parentNode.removeChild(this);
};
(document.head || document.documentElement).appendChild(s);

var port;

function setupPortIfNeeded() {
  if (!port && chrome && chrome.runtime) {
    port = chrome.runtime.connect(null, { name: "content" });
    port.postMessage({ action: "init" });
    port.onDisconnect.addListener(() => {
      port = null;
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

window.addEventListener("message", function (event) {
  if (event.source != window) return;
  if (event.data.type && event.data.type == "__GRPCWEB_DEVTOOLS__") {
    sendGRPCNetworkCall(event.data);
  }
}, false)
