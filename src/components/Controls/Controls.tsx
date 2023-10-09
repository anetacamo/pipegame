import React from 'react';

interface ControlsProps {
  newGameHandler: () => void;
  waterFlow: boolean;
  gameWon: boolean;

  levelDone: boolean;
  newLevelHandler: () => void;
  setWaterFlow: (value: boolean) => void;
  buttonNextLevelRef?: any;
  buttonNewGameRef?: any;
  text?: string;
}

const Controls: React.FC<ControlsProps> = ({
  newGameHandler,
  waterFlow,

  levelDone,
  newLevelHandler,
  buttonNextLevelRef,
  buttonNewGameRef,
  setWaterFlow,
  gameWon,
  text,
}) => {
  return (
    <div>
      <div className='flex'>
        <button onClick={newGameHandler} ref={buttonNewGameRef}>
          New Game
        </button>
        {!waterFlow && (
          <button onClick={() => setWaterFlow(true)}>
            Let the water flow!
          </button>
        )}
      </div>

      {levelDone && !gameWon && (
        <>
          <p>success!</p>
          <button onClick={newLevelHandler} ref={buttonNextLevelRef}>
            Next Level
          </button>
        </>
      )}
      {text && (
        <p style={{ whiteSpace: 'pre-line', position: 'absolute' }}>{text}</p>
      )}
    </div>
  );
};

export default Controls;
