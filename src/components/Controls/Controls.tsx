import React from 'react';
import styles from './Controls.module.scss';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';
import { switchWaterOn } from '../../store/features/water';
import { RootState } from '../../store/store';
import { useSelector, useDispatch } from 'react-redux';

interface ControlsProps {
  newGameHandler: () => void;
  gameWon: boolean;
  levelDone: boolean;
  setTimer: (value: boolean) => void;
  setSpeedUp: (value: boolean) => void;
  newLevelHandler: () => void;
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
  setTimer,
  gameWon,
  level,
  setSpeedUp,
}) => {
  const water = useSelector((state: RootState) => state.water.water);
  const dispatch = useDispatch();
  return (
    <div>
      <div className='flex'>
        {timer && (
          <button
            onClick={() => {
              dispatch(switchWaterOn());
              setTimer(false);
            }}
          >
            Let the water flow!
          </button>
        )}
        {water && (
          <button onClick={() => setSpeedUp(true)}>Speed up water!</button>
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
