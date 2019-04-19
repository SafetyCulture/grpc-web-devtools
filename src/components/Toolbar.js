// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPreserveLog } from '../state/network';
import './Toolbar.css';



class Toolbar extends Component {
  render() {
    const { preserveLog } = this.props;
    return (
      <div className="toolbar">
        <div className="toolbar-shadow">
          <span className="toolbar-item checkbox">
            <input
              type="checkbox"
              id="ui-checkbox-preserve-log"
              checked={preserveLog}
              onChange={this._onPreserveLogChanged}
            />
            <label for="ui-checkbox-preserve-log">Preserve log</label>
          </span>
          {/* <ToolbarButton onClick={() => {}} /> */}
        </div>
      </div>
    );
  }

  _onPreserveLogChanged = (e) => {
    const { setPreserveLog } = this.props;
    setPreserveLog(e.target.checked);
  }
}

// class ToolbarButton extends Component {
//   render() {
//     return (
//       <button className="toolbar-button toolbar-item" {...this.props}>
//         X
//       </button>
//     );
//   }
// }

const mapStateToProps = state => ({ preserveLog: state.network.preserveLog });
const mapDispatchToProps = { setPreserveLog };
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
