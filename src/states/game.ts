import * as Phaser from 'phaser-ce'
import Game from '../game/index';

export class GameState extends Phaser.State {

    init() {
        let game = new Game();

        game.subscribe(() => {
            if (game.isWin()) {
                this.showWinScreen();
            }

            if (game.isLost()) {
                this.showLostScreen();
            }

            console.log(game.getState());
        });

        window['game'] = game;
    }
    preload() { }

    create() {
        this.add.sprite(100, 100, 'testImage');
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
