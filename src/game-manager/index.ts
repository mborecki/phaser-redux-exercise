import { createStore, Store } from 'redux';
import { GameStateWithHistory, GameState } from './types';
import { reducer } from './reducer';
import { actionCreators } from './actions';
import { isMoveLegal } from './reducers/move';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// GameState version - used to detect breaking changes in localStorage data
const VER = '1.0.0';

// loaclStorage keys names
export const LS_GAME_STATE_KEY = 'mb_solitaire-gs';
const LS_VER_KEY = 'mb_solitaire-ver';

export default class Game {
    // Redux storage with game state
    private storage: Store<GameStateWithHistory>;

    // Is there past states in history
    public hasPastStates = new BehaviorSubject(false);

    // Is there future states in history
    public hasFutureStates = new BehaviorSubject(false);

    // GameState Observable - used because Observable are more convenient as API than public redux storage
    public state = new BehaviorSubject(null);

    constructor() {

        // If this is new game state version - clear localStorage
        if (VER !== window.localStorage[LS_VER_KEY]) {
            window.localStorage[LS_VER_KEY] = VER;
            window.localStorage.removeItem(LS_GAME_STATE_KEY);
        }

        this.storage = createStore<GameStateWithHistory>(reducer);
        this.storage.subscribe(() => {
            // On state change update state Observable
            this.state.next(this.storage.getState());

            // Save game state in localStorage
            window.localStorage[LS_GAME_STATE_KEY] = JSON.stringify(this.storage.getState());

            // update past/future states info
            this.hasPastStates.next(!!this.storage.getState().past.length);
            this.hasFutureStates.next(!!this.storage.getState().future.length);
        });

        // initialize state
        this.storage.dispatch(actionCreators.init());
    }

    /**
     * Move action
     *
     * @param pawnId
     * @param targetX
     * @param targetY
     */
    public move(pawnId: number, targetX: number, targetY: number) {
        this.storage.dispatch(actionCreators.move(pawnId, targetX, targetY));
    }

    /**
     * Reset game
     */
    public reset() {
        this.storage.dispatch(actionCreators.reset());
    }

    /**
     * Undo move
     */
    public undo() {
        this.storage.dispatch(actionCreators.undo());
    }

    /**
     * Reundo move
     */
    public reundo() {
        this.storage.dispatch(actionCreators.reundo());
    }

    /**
     * Returns actual game state
     */
    public getState(): GameState {
        return this.storage.getState().present;
    }

    /**
     * Check if pawn has legal moves
     *
     * @param pawnId
     */
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

    /**
     * Check if move is legal
     *
     * @param pawnId
     * @param x
     * @param y
     */
    public isMoveLegal(pawnId, x, y) {
        return isMoveLegal(this.getState(), pawnId, x, y);
    }

    /**
     * Check win condition
     */
    isWin(): boolean {
        return this.getState().pawns.length === 1
        // return false;
    }

    /**
     * Check lost condition
     */
    isLost(): boolean {
        return !this.getState().pawns.find(p => {
            return this.hasPawnLegalMoves(p.id);
        })
    }
}
