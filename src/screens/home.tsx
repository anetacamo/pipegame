import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LEVEL, SCORE } from '../constants/GameConstants';
import { levelSettings } from '../constants/LevelConstants';
import {
  TILE_CODES,
  CONSTANT,
  BASIC,
  END_PIPES,
  TANK_PIPE,
  CROSS_PIPE,
} from '../constants/tileCodes';
import { PipeGameTypes } from '../interfaces/gameTypes';
import Header from '../components/Header/Header';
import Suggestions from '../components/Suggestions/Suggestions';
import Timer from '../components/Timer/Timer';
import Board from '../components/Board/Board';
import Controls from '../components/Controls/Controls';

const exitValueToEntry = (number: number) => {
  return number < 2 ? number + 2 : number - 2;
};

function Home() {
  const buttonNewGame = useRef<HTMLButtonElement | null>(null);
  const buttonNextLevel = useRef<HTMLButtonElement | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(SCORE);
  const [level, setLevel] = useState(LEVEL);

  const levelName = `level${level}` as keyof typeof levelSettings;
  const { BODY, INITIAL_LOCATION, TIMER, SPEED, rows } = levelSettings[
    levelName
  ];

  const randomPipe = () => Math.floor(Math.random() * BASIC.length);
  const pipes = [...Array(rows)].map((row) => randomPipe());
  const [upcomingFields, setUpcomingFields] = useState(pipes);

  // const createInitialState = () => {
  //   return {
  //     headLocation: INITIAL_LOCATION,
  //     body: BODY,
  //     waterFlow: false,
  //     waterBody: [],
  //     waterHead: INITIAL_LOCATION,
  //     timer: TIMER,
  //     levelDone: false,
  //     waterDirection: 0,
  //   };
  // };

  // const [gameState, setGameState] = useState(createInitialState);

  // const { headLocation } = gameState;

  const [headLocation, setHeadLocation] = useState(INITIAL_LOCATION);
  const [body, setBody] = useState<PipeGameTypes['map']>(BODY);
  const [waterFlow, setWaterFlow] = useState(false);
  const [waterBody, setWaterBody] = useState<any>([]);
  const [waterHead, setWaterHead] = useState(INITIAL_LOCATION);
  const [timer, setTimer] = useState(TIMER);
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
      }, SPEED);

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

  const moveOnGrid = (
    direction: number,
    currentLocation: number[]
  ): number[] | null => {
    const [x, y] = currentLocation;
    const moveMap: Record<string, [number, number]> = {
      0: [x, y - 1],
      1: [x + 1, y],
      2: [x, y + 1],
      3: [x - 1, y],
    };
    const newLocation = moveMap[direction];
    if (
      newLocation &&
      newLocation[0] >= 0 &&
      newLocation[0] < rows &&
      newLocation[1] >= 0 &&
      newLocation[1] < rows
    ) {
      return newLocation;
    }
    return null; // Return null when the move is not valid
  };

  const moveHead = useCallback(
    (direction: number) => {
      const newLocation = moveOnGrid(direction, headLocation);
      if (newLocation !== null) {
        setHeadLocation(newLocation);
      }
    },
    [headLocation]
  );

  const moveWaterHead = useCallback(
    (direction: number) => {
      const newLocation = moveOnGrid(direction, waterHead);
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
    setHeadLocation(INITIAL_LOCATION);
    setBody(BODY);
    setWaterFlow(false);
    setWaterBody([]);
    setWaterHead(INITIAL_LOCATION);
    setTimer(TIMER);
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
    resetGame();
    setLevel(level + 1);
  };

  function findOutputIndex(inputString: string, number: number) {
    if (inputString[number] !== '0') {
      setGameOver(true);
      return -1;
    }

    const otherZeroIndex = inputString.indexOf('0', 0);
    if (otherZeroIndex !== number) {
      return otherZeroIndex;
    } else {
      const nextZeroIndex = inputString.indexOf('0', otherZeroIndex + 1);
      return nextZeroIndex;
    }
  }

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
        //big pipes
        if (TANK_PIPE.includes(getPipeCode)) {
          // wait for few extra seconds
        }
        const entryDirectionCode = exitValueToEntry(waterDirection);
        //crosspiece
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
      <Header score={score} />
      <div className='screen'>
        <Suggestions upcomingFields={upcomingFields} />
        <div>
          <Board
            {...{
              rows,
              headLocation,
              body,
              waterBody,
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
        <Timer rows={rows} timer={timer} />
      </div>
    </div>
  );
}
export default Home;

// const handleCollision = () => {
//   setWaterFlow(false);
//   if (Object.values(waterBody).length < 8) {
//     setLevelDone(true);
//   } else {
//     setGameOver(true);
//   }
// };

// const createInitialState = () => {
//   return {
//     headLocation: INITIAL_LOCATION,
//     body: BODY,
//     waterFlow: false,
//     waterBody: [],
//     waterHead: INITIAL_LOCATION,
//     timer: TIMER,
//     levelDone: false,
//     waterDirection: DIRECTION,
//   };
// };

// const [gameState, setGameState] = useState(createInitialState);

//423