import React, { useState, useEffect } from 'react';
import styles from './Timer.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';
import { useAppSelector } from '../../utils/reduxHooks';

const Timer: React.FC = () => {
  const [isFinalState, setIsFinalState] = useState(false);

  const { timer, level } = useAppSelector((state) => state.water);

  useEffect(() => {
    setIsFinalState(true);
    if (timer === true) {
      setTimeout(() => {
        setIsFinalState(false);
      }, 10);
    }
  }, [timer]);

  const rows = LEVEL_SETTINGS[level].initial_rows;

  return (
    <div
      style={{
        height: rows * FIELD_IN_PX + BORDER * 2,
        width: FIELD_IN_PX + BORDER * 2,
      }}
      className={styles.timer}
    >
      <div
        className={`${styles.innertimer} ${
          isFinalState ? styles.finalState : ''
        }`}
        style={{
          animationDuration: `${LEVEL_SETTINGS[level].initial_timer}ms`,
        }}
      ></div>
      <div className={styles.tileHolder}>
        {[...Array(rows)].map((box, index) => (
          <div
            key={index}
            style={{
              height: FIELD_IN_PX,
              width: FIELD_IN_PX,
            }}
            className={`box t5`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Timer;
