// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import './NetworkDetails.css';

class NetworkDetails extends Component {
  render() {
    const { entry } = this.props;
    return (
      <div className="widget vbox details-data">
        {this._renderContent(entry)}
      </div>
    );
  }
  _renderContent = (entry) => {
    if (entry) {
      const { method, request, response, error } = entry;
      var src = { method };
      if (request) src.request = request;
      if (response) src.response = response;
      if (error) src.error = error;
      return <ReactJson name="grpc" enableClipboard={true} src={src} />
    }
  }
}

const mapStateToProps = state => ({ entry: state.network.selectedEntry });
export default connect(mapStateToProps)(NetworkDetails);
