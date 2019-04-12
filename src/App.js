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
    if (window.chrome && window.chrome.devtools) {

      chrome.devtools.network.onNavigated.addListener(() => {
        this.checkforHook();
      });
      this.checkInterval = setInterval(() => this.checkforHook, 1000);
      this.checkforHook();

      chrome.devtools.network.onRequestFinished.addListener(rtn => {
        if (rtn.request.postData && rtn.request.postData.mimeType === "application/grpc-web-text") {
          const { requests } = this.state;
          var url = new URL(rtn.request.url)

          var grpcRequest = {
            path: url.pathname,
            obj: null,
          }

          if (this.hooksFound && this.services[url.pathname]) {            
            rtn.getContent((content, encoding) => {
            
              var data = getData(atob(content))

              chrome.devtools.inspectedWindow.eval(`window.__GRPCWEB_DEVTOOLS__.services[${url.pathname}]requestDeserializeFn("${data}")`, (out,err) => {
                console.log(out,err);
              })

              // grpcRequest.obj = convertResponse(atob(content), this.services[url.pathname].requestDeserializeFn)
            })
          }
          requests.push(grpcRequest);
          this.setState({ requests });
  
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.requests.map(req => {
          return (
            <div>
              <h3>{req.path}</h3>
              <div>{JSON.stringify(req.obj)}</div>
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
