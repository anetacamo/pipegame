export interface PipeGameTypes {
  body: Body;
  gameOver: boolean;
  gameWon: boolean;
  headLocation: Location;
  level: number;
  levelDone: boolean;
  rows: number;
  score: number;
  tileCode: Record<string, string>;
  timer: number;
  upcomingFields: number[];
  waterBody: [number, number][];
  waterDirection: string;
  waterFlow: boolean;
  waterHead: Location;
}

interface Body {
  [key: string]: number | undefined;
}

interface Location {
  x: number;
  y: number;
}
