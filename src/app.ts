import * as Phaser from 'phaser-ce'

import { BootState } from './states/boot'
import { GameState } from './states/game'

export default class App extends Phaser.Game {

    constructor() {
        let width = document.documentElement.clientWidth > 768 ? 768 : document.documentElement.clientWidth
        let height = document.documentElement.clientHeight > 1024 ? 1024 : document.documentElement.clientHeight

        super(width, height, Phaser.AUTO, 'content', null)

        this.state.add('Boot', BootState, false)
        this.state.add('Game', GameState, false)

        this.state.start('Boot')
    }
}
