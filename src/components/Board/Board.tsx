import React from 'react';
import { PipeGameTypes } from '../../interfaces/gameTypes';
import styles from './Board.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';

interface DesktopProps {
  rows: number;
  headLocation: number[];
  body: PipeGameTypes['map'];
  waterBody: string[];
  gameOver: boolean;
  gameWon: boolean;
  levelDone: boolean;
}

const Desktop: React.FC<DesktopProps> = ({
  rows,
  headLocation,
  body,
  waterBody,
  gameOver,
  gameWon,
  levelDone,
}) => {
  let message = '';

  if (gameOver) {
    message = 'game___oer';
  } else if (gameWon) {
    message = 'game___o';
  } else if (levelDone) {
    message = 'leel___doe';
  }

  return (
    <div
      className={styles.board}
      style={{
        width: rows * FIELD_IN_PX + BORDER * 2,
        height: rows * FIELD_IN_PX + BORDER * 2,
      }}
    >
      {[...Array(rows)].map((row, rowIndex) => (
        <div key={rowIndex}>
          {[...Array(rows)].map((column, columnIndex) => {
            const location = `${rowIndex},${columnIndex}`;
            const locationToString = location.toString();
            const hasWater = waterBody.includes(locationToString);

            const isActive = location === headLocation.toString();
            const bodyType = `t${body[locationToString]}`;
            const classNames = `field ${isActive && 'active'} ${
              hasWater && 'hasWater'
            } ${locationToString in body && bodyType}`;

            return (
              <div
                key={location}
                className={classNames}
                style={{ width: FIELD_IN_PX, height: FIELD_IN_PX }}
              ></div>
            );
          })}
        </div>
      ))}

      <div
        className={styles.modal}
        style={{
          top: FIELD_IN_PX * 2,
        }}
      >
        {message.split('').map((letter, index) => (
          <img
            key={index}
            className={styles.letter}
            src={require(`/public/images/alphabet/${letter}.png`)}
            alt={letter}
            style={{
              height: FIELD_IN_PX,
              width: FIELD_IN_PX,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Desktop;
