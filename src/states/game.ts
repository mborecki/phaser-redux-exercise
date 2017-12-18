import * as Phaser from 'phaser-ce'
import GameManager from '../game-manager/index';
import Pawn from '../sprites/pawn';
import CFG from '../config';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BoardTile } from '../sprites/board-tile';

export class GameState extends Phaser.State {
    selectedPawnID = new BehaviorSubject<number>(null);
    gameManager: GameManager;
    pawns: Pawn[] = [];

    init() {
        this.gameManager = new GameManager();

        this.gameManager.subscribe(() => {
            let state = this.gameManager.getState();
            if (this.gameManager.isWin()) {
                this.showWinScreen();
            }

            if (this.gameManager.isLost()) {
                this.showLostScreen();
            }

            console.log(this.gameManager.getState());

            this.pawns.forEach(pawn => {
                let pState = state.pawns.find(p => { return p.id === pawn.id });

                if (pState) {
                    console.log(pState.id, '->', pState.x, pState.y);
                    pawn.moveTo(pState.x, pState.y);
                    pawn.live = true;
                } else {
                    pawn.moveTo(0, 0);
                    pawn.live = false;
                }
            });
        });

        window['game'] = this.gameManager;
    }
    preload() { }

    create() {
        this.createMap();
        this.placePawns();
        this.createUI();
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
                    // sprite = this.add.sprite(i * CFG.TILE_WIDTH, j * CFG.TIME_HEIGHT, 'board');
                    sprite = new BoardTile(this.game, i * CFG.TILE_WIDTH, j * CFG.TIME_HEIGHT)
                    this.add.existing(sprite);

                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(() => {
                        let selectedPawnId = this.selectedPawnID.getValue()
                        if (selectedPawnId !== null) {
                            this.gameManager.move(selectedPawnId, i, j);
                            this.selectedPawnID.next(null);
                        }
                    })
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
        let resetButton = this.add.text(10, CFG.TIME_HEIGHT * 8, 'RESET');
        resetButton.inputEnabled = true;
        resetButton.events.onInputDown.add(() => {
            console.log('RESET');
            this.gameManager.reset();
        });
    }

    render() {

    }


    showWinScreen() {
        throw new Error("Method not implemented.");
    }

    showLostScreen() {
        throw new Error("Method not implemented.");
    }
}
