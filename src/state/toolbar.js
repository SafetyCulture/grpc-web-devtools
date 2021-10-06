// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSlice } from "@reduxjs/toolkit";

const toolbarSlice = createSlice({
  name: 'toolbar',
  initialState: {
    filterIsOpen: true,
    filterIsEnabled: false,
    filterValue: "",
  },
  reducers: {
    toggleFilter(state) {
      state.filterIsOpen = !state.filterIsOpen;
    },
    setFilterValue(state, action) {
      const { payload } = action;
      state.filterValue = payload;
      state.filterIsEnabled = !!(state.filterValue && state.filterValue.length > 0);
    }
  },

});

const { actions, reducer } = toolbarSlice;
export const { toggleFilter, setFilterValue } = actions;

export default reducer
