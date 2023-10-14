import { BASIC } from '../constants/tileCodes';
import { LEVEL_SETTINGS } from '../constants/LevelConstants';

// Function to generate a random pipe index
export function randomPipe(): number {
  return Math.floor(Math.random() * BASIC.length);
}

// find the direction water will flow out based on direction it flows in.
export function findOutputIndex(inputString: string, number: number): number {
  if (inputString[number] !== '0') {
    return -1;
  }

  const otherZeroIndex = inputString.indexOf('0', 0);
  if (otherZeroIndex !== number) {
    return otherZeroIndex;
  } else {
    const nextZeroIndex = inputString.indexOf('0', otherZeroIndex + 1);
    return nextZeroIndex;
  }
}

export const exitValueToEntry = (number: number) => {
  return number < 2 ? number + 2 : number - 2;
};

export const generateXOfRandomPipeCodes = (level: number) => {
  return [...Array(LEVEL_SETTINGS[level].initial_rows)].map((row) =>
    Math.floor(Math.random() * BASIC.length)
  );
};
