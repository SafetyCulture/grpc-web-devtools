import { createSlice } from "redux-starter-kit";

const toolbarSlice = createSlice({
  slice: 'toolbar',
  initialState: {
    filterIsOpen: false,
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
      console.log(state.filterValue);
      state.filterIsEnabled = !!(state.filterValue && state.filterValue.length > 0);
    }
  },

});

const { actions, reducer } = toolbarSlice;
export const { toggleFilter, setFilterValue } = actions;

export default reducer
