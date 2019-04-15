
var port;

function setupPortIfNeeded() {
  if (!port) {
    port = chrome.runtime.connect(null, { name: "content" });
    port.postMessage({ action: "init" });
    port.onDisconnect.addListener(() => {
      port = null;
    });
  }
}

function sendGRPCNetworkCall(data) {
  setupPortIfNeeded();
  port.postMessage({
    action: "gRPCNetworkCall",
    target: "panel",
    data,
  });
}

window.addEventListener("message", function (event) {
  if (event.source != window) return;
  if (event.data.type && event.data.type == "__GRPCWEB_DEVTOOLS__") {
    console.log(event.data)
    sendGRPCNetworkCall(event.data);
  }
}, false)
