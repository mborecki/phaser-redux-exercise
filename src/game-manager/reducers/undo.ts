import { Reducer } from "redux";
import { GameStateWithHistory } from "../types";
import { Actions, UNDO } from "../actions";
import cloneState from "../clone-state";

export const undoReducer: Reducer<GameStateWithHistory> = (state: GameStateWithHistory, action: Actions[typeof UNDO]) => {

    if (!state.past.length) {
        throw 'No past states';
    }

    let newState: GameStateWithHistory = cloneState(state);

    let present = newState.past.pop();
    newState.future.push(newState.present);

    newState = {
        past: newState.past,
        present,
        future: newState.future
    }

    return newState;
}
