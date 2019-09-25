// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { PureComponent } from 'react';
import './NetworkEmpty.css';

class NetworkEmpty extends PureComponent {
  render() {
    var modifier = navigator.platform.indexOf('Mac') === 0 ? '⌘' : 'Ctrl'
    return (
      <div className="network-empty">
        <div className="content">
          <div>Recording gRPC network activity...</div>
          <div>Perform a request or hit <strong>{modifier} R</strong> to record the reload</div>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/SafetyCulture/grpc-web-devtools"
            >
              Learn more
          </a>
          </div>
        </div>
      </div>
    );
  }
}

export default NetworkEmpty;
