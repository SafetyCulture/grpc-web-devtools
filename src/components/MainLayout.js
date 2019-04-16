// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import './MainLayout.css';
import NetworkList from './NetworkList';


class MainLayout extends Component {
  render() {
    return (
      <div className="vbox flex-auto">
        <div className="shadow-split-widget hbox widget">
          <div className="shadow-split-widget-contents shadow-split-widget-sidebar vbox">
            <NetworkList />
          </div>
          <div className="shadow-split-widget-contents shadow-split-widget-main">
            <div className="widget vbox">
              Right
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MainLayout