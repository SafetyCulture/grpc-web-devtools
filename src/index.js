/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from 'redux-starter-kit';
import App from './App';
import './index.css';
import networkReducer, { networkLog } from './state/network';



var port
// Setup port for communication with the background script
if (chrome) {
  try {
    port = chrome.runtime.connect(null, { name: "panel" });
    const tabId = chrome.devtools.inspectedWindow.tabId;
    // Sent initialization message.
    port.postMessage({ tabId, action: "init" });
    port.onMessage.addListener(_onMessageRecived);
  } catch (error) {
    console.warn("not running app in chrome extension panel")
  }
}

const store = configureStore({
  reducer: {
    network: networkReducer,
  }
});

function _onMessageRecived({ action, data }) {
  if (action === "gRPCNetworkCall") {
    store.dispatch(networkLog(data))
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

