// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPreserveLog } from '../state/network';
import ClearIcon from '../icons/Clear';
import './Toolbar.css';



class Toolbar extends Component {
  render() {
    const { preserveLog } = this.props;
    return (
      <div className="toolbar">
        <div className="toolbar-shadow">
          <ToolbarButton title="Clear" onClick={() => { }} >
            <ClearIcon />
          </ToolbarButton>
          <ToolbarDivider />
          <span className="toolbar-item checkbox" title="Do not clear log on page reload / navigation">
            <input
              type="checkbox"
              id="ui-checkbox-preserve-log"
              checked={preserveLog}
              onChange={this._onPreserveLogChanged}
            />
            <label for="ui-checkbox-preserve-log">Preserve log</label>
          </span>
        </div>
      </div>
    );
  }

  _onPreserveLogChanged = (e) => {
    const { setPreserveLog } = this.props;
    setPreserveLog(e.target.checked);
  }
}

class ToolbarDivider extends Component {
  render() {
    return (
      <div className="toolbar-item toolbar-divider" />
    );
  }
}

class ToolbarButton extends Component {
  render() {
    const { children } = this.props;
    return (
      <button className="toolbar-button toolbar-item" {...this.props}>
        {children}
      </button>
    );
  }
}

const mapStateToProps = state => ({ preserveLog: state.network.preserveLog });
const mapDispatchToProps = { setPreserveLog };
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
