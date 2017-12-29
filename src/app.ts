import * as Phaser from 'phaser-ce'

import { BootState } from './states/boot'
import { GameState } from './states/game'

import CFG from './config';

export default class App extends Phaser.Game {

    constructor() {
        let width = document.documentElement.clientWidth > CFG.TILE_WIDTH * 9 ? CFG.TILE_WIDTH * 9  : document.documentElement.clientWidth
        let height = document.documentElement.clientHeight > CFG.TILE_WIDTH * 9  ? CFG.TILE_WIDTH * 9  : document.documentElement.clientHeight

        super(width, height, Phaser.AUTO, 'content', null)

        this.state.add('Boot', BootState, false)
        this.state.add('Game', GameState, false)

        this.state.start('Boot')
    }
}
