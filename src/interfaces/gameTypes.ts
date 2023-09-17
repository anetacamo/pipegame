export interface PipeGameTypes {
  map: Record<string, string | number>;
  tileCode: Record<string, string>;
  upcomingFields: number[];
  gameOver: boolean;
  score: number;
  level: number;
  gameState: GameState;
}

interface Location {
  x: number;
  y: number;
}

type GameState = {
  headLocation: Location;
  body: Record<string, string | number>;
  waterFlow: boolean;
  waterBody: [number, number][];
  waterHead: Location;
  levelDone: boolean;
  waterDirection: string;
  timer: number;
};
