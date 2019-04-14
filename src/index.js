/* global chrome */

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Setup port for communication with the background script
var port = chrome.runtime.connect(null, { name: "panel" });
var tabId = chrome.devtools.inspectedWindow.tabId;

function post(message) {
  message.tabId = tabId;
  port.postMessage(message);
}


ReactDOM.render(<App port={port} tabId={tabId} />, document.getElementById('root'));

// Sent initialization message.
post({ action: "init" });