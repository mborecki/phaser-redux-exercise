import { GameState } from "./types";
import { Reducer, combineReducers } from "redux";
import { MOVE, RESET } from "./actions";
import { moveReducer } from "./reducers/move";


export const reducer: Reducer<GameState> = (state: GameState = getInitState(), action) => {

    switch(action.type) {
        case MOVE:
            return moveReducer(state, action);

        case RESET:
            return getInitState(true);

        default:
            return state;
    }
}

function getInitState(reset = false) : GameState {

    if (!reset && window.localStorage.gameState) {
        try {
            return JSON.parse(window.localStorage.gameState)
        } catch(e) {
            console.error('LocalStorage parse error!')
        }
    }

    return {
        mapHeight: 9,
        mapWidth: 9,
        blockers: [],
        pawns: [{
            id: 0,
            x: 5,
            y: 5
        }]
    }
}
