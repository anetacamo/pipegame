import React from 'react';
import styles from './Controls.module.scss';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';
import {
  switchWaterOn,
  speedUpWater,
  switchTimerOff,
  newGameStarted,
  levelStarted,
} from '../../store/features/water';
import { useAppDispatch, useAppSelector } from '../../utils/reduxHooks';

const Controls: React.FC = () => {
  const {
    waterFlow,
    gameOver,
    gameWon,
    timer,
    levelDone,
    level,
  } = useAppSelector((state) => state.water);
  const dispatch = useAppDispatch();

  function blurActiveElement() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  return (
    <div>
      <div className='flex'>
        {timer && (
          <button
            onClick={() => {
              dispatch(switchWaterOn());
              dispatch(switchTimerOff());
              blurActiveElement();
            }}
          >
            Turn the water on!
          </button>
        )}
        {waterFlow && (
          <button
            onClick={() => {
              dispatch(speedUpWater());
              blurActiveElement();
            }}
          >
            Speed up!
          </button>
        )}
      </div>
      {levelDone && !gameWon && !gameOver && (
        <button
          onClick={() => {
            blurActiveElement();
            dispatch(levelStarted());
          }}
        >
          Next Level
        </button>
      )}
      <div className={styles.info}>
        <p>{LEVEL_SETTINGS[level].text}</p>
        <button
          onClick={() => {
            blurActiveElement();
            dispatch(newGameStarted());
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Controls;
