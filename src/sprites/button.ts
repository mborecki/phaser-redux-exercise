export class Button extends Phaser.Text {
    constructor(game: Phaser.Game, x: number, y: number, text: string) {
        super(game, x, y, text);

        this.inputEnabled = true;
        this.input.useHandCursor = true;

        this.setStyle({
            fill: '#000'
        })

        this.events.onInputOver.add(() => {
            this.setStyle({
                fill: '#999'
            })
        });

        this.events.onInputOut.add(() => {
            this.setStyle({
                fill: '#000'
            })
        });
    }
}
