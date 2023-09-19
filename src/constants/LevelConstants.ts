export const levelSettings = {
  level1: {
    rows: 6,
    INITIAL_LOCATION: [0, 0],
    TIMER: 30000,
    SPEED: 2000,
    DIRECTION: 'right',
    BODY: {
      '0,0': 10,
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
    BODY: { '0,0': 10, '5,2': 7, '1,3': 8, '6,6': 12 },
  },
  level4: {
    rows: 7,
    INITIAL_LOCATION: [0, 0],
    TIMER: 15000,
    SPEED: 1500,
    DIRECTION: 'right',
    BODY: { '0,0': 10, '5,2': 7, '1,3': 8, '4,0': 9, '2,4': 11, '6,6': 12 },
  },
  level5: {
    rows: 7,
    INITIAL_LOCATION: [0, 0],
    TIMER: 15000,
    SPEED: 1500,
    DIRECTION: 'right',
    BODY: { '0,0': 10, '5,2': 7, '1,3': 8, '6,6': 12 },
  },
  // Add settings for other levels here
};
