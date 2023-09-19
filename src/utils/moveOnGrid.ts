export default function moveOnGrid(
  direction: number,
  currentLocation: number[],
  rows: number
): number[] | null {
  const [x, y] = currentLocation;
  const moveMap: Record<string, [number, number]> = {
    0: [x, y - 1],
    1: [x + 1, y],
    2: [x, y + 1],
    3: [x - 1, y],
  };
  const newLocation = moveMap[direction];
  if (
    newLocation &&
    newLocation[0] >= 0 &&
    newLocation[0] < rows &&
    newLocation[1] >= 0 &&
    newLocation[1] < rows
  ) {
    return newLocation;
  }
  return null; // Return null when the move is not valid
}
