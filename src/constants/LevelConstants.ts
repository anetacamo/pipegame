export const LEVEL_SETTINGS = {
  level1: {
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
  level2: {
    initial_rows: 6,
    initial_location: [0, 0],
    initial_timer: 30000,
    initial_speed: 1500,
    text:
      'If you use three cross tiles you will get extra points in the future.',
    initial_body: { '0,0': 10, '5,5': 12, '3,3': 0, '1,4': 0, '4,2': 0 },
  },
  level3: {
    initial_rows: 7,
    initial_location: [0, 0],
    initial_timer: 15000,
    initial_speed: 1500,
    text: 'If you encounter suspisious behaviour, refresh!',
    initial_body: { '0,0': 10, '5,2': 7, '1,3': 8, '6,6': 12 },
  },
  level4: {
    initial_rows: 7,
    initial_location: [0, 0],
    initial_timer: 15000,
    initial_speed: 1500,
    text:
      'spacebar to place a pipe tile. You can see upcoming tiles on the left.',
    initial_body: {
      '0,0': 10,
      '5,2': 7,
      '1,3': 8,
      '4,0': 8,
      '2,4': 0,
      '6,6': 12,
    },
  },
  level5: {
    initial_rows: 7,
    initial_location: [0, 0],
    initial_timer: 15000,
    initial_speed: 1500,
    text:
      'spacebar to place a pipe tile. You can see upcoming tiles on the left.',
    initial_body: { '0,0': 10, '5,2': 7, '1,3': 8, '6,6': 12 },
  },
  // Add settings for other levels here
};
