import * as Phaser from 'phaser-ce';

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#EDEEC9'
    }

    preload() {
        this.load.image('clearBoard', './assets/images/clear-board-flat.png');
        this.load.image('board', './assets/images/place-board-flat.png');
        this.load.image('pawn', './assets/images/pawn-flat.png');
    }

    render() {
        this.game.state.start('Game')
    }
}
