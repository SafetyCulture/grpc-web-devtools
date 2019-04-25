import { createSlice } from "redux-starter-kit";

const networkSlice = createSlice({
  slice: 'network',
  initialState: {
    preserveLog: false,
    selectedIdx: null,
    selectedEntry: null,
    log: [],
  },
  reducers: {
    networkLog(state, action) {
      const { payload } = action;
      if (payload.method) {
        const parts = payload.method.split('/')
        payload.endpoint = parts.pop() || parts.pop();
      }
      state.log.push(action.payload);
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
  }
});

const { actions, reducer } = networkSlice;
export const { networkLog, selectLogEntry, clearLog, setPreserveLog } = actions;

export default reducer
