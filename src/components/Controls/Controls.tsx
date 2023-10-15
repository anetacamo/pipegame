import React from 'react';
import styles from './Controls.module.scss';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';

interface ControlsProps {
  newGameHandler: () => void;
  gameWon: boolean;
  levelDone: boolean;
  setTimer: (value: boolean) => void;
  newLevelHandler: () => void;
  setWaterFlow: (value: boolean) => void;
  buttonNextLevel: React.RefObject<HTMLButtonElement>;
  buttonNewGame: React.RefObject<HTMLButtonElement>;
  level: number;
  timer: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  newGameHandler,
  levelDone,
  timer,
  newLevelHandler,
  buttonNextLevel,
  buttonNewGame,
  setWaterFlow,
  setTimer,
  gameWon,
  level,
}) => {
  return (
    <div>
      <div className='flex'>
        {timer && (
          <button
            onClick={() => {
              setWaterFlow(true);
              setTimer(false);
            }}
          >
            Let the water flow!
          </button>
        )}
      </div>
      {levelDone && !gameWon && (
        <button onClick={newLevelHandler} ref={buttonNextLevel}>
          Next Level
        </button>
      )}
      <div className={styles.info}>
        <p>{LEVEL_SETTINGS[level].text}</p>
        <button onClick={newGameHandler} ref={buttonNewGame}>
          New Game
        </button>
      </div>
    </div>
  );
};

export default Controls;
