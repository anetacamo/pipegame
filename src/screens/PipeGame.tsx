import React, { useCallback, useEffect } from 'react';

// Third-party library imports
import { useAppDispatch, useAppSelector } from '../utils/reduxHooks';

// constants
import { moveDirections } from '../constants/GameConstants';
import { LEVEL_SETTINGS } from '../constants/LevelConstants';
import {
  CONSTANT,
  CROSS_PIPE,
  END_PIPES,
  TANK_PIPE,
  TILE_CODES,
  WATERFLOW,
} from '../constants/tileCodes';

// redux TKT
import {
  changeSpeed,
  levelFinished,
  setBody,
  setHeadLocation,
  setScore,
  setWaterBody,
  setWaterDirection,
  setWaterHeadLocation,
  switchTimerOff,
  switchWaterOn,
  updateUpcomingFields,
} from '../store/features/water';

// utils & hooks
import { exitValueToEntry, findOutputIndex } from '../utils/gameUtils';
import moveOnGrid from '../utils/moveOnGrid';
import useKeyboardInput from '../utils/useKeyboardInput';

//components
import Board from '../components/Board/Board';
import Controls from '../components/Controls/Controls';
import Header from '../components/Header/Header';
import ScoreBoard from '../components/ScoreBoard/ScoreBoard';
import Suggestions from '../components/Suggestions/Suggestions';
import Timer from '../components/Timer/Timer';

function PipeGame() {
  const dispatch = useAppDispatch();
  const {
    speedUp,
    speed,
    waterFlow,
    timer,
    level,
    waterDirection,
    headLocation,
    waterHeadLocation,
    body,
    waterBody,
  } = useAppSelector((state) => state.water);

  const { initial_timer, initial_speed, initial_rows } = LEVEL_SETTINGS[level];

  const handleKeyPress = useCallback(
    (key: string) => {
      const index = moveDirections.indexOf(key);
      if (index !== -1) {
        moveHead(moveDirections.indexOf(key));
      } else if (key === ' ') {
        CONSTANT.includes(Number(body[headLocation.toString()])) || fillField();
      }
    },
    [headLocation, body]
  );

  useKeyboardInput(handleKeyPress);

  useEffect(() => {
    if (waterFlow === true) {
      const interval = setInterval(() => {
        checkNextTile();
        dispatch(setScore(10));
      }, speed);
      speedUp
        ? dispatch(changeSpeed(250))
        : dispatch(changeSpeed(initial_speed));
      return () => {
        clearInterval(interval);
      };
    }
  }, [waterHeadLocation, waterFlow]);

  useEffect(() => {
    if (timer === true) {
      const interval = setInterval(() => {
        dispatch(switchWaterOn());
        dispatch(switchTimerOff());
      }, initial_timer);
      return () => {
        clearInterval(interval);
      };
    }
  }, [timer]);

  const moveHead = useCallback(
    (direction: number) => {
      const newLocation = moveOnGrid(direction, headLocation, initial_rows);
      if (newLocation !== null) {
        dispatch(setHeadLocation(newLocation));
      }
    },
    [headLocation]
  );

  const moveWaterHead = useCallback(
    (direction: number) => {
      const newLocation = moveOnGrid(
        direction,
        waterHeadLocation,
        initial_rows
      );
      if (newLocation !== null) {
        dispatch(setWaterHeadLocation(newLocation));
      } else {
        //the water reached the wall
        dispatch(levelFinished());
      }
    },
    [waterHeadLocation]
  );

  //fillField with the pipe from the random pipe generated list and generate new pipe to the list
  const fillField = () => {
    dispatch(updateUpcomingFields());
    dispatch(setBody());
  };

  const checkNextTile = () => {
    //is waterflow inside the pipes?
    if (waterHeadLocation.toString() in body) {
      //get the code
      const pipeCode = Number(body[waterHeadLocation.toString()]);
      let pipeString = TILE_CODES[pipeCode];
      let exitDirection = 0;
      if (TANK_PIPE.includes(pipeCode)) {
        // wait for few extra seconds
        if (speedUp === false) {
          dispatch(changeSpeed(5000));
        }
      }
      if (END_PIPES.includes(pipeCode)) {
        //entry piece
        if (Object.values(waterBody).length < 1) {
          exitDirection = pipeString.indexOf('0');
        } else {
          dispatch(setScore(90));
          dispatch(setWaterBody());
          dispatch(levelFinished());
          return;
        }
      }
      if (WATERFLOW.includes(pipeCode)) {
        const entryDirectionCode = exitValueToEntry(waterDirection);
        if (CROSS_PIPE.includes(pipeCode)) {
          if (entryDirectionCode === 0 || entryDirectionCode === 2) {
            pipeString = '0x0x';
            dispatch(setScore(20));
          } else {
            pipeString = 'x0x0';
            dispatch(setScore(20));
          }
        }
        exitDirection = findOutputIndex(
          pipeString?.toString(),
          entryDirectionCode
        );
      }
      dispatch(setWaterDirection(exitDirection));
      dispatch(setWaterBody());
      moveWaterHead(exitDirection);
    } else {
      dispatch(levelFinished());
    }
  };

  return (
    <div>
      <Header />
      <div className='screen'>
        <Suggestions />
        <div>
          <Board />
          <Controls />
        </div>
        <Timer />
        <ScoreBoard />
      </div>
    </div>
  );
}
export default PipeGame;
//423, 191
