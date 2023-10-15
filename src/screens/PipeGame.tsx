import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from '../components/Board/Board';
import Controls from '../components/Controls/Controls';
import Header from '../components/Header/Header';
import ScoreBoard from '../components/ScoreBoard/ScoreBoard';
import Suggestions from '../components/Suggestions/Suggestions';
import Timer from '../components/Timer/Timer';
import {
  LEVEL,
  SCORE,
  moveDirections,
  LOCATION,
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
  exitValueToEntry,
  findOutputIndex,
  randomPipe,
  generateXOfRandomPipeCodes,
} from '../utils/gameUtils';
import moveOnGrid from '../utils/moveOnGrid';
import useKeyboardInput from '../utils/useKeyboardInput';

function PipeGame() {
  const buttonNewGame = useRef<HTMLButtonElement>(null);
  const buttonNextLevel = useRef<HTMLButtonElement>(null);

  const [score, setScore] = useState(SCORE);
  const [level, setLevel] = useState(LEVEL);

  const {
    initial_body,
    initial_timer,
    initial_speed,
    initial_rows,
  } = LEVEL_SETTINGS[level];

  const [upcomingFields, setUpcomingFields] = useState(
    generateXOfRandomPipeCodes(level)
  );
  const [headLocation, setHeadLocation] = useState(LOCATION);
  const [body, setBody] = useState<PipeGameTypes['body']>(initial_body);
  const [waterFlow, setWaterFlow] = useState(false);
  const [waterBody, setWaterBody] = useState<any>([]);
  const [waterHead, setWaterHead] = useState(LOCATION);
  const [timer, setTimer] = useState(true);
  const [waterDirection, setWaterDirection] = useState(0);
  const [levelDone, setLevelDone] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [speed, setSpeed] = useState(initial_speed);

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
    if (waterFlow) {
      const interval = setInterval(() => {
        checkNextTile();
        setScore((prevScore) => prevScore + 10);
        console.log(speed);
      }, speed);
      setSpeed(initial_speed);
      return () => {
        clearInterval(interval);
      };
    }
  }, [waterHead, waterFlow]);

  useEffect(() => {
    if (timer === true) {
      const interval = setInterval(() => {
        setWaterFlow(true);
        setTimer(false);
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
    setTimer(true);
    setLevelDone(false);
    setWaterDirection(0);
    setUpcomingFields(generateXOfRandomPipeCodes(newLevel));
  };

  const newGameHandler = () => {
    buttonNewGame.current?.blur();
    resetGame(1);
    setScore(SCORE);
    setLevel(LEVEL);
    setGameOver(false);
    setGameWon(false);
  };

  const newLevelHandler = () => {
    buttonNextLevel.current?.blur();
    const newLevel = level + 1;
    setLevel(newLevel);
    resetGame(newLevel);
  };

  const onFinish = () => {
    setWaterFlow(false);
    if (Object.values(waterBody).length > 5) {
      setLevelDone(true);
      level === 5 && setGameWon(true);
    } else {
      setGameOver(true);
    }
  };

  const checkNextTile = () => {
    //is waterflow inside the pipes?
    console.log('check next tile');
    if (waterHead.toString() in body) {
      //get the code
      const pipeCode = Number(body[waterHead.toString()]);
      let pipeString = TILE_CODES[pipeCode];
      let exitDirection = 0;
      if (TANK_PIPE.includes(pipeCode)) {
        // wait for few extra seconds
        console.log('tank pipe' + speed);
        setSpeed(5000);
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
              gameOver,
              gameWon,
              levelDone,
            }}
          />
          <Controls
            {...{
              newGameHandler,
              newLevelHandler,
              buttonNextLevel,
              buttonNewGame,
              levelDone,
              gameOver,
              gameWon,
              setWaterFlow,
              setTimer,
              timer,
              level,
            }}
          />
        </div>
        <Timer timer={timer} level={level} />
        <ScoreBoard
          score={score}
          gameOver={gameOver}
          rows={initial_rows}
          gameWon={gameWon}
        />
      </div>
    </div>
  );
}
export default PipeGame;

//423
