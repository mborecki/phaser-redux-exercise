export const MOVE = 'MOVE';
export const RESET = 'RESET';
export const UNDO = 'UNDO';
export const REUNDO = 'REUNDO';
export const INIT = 'INIT';

export type Actions = {
  MOVE: {
    type: typeof MOVE,
    pawnId: number,
    targetX: number,
    targetY: number
  },
  RESET: {
    type: typeof RESET
  },
  UNDO: {
    type: typeof UNDO
  },
  REUNDO: {
    type: typeof REUNDO
  },
  INIT: {
    type: typeof INIT
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
  reset: (): Actions[typeof RESET] => ({
    type: RESET
  }),
  undo: (): Actions[typeof UNDO] => ({
    type: UNDO
  }),
  reundo: (): Actions[typeof REUNDO] => ({
    type: REUNDO
  }),
  init: (): Actions[typeof INIT] => ({
    type: INIT
  })
};
