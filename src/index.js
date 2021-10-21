/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import App from './App';
import './index.css';
import networkReducer, { networkLog, clearLog } from './state/network';
import toolbarReducer from './state/toolbar';
import clipboardReducer from './state/clipboard';

var port, tabId
// Setup port for communication with the background script
if (chrome) {
  try {
    tabId = chrome.devtools.inspectedWindow.tabId;
    port = chrome.runtime.connect(null, { name: "panel" });
    port.postMessage({ tabId, action: "init" });
    port.onMessage.addListener(_onMessageRecived);
    chrome.tabs.onUpdated.addListener(_onTabUpdated);

  } catch (error) {
    console.warn("not running app in chrome extension panel")
  }
}

const store = configureStore({
  reducer: {
    network: networkReducer,
    toolbar: toolbarReducer,
    clipboard: clipboardReducer,
  }
});

function _onMessageRecived({ action, data }) {
  if (action === "gRPCNetworkCall") {
    store.dispatch(networkLog(data));
  }
}

function _onTabUpdated(tId, { status }) {
  if (tId === tabId && status === "loading") {
    store.dispatch(clearLog());
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

