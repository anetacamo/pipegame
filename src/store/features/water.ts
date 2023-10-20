import { createSlice } from '@reduxjs/toolkit';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';

interface StateDef {
  water: boolean;
  speedUp: boolean;
  levelDone: boolean;
  gameOver: boolean;
  gameWon: boolean;
  timer: boolean;
}

const initialState: StateDef = {
  water: false,
  speedUp: false,
  levelDone: false,
  gameOver: false,
  gameWon: false,
  timer: true,
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
    speedUpWater: (state) => {
      return {
        ...state,
        speedUp: true,
      };
    },
    levelFinished: (state, action) => {
      //switchWaterOff
      const { level, waterBody } = action.payload;
      const gameOver = Object.values(waterBody).length < 8;
      const gameWon = !state.gameOver && level === LEVEL_SETTINGS.length - 1;
      return {
        ...state,
        water: false,
        speedUp: false,
        levelDone: true,
        gameOver,
        gameWon,
      };
    },
    levelStarted: (state) => {
      return {
        //increment level by one
        ...state,
        levelDone: false,
        gameOver: false,
        timer: true,
        gameWon: false,
      };
    },

    switchTimerOff: (state) => {
      return {
        //increment level by one
        ...state,
        timer: false,
      };
    },
  },
});

export const {
  switchWaterOn,
  speedUpWater,
  levelFinished,
  levelStarted,
  switchTimerOff,
} = waterSlice.actions;
export default waterSlice.reducer;
// Define the RootState type for your Redux store
