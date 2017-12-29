import CFG from '../config';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';

export default class Pawn extends Phaser.Sprite {
    id: number;
    live = false;

    private hasValidMove = new BehaviorSubject(false);
    private hover = new BehaviorSubject(false);
    private selected = new BehaviorSubject(false);

    constructor(game: Phaser.Game, id: number) {
        super(game, -100, -100, 'pawn');

        this.id = id;

        this.scale.x = ((CFG.TILE_WIDTH) / this.width);
        this.scale.y = ((CFG.TILE_HEIGHT) / this.height);

        this.events.onInputOver.add(() => {
            if (!this.live) return;

            this.hover.next(true);
        });

        this.events.onInputOut.add(() => {
            if (!this.live) return;

            this.hover.next(false);
        });

        Observable.combineLatest(
            this.hasValidMove,
            this.hover,
            this.selected
        ).subscribe(([valid, hover, selected]) => {
            if (valid) {
                if (selected) {
                    if (hover) {
                        this.setSelectedHoverSprite();
                    } else {
                        this.setSelectedSprite();
                    }
                } else if (hover) {
                    this.setHoverSprite();
                } else {
                    this.setNormalSprite();
                }
            } else {
                this.setDisableSprite();
            }
        })
    }

    moveTo(x: number, y: number) {
        let tween = this.game.add.tween(this).to({
            x: (x + .5) * CFG.TILE_WIDTH - (this.width / 2),
            y: (y + .5) * CFG.TILE_HEIGHT - (this.height / 2)
        }, 300);

        tween.start();
    }

    setSelectedIdObs(selectedPawnID: Observable<number>) {
        selectedPawnID.subscribe(id => {
            this.selected.next(id === this.id);
        });
    }

    public setHasValidMove(state: boolean) {
        this.hasValidMove.next(state)
    }

    private setHoverSprite() {
        this.loadTexture('pawn-hover');
    }

    private setSelectedSprite() {
        this.loadTexture('pawn-selected');
    }

    private setSelectedHoverSprite() {
        this.loadTexture('pawn-selected-hover');
    }

    private setDisableSprite() {
        this.loadTexture('pawn-disable');
    }

    private setNormalSprite() {
        this.loadTexture('pawn');
    }
}
