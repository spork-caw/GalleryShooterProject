class WinScene extends Phaser.Scene {
    constructor() 
{
super('winScene');
}

create() {
    this.add.text(400, 300, 'YOU WIN!', {font: '48px', fill: 'fff'}).setOrigin(0.5);

    this.input.keyboard.once('keydown-SPACE', () => {
        this.scene.start('galleryShooter');
    });
}

}