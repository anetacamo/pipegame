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
import { useAppSelector } from '../../utils/reduxHooks';
import { LEVEL_SETTINGS } from '../../constants/LevelConstants';

interface ScoreBoardProps {
  score: number;
  level: number;
}

type Score = {
  name?: string;
  score?: number;
  id: string;
};

const ScoreBoard: React.FC<ScoreBoardProps> = ({ score, level }) => {
  const [scores, setScores] = useState<Score[]>([]);
  const [submit, setSubmit] = useState<boolean>(false);
  const inputName = useRef<HTMLInputElement | null>(null);
  const scoresCollectionRef = collection(db, 'scores');

  const gameWon = useAppSelector((state) => state.water.gameWon);
  const gameOver = useAppSelector((state) => state.water.gameOver);

  const isScoreLegendary = () => {
    return scores.some((s) => s.score && s.score < score);
  };

  const rows = LEVEL_SETTINGS[level].initial_rows;

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

  // useEffect(() => {
  //   console.log('fetch from my server');
  //   fetch('http://localhost:5000/api').then((response) =>
  //     response.json().then((data) => {
  //       setBackend(data);
  //     })
  //   );
  // }, []);

  // const replaceScore = async () => {
  //   const scoreObject: Record<string, number> = {};
  //   scores.forEach((sc) => {
  //     if (sc.name && sc.score) {
  //       scoreObject[sc.name] = sc.score;
  //     }
  //   });

  //   console.log(scoreObject);
  // fetch('http://localhost:5000/api', {
  //   method: 'PUT',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(scoreObject),
  // })
  //   .then((response) => response.json())
  //   .then((data) => console.log(data));
  // };

  const createScore = async (userName: string) => {
    await addDoc(scoresCollectionRef, { name: userName, score: score });
    const updatedScores = [
      ...scores,
      { name: userName, score: score, id: scores[scores.length - 1].id },
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
      }, scores[scores.length - 1].id || 0);
      await deleteScore(smallestScore as string);
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
        {/* <button onClick={replaceScore}>update the scores</button>
        {Object.keys(backend).map((key, value) => (
          <p>
            {key}: {value}
          </p>
        ))} */}
        {(gameOver || gameWon) && isScoreLegendary() && !submit && (
          <>
            <p>
              You made new record!
              <br />
              fill your nickname bellow
            </p>
            <p>your score: {score}</p>
            <input maxLength={24} placeholder='your name' ref={inputName} />

            <button onClick={() => setUserAndCreateScore()}>
              submit score
            </button>
          </>
        )}
        {submit && <p>thanks!</p>}
      </>
    </div>
  );
};

export default ScoreBoard;
