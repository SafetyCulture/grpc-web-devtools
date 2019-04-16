
import React, { Component } from 'react';
import './App.css';
import MainLayout from './components/MainLayout';
import Toolbar from './components/Toolbar';


class App extends Component {

  render() {
    // const { traceRequest, network } = this.props;
    return (
      <div className="vbox flex-auto">
        <div className="hbox widget">
          <div className="vbox app-contents flex-auto">
            <div className="vbox widget">
              <div className="vbox flex-auto">
                <div className="widget vbox">
                  <Toolbar />
                  <MainLayout />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;


/*
{network.map(req => {
          return (
            <div>
              <h3>{req.method}</h3>
              <div>Request: {JSON.stringify(req.request)}</div>
              <div>Response: {JSON.stringify(req.response)}</div>
              <hr></hr>
            </div>
          )
        })}

<div className="vbox widget">
                <button onClick={() => {
                    traceRequest({ method: "/a.url/goes/here", request: { req: "Some request" }, response: "Some response" });
                  }}>add fake request
                </button>
              </div>

        */