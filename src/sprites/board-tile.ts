import { BehaviorSubject } from "rxjs/BehaviorSubject";
import CFG from '../config';
import { Observable } from "rxjs/Observable";

export class BoardTile extends Phaser.Sprite {

    availableMove = new BehaviorSubject(false);
    hover = new BehaviorSubject(false);

    tileX: number;
    tileY: number;

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x * CFG.TILE_WIDTH, y * CFG.TILE_HEIGHT, 'board');

        this.tileX = x;
        this.tileY = y;

        this.events.onInputOver.add(() => {
            this.hover.next(true);
        });

        this.events.onInputOut.add(() => {
            this.hover.next(false);
        });

        Observable.combineLatest(
            this.hover,
            this.availableMove
        ).subscribe(([hover, available]) => {
            if (available) {
                this.loadTexture(hover ? 'board-available-hover' : 'board-available');
            } else {
                this.loadTexture(hover ? 'board-hover' : 'board');
            }
        })
    }

    public setAvailableMoveMark(value: boolean) {
        this.availableMove.next(value);
    }
}
