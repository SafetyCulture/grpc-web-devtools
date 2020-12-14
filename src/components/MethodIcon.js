// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import DownIcon from '../icons/Down';
import UpIcon from '../icons/Up';
import UpDownIcon from '../icons/UpDown';
import EndIcon from '../icons/End';

class MethodIcon extends Component {
  render() {
    const { log } = this.props;
    const {methodType, request, response} = log;
    const isStream = methodType === 'server_streaming';
    const isRequest = Boolean(request);
    const isEOF = response === 'EOF';
    let IconClass = UpDownIcon;
    if (isStream) {
      if (isRequest) {
        IconClass = UpIcon;
      } else if (isEOF) {
        IconClass = EndIcon;
      } else {
        IconClass = DownIcon;
      }
    }

    return IconClass ? <IconClass /> : null;
  }
}

export default MethodIcon;
