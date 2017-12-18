export class BoardTile extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, 'board');

        this.events.onInputOver.add(() => {
            this.loadTexture('board-hover');
        });

        this.events.onInputOut.add(() => {
            this.loadTexture('board');
        });
    }
}
