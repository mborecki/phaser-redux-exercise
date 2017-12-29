import * as Phaser from 'phaser-ce'
import GameManager from '../game-manager/index';
import Pawn from '../sprites/pawn';
import CFG from '../config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BoardTile } from '../sprites/board-tile';
import { Observable } from 'rxjs/Observable';
import { Button } from '../sprites/button';

export class GameState extends Phaser.State {

    // Layers
    uiLayer: Phaser.Group;
    pawnsLayer: Phaser.Group;
    backgroundLayer: Phaser.Group;

    // UI Buttons
    undoButton: Button;
    reundoButton: Button;
    resetButton: Button;

    // Win / Lost message
    msgText: Phaser.Text;

    // Actualy selected Pawn
    selectedPawnID = new BehaviorSubject<number>(null);

    // Main Game Object
    gameManager: GameManager;

    // References to Pawn sprites
    pawns: Pawn[] = [];

    // References to BoardTile sprites
    boardTiles: BoardTile[] = [];

    init() {
        this.initLayers();
        this.initGameState();
        this.initScreen();
    }

    /**
     * Create layers to organize sprite's z-index
     */
    private initLayers() {
        this.backgroundLayer = this.game.add.group();
        this.pawnsLayer = this.game.add.group();
        this.uiLayer = this.game.add.group();
    }

    /**
     * Init GameManager - object with whole game logics
     */
    private initGameState() {

        this.gameManager = new GameManager();

        // When game state changes - update sreen
        this.gameManager.state.subscribe(() => {
            this.updateScreen();
        });

        // When player selects pawn mark posible moves and remove old markings
        this.selectedPawnID.subscribe(id => {
            let hasLegalMoves = this.gameManager.hasPawnLegalMoves(id);

            this.boardTiles.forEach(tile => {
                if (hasLegalMoves) {
                    try {
                        if (this.gameManager.isMoveLegal(id, tile.tileX, tile.tileY)) {
                            tile.setAvailableMoveMark(true);
                        } else {
                            tile.setAvailableMoveMark(false);
                        }
                    } catch (e) {
                        tile.setAvailableMoveMark(false);
                    }
                } else {
                    tile.setAvailableMoveMark(false);
                }
            });
        });
    }

    /**
     * Create constant screen elements
     */
    private initScreen() {
        this.buildBoard();
        this.createUI();
    }

    /**
     * Create board tiles
     */
    private buildBoard() {
        let state = this.gameManager.getState();

        for (let i = 0; i < state.mapWidth; i++) {
            for (let j = 0; j < state.mapHeight; j++) {
                let sprite: Phaser.Sprite;

                if (state.blockers.find(b => {
                    return b.x === i && b.y === j;
                })) {
                    // If tile is a blocker create `clearBoard` sprite
                    sprite = this.add.sprite(i * CFG.TILE_WIDTH, j * CFG.TILE_HEIGHT, 'clearBoard')
                } else {

                    // Create BoardTile
                    sprite = new BoardTile(this.game, i, j)
                    this.add.existing(sprite);

                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(() => {
                        let selectedPawnId = this.selectedPawnID.getValue()

                        // If any pawn is selected try to make a move
                        if (selectedPawnId !== null) {
                            this.gameManager.move(selectedPawnId, i, j);
                            this.selectedPawnID.next(null);
                        }
                    })

                    this.boardTiles.push(sprite as BoardTile);
                }

                // Assign sprite to proper layer
                this.backgroundLayer.add(sprite);

                // Scale sprite to tile size
                sprite.scale.y = (CFG.TILE_HEIGHT / sprite.height);
                sprite.scale.x = (CFG.TILE_WIDTH / sprite.width);
            }
        }
    }

    private createUI() {
        this.createResetButton();
        this.createUndoButton();
        this.createReundoButton();
    }

