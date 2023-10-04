// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSelector, createSlice } from "@reduxjs/toolkit";
import { setMethodFilter, setContentFilter } from "./toolbar";

const networkSlice = createSlice({
  name: "network",
  initialState: {
    logs: [],
    preserveLog: false,
    selectedEntry: null,
    stopLog: false,
    _methodFilter: "",
    _contentFilter: "",
  },
  reducers: {
    networkLog(state, action) {
      const { logs, stopLog } = state;
      if (!stopLog) {
        const { payload } = action;
        if (payload.method) {
          const parts = payload.method.split("/");
          payload.endpoint = parts.pop() || parts.pop();
        }
        logs.push(payload);
      }
    },
    toggleStopResumeLogs(state) {
      state.stopLog = !state.stopLog;
    },
    selectLogEntry(state, action) {
      state.selectedEntry = action.payload;
    },
    clearLog(state, action) {
      const { payload: { force } = {} } = action;
      if (state.preserveLog && !force) {
        return;
      }
      state.selectedEntry = null;
      state.logs = [];
    },
    setPreserveLog(state, action) {
      const { payload } = action;
      state.preserveLog = payload;
    },
  },
  extraReducers: {
    [setMethodFilter]: (state, action) => {
      const { payload: filterValue = "" } = action;
      state._methodFilter = filterValue;
    },
    [setContentFilter]: (state, action) => {
      const { payload: filterValue = "" } = action;
      state._contentFilter = filterValue;
    },
  },
});

export const selectFilteredLogs = createSelector(
  [
    (state) => state.network.logs,
    (state) => state.network._methodFilter,
    (state) => state.network._contentFilter,
  ],
  (logs, methodFilter, contentFilter) => {
    const lcMethodFilter = methodFilter.toLowerCase();
    const lcContentFilter = contentFilter.toLowerCase();
    return logs.filter(
      (l) =>
        l.method?.toLowerCase().includes(lcMethodFilter) &&
        // TODO implement recursive search?
        // TODO rethink this filter as it's filtering ALL the list when one arrives
        (!contentFilter ||
          JSON.stringify(l).toLowerCase().includes(lcContentFilter))
    );
  }
);

const { actions, reducer } = networkSlice;
export const {
  networkLog,
  selectLogEntry,
  clearLog,
  setPreserveLog,
  toggleStopResumeLogs,
} = actions;

export default reducer;
