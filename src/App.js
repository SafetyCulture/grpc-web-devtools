
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
