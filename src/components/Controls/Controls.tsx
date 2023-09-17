import React from 'react';

interface ControlsProps {
  newGameHandler: () => void;
  waterFlow: boolean;
  gameOver: boolean;
  levelDone: boolean;
  newLevelHandler: () => void;
  setWaterFlow: (value: boolean) => void;
  buttonNextLevelRef?: any;
  buttonNewGameRef?: any;
}

const Controls: React.FC<ControlsProps> = ({
  newGameHandler,
  waterFlow,
  gameOver,
  levelDone,
  newLevelHandler,
  buttonNextLevelRef,
  buttonNewGameRef,
  setWaterFlow,
}) => {
  return (
    <div>
      <button onClick={newGameHandler} ref={buttonNewGameRef}>
        New Game
      </button>
      {gameOver && <p>game over</p>}
      {levelDone && (
        <>
          <p>success!</p>
          <button onClick={newLevelHandler} ref={buttonNextLevelRef}>
            Next Level
          </button>
        </>
      )}
      {!waterFlow && (
        <button onClick={() => setWaterFlow(true)}>Let the water flow!</button>
      )}
    </div>
  );
};

export default Controls;
