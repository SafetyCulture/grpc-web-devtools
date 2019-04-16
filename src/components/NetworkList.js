// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './NetworkList.css';

class NetworkList extends Component {
  render() {
    const { network } = this.props;
    return (
      <div className="widget vbox network-list">
        <div className="widget vbox">
          <div class="data-grid">
            <div className="header-container">
              <table class="header">
                <tbody>
                  <tr>
                    <th>
                      <div>Name</div>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="data-container">
              <table class="data">
                <tbody>
                  {network.map(req => (
                    <tr title={req.method}>
                      <td>{req.endpoint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ network: state.network })
export default connect(mapStateToProps)(NetworkList)