import { createStore, Store } from 'redux';
import { GameStateWithHistory, GameState } from './types';
import { reducer } from './reducer';
import { actionCreators } from './actions';
import { isMoveLegal } from './reducers/move';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export default class Game {
    private storage: Store<GameStateWithHistory>;

    public hasPastStates = new BehaviorSubject(false);
    public hasFutureStates = new BehaviorSubject(false);

    constructor() {

        window['STATE'] = this;

        this.storage = createStore<GameStateWithHistory>(reducer);
        this.storage.subscribe(() => {
            console.log('TUTAJ')
            window.localStorage.gameState = JSON.stringify(this.storage.getState());

            this.hasPastStates.next(!!this.storage.getState().past.length);
            this.hasFutureStates.next(!!this.storage.getState().future.length);
        });
        this.storage.dispatch(actionCreators.init());
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

    public getState(): GameState {
        return this.storage.getState().present;
    }

    public hasPawnLegalMoves(pawnId): boolean {
        let state = this.getState()
        let pawn = state.pawns.find(p => {
            return p.id === pawnId;
        });

        if (!pawn) {
            return false;
        }

        for (let i = 0; i < state.mapWidth; i++) {
            for (let j = 0; j < state.mapHeight; j++) {
                try {
                    if (isMoveLegal(state, pawn.id, i, j)) {
                        return true;
                    }
                } catch (e) { }
            }
        }

        return false;
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
