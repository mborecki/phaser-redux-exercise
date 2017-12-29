import { Reducer } from "redux";
import { GameStateWithHistory } from "../types";
import { Actions, UNDO } from "../actions";
import cloneState from "../clone-state";

export const reundoReducer: Reducer<GameStateWithHistory> = (state: GameStateWithHistory, action: Actions[typeof UNDO]) => {

    if (!state.future.length) {
        throw 'No future states';
    }

    let newState: GameStateWithHistory = cloneState(state);

    let present = newState.future.pop();
    newState.past.push(newState.present);

    newState = {
        past: newState.past,
        present,
        future: newState.future
    }

    return newState;
}
