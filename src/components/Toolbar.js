// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { networkLog } from '../state/network';
import './Toolbar.css';



class Toolbar extends Component {
  render() {
    const { networkLog } = this.props;
    return (
      <div className="toolbar">
        <div className="toolbar-shadow">
          <ToolbarButton onClick={() => networkLog({ method: "/a.url/goes/here", request: { req: "Some request" }, response: "Some response" })} />
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
const mapDispatchToProps = { networkLog };
export default connect(null, mapDispatchToProps)(Toolbar);
