import { createSlice } from "redux-starter-kit";

const networkSlice = createSlice({
    slice: 'network',
    initialState: [],
    reducers: {
        traceRequest(state, action) {
            const { payload } = action;
            if (payload.method) {
                const parts = payload.method.split('/')
                payload.endpoint = parts.pop() || parts.pop();
            }
            state.push(action.payload);
        },
    }
});

const { actions, reducer } = networkSlice;
export const { traceRequest } = actions;

export default reducer