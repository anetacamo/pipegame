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
        width: FIELD_IN_PX / 4,
      }}
      className={styles.timer}
    >
      <div
        className={styles.innertimer}
        style={{ animationDuration: `${timer}ms` }}
      ></div>
    </div>
  );
};

export default Timer;
