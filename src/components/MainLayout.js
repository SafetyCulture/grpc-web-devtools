// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from "react";
import { connect } from "react-redux";
import Split from "react-split";
import "./MainLayout.css";
import NetworkDetails from "./NetworkDetails";
import NetworkEmpty from "./NetworkEmpty";
import NetworkList from "./NetworkList";
class MainLayout extends Component {
  _renderContent() {
    const { isEmpty } = this.props;
    if (isEmpty) {
      return <NetworkEmpty />;
    }

    return (
      <Split
        className="hbox flex-auto"
        sizes={[30, 70]}
        gutterSize={5}
        cursor="ew-resize"
      >
        <NetworkList />
        <NetworkDetails />
      </Split>
    );
  }

  render() {
    return (
      <div className="vbox flex-auto">
        <div className="shadow-split-widget hbox widget">
          {this._renderContent()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isEmpty: state.network.logs.length === 0,
});
export default connect(mapStateToProps)(MainLayout);
