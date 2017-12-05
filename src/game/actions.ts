export const MOVE = 'MOVE';
export const RESET = 'RESET';

export type Actions = {
  MOVE: {
    type: typeof MOVE,
    pawnId: number,
    targetX: number,
    targetY: number
  },
  RESET: {
      type: typeof RESET
  }
};

// Action Creators
export const actionCreators = {
  move: (pawnId, targetX, targetY): Actions[typeof MOVE] => ({
    type: MOVE,
    pawnId,
    targetX,
    targetY
  }),
  reset: () : Actions[typeof RESET] => ({
      type: RESET
  })
};
