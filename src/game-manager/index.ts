import { createStore, Store } from 'redux';
import { GameStateWithHistory, GameState } from './types';
import { reducer } from './reducer';
import { actionCreators } from './actions';
import { isMoveLegal } from './reducers/move';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const VER = '1.0.0';
export const LS_GAME_STATE_KEY = 'mb_solitaire-gs';
const LS_VER_KEY = 'mb_solitaire-ver';

export default class Game {
    private storage: Store<GameStateWithHistory>;

    public hasPastStates = new BehaviorSubject(false);
    public hasFutureStates = new BehaviorSubject(false);

    public state = new BehaviorSubject(null);

    constructor() {

        window['STATE'] = this;

        this.storage = createStore<GameStateWithHistory>(reducer);
        this.storage.subscribe(() => {
            this.state.next(this.storage.getState());

            if (VER !== window.localStorage[LS_VER_KEY]) {
                window.localStorage[LS_VER_KEY] = VER;
                window.localStorage.removeItem(LS_GAME_STATE_KEY);
            }

            window.localStorage[LS_GAME_STATE_KEY] = JSON.stringify(this.storage.getState());

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

    public isMoveLegal(pawnId, x, y) {
        return isMoveLegal(this.getState(), pawnId, x, y);
    }

    isWin(): boolean {
        return this.getState().pawns.length === 1
        // return false;
    }

    isLost(): boolean {
        return !this.getState().pawns.find(p => {
            return this.hasPawnLegalMoves(p.id);
        })
    }
}
