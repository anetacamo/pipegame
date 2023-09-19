import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from '../components/Board/Board';
import Controls from '../components/Controls/Controls';
import Header from '../components/Header/Header';
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
} from '../constants/tileCodes';
import { PipeGameTypes } from '../interfaces/gameTypes';
import {
  exitValueToEntry,
  findOutputIndex,
  randomPipe,
} from '../utils/gameUtils';
import moveOnGrid from '../utils/moveOnGrid';

function PipeGame() {
  const buttonNewGame = useRef<HTMLButtonElement | null>(null);
  const buttonNextLevel = useRef<HTMLButtonElement | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(SCORE);
  const [level, setLevel] = useState(LEVEL);

  const levelName = `level${level}` as keyof typeof LEVEL_SETTINGS;
  const {
    initial_body,
    initial_location,
    initial_timer,
    initial_speed,
    initial_rows,
  } = LEVEL_SETTINGS[levelName];

  const pipes = [...Array(initial_rows)].map((row) => randomPipe());
  const [upcomingFields, setUpcomingFields] = useState(pipes);
  const [headLocation, setHeadLocation] = useState(initial_location);
  const [body, setBody] = useState<PipeGameTypes['map']>(initial_body);
  const [waterFlow, setWaterFlow] = useState(false);
  const [waterBody, setWaterBody] = useState<any>([]);
  const [waterHead, setWaterHead] = useState(initial_location);
  const [timer, setTimer] = useState(initial_timer);
  const [levelDone, setLevelDone] = useState(false);
  const [waterDirection, setWaterDirection] = useState(0);

  useEffect(() => {
    const arrowClickHandler = (e: KeyboardEvent) => {
      const moveDirections: Record<string, number> = {
        ArrowUp: 0,
        ArrowRight: 1,
        ArrowDown: 2,
        ArrowLeft: 3,
      };

      if (e.key in moveDirections) {
        moveHead(moveDirections[e.key]);
      } else if (e.keyCode === 32) {
        CONSTANT.includes(Number(body[headLocation.toString()])) || fillField();
      }
    };

    window.addEventListener('keydown', arrowClickHandler);
    return () => {
      window.removeEventListener('keydown', arrowClickHandler);
    };
  }, [headLocation, body]);

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
        setWaterFlow(false);
        setLevelDone(true);
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

  const resetGame = () => {
    setHeadLocation(initial_location);
    setWaterHead(initial_location);
    setBody(initial_body);
    setWaterFlow(false);
    setWaterBody([]);
    setTimer(initial_timer);
    setLevelDone(false);
    setWaterDirection(0);
  };

  const newGameHandler = () => {
    buttonNewGame.current?.blur();
    resetGame();
    setScore(SCORE);
    setLevel(LEVEL);
    setGameOver(false);
  };

  const newLevelHandler = () => {
    buttonNextLevel.current?.blur();
    setLevel(level + 1);
    resetGame();
  };

  const checkNextTile = () => {
    if (waterHead.toString() in body) {
      const getPipeCode = Number(body[waterHead.toString()]);
      let generatedCode = TILE_CODES[getPipeCode];
      let exitDirection;

      if (END_PIPES.includes(getPipeCode)) {
        if (Object.values(waterBody).length < 1) {
          //entry piece
          exitDirection = generatedCode.toString().indexOf('0');
        } else {
          //endpiece
          setWaterBody([...waterBody, waterHead?.toString()]);
          setWaterFlow(false);
          setLevelDone(true);
          return;
        }
      } else {
        if (TANK_PIPE.includes(getPipeCode)) {
          // wait for few extra seconds
        }
        const entryDirectionCode = exitValueToEntry(waterDirection);
        if (CROSS_PIPE.includes(getPipeCode)) {
          if (entryDirectionCode === 0 || entryDirectionCode === 2) {
            generatedCode = '0x0x';
          } else {
            generatedCode = 'x0x0';
          }
        }
        exitDirection = findOutputIndex(
          generatedCode?.toString(),
          entryDirectionCode
        );
      }
      setWaterDirection(exitDirection);
      setWaterBody([...waterBody, waterHead?.toString()]);
      moveWaterHead(exitDirection);
    } else {
      setWaterFlow(false);
      setGameOver(true);
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
            }}
          />
        </div>
        <Timer rows={initial_rows} timer={timer} />
      </div>
    </div>
  );
}
export default PipeGame;

//423
