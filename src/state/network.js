import { createSlice } from "redux-starter-kit";

const networkSlice = createSlice({
    slice: 'network',
    initialState: {
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
        }
    }
});

const { actions, reducer } = networkSlice;
export const { networkLog, selectLogEntry } = actions;

export default reducer