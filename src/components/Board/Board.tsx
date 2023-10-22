import React from 'react';
import styles from './Board.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';
import { useAppSelector } from '../../utils/reduxHooks';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';

const Desktop: React.FC = () => {
  let message = '';
  const {
    gameWon,
    level,
    levelDone,
    gameOver,
    headLocation,
    body,
    waterBody,
  } = useAppSelector((state) => state.water);
  const rows = LEVEL_SETTINGS[level].initial_rows;

  const convertMessage = (message: string) => {
    return message
      .split(' ')
      .map((word: string) => {
        const letters = word.length;
        const spaces = '_'.repeat(rows - letters);
        return word + spaces;
      })
      .join('');
  };

  if (gameOver) {
    message = convertMessage('game ouer');
  } else if (gameWon) {
    message = convertMessage('you beat the game');
  } else if (levelDone) {
    message = convertMessage('you made it');
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
