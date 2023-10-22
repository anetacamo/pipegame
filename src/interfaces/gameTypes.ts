export interface PipeGameTypes {
  body: Body;
  gameWon: boolean;
  gameOver: boolean;
  headLocation: number[];
  level: number;
  levelDone: boolean;
  score: number;
  speed: number;
  speedUp: boolean;
  timer: boolean;
  upcomingFields: number[];
  waterBody: string[];
  waterDirection: number;
  waterFlow: boolean;
  waterHeadLocation: number[];
}

interface Body {
  [key: string]: number | undefined;
}
