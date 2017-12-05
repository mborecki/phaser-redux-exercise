import { Reducer } from "redux";
import { GameState } from "../types";

export const moveReducer: Reducer<GameState> = (state: GameState, action) => {

    validateAction(state, action);

    let newState = cloneState(state);

    let pawn = newState.pawns.find(p => {
        return p.id === action.pawnId;
    });

    pawn.x = action.targetX;
    pawn.y = action.targetY;

    return newState;
}

function validateAction(state: GameState, action) {
    if (!isMoveInMap(state, action)) {
        throw "Move outside the map";
    }

    if (!isTargetEmpty(state, action)) {
        throw "Target tile is not empty";
    }

    if (!isMoveLegal(state, action)) {
        throw "Unlegal move";
    }
}

function isMoveLegal(state: GameState, action): boolean {
    // TODO
    return true;
}

function isMoveInMap(state: GameState, action): boolean {
    return (
        action.targetX >= 0 &&
        action.targetX < state.mapWidth &&
        action.targetY >= 0 &&
        action.targetY < state.mapHeight
    )
}

function isTargetEmpty(state: GameState, action): boolean {
    let isBlockerOnTarget = !!state.blockers.find(b => {
        return b.x === action.targetX && b.y === action.targetY;
    });

    let isPawnOnTarget = !!state.pawns.find(p => {
        return p.x === action.targetX && p.y === action.targetY;
    });

    return !isBlockerOnTarget && !isPawnOnTarget;
}

function cloneState(state: GameState): GameState {
    return JSON.parse(JSON.stringify(state));
}
