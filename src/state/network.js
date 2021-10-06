// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSlice } from "@reduxjs/toolkit";
import Fuse from 'fuse.js';
import { setFilterValue } from "./toolbar";

var options = {
  shouldSort: false,
  threshold: 0.1,
  distance: 10000,
  keys: [
    'method',
  ]
};
var fuse = new Fuse([], options);

const networkSlice = createSlice({
  name: 'network',
  initialState: {
    preserveLog: false,
    selectedIdx: null,
    selectedEntry: null,
    log: [
    ],
    _filterValue: '',
    _logBak: [],
  },
  reducers: {
    networkLog(state, action) {
      const { log, _filterValue, _logBak } = state;
      const { payload, } = action;
      if (payload.method) {
        const parts = payload.method.split('/')
        payload.endpoint = parts.pop() || parts.pop();
      }
      if (_filterValue.length > 0) {
        _logBak.push(payload);
        fuse.setCollection(_logBak);
        state.log = fuse.search(_filterValue);
      } else {
        log.push(payload);
      }
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
      state._logBak = [];
    },
    setPreserveLog(state, action) {
      const { payload } = action;
      state.preserveLog = payload;
    },
  },
  extraReducers: {
    [setFilterValue]: (state, action) => {

      const { payload: filterValue = '' } = action;
      state._filterValue = filterValue;
      if (filterValue.length === 0) {
        state.log = state._logBak;
        state._logBak = [];
        return;
      }

      if (state._logBak.length === 0 && state.log.length !== 0) {
        state._logBak = state.log;
      }
      fuse.setCollection(state._logBak);
      state.log = fuse.search(filterValue);
    },
  },
});

const { actions, reducer } = networkSlice;
export const { networkLog, selectLogEntry, clearLog, setPreserveLog } = actions;

export default reducer
