// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setPreserveLog, clearLog } from '../state/network';
import { toggleFilter, setFilterValue } from '../state/toolbar';
import { toggleClipboard } from "../state/clipboard";
import ClearIcon from '../icons/Clear';
import FilterIcon from '../icons/Filter';
import './Toolbar.css';

class Toolbar extends Component {

  _renderFilterToolbar() {
    const { filterIsOpen, filterValue } = this.props.toolbar;
    if (filterIsOpen) {
      return (
        <div className="toolbar">
          <div className="toolbar-shadow">
            <span className="toolbar-item text">
              <input
                type="text"
                placeholder="Filter"
                value={filterValue}
                onChange={this._onFilterValueChanged}
              />
            </span>
          </div>
        </div>
      );
    }
  }

  render() {
    const { preserveLog, clearLog, toggleFilter, toolbar: { filterIsOpen, filterIsEnabled }, clipboardIsEnabled } = this.props;
    return (
      <>
        <div className="toolbar">
          <div className="toolbar-shadow">
            <ToolbarButton title="Clear" onClick={() => clearLog({ force: true })} >
              <ClearIcon />
            </ToolbarButton>
            <ToolbarButton
              title="Filter"
              onClick={() => toggleFilter()}
              className={(filterIsOpen ? "open " : "") + (filterIsEnabled ? "enabled" : "")}
            >
              <FilterIcon />
            </ToolbarButton>
            <ToolbarDivider />
            <span className="toolbar-item checkbox" title="Do not clear log on page reload / navigation">
              <input
                type="checkbox"
                id="ui-checkbox-preserve-log"
                checked={preserveLog}
                onChange={this._onPreserveLogChanged}
              />
              <label htmlFor="ui-checkbox-preserve-log">Preserve log</label>
            </span>
            <ToolbarDivider />
            <span className="toolbar-item checkbox" title="Enables clipboard when for network details">
              <input
                type="checkbox"
                id="ui-checkbox-clipboard-is-enabled"
                checked={clipboardIsEnabled}
                onChange={this._onEnableClipboardChanged}
              />
              <label htmlFor="ui-checkbox-clipboard-is-enabled">Enable clipboard</label>
            </span>
          </div>
        </div>
        {this._renderFilterToolbar()}
      </>
    );
  }

  _onPreserveLogChanged = e => {
    const { setPreserveLog } = this.props;
    setPreserveLog(e.target.checked);
  }

  _onEnableClipboardChanged = e => {
    const { toggleClipboard } = this.props;
    toggleClipboard(e.target.checked);
  }

  _onFilterValueChanged = e => {
    const { setFilterValue } = this.props;
    setFilterValue(e.target.value);
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
    const { children, className = "", ...other } = this.props;
    return (
      <button className={"toolbar-button toolbar-item " + className} {...other}>
        {children}
      </button>
    );
  }
}

const mapStateToProps = state => ({
  preserveLog: state.network.preserveLog,
  toolbar: state.toolbar,
  clipboardIsEnabled: state.clipboard.clipboardIsEnabled,
});
const mapDispatchToProps = { setPreserveLog, clearLog, toggleFilter, setFilterValue, toggleClipboard };
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
