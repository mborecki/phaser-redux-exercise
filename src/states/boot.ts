import * as Phaser from 'phaser-ce';

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#EDEEC9'

        this.game.scale.windowConstraints.bottom = "visual";
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    preload() {
        this.load.image('clearBoard', './assets/images/clear-board-flat_lit.png');

        this.load.image('board', './assets/images/place-board-flat_lit.png');
        this.load.image('board-hover', './assets/images/place-board-hover-flat_lit.png');

        this.load.image('pawn', './assets/images/pawn-flat_lit.png');
        this.load.image('pawn-selected', './assets/images/pawn-selected-flat_lit.png');
        this.load.image('pawn-selected-hover', './assets/images/pawn-selected-hover-flat_lit.png');
        this.load.image('pawn-hover', './assets/images/pawn-hover-flat_lit.png');
        this.load.image('pawn-disable', './assets/images/pawn-disable-flat_lit.png');

        this.load.image('board-available', './assets/images/place-board-available-flat_lit.png');
        this.load.image('board-available-hover', './assets/images/place-board-available-hover-flat_lit.png');
    }

    render() {
        this.game.state.start('Game')
    }
}
