/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import './index.css';
import networkReducer, {clearLog, networkLog} from './state/network';
import toolbarReducer from './state/toolbar';
import clipboardReducer from './state/clipboard';
import {configureStore} from "@reduxjs/toolkit";

let panelCreated = false;

const store = configureStore({
  reducer: {
    network: networkReducer,
    toolbar: toolbarReducer,
    clipboard: clipboardReducer,
  },
});

ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('root'),
  createPanelIfReactLoaded);

// Setup port for communication with the background script
function createPanelIfReactLoaded() {
  if (!(chrome?.runtime) || panelCreated)
    return;

  panelCreated = true;
  clearInterval(loadCheckInterval);

  try {
    const tabId = chrome.devtools.inspectedWindow.tabId;
    const port = chrome.runtime.connect(null, {name: "panel"});
    port.postMessage({tabId, action: "init"});

    function _onMessageReceived({action, data}) {
      if (action === "gRPCNetworkCall") {
        store.dispatch(networkLog(data));
      }
    }

    function _onTabUpdated(tId, {status}) {
      if (tId === tabId && status === "loading") {
        store.dispatch(clearLog());
      }
    }

    port.onMessage.addListener(_onMessageReceived);
    chrome.tabs.onUpdated.addListener(_onTabUpdated);

  } catch (error) {
    console.warn("not running app in chrome extension panel")
  }
}

chrome?.devtools.network.onNavigated.addListener(createPanelIfReactLoaded);

// Check to see if React has loaded once per second in case React is added
// after page load
const loadCheckInterval = setInterval(function() {
  createPanelIfReactLoaded();
}, 1000);
