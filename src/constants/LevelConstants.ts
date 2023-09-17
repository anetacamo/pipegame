export const levelSettings = {
  level1: {
    rows: 5,
    INITIAL_LOCATION: [0, 0],
    TIMER: 3000,
    SPEED: 2000,
    DIRECTION: 'right',
    BODY: {
      '0,0': 10,
      '2,2': 8,
      '3,1': 7,
      '4,4': 12,
    },
  },
  level2: {
    rows: 6,
    INITIAL_LOCATION: [0, 0],
    TIMER: 15000,
    SPEED: 1500,
    DIRECTION: 'right',
    BODY: { '0,0': 10, '6,6': 12, '3,3': 8 },
  },
  level3: {
    rows: 7,
    INITIAL_LOCATION: [0, 0],
    TIMER: 15000,
    SPEED: 1500,
    DIRECTION: 'right',
    BODY: { '0,0': 10, '5,2': 7, '1,3': 8, '7,7': 12 },
  },
  level4: {
    rows: 7,
    INITIAL_LOCATION: [0, 0],
    TIMER: 15000,
    SPEED: 1500,
    DIRECTION: 'right',
    BODY: { '0,0': 10, '5,2': 7, '1,3': 8, '7,7': 12 },
  },
  // Add settings for other levels here
};
