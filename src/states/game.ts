import * as Phaser from 'phaser-ce'
import GameManager from '../game-manager/index';
import Pawn from '../sprites/pawn';
import CFG from '../config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BoardTile } from '../sprites/board-tile';
import { Observable } from 'rxjs/Observable';

export class GameState extends Phaser.State {
    undoButton: Phaser.Text;
    reundoButton: Phaser.Text;
    resetButton: Phaser.Text;

    winText: Phaser.Text;

    selectedPawnID = new BehaviorSubject<number>(null);
    gameManager: GameManager;
    pawns: Pawn[] = [];

    boardTiles: BoardTile[] = [];

    init() {

        this.gameManager = new GameManager();

        this.createMap();
        this.placePawns();
        this.createUI();

        this.gameManager.hasPastStates.subscribe((value) => {
            console.log('past', value)
            if (this.undoButton) {
                this.undoButton.visible = value;
            }
        });

        this.gameManager.hasFutureStates.subscribe((value) => {
            console.log('future', value)
            if (this.reundoButton) {
                this.reundoButton.visible = value;
            }
        });

        Observable.combineLatest(
            this.gameManager.hasPastStates,
            this.gameManager.hasFutureStates
        ).subscribe(([past, future]) => {
            this.resetButton.visible = past || future;
        });

        this.gameManager.state.subscribe(() => {
            this.updateGUI();
        });

        this.selectedPawnID.subscribe(id => {
            let state = this.gameManager.getState();

            for (let i = 0; i < state.mapWidth; i++) {
                for (let j = 0; j < state.mapHeight; j++) {
                    if (id === null) {
                        let tile = this.boardTiles.find(bt => {
                            return bt.tileX === i && bt.tileY === j;
                        });

                        if (!tile) continue;

                        tile.setAvailableMove(false);
                    } else if (this.gameManager.hasPawnLegalMoves(id)) {
                        let tile = this.boardTiles.find(bt => {
                            return bt.tileX === i && bt.tileY === j;
                        });

                        console.log(i, j, tile);

                        if (!tile) continue;

                        try {
                            console.log(i, j);
                            if (this.gameManager.isMoveLegal(id, i, j)) {
                                tile.setAvailableMove(true);
                            } else {
                                tile.setAvailableMove(false);
                            }
                        } catch (e) {
                            tile.setAvailableMove(false);
                        }

                    }
                }
            }
        })

        window['game'] = this.gameManager;
    }
    preload() { }

    create() {
    }

    createMap() {
        let state = this.gameManager.getState();

        for (let i = 0; i < state.mapWidth; i++) {
            for (let j = 0; j < state.mapHeight; j++) {
                let sprite: Phaser.Sprite;

                if (state.blockers.find(b => {
                    return b.x === i && b.y === j;
                })) {
                    sprite = this.add.sprite(i * CFG.TILE_WIDTH, j * CFG.TIME_HEIGHT, 'clearBoard')
                } else {
                    sprite = new BoardTile(this.game, i, j)
                    this.add.existing(sprite);

                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(() => {
                        let selectedPawnId = this.selectedPawnID.getValue()
                        if (selectedPawnId !== null) {
                            this.gameManager.move(selectedPawnId, i, j);
                            this.selectedPawnID.next(null);
                        }
                    })

                    this.boardTiles.push(sprite as BoardTile);
                }

                sprite.scale.y = (CFG.TIME_HEIGHT / sprite.height);
                sprite.scale.x = (CFG.TILE_WIDTH / sprite.width);
            }
        }
    }

    placePawns() {
        let state = this.gameManager.getState();

        for (let i = 0; i < state.startPawnsCount; i++) {
            let livePawn = state.pawns.find(p => { return p.id === i });

            let pawn = new Pawn(this.game, i);
            pawn.setSelectedIdObs(this.selectedPawnID);
            pawn.live = !!livePawn;

            if (livePawn) {
                pawn.moveTo(livePawn.x, livePawn.y);
            }

            pawn.inputEnabled = true;
            pawn.events.onInputDown.add(() => {
                if (!pawn.live) return;

                this.selectedPawnID.next(i);
            });

            this.add.existing(pawn);

            this.pawns.push(pawn);
        };
    }

    createUI() {
        this.resetButton = this.add.text(10, CFG.TIME_HEIGHT * 8, 'RESET');
        this.resetButton.inputEnabled = true;
        this.resetButton.events.onInputDown.add(() => {
            this.gameManager.reset();
            this.selectedPawnID.next(null);
            if (this.winText) {
                this.winText.destroy();
            }
        });

        this.undoButton = this.add.text(10, CFG.TIME_HEIGHT * 7, 'UNDO');
        this.undoButton.inputEnabled = true;
        this.undoButton.events.onInputDown.add(() => {
            this.gameManager.undo();
            if (this.winText) {
                this.winText.destroy();
            }
        });

        this.reundoButton = this.add.text(10, CFG.TIME_HEIGHT * 6, 'REUNDO');
        this.reundoButton.inputEnabled = true;
        this.reundoButton.events.onInputDown.add(() => {
            this.gameManager.reundo();
            if (this.winText) {
                this.winText.destroy();
            }
        });
    }

    render() {

    }

    showWinScreen() {
        this.winText = this.add.text(CFG.TIME_HEIGHT * 8, CFG.TIME_HEIGHT * 8, 'WIN!')
    }

    showLostScreen() {
        throw new Error("Method not implemented.");
    }

    private updateGUI() {
        let state = this.gameManager.getState();

        console.log('subscribe', state);

        if (this.gameManager.isWin()) {
            this.showWinScreen();
        }

        if (this.gameManager.isLost()) {
            this.showLostScreen();
        }

        this.pawns.forEach(pawn => {
            let pState = state.pawns.find(p => { return p.id === pawn.id });

            pawn.setHasValidMove(this.gameManager.hasPawnLegalMoves(pawn.id))

            if (pState) {
                pawn.moveTo(pState.x, pState.y);
                pawn.live = true;
            } else {
                pawn.moveTo(-1, -1);
                pawn.live = false;
            }
        });
    }
}
