// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import { createSlice } from "redux-starter-kit";

const clipboardSlice = createSlice({
  slice: 'clipboard',
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
