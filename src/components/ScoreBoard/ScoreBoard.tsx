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
  gameWon: boolean;
}

type Score = {
  name?: string;
  score?: number;
  id: string;
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({
  score,
  gameOver,
  rows,
  gameWon,
}) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputName = useRef<HTMLInputElement | null>(null);
  const scoresCollectionRef = collection(db, 'scores');

  const isScoreLegendary = () => {
    return scores.some((s) => s.score && s.score < score);
  };

  console.log(scores);

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
    const updatedScores = [
      ...scores,
      { name: userName, score: score, id: '1' },
    ];
    setScores(updatedScores);
  };

  const deleteScore = async (id: string) => {
    const userDoc = doc(db, 'scores', id);
    await deleteDoc(userDoc);
    const updatedScores = scores.filter((s) => s.id === id);
    setScores(updatedScores);
  };

  const setUserAndCreateScore = async () => {
    const newUser = inputName.current?.value;
    if (scores.length > 9) {
      const smallestScore = scores.reduce((min, score) => {
        const scoreValue = score.score;
        return scoreValue !== undefined && scoreValue < min ? scoreValue : min;
      }, scores[0].id || 0);
      deleteScore(smallestScore as string);
    }
    if (newUser) {
      await createScore(newUser);
    }
    setSubmit(true);
  };

  return (
    <div
      className={styles.scoreBoard}
      style={{
        height: rows * FIELD_IN_PX + BORDER * 2,
      }}
    >
      <>
        <h3>TABLE OF LEGENDS</h3>
        {scores
          .sort((a, b) => (a.score && b.score ? b.score - a.score : 0))
          .map((s: any) => (
            <p key={s.id}>
              {s.name}: {s.score}
            </p>
          ))}
        <br />
        {(gameOver || gameWon) && isScoreLegendary() && !submit && (
          <>
            <p>
              You made new record!
              <br />
              fill your nickname bellow
            </p>
            <p>your score: {score}</p>
            <input max={16} placeholder='your name' ref={inputName} />
            {isLoading ? (
              <button disabled>loading</button>
            ) : (
              <button onClick={() => setUserAndCreateScore()}>
                submit score
              </button>
            )}
          </>
        )}
        {submit && <p>thanks!</p>}
      </>
    </div>
  );
};

export default ScoreBoard;
