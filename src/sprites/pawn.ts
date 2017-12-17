import CFG from '../config';

export default class Pawn extends Phaser.Sprite {
    id: number;
    constructor(game: Phaser.Game, id: number) {
        super(game, 0, 0, 'pawn');

        this.id = id;

        this.scale.x = ((CFG.TILE_WIDTH * .75) / this.width);
        this.scale.y = ((CFG.TIME_HEIGHT * .75) / this.height);
    }

    moveTo(x: number, y: number) {
        let tween = this.game.add.tween(this).to({
            x: (x + .5) * CFG.TILE_WIDTH - (this.width / 2),
            y: (y + .5) * CFG.TIME_HEIGHT - (this.height / 2)
        }, 300);

        tween.start();
    }
}
