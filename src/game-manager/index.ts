import { createStore, Store } from 'redux';
import { GameStateWithHistory, GameState } from './types';
import { reducer } from './reducer';
import { actionCreators } from './actions';

export default class Game {
    private storage: Store<GameStateWithHistory>;

    constructor() {

        window['STATE'] = this;

        this.storage = createStore<GameStateWithHistory>(reducer);
        this.storage.subscribe(() => {
            window.localStorage.gameState = JSON.stringify(this.storage.getState());
        });
    }

    public subscribe(listener) {
        this.storage.subscribe(listener);
    }

    public move(pawnId: number, targetX: number, targetY: number) {
        this.storage.dispatch(actionCreators.move(pawnId, targetX, targetY));
    }

    public reset() {
        this.storage.dispatch(actionCreators.reset());
    }

    public undo() {
        this.storage.dispatch(actionCreators.undo());
    }

    public reundo() {
        this.storage.dispatch(actionCreators.reundo());
    }

    public getState() : GameState {
        return this.storage.getState().present;
    }

    isWin(): boolean {
        return this.getState().pawns.length === 1
        // return false;
    }

    isLost(): boolean {
        //TODO
        return false;
    }
}
