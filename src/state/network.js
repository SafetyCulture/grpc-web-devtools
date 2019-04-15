import { createSlice } from "redux-starter-kit";

const networkSlice = createSlice({
    slice: 'network',
    initialState: [],
    reducers: {
        traceRequest(state, action) { state.push(action.payload) },
    }
});

const { actions, reducer } = networkSlice;
export const { traceRequest } = actions;

export default reducer