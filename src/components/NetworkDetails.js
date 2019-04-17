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
      return <ReactJson name="grpc" enableClipboard={false} src={ { method, request, response, error, largeList } } /> 
    }
  }
}

const mapStateToProps = state => ({ entry: state.network.selectedEntry });
export default connect(mapStateToProps)(NetworkDetails);

var largeList = [
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
  "123456789",
]

