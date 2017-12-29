import { Reducer } from "redux";
import { GameStateWithHistory, GameState } from "../types";
import { Actions, MOVE } from "../actions";
import cloneState from "../clone-state";

export const moveReducer: Reducer<GameStateWithHistory> = (state: GameStateWithHistory, action: Actions[typeof MOVE]) => {

    validateAction(state.present, action);

    let newState: GameStateWithHistory = cloneState(state);

    newState.past.push(state.present);
    newState.future = [];

    let pawn = newState.present.pawns.find(p => {
        return p.id === action.pawnId;
    });

    let x = (pawn.x + action.targetX) / 2;
    let y = (pawn.y + action.targetY) / 2;

    let pawnToKill = newState.present.pawns.find(p => {return p.x === x && p.y === y});

    pawn.x = action.targetX;
    pawn.y = action.targetY;


    let index = newState.present.pawns.indexOf(pawnToKill);
    newState.present.pawns.splice(index, 1);

    return newState;
}

function validateAction(state: GameState, action: Actions[typeof MOVE]) {
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

function isMoveLegal(state: GameState, action: Actions[typeof MOVE]): boolean {

    if (!isTargetCorrect(state, action)) {
        throw "Target tile is incorrect"
    }

    if (!isPawnToKill(state, action)) {
        throw "You must kill pawn"
    }
    return true;
}

function isTargetCorrect(state: GameState, action: Actions[typeof MOVE]): boolean {
    let pawn = state.pawns.find(p => {return p.id === action.pawnId});

    if ((pawn.x === action.targetX || pawn.y === action.targetY) &&
        Math.abs(pawn.x - action.targetX) + Math.abs(pawn.y - action.targetY) === 2) {
        return true;
    }

    return false;
}

function isPawnToKill(state: GameState, action: Actions[typeof MOVE]): boolean {
    let pawn = state.pawns.find(p => {return p.id === action.pawnId});

    let x = (pawn.x + action.targetX) / 2;
    let y = (pawn.y + action.targetY) / 2;

    let pawnToKill = state.pawns.find(p => {return p.x === x && p.y === y});

    return !!pawnToKill;
}



function isMoveInMap(state: GameState, action: Actions[typeof MOVE]): boolean {
    return (
        action.targetX >= 0 &&
        action.targetX < state.mapWidth &&
        action.targetY >= 0 &&
        action.targetY < state.mapHeight
    )
}

function isTargetEmpty(state: GameState, action: Actions[typeof MOVE]): boolean {
    let isBlockerOnTarget = !!state.blockers.find(b => {
        return b.x === action.targetX && b.y === action.targetY;
    });

    let isPawnOnTarget = !!state.pawns.find(p => {
        return p.x === action.targetX && p.y === action.targetY;
    });

    return !isBlockerOnTarget && !isPawnOnTarget;
}

