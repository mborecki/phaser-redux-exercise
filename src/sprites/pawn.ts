import CFG from '../config';
import { Observable } from 'rxjs/Observable';

export default class Pawn extends Phaser.Sprite {
    id: number;
    selected = false;
    live = false;

    constructor(game: Phaser.Game, id: number) {
        super(game, 0, 0, 'pawn');

        this.id = id;

        this.scale.x = ((CFG.TILE_WIDTH) / this.width);
        this.scale.y = ((CFG.TIME_HEIGHT) / this.height);

        this.events.onInputOver.add(() => {
            if (!this.live) return;

            if (!this.selected) {
                this.setHoverSprite();
                this.bringToTop();
            }
        });

        this.events.onInputOut.add(() => {
            if (!this.live) return;

            if (!this.selected) {
                this.setNormalSprite();
            }
        });
    }

    moveTo(x: number, y: number) {
        let tween = this.game.add.tween(this).to({
            x: (x + .5) * CFG.TILE_WIDTH - (this.width / 2),
            y: (y + .5) * CFG.TIME_HEIGHT - (this.height / 2)
        }, 300);

        tween.start();
    }

    setSelectedIdObs(selectedPawnID: Observable<number>) {
        selectedPawnID.subscribe(id => {
            if (id === this.id) {
                this.selected = true;
                this.setSelectedSprite();
            } else {
                this.selected = false;
                this.setNormalSprite();
            }
        });
    }

    private setHoverSprite() {
        this.loadTexture('pawn-hover');
    }

    private setSelectedSprite() {
        this.loadTexture('pawn-selected');
    }

    private setNormalSprite() {
        this.loadTexture('pawn');
    }
}
