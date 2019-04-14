
var port;
port = chrome.runtime.connect(null, { name: "content" });
port.postMessage({ action: "init" });
port.onDisconnect.addListener(() => {
  console.log("disconnect")
  port = null;
});


// Handle requests coming from the panel
port.onMessage.addListener(message => {
  console.log(message)
  switch (message.action) {
    case "clearPage":
      window.document.body.innerHTML = "";
      break;
  }
  console.log(window.__GRPCWEB_DEVTOOLS__.services)
});

