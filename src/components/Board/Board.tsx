import React from 'react';
import { PipeGameTypes } from '../../interfaces/gameTypes';
import styles from './Board.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';
import { useAppSelector } from '../../utils/reduxHooks';

interface DesktopProps {
  rows: number;
  headLocation: number[];
  body: PipeGameTypes['body'];
  waterBody: PipeGameTypes['waterBody'];
}

const Desktop: React.FC<DesktopProps> = ({
  rows,
  headLocation,
  body,
  waterBody,
}) => {
  let message = '';

  const gameWon = useAppSelector((state) => state.water.gameWon);
  const levelDone = useAppSelector((state) => state.water.levelDone);
  const gameOver = useAppSelector((state) => state.water.gameOver);

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
