/*global chrome*/

import React, { Component } from 'react';
import './App.css';

class App extends Component {

  state = {
    requests: [],
  }

  componentDidMount() {
    if (chrome && chrome.devtools) {
      chrome.devtools.network.onRequestFinished.addListener(rtn => {
        if (rtn.request.postData.mimeType == "application/grpc-web-text") {
          const { requests } = this.state;
          requests.push(rtn.request.url);
          this.setState({ requests });
        }
      });
    }
  }

  render() {
    return (
      <div className="App">
        {this.state.requests.map(element => {
          return <div>{element}</div>
        })}
      </div>
    );
  }
}

export default App;
