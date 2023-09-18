import React from 'react';
import styles from './Timer.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';

interface TimerProps {
  rows: number;
  timer: number;
}

const Timer: React.FC<TimerProps> = ({ rows, timer }) => {
  return (
    <div
      style={{
        height: rows * FIELD_IN_PX + BORDER * 2,
        width: FIELD_IN_PX + BORDER * 2,
      }}
      className={styles.timer}
    >
      <div
        className={styles.innertimer}
        style={{ animationDuration: `${timer}ms` }}
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
