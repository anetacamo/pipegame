import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
  score: number;
  level: number;
}

const Header: React.FC<HeaderProps> = ({ score, level }) => {
  return (
    <div className={styles.score}>
      {`${level}_score_${score}`
        .toString()
        .split('')
        .map((letter, index) => (
          <img
            key={index}
            src={require(`/public/images/alphabet/${letter}.png`)}
            alt={letter}
          />
        ))}
    </div>
  );
};

export default Header;
