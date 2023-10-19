import { createSlice } from '@reduxjs/toolkit';
//import { PayloadAction } from '@reduxjs/toolkit/dist/createAction';

interface StateDef {
  water: boolean;
  number: number;
}

const initialState: StateDef = {
  water: false,
  number: 1,
};

export const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    switchWaterOn: (state) => {
      return {
        ...state,
        water: true,
      };
    },
    switchWaterOff: (state) => {
      return {
        ...state,
        water: false,
      };
    },
  },
});

export const { switchWaterOn, switchWaterOff } = waterSlice.actions;
export default waterSlice.reducer;