    private createResetButton() {
        this.resetButton = new Button(this.game, CFG.TILE_HEIGHT * .5, CFG.TILE_HEIGHT * 8, 'RESET')
        this.resetButton.events.onInputDown.add(() => {
            this.gameManager.reset();
            this.selectedPawnID.next(null);
            if (this.msgText) {
                this.msgText.destroy();
            }
        });
        this.add.existing(this.resetButton);
        this.uiLayer.add(this.resetButton);

        // Reset button is shown if there are past of future states
        Observable.combineLatest(
            this.gameManager.hasPastStates,
            this.gameManager.hasFutureStates
        ).subscribe(([past, future]) => {
            this.resetButton.visible = past || future;
        });
    }

    private createUndoButton() {
        this.undoButton = new Button(this.game, CFG.TILE_HEIGHT * .5, CFG.TILE_HEIGHT * 7.5, 'UNDO');
        this.undoButton.events.onInputDown.add(() => {
            this.gameManager.undo();
            this.selectedPawnID.next(null);
            if (this.msgText) {
                this.msgText.destroy();
            }
        });
        this.add.existing(this.undoButton);
        this.uiLayer.add(this.undoButton);

        // Undo button is shown if there are past states
        this.gameManager.hasPastStates.subscribe((value) => {
            if (this.undoButton) {
                this.undoButton.visible = value;
            }
        });
    }

    private createReundoButton() {
        this.reundoButton = new Button(this.game, CFG.TILE_HEIGHT * .5, CFG.TILE_HEIGHT * 7, 'REUNDO')
        this.reundoButton.events.onInputDown.add(() => {
            this.gameManager.reundo();
            this.selectedPawnID.next(null);
            if (this.msgText) {
                this.msgText.destroy();
            }
        });
        this.add.existing(this.reundoButton);
        this.uiLayer.add(this.reundoButton);

        // Reundo button is shown if there are future states
        this.gameManager.hasFutureStates.subscribe((value) => {
            if (this.reundoButton) {
                this.reundoButton.visible = value;
            }
        });
    }

    private showWinScreen() {
        this.msgText = this.add.text(CFG.TILE_HEIGHT * 8, CFG.TILE_HEIGHT * 8, 'WIN!')
    }

    private showLostScreen() {
        this.msgText = this.add.text(CFG.TILE_HEIGHT * 6, CFG.TILE_HEIGHT * 6, 'No legal moves!')
    }

    private updateScreen() {
        let state = this.gameManager.getState();

        // If isWin - show win message
        if (this.gameManager.isWin()) {
            this.showWinScreen();
        }

        // If isLost - show lost message
        if (this.gameManager.isLost()) {
            this.showLostScreen();
        }

        // If there are more pawns in game stare than pawns on screen - create now Pawn sprites.
        if (this.pawns.length < state.pawns.length) {
            state.pawns.forEach(sPawn => {
                if (!this.pawns.find(p => {
                    return p.id === sPawn.id
                })) {
                    this.createPawn(sPawn.id);
                }
            })
        }

        this.pawns.forEach(pawn => {
            // Find referring pawn in game state
            let pState = state.pawns.find(p => { return p.id === pawn.id });

            // Check if pawn has valid moves
            pawn.setHasValidMove(this.gameManager.hasPawnLegalMoves(pawn.id))

            if (pState) {
                // Move pawns sprite to proper place
                pawn.moveTo(pState.x, pState.y);
                pawn.live = true;
            } else {
                // Remove pawn from board
                pawn.moveTo(-1, -1);
                pawn.live = false;
            }
        });
    }

    private createPawn(id: number) {

        let pawn = new Pawn(this.game, id);

        // Pass selectedPawnID Observable to Pawn
        pawn.setSelectedIdObs(this.selectedPawnID);
        pawn.live = false;

        pawn.inputEnabled = true;

        // On click select clicked pawn
        pawn.events.onInputDown.add(() => {
            if (!pawn.live) return;

            this.selectedPawnID.next(id);
        });


        this.pawns.push(pawn);

        // Add pawn to layer
        this.pawnsLayer.add(pawn);

        // Add pawn to state
        this.add.existing(pawn);
    }
}
