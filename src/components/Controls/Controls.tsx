import React from 'react';
import styles from './Controls.module.scss';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';
import {
  switchWaterOn,
  speedUpWater,
  switchTimerOff,
} from '../../store/features/water';
import { useAppDispatch, useAppSelector } from '../../utils/reduxHooks';

interface ControlsProps {
  newGameHandler: () => void;
  newLevelHandler: () => void;
  buttonNextLevel: React.RefObject<HTMLButtonElement>;
  buttonNewGame: React.RefObject<HTMLButtonElement>;
  level: number;
}

const Controls: React.FC<ControlsProps> = ({
  newGameHandler,
  newLevelHandler,
  buttonNextLevel,
  buttonNewGame,
  level,
}) => {
  const { water, gameOver, gameWon, timer, levelDone } = useAppSelector(
    (state) => state.water
  );
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className='flex'>
        {timer && (
          <button
            onClick={() => {
              dispatch(switchWaterOn());
              dispatch(switchTimerOff());
            }}
          >
            Turn the water on!
          </button>
        )}
        {water && (
          <button onClick={() => dispatch(speedUpWater())}>Speed up!</button>
        )}
      </div>
      {levelDone && !gameWon && !gameOver && (
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
