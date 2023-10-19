export interface PipeGameTypes {
  body: Body;
  gameOver: boolean;
  gameWon: boolean;
  headLocation: number[];
  level: number;
  levelDone: boolean;
  rows: number;
  score: number;
  tileCode: Record<string, string>;
  timer: number;
  upcomingFields: number[];
  waterBody: string[];
  waterDirection: string;
  waterFlow: boolean;
  waterHead: number[];
}

interface Body {
  [key: string]: number | undefined;
}
