/*global chrome*/

import { AccessTokenResponse } from '@safetyculture/s12-apis-web/s12/authorization/v1/authorization_pb';
import { DevicesResponse } from '@safetyculture/s12-apis-web/s12/iot/v1/devices_pb';
import React, { Component } from 'react';
import './App.css';
import { decodeStringToUint8Array } from './base64';
import GrpcWebStreamParser from './GrpcWebStreamParser';


var serviceMap = {
  "/s12.authorization.v1.AuthorizationService/GetAccessToken": { res: AccessTokenResponse },
  "/s12.iot.v1.DevicesService/ListDevices": { res: DevicesResponse },
}


class App extends Component {

  state = {
    requests: [],
  }

  componentDidMount() {
    if (window.chrome && window.chrome.devtools) {
      chrome.devtools.network.onRequestFinished.addListener(rtn => {
        if (rtn.request.postData && rtn.request.postData.mimeType === "application/grpc-web-text") {
          const { requests } = this.state;
          var url = new URL(rtn.request.url)
          if (serviceMap[url.pathname]) {
            
            rtn.getContent((content, encoding) => {
           
              var obj = convertResponse(atob(content), serviceMap[url.pathname].res.deserializeBinary)
              requests.push({
                path: url.pathname,
                obj: obj,
              })

              this.setState({ requests });

            })

          }
  
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


function convertResponse(responseText, deserializeFn) {
  var newPos = responseText.length - responseText.length % 4;
  var newData = responseText.substr(0, newPos);
  var byteSource = decodeStringToUint8Array(newData);

  var parser = new GrpcWebStreamParser()

  var messages = parser.parse([].slice.call(byteSource));
  if (messages) {
    var FrameType = GrpcWebStreamParser.FrameType;
    for (var i = 0; i < messages.length; i++) {
      if (FrameType.DATA in messages[i]) {
        var data = messages[i][FrameType.DATA];
          return deserializeFn(data).toObject();
      }
    }
  }
}

export default App;
