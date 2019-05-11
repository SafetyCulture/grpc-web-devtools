// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React, { Component } from 'react';
import UpDownIcon from '../icons/UpDown';
import UpIcon from '../icons/Up';
import DownIcon from '../icons/Down';

class MethodIcon extends Component {
  render() {
    const { methodType, isRequest } = this.props;
    var IconClass;
    if (methodType === 'server_streaming') {
      IconClass = isRequest ? UpIcon : DownIcon;
    }
    if (methodType === 'unary') {
      IconClass = UpDownIcon;
    }
    return <IconClass />
  }
}

export default MethodIcon;
