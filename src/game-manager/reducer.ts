import { GameState, GameLavelData, GameStateWithHistory } from "./types";
import { Reducer, combineReducers } from "redux";
import { MOVE, RESET, UNDO, REUNDO } from "./actions";
import { moveReducer } from "./reducers/move";
import Levels, { LevelsNames } from './levels';
import { undoReducer } from "./reducers/undo";
import { reundoReducer } from "./reducers/reundo";


export const reducer: Reducer<GameStateWithHistory> = (state: GameStateWithHistory = getInitState(), action) => {

    switch (action.type) {
        case MOVE:
            return moveReducer(state, action);

        case RESET:
            return getInitState(true);

        case UNDO:
            return undoReducer(state, action);

        case REUNDO:
            return reundoReducer(state, action);

        default:
            return state;
    }
}

function getInitState(reset = false): GameStateWithHistory {

    if (!reset && window.localStorage.gameState) {
        try {
            return JSON.parse(window.localStorage.gameState)
        } catch (e) {
            console.error('LocalStorage parse error!')
        }
    }

    let levelData: GameLavelData = Levels.find(l => {
        // return l.name === LevelsNames.MODERN;
        return l.name === LevelsNames.CROSS;
    }).data;

    let initState: GameState = {
        mapHeight: levelData.mapHeight,
        mapWidth: levelData.mapWidth,
        blockers: levelData.blockers,
        pawns: levelData.pawns.map(({ x, y }, id) => {
            return {
                x, y, id
            }
        }),
        startPawnsCount: levelData.pawns.length
    }

    return {
        past: [],
        present: initState,
        future: []
    };
}
