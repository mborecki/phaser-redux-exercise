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
    if (!isMoveLegal(state, action.pawnId, action.targetX, action.targetY)) {
        throw "Inlegal move";
    }
}

export function isMoveLegal(state: GameState, pawnId: number, targetX: number, targetY: number): boolean {

    if (!isMoveInMap(state, targetX, targetY)) {
        throw "Move outside the map";
    }

    if (!isTargetEmpty(state, targetX, targetY)) {
        throw "Target tile is not empty";
    }

    if (!isTargetCorrect(state, pawnId, targetX, targetY)) {
        throw "Target tile is incorrect"
    }

    if (!isPawnToKill(state, pawnId, targetX, targetY)) {
        throw "You must kill pawn"
    }

    return true;
}

function isTargetCorrect(state: GameState, pawnId: number, targetX: number, targetY: number): boolean {
    let pawn = state.pawns.find(p => {return p.id === pawnId});

    if ((pawn.x === targetX || pawn.y === targetY) &&
        Math.abs(pawn.x - targetX) + Math.abs(pawn.y - targetY) === 2) {
        return true;
    }

    return false;
}

function isPawnToKill(state: GameState, pawnId: number, targetX: number, targetY: number): boolean {
    let pawn = state.pawns.find(p => {return p.id === pawnId});

    let x = (pawn.x + targetX) / 2;
    let y = (pawn.y + targetY) / 2;

    let pawnToKill = state.pawns.find(p => {return p.x === x && p.y === y});

    return !!pawnToKill;
}



function isMoveInMap(state: GameState, x: number, y: number): boolean {
    return (
        x >= 0 &&
        x < state.mapWidth &&
        y >= 0 &&
        y < state.mapHeight
    )
}

function isTargetEmpty(state: GameState, x: number, y: number): boolean {
    let isBlockerOnTarget = !!state.blockers.find(b => {
        return b.x === x && b.y === y;
    });

    let isPawnOnTarget = !!state.pawns.find(p => {
        return p.x === x && p.y === y;
    });

    return !isBlockerOnTarget && !isPawnOnTarget;
}

