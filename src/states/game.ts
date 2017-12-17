import * as Phaser from 'phaser-ce'
import GameManager from '../game-manager/index';
import Pawn from '../sprites/pawn';
import CFG from '../config';

export class GameState extends Phaser.State {
    selectedPawn: number = null;
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
                let pState = state.pawns.find(p => {return p.id === pawn.id});

                if(pState) {
                    pawn.moveTo(pState.x, pState.y);
                } else {
                    pawn.moveTo(0,0);
                }
            });
        });

        window['game'] = this.gameManager;
    }
    preload() { }

    create() {
        this.createMap();
        this.placePawns();
    }

    createMap() {
        let state = this.gameManager.getState();

        for (let i= 0; i < state.mapWidth; i++) {
            for (let j=0; j < state.mapHeight; j++) {
                let sprite: Phaser.Sprite;

                if (state.blockers.find(b => {
                    return b.x === i && b.y === j;
                })) {
                    sprite = this.add.sprite(i * CFG.TILE_WIDTH, j * CFG.TIME_HEIGHT, 'clearBoard')
                } else {
                    sprite = this.add.sprite(i * CFG.TILE_WIDTH, j * CFG.TIME_HEIGHT, 'board');

                    sprite.inputEnabled = true;
                    sprite.events.onInputDown.add(() => {
                        if (this.selectedPawn !== null) {
                            this.gameManager.move(this.selectedPawn, i, j);
                            this.selectedPawn = null;
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

        state.pawns.forEach(p => {
            let pawn = new Pawn(this.game, p.id);
            pawn.moveTo(p.x, p.y);

            pawn.inputEnabled = true;
            pawn.events.onInputDown.add(() => {
                this.selectedPawn = p.id;
            });

            this.add.existing(pawn);

            this.pawns.push(pawn);
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
