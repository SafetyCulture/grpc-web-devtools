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
    /*
     * Stored to avoid calculating all the filtering every time a new log appears (as it can be a lot).
     * This way only new logs are filtered and added or not to the filteredLogs array.
     */
    _filteredLogs: [],
    _methodFilter: "",
    _contentFilter: "",
  },
  reducers: {
    networkLog(state, action) {
      const { logs, _filteredLogs, stopLog, _contentFilter, _methodFilter } =
        state;
      if (!stopLog) {
        const { payload: log } = action;
        if (log.method) {
          const parts = log.method.split("/");
          log.endpoint = parts.pop() || parts.pop();
        }
        logs.push(log);
        if (
          logCompliesWithFilters(
            log,
            _contentFilter.toLowerCase(),
            _methodFilter.toLowerCase()
          )
        ) {
          _filteredLogs.push(log);
        }
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
      state._filteredLogs = [];
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
      state._filteredLogs = filterLogs(
        state.logs,
        state._methodFilter,
        state._contentFilter
      );
    },
    [setContentFilter]: (state, action) => {
      const { payload: filterValue = "" } = action;
      state._contentFilter = filterValue;
      state._filteredLogs = filterLogs(
        state.logs,
        state._methodFilter,
        state._contentFilter
      );
    },
  },
});

export const selectFilteredLogs = createSelector(
  [(state) => state.network._filteredLogs],
  (logs) => {
    return logs;
  }
);

function filterLogs(logs, methodFilter, contentFilter) {
  const lcMethodFilter = methodFilter.toLowerCase();
  const lcContentFilter = contentFilter.toLowerCase();
  return logs.filter((l) =>
    logCompliesWithFilters(l, lcMethodFilter, lcContentFilter)
  );
}

function logCompliesWithFilters(log, methodFilter, contentFilter) {
  return (
    log.method?.toLowerCase().includes(methodFilter) &&
    // TODO implement recursive search?
    (!contentFilter ||
      JSON.stringify(log).toLowerCase().includes(contentFilter))
  );
}

const { actions, reducer } = networkSlice;
export const {
  networkLog,
  selectLogEntry,
  clearLog,
  setPreserveLog,
  toggleStopResumeLogs,
} = actions;

export default reducer;
