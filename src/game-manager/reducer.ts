import { GameState, GameLavelData } from "./types";
import { Reducer, combineReducers } from "redux";
import { MOVE, RESET } from "./actions";
import { moveReducer } from "./reducers/move";


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

    let levelData: GameLavelData = {
        mapHeight: 9,
        mapWidth: 9,
        blockers: [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 0, y: 6 },
            { x: 1, y: 6 },
            { x: 2, y: 6 },
            { x: 0, y: 7 },
            { x: 1, y: 7 },
            { x: 2, y: 7 },
            { x: 0, y: 8 },
            { x: 1, y: 8 },
            { x: 2, y: 8 },
            { x: 6, y: 0 },
            { x: 7, y: 0 },
            { x: 8, y: 0 },
            { x: 6, y: 1 },
            { x: 7, y: 1 },
            { x: 8, y: 1 },
            { x: 6, y: 2 },
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 6, y: 6 },
            { x: 7, y: 6 },
            { x: 8, y: 6 },
            { x: 6, y: 7 },
            { x: 7, y: 7 },
            { x: 8, y: 7 },
            { x: 6, y: 8 },
            { x: 7, y: 8 },
            { x: 8, y: 8 },
        ],
        pawns: [
            { x: 4, y: 4 },
            { x: 3, y: 4 },
            { x: 4, y: 3 },
            { x: 5, y: 4 },
            { x: 4, y: 5 },
            { x: 4, y: 6 }
        ]

    }

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
