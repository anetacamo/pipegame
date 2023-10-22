import { createSlice } from '@reduxjs/toolkit';
import { LEVEL, LOCATION } from '../../constants/GameConstants';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';
import { generateXOfRandomPipeCodes, randomPipe } from '../../utils/gameUtils';
import { PipeGameTypes } from '../../interfaces/gameTypes';

const newGameValues = {
  score: 0,
  level: LEVEL,
  speed: LEVEL_SETTINGS[LEVEL].initial_speed,
  upcomingFields: generateXOfRandomPipeCodes(LEVEL),
  body: LEVEL_SETTINGS[LEVEL].initial_body,
};

//values that are reset to the same value
const commonFields = {
  gameOver: false,
  levelDone: false,
  gameWon: false,
  timer: true,
  waterDirection: 0,
  headLocation: LOCATION,
  waterHeadLocation: LOCATION,
  waterBody: [],
};

const initialState: PipeGameTypes = {
  waterFlow: false,
  speedUp: false,
  ...commonFields,
  ...newGameValues,
};

export const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    //when timer runs of | on water button press
    switchWaterOn: (state) => ({
      ...state,
      waterFlow: true,
    }),
    //on button press
    speedUpWater: (state) => ({
      ...state,
      speedUp: true,
    }),
    //on a crash | final pipe enter
    levelFinished: (state) => {
      const gameOver = Object.values(state.waterBody).length < 8;
      const gameWon =
        !state.gameOver && state.level === LEVEL_SETTINGS.length - 1;
      return {
        ...state,
        waterFlow: false,
        speedUp: false,
        levelDone: true,
        gameOver,
        gameWon,
      };
    },
    //on new level button press
    levelStarted: (state) => ({
      ...state,
      level: state.level + 1,
      upcomingFields: generateXOfRandomPipeCodes(state.level + 1),
      speed: LEVEL_SETTINGS[state.level + 1].initial_speed,
      body: LEVEL_SETTINGS[state.level + 1].initial_body,
      ...commonFields,
    }),
    //on new game button press | on page load
    newGameStarted: (state) => ({
      ...state,
      ...commonFields,
      ...newGameValues,
    }),
    //on timer runs of | on waterflow button press
    switchTimerOff: (state) => ({
      ...state,
      timer: false,
    }),

    setBody: (state) => {
      const body = {
        ...state.body,
        [state.headLocation.toString()]: state.upcomingFields[0],
      };
      return {
        ...state,
        body,
      };
    },
    setWaterBody: (state) => {
      const waterBody = [
        ...state.waterBody,
        state.waterHeadLocation?.toString(),
      ];
      return {
        ...state,
        waterBody,
      };
    },
    //on arrow press
    setHeadLocation: (state, action) => {
      const headLocation = action.payload;
      return {
        ...state,
        headLocation,
      };
    },
    // on succesfull check of matching tiles
    setWaterHeadLocation: (state, action) => {
      const waterHeadLocation = action.payload;
      return {
        ...state,
        waterHeadLocation,
      };
    },
    //on succesfull check of matching tiles
    setScore: (state, action) => {
      const score = state.score + action.payload;
      return {
        ...state,
        score,
      };
    },
    //on succesfull check of matching tiles
    setWaterDirection: (state, action) => {
      const direction = action.payload;
      return {
        ...state,
        waterDirection: direction,
      };
    },
    //on new level or game | on speed up press | no a tank pipe encounter
    changeSpeed: (state, action) => {
      const speed = action.payload;
      return {
        ...state,
        speed,
      };
    },
    // on spacebar press
    updateUpcomingFields: (state) => {
      const upcomingFields = [...state.upcomingFields.slice(1), randomPipe()];
      return {
        ...state,
        upcomingFields,
      };
    },
  },
});

export const {
  switchWaterOn,
  speedUpWater,
  levelFinished,
  levelStarted,
  newGameStarted,
  switchTimerOff,
  setScore,
  updateUpcomingFields,
  setWaterDirection,
  setWaterHeadLocation,
  setHeadLocation,
  changeSpeed,
  setBody,
  setWaterBody,
} = waterSlice.actions;
export default waterSlice.reducer;
// Define the RootState type for your Redux store
//107
