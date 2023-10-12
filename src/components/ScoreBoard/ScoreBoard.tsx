import {
  collection,
  getDocs,
  addDoc,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import db from '../../firebase-config';
import styles from './ScoreBoard.module.scss';
import { FIELD_IN_PX, BORDER } from '../../constants/GameConstants';

interface ScoreBoardProps {
  score: number;
  gameOver: boolean;
  rows: number;
}

type Score = {
  name?: string;
  score?: number;
  id: string;
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, gameOver, rows }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);
  const inputName = useRef<HTMLInputElement | null>(null);
  const scoresCollectionRef = collection(db, 'scores');

  const isScoreLegendary = () => {
    return scores.some((s) => s.score && s.score < score);
  };

  useEffect(() => {
    const fetchScores = async () => {
      const data = await getDocs(scoresCollectionRef);
      const sortedData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setScores(sortedData);
    };
    fetchScores();
  }, []);

  const createScore = async (userName: string) => {
    await addDoc(scoresCollectionRef, { name: userName, score: score });
  };

  const deleteScore = async (id: string) => {
    const userDoc = doc(db, 'scores', id);
    await deleteDoc(userDoc);
  };

  const setUserAndCreateScore = async () => {
    const newUser = inputName.current?.value;
    if (scores.length > 10) {
      const smallestScore = scores.reduce((min, score) => {
        const scoreValue = score.score;
        return scoreValue !== undefined && scoreValue < min ? scoreValue : min;
      }, scores[0].id || 0); // Provide an initial value for 'min'
      deleteScore(smallestScore as string);
    }
    if (newUser) {
      await createScore(newUser);
    }
    setSubmit(true);
  };
  console.log(isScoreLegendary());

  return (
    <div
      className={styles.scoreBoard}
      style={{
        height: rows * FIELD_IN_PX + BORDER * 2,
      }}
    >
      <h3>TABLE OF LEGENDS</h3>
      {scores.map((s: any) => (
        <p>
          {s.name}: {s.score}
        </p>
      ))}
      <br />
      {gameOver && isScoreLegendary() && !submit && (
        <>
          <p>
            WOW! No way. You made new record!
            <br />
            fill your nickname bellow
          </p>
          <p>your score:{score}</p>
          <input max={16} placeholder='your name' ref={inputName} />
          <button onClick={() => setUserAndCreateScore()}>submit score</button>
        </>
      )}
      {submit && <p>thanks! refresh to see the updated table</p>}
    </div>
  );
};

export default ScoreBoard;
