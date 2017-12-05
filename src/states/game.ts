import * as Phaser from 'phaser-ce'

export class GameState extends Phaser.State {

    init() { }
    preload() { }

    create() {
        this.add.sprite(100, 100, 'testImage');
    }

    render() {
    }
}
