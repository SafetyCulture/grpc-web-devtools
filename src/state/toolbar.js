// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSlice } from "@reduxjs/toolkit";

const toolbarSlice = createSlice({
  name: "toolbar",
  initialState: {
    filterIsOpen: true,
    filterIsEnabled: false,
    methodFilter: "",
    contentFilter: "",
  },
  reducers: {
    toggleFilter(state) {
      state.filterIsOpen = !state.filterIsOpen;
    },
    setMethodFilter(state, action) {
      const { payload } = action;
      state.methodFilter = payload;
      state.filterIsEnabled = isAnyFilterEnabled(
        state.methodFilter,
        state.contentFilter
      );
    },
    setContentFilter(state, action) {
      const { payload } = action;
      state.contentFilter = payload;
      state.filterIsEnabled = isAnyFilterEnabled(
        state.methodFilter,
        state.contentFilter
      );
    },
  },
});

function isAnyFilterEnabled(methodFilter, contentFilter) {
  return methodFilter?.length > 0 || contentFilter?.length > 0;
}

const { actions, reducer } = toolbarSlice;
export const { toggleFilter, setContentFilter, setMethodFilter } = actions;

export default reducer;
