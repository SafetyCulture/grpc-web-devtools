import React, { PureComponent } from "react";

class Stop extends PureComponent {
  render() {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" style={{ width: "18px" }}>
        <path d="M9 9h6v6H9z" />
        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" />
      </svg>
    );
  }
}

export default Stop;
