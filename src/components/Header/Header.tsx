import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
  score: number;
}

const Header: React.FC<HeaderProps> = ({ score }) => {
  return (
    <div className={styles.score}>
      {'score'.split('').map((letter, index) => (
        <img key={index} src={`/images/alphabet/${letter}.png`} alt={letter} />
      ))}
      {score
        .toString()
        .split('')
        .map((number, index) => (
          <img
            key={index}
            src={`/images/alphabet/${number}.png`}
            alt={number}
          />
        ))}
    </div>
  );
};

export default Header;
