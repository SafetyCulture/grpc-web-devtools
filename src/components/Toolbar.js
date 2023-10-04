// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  setPreserveLog,
  clearLog,
  toggleStopResumeLogs,
} from "../state/network";
import {
  toggleFilter,
  setMethodFilter,
  setContentFilter,
} from "../state/toolbar";
import { toggleClipboard } from "../state/clipboard";
import ClearIcon from "../icons/Clear";
import StopIcon from "../icons/Stop";
import PlayIcon from "../icons/Play";
import FilterIcon from "../icons/Filter";
import "./Toolbar.css";

class Toolbar extends Component {
  _renderButtons() {
    const {
      clearLog,
      toggleFilter,
      toolbar: { filterIsEnabled, filterIsOpen },
      stopIsEnabled,
      toggleStopResumeLogs,
    } = this.props;

    return (
      <>
        <ToolbarButton title="Clear" onClick={() => clearLog({ force: true })}>
          <ClearIcon />
        </ToolbarButton>
        <ToolbarButton
          title={stopIsEnabled ? "Resume" : "Stop"}
          onClick={() => toggleStopResumeLogs()}
        >
          {stopIsEnabled ? <PlayIcon /> : <StopIcon />}
        </ToolbarButton>
        <ToolbarButton
          title="Filter"
          onClick={() => toggleFilter()}
          className={
            (filterIsOpen ? "open " : "") + (filterIsEnabled ? "enabled" : "")
          }
        >
          <FilterIcon />
        </ToolbarButton>
      </>
    );
  }

  _renderFilterToolbar() {
    const { filterIsOpen, filterValue } = this.props.toolbar;
    if (filterIsOpen) {
      return (
        <div className="toolbar">
          <div className="toolbar-shadow">
            <span className="toolbar-item text">
              Method:{" "}
              <input
                type="text"
                placeholder="Filter Method"
                value={filterValue}
                onChange={this._onMethodFilterChange}
              />
            </span>
            <span className="toolbar-item text">
              Content:{" "}
              <input
                type="text"
                placeholder="Filter Content"
                value={filterValue}
                onChange={this._onContentFilterChange}
              />
            </span>
          </div>
        </div>
      );
    }
  }

  render() {
    const { preserveLog, clipboardIsEnabled } = this.props;
    return (
      <>
        <div className="toolbar">
          <div className="toolbar-shadow">
            {this._renderButtons()}
            <ToolbarDivider />
            <span
              className="toolbar-item checkbox"
              title="Do not clear log on page reload / navigation"
            >
              <input
                type="checkbox"
                id="ui-checkbox-preserve-log"
                checked={preserveLog}
                onChange={this._onPreserveLogChanged}
              />
              <label htmlFor="ui-checkbox-preserve-log">Preserve log</label>
            </span>
            <ToolbarDivider />
            <span
              className="toolbar-item checkbox"
              title="Enables clipboard for JSON tree (decreases rendering performance)"
            >
              <input
                type="checkbox"
                id="ui-checkbox-clipboard-is-enabled"
                checked={clipboardIsEnabled}
                onChange={this._onEnableClipboardChanged}
              />
              <label htmlFor="ui-checkbox-clipboard-is-enabled">
                Enable clipboard
              </label>
            </span>
          </div>
        </div>
        {this._renderFilterToolbar()}
      </>
    );
  }

  _onPreserveLogChanged = (e) => {
    const { setPreserveLog } = this.props;
    setPreserveLog(e.target.checked);
  };

  _onEnableClipboardChanged = (e) => {
    const { toggleClipboard } = this.props;
    toggleClipboard(e.target.checked);
  };

  _onMethodFilterChange = (e) => {
    const { setMethodFilter } = this.props;
    setMethodFilter(e.target.value);
  };

  _onContentFilterChange = (e) => {
    const { setContentFilter } = this.props;
    setContentFilter(e.target.value);
  };
}

const ToolbarDivider = () => <div className="toolbar-item toolbar-divider" />;

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

const mapStateToProps = (state) => ({
  preserveLog: state.network.preserveLog,
  toolbar: state.toolbar,
  clipboardIsEnabled: state.clipboard.clipboardIsEnabled,
  stopIsEnabled: state.network.stopLog,
});
const mapDispatchToProps = {
  setPreserveLog,
  clearLog,
  toggleFilter,
  setMethodFilter,
  setContentFilter,
  toggleClipboard,
  toggleStopResumeLogs,
};
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
