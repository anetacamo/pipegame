import { useEffect } from 'react';

const useKeyboardInput = (onKeyPress: (key: string) => void) => {
  useEffect(() => {
    const arrowClickHandler = (e: KeyboardEvent) => {
      onKeyPress(e.key);
    };

    window.addEventListener('keydown', arrowClickHandler);

    return () => {
      window.removeEventListener('keydown', arrowClickHandler);
    };
  }, [onKeyPress]);
};

export default useKeyboardInput;
