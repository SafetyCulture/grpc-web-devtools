
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { traceRequest } from './state/network';
import './App.css';

class App extends Component {

  render() {
    const { traceRequest, network } = this.props;
    return (
      <div className="App">
        <button onClick={() => {
          traceRequest({ method: "/a.url/goes/here", request: { req: "Some request" }, response: "Some response" });
        }}>Clear</button>
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
      </div>
    );
  }
}

const mapStateToProps = state => ({ network: state.network })
const mapDispatchToProps = { traceRequest };

export default connect(mapStateToProps, mapDispatchToProps)(App);
