// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectLogEntry } from '../state/network';
import './NetworkList.css';

class NetworkList extends Component {
  render() {
    const { network, selectLogEntry } = this.props;
    return (
      <div className="widget vbox network-list">
        <div className="widget vbox">
          <div className="data-grid">
            <div className="header-container">
              <table className="header">
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
              <table className="data">
                <tbody>
                  {network.log.map((req, idx) => (
                    <tr 
                      key={idx}
                      onClick={() => selectLogEntry(idx)}
                      title={req.method}
                      className={idx === network.selectedIdx ? "selected" : ""}
                    >
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
const mapDispatchToProps = { selectLogEntry };
export default connect(mapStateToProps, mapDispatchToProps)(NetworkList)