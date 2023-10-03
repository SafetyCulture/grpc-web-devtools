// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSelector, createSlice } from "@reduxjs/toolkit";
import { setFilterValue } from "./toolbar";

const networkSlice = createSlice({
  name: "network",
  initialState: {
    preserveLog: false,
    selectedIdx: null,
    selectedEntry: null,
    log: [],
    stopLog: false,
    _filterValue: "",
  },
  reducers: {
    networkLog(state, action) {
      const { log, stopLog } = state;
      if (!stopLog) {
        const { payload } = action;
        if (payload.method) {
          const parts = payload.method.split("/");
          payload.endpoint = parts.pop() || parts.pop();
        }
        log.push(payload);
      }
    },
    toggleStopResumeLogs(state) {
      state.stopLog = !state.stopLog;
    },
    selectLogEntry(state, action) {
      const { payload: idx } = action;
      const entry = state.log[idx];
      if (entry) {
        state.selectedIdx = idx;
        state.selectedEntry = entry;
      }
    },
    clearLog(state, action) {
      const { payload: { force } = {} } = action;
      if (state.preserveLog && !force) {
        return;
      }
      state.selectedIdx = null;
      state.selectedEntry = null;
      state.log = [];
    },
    setPreserveLog(state, action) {
      const { payload } = action;
      state.preserveLog = payload;
    },
  },
  extraReducers: {
    [setFilterValue]: (state, action) => {
      const { payload: filterValue = "" } = action;
      state._filterValue = filterValue;
    },
  },
});

export const selectFilteredLogs = createSelector(
  [(state) => state.network.log, (state) => state.network._filterValue],
  (log, filter) => {
    const lcFilter = filter.toLowerCase();
    return log.filter((l) => l.method?.toLowerCase().includes(lcFilter));
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
