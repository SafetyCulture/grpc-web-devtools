// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSlice } from "@reduxjs/toolkit";

const clipboardSlice = createSlice({
  name: 'clipboard',
  initialState: {
    clipboardIsEnabled: false,
  },
  reducers: {
    toggleClipboard(state) {
      state.clipboardIsEnabled = !state.clipboardIsEnabled;
    }
  },

});

const { actions, reducer } = clipboardSlice;
export const { toggleClipboard } = actions;

export default reducer
