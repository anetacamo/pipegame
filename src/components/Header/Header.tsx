import React from 'react';
import styles from './Header.module.scss';
import { useAppSelector } from '../../utils/reduxHooks';

const Header: React.FC = () => {
  const { level, score } = useAppSelector((state) => state.water);

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
