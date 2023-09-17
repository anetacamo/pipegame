import React from 'react';
import styles from './Suggestions.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';

interface SuggestionsProps {
  upcomingFields: number[];
}

const Suggestions: React.FC<SuggestionsProps> = ({ upcomingFields }) => {
  return (
    <div
      className={styles.suggestions}
      style={{
        height: upcomingFields.length * FIELD_IN_PX + BORDER * 2,
        width: FIELD_IN_PX + BORDER * 2,
      }}
    >
      {upcomingFields.map((box, index) => (
        <div
          key={index}
          style={{
            height: FIELD_IN_PX,
            width: FIELD_IN_PX,
          }}
          className={`box t${box.toString()}`}
        ></div>
      ))}
    </div>
  );
};

export default Suggestions;
