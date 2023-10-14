export const LEVEL_SETTINGS = [
  {
    initial_rows: 6,
    initial_location: [0, 0],
    initial_timer: 30000,
    initial_speed: 2000,
    text:
      'welcome & Watch out! This game is for desktop only.\n Move on the field by the arrows up, right, down and left. Press spacebar to place a pipe tile.\n You can see upcoming tiles on the left. Timer on the right.\n When times runs out, water will flow from top left pipe.',
    initial_body: {
      '0,0': 10,
      '5,5': 12,
    },
  },
  {
    initial_rows: 6,
    initial_location: [0, 0],
    initial_timer: 28000,
    initial_speed: 2000,
    text:
      'if you manage to lead the water to the end pipe, youll get 100 points.',
    initial_body: {
      '0,0': 10,
      '5,5': 12,
    },
  },
  {
    initial_rows: 6,
    initial_location: [0, 0],
    initial_timer: 26000,
    initial_speed: 1500,
    text:
      'Using a cross gives you 30 points, run through it again and double that.',
    initial_body: { '0,0': 10, '5,5': 12, '3,3': 0, '1,4': 0, '4,2': 0 },
  },
  {
    initial_rows: 7,
    initial_location: [0, 0],
    initial_timer: 24000,
    initial_speed: 1500,
    text: 'This game has 5 levels',
    initial_body: { '0,0': 10, '5,2': 7, '1,3': 8, '6,6': 12 },
  },
  {
    initial_rows: 7,
    initial_location: [0, 0],
    initial_timer: 22000,
    initial_speed: 1500,
    text:
      'If you score more then the last person on the board, youll replace them.',
    initial_body: {
      '0,0': 10,
      '5,2': 7,
      '1,3': 8,
      '4,0': 8,
      '2,4': 0,
      '6,6': 12,
    },
  },
  {
    initial_rows: 7,
    initial_location: [0, 0],
    initial_timer: 20000,
    initial_speed: 1500,
    text:
      'spacebar to place a pipe tile. You can see upcoming tiles on the left.',
    initial_body: { '0,0': 10, '5,2': 7, '1,3': 8, '6,6': 12 },
  },
];
