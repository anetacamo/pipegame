import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from '../components/Board/Board';
import Controls from '../components/Controls/Controls';
import Header from '../components/Header/Header';
import ScoreBoard from '../components/ScoreBoard/ScoreBoard';
import Suggestions from '../components/Suggestions/Suggestions';
import Timer from '../components/Timer/Timer';
import { LEVEL, SCORE } from '../constants/GameConstants';
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
} from '../utils/gameUtils';
import moveOnGrid from '../utils/moveOnGrid';
import useKeyboardInput from '../utils/useKeyboardInput';

function PipeGame() {
  const buttonNewGame = useRef<HTMLButtonElement | null>(null);
  const buttonNextLevel = useRef<HTMLButtonElement | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(SCORE);
  const [level, setLevel] = useState(LEVEL);

  const {
    initial_body,
    initial_location,
    initial_timer,
    initial_speed,
    initial_rows,
    text,
  } = LEVEL_SETTINGS[level];

  const pipes = [...Array(initial_rows)].map((row) => randomPipe());

  const [upcomingFields, setUpcomingFields] = useState(pipes);
  const [headLocation, setHeadLocation] = useState(initial_location);
  const [body, setBody] = useState<PipeGameTypes['body']>(initial_body);
  const [waterFlow, setWaterFlow] = useState(false);
  const [waterBody, setWaterBody] = useState<any>([]);
  const [waterHead, setWaterHead] = useState(initial_location);
  const [timer, setTimer] = useState(initial_timer);
  const [levelDone, setLevelDone] = useState(false);
  const [waterDirection, setWaterDirection] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const moveDirections = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];

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
    if (!gameOver && waterFlow && !levelDone) {
      const interval = setInterval(() => {
        checkNextTile();
        setScore((prevScore) => prevScore + 10);
      }, initial_speed);

      return () => {
        clearInterval(interval);
      };
    }
  }, [waterHead, waterFlow, gameOver, levelDone]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWaterFlow(true);
    }, timer);

    return () => {
      clearInterval(interval);
    };
  }, [waterFlow, level]);

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
        onCollision();
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
    setHeadLocation(LEVEL_SETTINGS[newLevel].initial_location);
    setWaterHead(LEVEL_SETTINGS[newLevel].initial_location);
    setBody(LEVEL_SETTINGS[newLevel].initial_body);
    setWaterFlow(false);
    setWaterBody([]);
    setTimer(LEVEL_SETTINGS[newLevel].initial_timer);
    setLevelDone(false);
    setWaterDirection(0);
  };

  const newGameHandler = () => {
    buttonNewGame.current?.blur();
    resetGame(1);
    setScore(SCORE);
    setLevel(LEVEL);
    setGameOver(false);
  };

  const newLevelHandler = () => {
    buttonNextLevel.current?.blur();
    const newLevel = level + 1;
    setLevel(newLevel);
    resetGame(newLevel);
  };

  const onCollision = () => {
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
    if (waterHead.toString() in body) {
      //get the code
      const pipeCode = Number(body[waterHead.toString()]);
      let pipeString = TILE_CODES[pipeCode];
      let exitDirection = 0;
      if (TANK_PIPE.includes(pipeCode)) {
        // wait for few extra seconds
      }
      if (END_PIPES.includes(pipeCode)) {
        //entry piece
        if (Object.values(waterBody).length < 1) {
          exitDirection = pipeString.indexOf('0');
          //endpiece
        } else {
          setWaterBody([...waterBody, waterHead?.toString()]);
          onCollision();
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
      onCollision();
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
              waterFlow,
              gameOver,
              buttonNextLevelRef: buttonNextLevel,
              buttonNewGameRef: buttonNewGame,
              levelDone,
              newLevelHandler,
              setWaterFlow,
              gameWon,
              text,
            }}
          />
        </div>
        <Timer rows={initial_rows} timer={timer} waterFlow={waterFlow} />
        <ScoreBoard score={score} gameOver={gameOver} rows={initial_rows} />
      </div>
    </div>
  );
}
export default PipeGame;

//423
