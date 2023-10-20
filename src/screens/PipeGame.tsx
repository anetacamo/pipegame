import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/reduxHooks';
import Board from '../components/Board/Board';
import Controls from '../components/Controls/Controls';
import Header from '../components/Header/Header';
import ScoreBoard from '../components/ScoreBoard/ScoreBoard';
import Suggestions from '../components/Suggestions/Suggestions';
import Timer from '../components/Timer/Timer';
import {
  LEVEL,
  LOCATION,
  moveDirections,
  SCORE,
} from '../constants/GameConstants';
import { LEVEL_SETTINGS } from '../constants/LevelConstants';
import {
  CONSTANT,
  CROSS_PIPE,
  END_PIPES,
  TANK_PIPE,
  TILE_CODES,
  WATERFLOW,
} from '../constants/tileCodes';
import { PipeGameTypes } from '../interfaces/gameTypes';
import {
  switchWaterOn,
  levelFinished,
  levelStarted,
  switchTimerOff,
} from '../store/features/water';
import {
  exitValueToEntry,
  findOutputIndex,
  generateXOfRandomPipeCodes,
  randomPipe,
} from '../utils/gameUtils';
import moveOnGrid from '../utils/moveOnGrid';
import useKeyboardInput from '../utils/useKeyboardInput';

function PipeGame() {
  const buttonNewGame = useRef<HTMLButtonElement>(null);
  const buttonNextLevel = useRef<HTMLButtonElement>(null);

  //dont reset on new level
  const [score, setScore] = useState(SCORE);
  const [level, setLevel] = useState(LEVEL);

  //reset on new level by level dynamically:
  const [speed, setSpeed] = useState(LEVEL_SETTINGS[level].initial_speed);
  const [upcomingFields, setUpcomingFields] = useState(
    generateXOfRandomPipeCodes(level)
  );
  const [body, setBody] = useState<PipeGameTypes['body']>(
    LEVEL_SETTINGS[level].initial_body
  );

  //reset always to the same value
  const [headLocation, setHeadLocation] = useState(LOCATION);
  const [waterBody, setWaterBody] = useState<PipeGameTypes['waterBody']>([]);
  const [waterHead, setWaterHead] = useState<PipeGameTypes['waterHead']>(
    LOCATION
  );
  const [waterDirection, setWaterDirection] = useState(0);

  //dispatch values
  const { speedUp, water, timer } = useAppSelector((state) => state.water);
  const dispatch = useAppDispatch();

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
    if (water === true) {
      const interval = setInterval(() => {
        checkNextTile();
        setScore((prevScore) => prevScore + 10);
      }, speed);
      speedUp ? setSpeed(250) : setSpeed(initial_speed);
      return () => {
        clearInterval(interval);
      };
    }
  }, [waterHead, water]);

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
        setHeadLocation(newLocation);
      }
    },
    [headLocation]
  );

  const moveWaterHead = useCallback(
    (direction: number) => {
      const newLocation = moveOnGrid(direction, waterHead, initial_rows);
      if (newLocation !== null) {
        setWaterHead(newLocation);
      } else {
        //the water reached the wall
        onFinish();
      }
    },
    [waterHead]
  );

  //fillField with the pipe from the random pipe generated list and generate new pipe to the list
  const fillField = () => {
    const newUpcomingFields = [...upcomingFields.slice(1), randomPipe()];
    setBody((prevBody) => ({
      ...prevBody,
      [headLocation.toString()]: upcomingFields[0],
    }));
    setUpcomingFields(newUpcomingFields);
  };

  const resetGame = (newLevel: number) => {
    setHeadLocation(LOCATION);
    setWaterHead(LOCATION);
    setBody(LEVEL_SETTINGS[newLevel].initial_body);
    setWaterBody([]);
    setSpeed(LEVEL_SETTINGS[newLevel].initial_speed);
    dispatch(levelStarted());
    setWaterDirection(0);
    setUpcomingFields(generateXOfRandomPipeCodes(newLevel));
  };

  const newGameHandler = () => {
    buttonNewGame.current?.blur();
    resetGame(1);
    setScore(SCORE);
    setLevel(LEVEL);
  };

  const newLevelHandler = () => {
    buttonNextLevel.current?.blur();
    const newLevel = level + 1;
    setLevel(newLevel);
    resetGame(newLevel);
  };

  const onFinish = () => {
    dispatch(levelFinished({ level, waterBody }));
  };

  const checkNextTile = () => {
    //is waterflow inside the pipes?
    if (waterHead.toString() in body) {
      //get the code
      const pipeCode = Number(body[waterHead.toString()]);
      let pipeString = TILE_CODES[pipeCode];
      let exitDirection = 0;
      if (TANK_PIPE.includes(pipeCode)) {
        // wait for few extra seconds
        if (speedUp === false) {
          setSpeed(5000);
        }
      }
      if (END_PIPES.includes(pipeCode)) {
        //entry piece
        if (Object.values(waterBody).length < 1) {
          exitDirection = pipeString.indexOf('0');
        } else {
          setScore(score + 90);
          setWaterBody([...waterBody, waterHead?.toString()]);
          onFinish();
          return;
        }
      }
      if (WATERFLOW.includes(pipeCode)) {
        const entryDirectionCode = exitValueToEntry(waterDirection);
        if (CROSS_PIPE.includes(pipeCode)) {
          if (entryDirectionCode === 0 || entryDirectionCode === 2) {
            pipeString = '0x0x';
            setScore(score + 20);
          } else {
            pipeString = 'x0x0';
            setScore(score + 20);
          }
        }
        exitDirection = findOutputIndex(
          pipeString?.toString(),
          entryDirectionCode
        );
      }
      setWaterDirection(exitDirection);
      setWaterBody([...waterBody, waterHead?.toString()]);
      moveWaterHead(exitDirection);
    } else {
      onFinish();
    }
  };

  return (
    <div>
      <Header score={score} level={level} />
      <div className='screen'>
        <Suggestions upcomingFields={upcomingFields} />
        <div>
          <Board
            {...{
              rows: initial_rows,
              headLocation,
              body,
              waterBody,
            }}
          />
          <Controls
            {...{
              newGameHandler,
              newLevelHandler,
              buttonNextLevel,
              buttonNewGame,
              level,
            }}
          />
        </div>
        <Timer level={level} />
        <ScoreBoard score={score} level={level} />
      </div>
    </div>
  );
}
export default PipeGame;
//423, 279, 251
