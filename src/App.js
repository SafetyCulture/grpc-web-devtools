/*global chrome*/

import React, { Component } from 'react';
import './App.css';
import { decodeStringToUint8Array } from './base64';
import GrpcWebStreamParser from './GrpcWebStreamParser';


class App extends Component {

  state = {
    requests: [],
  }

  services = null;
  hooksFound = false;
  checkInterval = null;

  checkforHook() {
    if (this.hooksFound) {
      return;
    }

    chrome.devtools.inspectedWindow.eval("window.__GRPCWEB_DEVTOOLS__", hooks => {
      if (hooks && hooks.services) {
        this.services = hooks.services;
        this.hooksFound = true;
        clearInterval(this.checkInterval);
      }
    })
  }

  componentDidMount() {
    this.props.port.onMessage.addListener(this._onMessageRecived)
  }

  _onMessageRecived = ({ action, data }) => {
    if (action === "gRPCNetworkCall") {
      const { requests } = this.state;
      requests.push(data)
      this.setState({ requests });
    }
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => {
          this.props.port.postMessage({
            action: "clearPage",
            target: "content",
            tabId: this.props.tabId,
          });
        }}>Clear</button>
        {this.state.requests.map(req => {
          return (
            <div>
              <h3>{req.method}</h3>
              <div>Request: {JSON.stringify(req.request)}</div>
              <div>Response: {JSON.stringify(req.response)}</div>
              <hr></hr>
            </div>
          )
        })}
      </div>
    );
  }
}


function getData(responseText) {
  var newPos = responseText.length - responseText.length % 4;
  var newData = responseText.substr(0, newPos);
  var byteSource = decodeStringToUint8Array(newData);

  var parser = new GrpcWebStreamParser()

  var messages = parser.parse([].slice.call(byteSource));
  if (messages) {
    var FrameType = GrpcWebStreamParser.FrameType;
    for (var i = 0; i < messages.length; i++) {
      if (FrameType.DATA in messages[i]) {
        return messages[i][FrameType.DATA];
      }
    }
  }
}

export default App;
