import { createStore, Store } from 'redux';
import { GameState } from './types';
import { reducer } from './reducer';
import { actionCreators } from './actions';

export default class Game {
    private storage: Store<GameState>;

    constructor() {
        this.storage = createStore<GameState>(reducer);
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

    public getState() {
        return this.storage.getState();
    }


    isWin(): boolean {
        //TODO
        return false;
    }

    isLost(): boolean {
        //TODO
        return false;
    }
}
