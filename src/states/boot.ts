import * as Phaser from 'phaser-ce';

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#EDEEC9'
    }

    preload() {

        // here preload your assets!
        this.load.image('testImage', './assets/images/test.jpg')
    }

    render() {
        this.game.state.start('Game')
    }
}
