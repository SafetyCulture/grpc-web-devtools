// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import './Toolbar.css';



class Toolbar extends Component {
  render() {
    const { networkLog } = this.props;
    return (
      <div className="toolbar">
        <div className="toolbar-shadow">
          {/* <ToolbarButton onClick={() => {}} /> */}
        </div>
      </div>
    );
  }
}

class ToolbarButton extends Component {
  render() {
    return (
      <button className="toolbar-button toolbar-item" {...this.props}>
        X
      </button>
    );
  }
}

export default Toolbar;
