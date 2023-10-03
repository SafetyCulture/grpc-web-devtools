// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import React from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import NetworkListRow from "./NetworkListRow";

import "./NetworkList.css";
import { selectFilteredLogs } from "../state/network";

const NetworkList = () => {
  const log = useSelector(selectFilteredLogs);
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
            <AutoSizer disableWidth>
              {({ height }) => (
                <List
                  className="data"
                  itemCount={log.length}
                  height={height}
                  itemSize={21}
                  itemData={log}
                  overscanCount={50}
                >
                  {NetworkListRow}
                </List>
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkList;
