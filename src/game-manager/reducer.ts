import { GameState, GameLavelData } from "./types";
import { Reducer, combineReducers } from "redux";
import { MOVE, RESET } from "./actions";
import { moveReducer } from "./reducers/move";
import Levels, { LevelsNames } from './levels';


export const reducer: Reducer<GameState> = (state: GameState = getInitState(), action) => {

    switch (action.type) {
        case MOVE:
            return moveReducer(state, action);

        case RESET:
            return getInitState(true);

        default:
            return state;
    }
}

function getInitState(reset = false): GameState {

    if (!reset && window.localStorage.gameState) {
        try {
            return JSON.parse(window.localStorage.gameState)
        } catch (e) {
            console.error('LocalStorage parse error!')
        }
    }

    let levelData: GameLavelData = Levels.find(l => {
        return l.name === LevelsNames.MODERN;
    }).data;

    let initState: GameState = {
        mapHeight: levelData.mapHeight,
        mapWidth: levelData.mapWidth,
        blockers: levelData.blockers,
        pawns: levelData.pawns.map(({x, y}, id) => {
            return {
                x, y, id
            }
        }),
        startPawnsCount: levelData.pawns.length
    }

    return initState;
}
