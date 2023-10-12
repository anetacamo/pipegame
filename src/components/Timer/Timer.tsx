import React, { useState, useEffect } from 'react';
import styles from './Timer.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';

interface TimerProps {
  rows: number;
  timer: number;
  waterFlow: boolean;
}

const Timer: React.FC<TimerProps> = ({ rows, timer, waterFlow }) => {
  const [isFinalState, setIsFinalState] = useState(false);

  //start the water
  useEffect(() => {
    setIsFinalState(true);
    setTimeout(() => {
      setIsFinalState(false);
    }, 10);
  }, [timer]);

  //stop the water
  useEffect(() => {
    console.log('waterflow', waterFlow);
    // Handle changes to the waterFlow prop
    if (waterFlow) {
      setIsFinalState(true);
    }
  }, [waterFlow]);

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
